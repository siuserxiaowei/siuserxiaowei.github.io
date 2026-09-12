#!/usr/bin/env python3
"""Crawl KDocs team drives into a local manifest and content archive."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
CONTENT_DIR = ROOT / "content"
ARCHIVE_DIR = ROOT / "archive"


def mixed_json_loads(text: str) -> Any:
    decoder = json.JSONDecoder()
    start = text.find("{")
    if start < 0:
        start = text.find("[")
    if start < 0:
        raise ValueError(f"no JSON found in output: {text[:200]}")
    value, _ = decoder.raw_decode(text[start:])
    return value


def unwrap(payload: Any) -> Any:
    """Unwrap kdocs-cli's nested success envelope."""
    current = payload
    for _ in range(3):
        if (
            isinstance(current, dict)
            and current.get("code") == 0
            and isinstance(current.get("data"), dict)
            and current["data"].get("code") == 0
            and "data" in current["data"]
        ):
            current = current["data"]["data"]
            continue
        if isinstance(current, dict) and current.get("code") == 0 and "data" in current:
            current = current["data"]
            continue
        break
    return current


def run_kdocs(service: str, action: str, params: dict[str, Any], timeout: int = 120) -> Any:
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json", delete=False) as f:
        json.dump(params, f, ensure_ascii=False)
        param_path = f.name
    try:
        cmd = [
            "kdocs-cli",
            service,
            action,
            "--file",
            param_path,
            "--compact",
            "--timeout",
            str(timeout * 1000),
        ]
        proc = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout + 15)
        if proc.returncode != 0:
            raise RuntimeError((proc.stderr or proc.stdout).strip())
        return unwrap(mixed_json_loads(proc.stdout))
    finally:
        try:
            os.unlink(param_path)
        except OSError:
            pass


def slugify(name: str, fallback: str) -> str:
    stem = re.sub(r"\.[A-Za-z0-9]+$", "", name).strip().lower()
    stem = re.sub(r"[^\w\u4e00-\u9fff]+", "-", stem, flags=re.UNICODE).strip("-")
    stem = stem[:72].strip("-")
    return stem or fallback


def unique_slug(name: str, file_id: str, used: set[str]) -> str:
    base = slugify(name, file_id[:8])
    suffix = hashlib.sha1(file_id.encode("utf-8")).hexdigest()[:8]
    candidate = f"{base}-{suffix}"
    i = 2
    while candidate in used:
        candidate = f"{base}-{suffix}-{i}"
        i += 1
    used.add(candidate)
    return candidate


def iter_files(drive_id: str, parent_id: str = "0", path: str = ""):
    page_token = ""
    while True:
        params = {
            "drive_id": drive_id,
            "parent_id": parent_id,
            "page_size": 200,
            "order": "asc",
            "order_by": "fname",
            "with_permission": True,
            "with_ext_attrs": True,
        }
        if page_token:
            params["page_token"] = page_token
        data = run_kdocs("drive", "list-files", params, timeout=90)
        items = data.get("items", []) if isinstance(data, dict) else []
        for item in items:
            child_path = f"{path}/{item.get('name','')}".strip("/")
            item["path"] = child_path
            yield item
            if item.get("type") == "folder":
                yield from iter_files(drive_id, item["id"], child_path)
        page_token = (data or {}).get("next_page_token") or ""
        if not page_token:
            break


def poll_read_file(file_id: str, timeout: int) -> dict[str, Any]:
    params: dict[str, Any] = {"file_id": file_id, "format": "markdown"}
    for _ in range(80):
        data = run_kdocs("drive", "read-file", params, timeout=timeout)
        if not isinstance(data, dict):
            return {"status": "failed", "error": "unexpected read_file response", "raw": data}
        status = data.get("status")
        if status == "ok":
            return data
        if status == "pending" and data.get("task_id"):
            params["task_id"] = data["task_id"]
            time.sleep(2)
            continue
        return data
    return {"status": "failed", "error": "read_file polling timeout"}


def content_to_markdown(read_data: dict[str, Any]) -> str:
    content = read_data.get("content")
    fmt = read_data.get("content_format", "")
    if isinstance(content, str):
        return content
    if isinstance(content, dict):
        lines = [f"> 内容格式：`{fmt or 'structured'}`", ""]
        range_data = (
            content.get("range_data", {})
            .get("detail", {})
            .get("rangeData", [])
        )
        if range_data:
            lines.append("| 行 | 列 | 内容 |")
            lines.append("| --- | --- | --- |")
            for cell in range_data[:1000]:
                text = str(cell.get("cellText", "")).replace("|", "\\|").replace("\n", " ")
                lines.append(f"| {cell.get('originRow','')} | {cell.get('originCol','')} | {text} |")
            if len(range_data) > 1000:
                lines.append("")
                lines.append(f"> 表格内容较大，仅学习页展示前 1000 个单元格；完整结构见 raw JSON。")
        else:
            lines.append("```json")
            lines.append(json.dumps(content, ensure_ascii=False, indent=2)[:200000])
            lines.append("```")
        return "\n".join(lines)
    return ""


