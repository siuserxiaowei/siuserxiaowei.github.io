#!/usr/bin/env python3
"""Verify the generated MoneyHunter public learning hub."""

from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "data" / "moneyhunter-manifest.json"
REQUIRED_PATHS = [
    "README.md",
    "index.html",
    "site/index.html",
    "site/links.html",
    "site/styles.css",
    "site/app.js",
    "site/moneyhunter-data.js",
    "raw/index.html",
    "data/moneyhunter-manifest.json",
    "data/moneyhunter-links.json",
    "docs/moneyhunter-overview.md",
    "docs/moneyhunter-growth-map.md",
    "docs/moneyhunter-file-index.md",
    "docs/moneyhunter-risk-notes.md",
    "scripts/import_moneyhunter.py",
    "scripts/verify_package.py",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def read_manifest() -> dict:
    if not MANIFEST_PATH.exists():
        fail("missing data/moneyhunter-manifest.json")
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def check_required_paths() -> None:
    missing = [path for path in REQUIRED_PATHS if not (ROOT / path).exists()]
    if missing:
        fail(f"missing required paths: {missing}")


def check_raw_files(manifest: dict) -> None:
    files = manifest["files"]
    if len(files) != 152:
        fail(f"expected 152 public files after excluding .DS_Store, got {len(files)}")
    markdown_count = sum(1 for item in files if item["extension"] == ".md")
    if markdown_count != 149:
        fail(f"expected 149 markdown files, got {markdown_count}")
    for item in files:
        raw_path = ROOT / "raw" / item["path"]
        if not raw_path.exists():
            fail(f"raw file missing: raw/{item['path']}")
    bad = [item["path"] for item in files if ".git" in item["path"].split("/") or item["path"].endswith(".DS_Store")]
    if bad:
        fail(f"excluded files leaked into raw: {bad[:5]}")


def check_links(manifest: dict) -> None:
    stats = manifest["stats"]
    if stats["linkOccurrenceCount"] < 2000:
        fail(f"expected at least 2000 URL occurrences, got {stats['linkOccurrenceCount']}")
    if stats["uniqueLinkCount"] < 1500:
        fail(f"expected at least 1500 unique URLs, got {stats['uniqueLinkCount']}")
    domains = {item["domain"] for item in stats["topDomains"]}
    for domain in ["www.qimai.cn", "www.tiktok.com", "www.facebook.com", "github.com"]:
        if domain not in domains:
            fail(f"expected domain missing from top domain index: {domain}")


def check_attachments(manifest: dict) -> None:
    paths = {item["path"] for item in manifest["attachments"]}
    required = {
        "其他资料/下载低收入高的app.xlsx",
        "如何做一个骚货/如何做一个骚货.pptx",
        "MoneyHunter微信.jpg",
    }
    missing = sorted(required - paths)
    if missing:
        fail(f"missing attachment entries: {missing}")


def check_five_dimensions(manifest: dict) -> None:
    expected_labels = ["道", "法", "术", "器", "势"]
    expected_keys = ["dao", "fa", "shu", "qi", "shi"]
    for item in manifest["files"]:
        dimensions = item.get("fiveDimensions")
        if not dimensions or len(dimensions) != 5:
            fail(f"file missing fiveDimensions: {item['path']}")
        labels = [dimension.get("label") for dimension in dimensions]
        keys = [dimension.get("key") for dimension in dimensions]
        if labels != expected_labels or keys != expected_keys:
            fail(f"file has invalid dimension order: {item['path']}")
        for dimension in dimensions:
            if not dimension.get("items"):
                fail(f"dimension missing items: {item['path']} {dimension.get('label')}")


def check_site_content(manifest: dict) -> None:
    root_index = (ROOT / "index.html").read_text(encoding="utf-8")
    index = (ROOT / "site" / "index.html").read_text(encoding="utf-8")
    links = (ROOT / "site" / "links.html").read_text(encoding="utf-8")
    raw = (ROOT / "raw" / "index.html").read_text(encoding="utf-8")
    app = (ROOT / "site" / "app.js").read_text(encoding="utf-8")
    data_js = (ROOT / "site" / "moneyhunter-data.js").read_text(encoding="utf-8")
    for needle in ["site/styles.css", "site/moneyhunter-data.js", "site/app.js", "raw/"]:
        if needle not in root_index:
            fail(f"index.html missing root entry asset/path: {needle}")
    for needle in ["MoneyHunter 全量公开交互学习库", "全文搜索", "附件库", "workspace-grid", "detail-pane"]:
        if needle not in index:
            fail(f"site/index.html missing {needle}")
    for needle in ["完整链接库", "domainFilter", "linkPager"]:
        if needle not in links:
            fail(f"site/links.html missing {needle}")
    for needle in ["rawSearchInput", "rawDirectoryTree", "rawTableBody"]:
        if needle not in raw:
            fail(f"raw/index.html missing {needle}")
    for needle in ["linkPageSize", "renderRawTable", "renderDetail", "dimensionCards", "dimensionMini", "五维拆解", "道 · 法 · 术 · 器 · 势"]:
        if needle not in app:
            fail(f"site/app.js missing {needle}")
    for needle in ["fiveDimensions", "\"label\":\"道\"", "\"label\":\"法\"", "\"label\":\"术\"", "\"label\":\"器\"", "\"label\":\"势\""]:
        if needle not in data_js:
            fail(f"data js missing five dimension content: {needle}")
    for needle in ["tiktok", "revenuecat", "ASO", "七麦", "Facebook", "知识星球"]:
        if needle.lower() not in data_js.lower():
            fail(f"data js missing searchable term: {needle}")


def main() -> None:
    check_required_paths()
    manifest = read_manifest()
    check_raw_files(manifest)
    check_links(manifest)
    check_attachments(manifest)
    check_five_dimensions(manifest)
    check_site_content(manifest)
    print(
        "PASS: "
        f"{manifest['stats']['fileCount']} files, "
        f"{manifest['stats']['markdownCount']} markdown files, "
        f"{manifest['stats']['uniqueLinkCount']} unique links"
    )


if __name__ == "__main__":
    main()
