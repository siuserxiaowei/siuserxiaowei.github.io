#!/usr/bin/env python3
"""Create a Feishu wiki space and sync generated learning pages as documents."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]


def mixed_json_loads(text: str) -> Any:
    decoder = json.JSONDecoder()
    start = text.find("{")
    if start < 0:
        raise ValueError(text[:300])
    value, _ = decoder.raw_decode(text[start:])
    return value


def run(cmd: list[str], timeout: int = 120) -> Any:
    proc = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout).strip())
    return mixed_json_loads(proc.stdout)


def create_space(name: str) -> str:
    payload = json.dumps({
        "name": name,
        "description": "金山文档镜像归档与互动学习知识库",
        "open_sharing": "closed",
    }, ensure_ascii=False)
    out = run(["lark-cli", "wiki", "spaces", "create", "--as", "user", "--data", payload, "--format", "json", "--yes"], timeout=120)
    space = out.get("data", {}).get("space") or out.get("space") or {}
    if not space.get("space_id"):
        raise RuntimeError(f"cannot find space_id in response: {out}")
    return space["space_id"]


def write_page_file(doc: dict[str, Any], base_url: str, max_chars: int) -> Path:
    page_dir = ROOT / "feishu_pages"
    page_dir.mkdir(exist_ok=True)
    title = doc.get("name") or "未命名文档"
    content = ""
    if doc.get("content_path"):
        content = (ROOT / doc["content_path"]).read_text(encoding="utf-8", errors="replace")
    truncated = len(content) > max_chars
    if truncated:
        content = content[:max_chars] + "\n\n> 飞书页因长度限制只放摘录，完整正文请看 GitHub 仓库。"
    md = f"""# {title}

> 在线互动学习页：{base_url}/learn/{doc['slug']}/

## 来源

- 金山路径：{doc.get('path','')}
- 金山链接：{doc.get('link_url','')}
- 文件 ID：`{doc.get('file_id','')}`
- GitHub Markdown：{base_url}/{doc.get('content_path','')}

## 学习入口

打开互动学习页可以查看翻页式学习卡、提示词、清单、自测题和道法术器势拆解：

{base_url}/learn/{doc['slug']}/

## 正文{'（摘录）' if truncated else ''}

{content}
"""
    target = page_dir / f"{doc['slug']}.md"
    target.write_text(md, encoding="utf-8")
    return target


def create_doc(space_id: str, title: str, markdown_path: Path) -> dict[str, Any]:
    rel_path = markdown_path.relative_to(ROOT)
    node_out = run([
        "lark-cli",
        "wiki",
        "+node-create",
        "--as",
        "user",
        "--space-id",
        space_id,
        "--title",
        title,
    ], timeout=120)
    node_data = node_out.get("data") or node_out
    obj_token = node_data.get("obj_token") or node_data.get("document_id")
    if not obj_token:
        raise RuntimeError(f"cannot find obj_token in wiki node response: {node_out}")
    update_out = run([
        "lark-cli",
        "docs",
        "+update",
        "--api-version",
        "v2",
        "--as",
        "user",
        "--doc",
        obj_token,
        "--command",
        "overwrite",
        "--doc-format",
        "markdown",
        "--content",
        f"@{rel_path}",
    ], timeout=180)
    return {"node": node_data, "update": update_out}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="https://siuserxiaowei.github.io/chuhai-xuexi")
    parser.add_argument("--space-name", default="出海学习")
    parser.add_argument("--space-id", default="", help="Reuse an existing Feishu wiki space")
    parser.add_argument("--max-docs", type=int, default=0, help="0 means all")
    parser.add_argument("--max-feishu-chars", type=int, default=50000)
    args = parser.parse_args()

    manifest_path = ROOT / "data" / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    existing = manifest.get("feishu") or {}
    space_id = args.space_id or existing.get("space_id") or create_space(args.space_name)
    manifest["feishu"] = {
        "space_id": space_id,
        "space_name": args.space_name,
        "documents": existing.get("documents", []),
    }
    done_slugs = {item.get("slug") for item in manifest["feishu"]["documents"]}
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    count = 0
    for doc in manifest["documents"]:
        if doc.get("kind") != "file" or doc.get("read_status") != "ok":
            continue
        if doc.get("slug") in done_slugs:
            continue
        if args.max_docs and count >= args.max_docs:
            break
        md_file = write_page_file(doc, args.base_url, args.max_feishu_chars)
        print(f"[feishu] {doc.get('name')}", flush=True)
        out = create_doc(space_id, doc.get("name") or doc["slug"], md_file)
        node = out.get("node") or {}
        update_doc = out.get("update", {}).get("data", {}).get("document") or out.get("update", {}).get("document") or {}
        doc["feishu_url"] = node.get("url") or update_doc.get("url", "")
        doc["feishu_node_token"] = node.get("node_token", "")
        doc["feishu_document_id"] = node.get("obj_token") or update_doc.get("document_id", "")
        manifest["feishu"]["documents"].append({
            "slug": doc["slug"],
            "title": doc.get("name"),
            "url": doc.get("feishu_url"),
            "document_id": doc.get("feishu_document_id"),
        })
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
        count += 1

    summary = ROOT / "feishu_pages" / "道法术器势总分析.md"
    report = (ROOT / "reports" / "dao-fa-shu-qi-shi.md").read_text(encoding="utf-8", errors="replace")
    summary.write_text("# 道法术器势总分析\n\n" + report[:50000], encoding="utf-8")
    out = create_doc(space_id, "道法术器势总分析", summary)
    node = out.get("node") or {}
    update_doc = out.get("update", {}).get("data", {}).get("document") or out.get("update", {}).get("document") or {}
    manifest["feishu"]["analysis_url"] = node.get("url") or update_doc.get("url", "")
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"synced {count} documents to Feishu space {space_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