def maybe_download(item: dict[str, Any], slug: str, max_bytes: int) -> dict[str, Any]:
    size = int(item.get("size") or 0)
    result = {"downloaded": False, "reason": "", "path": "", "hash": ""}
    if size > max_bytes:
        result["reason"] = f"oversize_for_github:{size}"
        return result
    permission = item.get("permission") or {}
    name = item.get("name", "")
    downloadable_ext = bool(re.search(r"\.(docx?|xlsx?|pptx?|pdf|txt|md|csv)$", name, re.I))
    if not permission.get("download") and not downloadable_ext:
        result["reason"] = "download_not_permitted_or_online_doc"
        return result
    try:
        info = run_kdocs("drive", "download-file", {"file_id": item["id"], "with_hash": True}, timeout=90)
        url = info.get("url") if isinstance(info, dict) else None
        if not url:
            result["reason"] = "no_download_url"
            return result
        target_dir = ARCHIVE_DIR / slug
        target_dir.mkdir(parents=True, exist_ok=True)
        safe_name = re.sub(r"[/:\\]+", "-", name).strip() or f"{slug}.bin"
        target = target_dir / safe_name
        with urllib.request.urlopen(url, timeout=120) as resp:
            hasher = hashlib.sha256()
            written = 0
            with target.open("wb") as out:
                while True:
                    chunk = resp.read(1024 * 1024)
                    if not chunk:
                        break
                    written += len(chunk)
                    if written > max_bytes:
                        out.close()
                        target.unlink(missing_ok=True)
                        result["reason"] = f"download_exceeded_limit:{written}"
                        return result
                    hasher.update(chunk)
                    out.write(chunk)
        result.update({"downloaded": True, "path": str(target.relative_to(ROOT)), "hash": hasher.hexdigest()})
        return result
    except Exception as exc:  # noqa: BLE001
        result["reason"] = f"download_failed:{exc}"
        return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--drive", action="append", required=True, help="KDocs team drive ID")
    parser.add_argument("--max-download-mb", type=int, default=95)
    parser.add_argument("--read-timeout", type=int, default=180)
    args = parser.parse_args()

    DATA_DIR.mkdir(exist_ok=True)
    RAW_DIR.mkdir(exist_ok=True)
    CONTENT_DIR.mkdir(exist_ok=True)
    ARCHIVE_DIR.mkdir(exist_ok=True)

    used: set[str] = set()
    manifest: dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": "kdocs",
        "drives": args.drive,
        "documents": [],
        "unsupported": [],
    }

    max_bytes = args.max_download_mb * 1024 * 1024
    for drive_id in args.drive:
        print(f"[crawl] drive {drive_id}", flush=True)
        for item in iter_files(drive_id):
            if item.get("type") == "folder":
                manifest["documents"].append({
                    "kind": "folder",
                    "drive_id": drive_id,
                    "file_id": item.get("id"),
                    "name": item.get("name"),
                    "path": item.get("path"),
                    "link_url": item.get("link_url"),
                })
                continue

            slug = unique_slug(item.get("name", ""), item.get("id", ""), used)
            print(f"[read] {item.get('path')} -> {slug}", flush=True)
            raw_dir = RAW_DIR / slug
            raw_dir.mkdir(parents=True, exist_ok=True)
            (raw_dir / "metadata.json").write_text(json.dumps(item, ensure_ascii=False, indent=2), encoding="utf-8")

            doc_entry = {
                "kind": "file",
                "slug": slug,
                "drive_id": drive_id,
                "file_id": item.get("id"),
                "name": item.get("name"),
                "path": item.get("path"),
                "size": item.get("size"),
                "mtime": item.get("mtime"),
                "ctime": item.get("ctime"),
                "link_url": item.get("link_url"),
                "hash": item.get("hash"),
                "read_status": "pending",
                "content_path": "",
                "archive": {},
                "warnings": [],
            }

            try:
                read_data = poll_read_file(item["id"], args.read_timeout)
                (raw_dir / "read_file.json").write_text(json.dumps(read_data, ensure_ascii=False, indent=2), encoding="utf-8")
                if read_data.get("status") == "ok":
                    md = content_to_markdown(read_data)
                    content_path = CONTENT_DIR / f"{slug}.md"
                    header = [
                        f"# {item.get('name','未命名文档')}",
                        "",
                        f"- 来源路径：{item.get('path','')}",
                        f"- 金山链接：{item.get('link_url','')}",
                        f"- 文件 ID：`{item.get('id','')}`",
                        "",
                    ]
                    content_path.write_text("\n".join(header) + md, encoding="utf-8")
                    doc_entry["read_status"] = "ok"
                    doc_entry["content_path"] = str(content_path.relative_to(ROOT))
                    doc_entry["content_format"] = read_data.get("content_format")
                    doc_entry["warnings"] = read_data.get("warnings") or []
                else:
                    doc_entry["read_status"] = read_data.get("status", "failed")
                    doc_entry["error"] = read_data.get("error") or read_data.get("msg") or "read_file_not_ok"
                    manifest["unsupported"].append(doc_entry.copy())
            except Exception as exc:  # noqa: BLE001
                doc_entry["read_status"] = "failed"
                doc_entry["error"] = str(exc)
                manifest["unsupported"].append(doc_entry.copy())

            doc_entry["archive"] = maybe_download(item, slug, max_bytes)
            manifest["documents"].append(doc_entry)
            (DATA_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    (DATA_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[done] documents={len(manifest['documents'])} unsupported={len(manifest['unsupported'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
