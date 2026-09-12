#!/usr/bin/env python3
"""Render repository Markdown files into static HTML pages.

The site is intentionally static, so public visitors should never have to read
raw Markdown when they click a learning document. This lightweight renderer
covers the structures used by this package without adding a build dependency.
"""

from __future__ import annotations

import html
import re
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
SITE_TITLE = "AI App 出海知识库"
LAST_UPDATED = "2026-06-02"

ROOT_MARKDOWN = [
    "README.md",
    "DELIVERY_INDEX.md",
    "QA_REPORT.md",
    "CONTRIBUTING.md",
    "ATTRIBUTION.md",
]

INTERNAL_PUBLIC_HOSTS = (
    "https://siuserxiaowei.github.io/ai-app-export-learning-hub/",
    "http://gptimage2.store/",
    "https://gptimage2.store/",
)


def iter_markdown_files() -> list[Path]:
    files = [ROOT / path for path in ROOT_MARKDOWN]
    files.extend(sorted((ROOT / "docs").glob("*.md")))
    return files


def rewrite_link(raw: str, current_file: Path) -> str:
    href = raw.strip()
    if not href or href.startswith(("#", "mailto:", "tel:")):
        return href

    if href in {"LICENSE", "../LICENSE", "./LICENSE"}:
        prefix = "../" if href.startswith("../") else ""
        return f"{prefix}LICENSE.html"

    href = re.sub(r"\.md(?=($|[?#]))", ".html", href)

    for host in INTERNAL_PUBLIC_HOSTS:
        if href.startswith(host):
            return re.sub(r"\.md(?=($|[?#]))", ".html", href)
    return href


def rewrite_public_url(raw: str) -> str:
    for host in INTERNAL_PUBLIC_HOSTS:
        if raw.startswith(host):
            return re.sub(r"\.md(?=($|[?#]))", ".html", raw)
    return raw


def render_text_piece(text: str) -> str:
    escaped = html.escape(text)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", escaped)

    def bare_url(match: re.Match[str]) -> str:
        url = match.group(0).rstrip(".,)")
        suffix = match.group(0)[len(url):]
        url = rewrite_public_url(url)
        safe_url = html.escape(url, quote=True)
        return f'<a href="{safe_url}" target="_blank" rel="noreferrer">{html.escape(url)}</a>{html.escape(suffix)}'

    return re.sub(r"https?://[^\s<]+", bare_url, escaped)


INLINE_RE = re.compile(r"(`[^`]+`|\[([^\]]+)\]\(([^)]+)\))")


def render_inline(text: str, current_file: Path) -> str:
    parts: list[str] = []
    pos = 0
    for match in INLINE_RE.finditer(text):
        parts.append(render_text_piece(text[pos:match.start()]))
        token = match.group(1)
        if token.startswith("`"):
            parts.append(f"<code>{html.escape(token[1:-1])}</code>")
        else:
            label = render_text_piece(match.group(2))
            href = rewrite_link(match.group(3), current_file)
            attrs = ""
            if href.startswith(("http://", "https://")):
                attrs = ' target="_blank" rel="noreferrer"'
            parts.append(f'<a href="{html.escape(href, quote=True)}"{attrs}>{label}</a>')
        pos = match.end()
    parts.append(render_text_piece(text[pos:]))
    return "".join(parts)


def slugify(text: str, used: set[str]) -> str:
    base = re.sub(r"<[^>]+>", "", text)
    base = re.sub(r"[^\w\u4e00-\u9fff-]+", "-", base, flags=re.UNICODE).strip("-").lower()
    if not base:
        base = "section"
    slug = base
    index = 2
    while slug in used:
        slug = f"{base}-{index}"
        index += 1
    used.add(slug)
    return slug


def is_table_separator(line: str) -> bool:
    cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell or "") for cell in cells)


def split_table_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def render_table(lines: list[str], current_file: Path) -> str:
    header = split_table_row(lines[0])
    body = [split_table_row(line) for line in lines[2:]]
    output = ["<div class=\"doc-table-wrap\"><table>", "<thead><tr>"]
    output.extend(f"<th>{render_inline(cell, current_file)}</th>" for cell in header)
    output.append("</tr></thead>")
    output.append("<tbody>")
    for row in body:
        output.append("<tr>")
        output.extend(f"<td>{render_inline(cell, current_file)}</td>" for cell in row)
        output.append("</tr>")
    output.append("</tbody></table></div>")
    return "".join(output)


def render_markdown(markdown: str, current_file: Path) -> tuple[str, str, list[tuple[int, str, str]]]:
    lines = markdown.splitlines()
    html_parts: list[str] = []
    headings: list[tuple[int, str, str]] = []
    used_slugs: set[str] = set()
    title = current_file.stem.replace("-", " ").title()
    i = 0

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped.startswith("```"):
            language = stripped[3:].strip()
            code_lines: list[str] = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            if i < len(lines):
                i += 1
            class_attr = f' class="language-{html.escape(language, quote=True)}"' if language else ""
            html_parts.append(f"<pre><code{class_attr}>{html.escape(chr(10).join(code_lines))}</code></pre>")
            continue

        heading = re.match(r"^(#{1,6})\s+(.+)$", stripped)
        if heading:
            level = len(heading.group(1))
            inner = render_inline(heading.group(2).strip(), current_file)
            slug = slugify(inner, used_slugs)
            if level == 1:
                title = re.sub(r"<[^>]+>", "", inner)
            headings.append((level, re.sub(r"<[^>]+>", "", inner), slug))
            html_parts.append(f'<h{level} id="{slug}">{inner}</h{level}>')
            i += 1
            continue

        if stripped in {"---", "***", "___"}:
            html_parts.append("<hr>")
            i += 1
            continue

        if i + 1 < len(lines) and "|" in stripped and is_table_separator(lines[i + 1]):
            table_lines = [line, lines[i + 1]]
            i += 2
            while i < len(lines) and "|" in lines[i] and lines[i].strip():
                table_lines.append(lines[i])
                i += 1
            html_parts.append(render_table(table_lines, current_file))
            continue

        if stripped.startswith(">"):
            quote_lines: list[str] = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_lines.append(lines[i].strip()[1:].strip())
                i += 1
            html_parts.append(f"<blockquote>{render_inline(' '.join(quote_lines), current_file)}</blockquote>")
            continue

        unordered = re.match(r"^[-*]\s+(.+)$", stripped)
        ordered = re.match(r"^\d+[.)]\s+(.+)$", stripped)
        if unordered or ordered:
            tag = "ul" if unordered else "ol"
            html_parts.append(f"<{tag}>")
            while i < len(lines):
                item_line = lines[i].strip()
                match = re.match(r"^[-*]\s+(.+)$", item_line) if tag == "ul" else re.match(r"^\d+[.)]\s+(.+)$", item_line)
                if not match:
                    break
                html_parts.append(f"<li>{render_inline(match.group(1), current_file)}</li>")
                i += 1
            html_parts.append(f"</{tag}>")
            continue

        paragraph_lines = [stripped]
        i += 1
        while i < len(lines):
            candidate = lines[i].strip()
            if not candidate:
                break
            if (
                candidate.startswith(("```", "#", ">"))
                or candidate in {"---", "***", "___"}
                or re.match(r"^[-*]\s+", candidate)
                or re.match(r"^\d+[.)]\s+", candidate)
                or (i + 1 < len(lines) and "|" in candidate and is_table_separator(lines[i + 1]))
            ):
                break
            paragraph_lines.append(candidate)
            i += 1
        html_parts.append(f"<p>{render_inline(' '.join(paragraph_lines), current_file)}</p>")

    return title, "\n".join(html_parts), headings


def page_path_for(source: Path) -> Path:
    return source.with_suffix(".html")


def relative_to_site_assets(output: Path) -> str:
    return html.escape(Path("site/styles.css").as_posix() if output.parent == ROOT else Path("../site/styles.css").as_posix(), quote=True)


def home_href(output: Path) -> str:
    return "site/index.html" if output.parent == ROOT else "../site/index.html"


def docs_index_href(output: Path) -> str:
    return "docs/index.html" if output.parent == ROOT else "index.html"


def render_toc(headings: Iterable[tuple[int, str, str]]) -> str:
    items = [(level, text, slug) for level, text, slug in headings if 2 <= level <= 3]
    if not items:
        return ""
    links = []
    for level, text, slug in items[:24]:
        links.append(f'<a class="toc-level-{level}" href="#{html.escape(slug, quote=True)}">{html.escape(text)}</a>')
    return f'<nav class="doc-toc" aria-label="本文目录"><strong>目录</strong>{"".join(links)}</nav>'


def render_page(source: Path) -> None:
    output = page_path_for(source)
    title, body, headings = render_markdown(source.read_text(encoding="utf-8"), source)
    toc = render_toc(headings)
    rel_source = source.relative_to(ROOT).as_posix()
    css_href = relative_to_site_assets(output)
    page = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} · {SITE_TITLE}</title>
  <meta name="description" content="{html.escape(title)}，AI App 出海知识库文档页。">
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="{css_href}">
</head>
<body class="doc-body">
  <a class="skip-link" href="#main">跳到正文</a>
  <header class="doc-header">
    <nav class="doc-nav" aria-label="文档导航">
      <a class="brand" href="{html.escape(home_href(output), quote=True)}">
        <span class="brand-mark">AI</span>
        <span>AI App 出海知识库</span>
      </a>
      <div class="doc-nav-links">
        <a href="{html.escape(home_href(output), quote=True)}#knowledge">知识库</a>
        <a href="{html.escape(home_href(output), quote=True)}#downloads">资料库</a>
        <a href="{html.escape(docs_index_href(output), quote=True)}">文档索引</a>
      </div>
    </nav>
    <div class="doc-hero">
      <p class="eyebrow">Rendered Document</p>
      <h1>{html.escape(title)}</h1>
      <p>已渲染为 HTML 页面，来源文件：<code>{html.escape(rel_source)}</code></p>
    </div>
  </header>
  <main class="doc-shell" id="main">
    <article class="doc-article">
{body}
    </article>
    <aside class="doc-side">
      {toc}
      <div class="doc-meta">
        <strong>页面信息</strong>
        <span>最后核查：{LAST_UPDATED}</span>
        <a href="{html.escape(home_href(output), quote=True)}">返回知识库首页</a>
      </div>
    </aside>
  </main>
</body>
</html>
"""
    output.write_text(page, encoding="utf-8")


def render_docs_index(markdown_files: list[Path]) -> None:
    cards = []
    for source in markdown_files:
        if source.parent != ROOT / "docs":
            continue
        title, _, _ = render_markdown(source.read_text(encoding="utf-8"), source)
        cards.append(
            f'<a class="doc-index-card" href="{html.escape(source.with_suffix(".html").name, quote=True)}">'
            f"<strong>{html.escape(title)}</strong><span>{html.escape(source.name)}</span></a>"
        )
    page = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>文档索引 · {SITE_TITLE}</title>
  <meta name="description" content="AI App 出海知识库所有已渲染文档入口。">
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../site/styles.css">
</head>
<body class="doc-body">
  <header class="doc-header">
    <nav class="doc-nav" aria-label="文档导航">
      <a class="brand" href="../site/index.html"><span class="brand-mark">AI</span><span>AI App 出海知识库</span></a>
      <div class="doc-nav-links"><a href="../site/index.html#knowledge">知识库</a><a href="../site/index.html#downloads">资料库</a></div>
    </nav>
    <div class="doc-hero">
      <p class="eyebrow">Document Index</p>
      <h1>文档索引</h1>
      <p>这里列出已经渲染成 HTML 的深度资料页，避免访客看到 raw Markdown。</p>
    </div>
  </header>
  <main class="doc-index-grid">
    {"".join(cards)}
  </main>
</body>
</html>
"""
    (ROOT / "docs" / "index.html").write_text(page, encoding="utf-8")


def render_license() -> None:
    source = ROOT / "LICENSE"
    if not source.exists():
        return
    text = source.read_text(encoding="utf-8")
    body = "<pre><code>" + html.escape(text) + "</code></pre>"
    page = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>License · {SITE_TITLE}</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="site/styles.css">
</head>
<body class="doc-body">
  <header class="doc-header">
    <nav class="doc-nav" aria-label="文档导航">
      <a class="brand" href="site/index.html"><span class="brand-mark">AI</span><span>AI App 出海知识库</span></a>
      <div class="doc-nav-links"><a href="site/index.html#downloads">资料库</a><a href="docs/index.html">文档索引</a></div>
    </nav>
    <div class="doc-hero"><p class="eyebrow">License</p><h1>开源协议</h1><p>本页为仓库协议文件的 HTML 渲染版。</p></div>
  </header>
  <main class="doc-shell" id="main"><article class="doc-article">{body}</article></main>
</body>
</html>
"""
    (ROOT / "LICENSE.html").write_text(page, encoding="utf-8")


def render_sitemap(markdown_files: list[Path]) -> None:
    public_paths = [
        "",
        "site/index.html",
        "site/privacy.html",
        "site/terms.html",
        "docs/index.html",
        "LICENSE.html",
    ]
    public_paths.extend(page_path_for(path).relative_to(ROOT).as_posix() for path in markdown_files)
    seen: list[str] = []
    for path in public_paths:
        if path not in seen:
            seen.append(path)

    urls = []
    for path in seen:
        loc = "http://gptimage2.store/" if not path else f"http://gptimage2.store/{path}"
        priority = "1.0" if not path else "0.8" if path == "site/index.html" else "0.7"
        changefreq = "weekly" if (not path or path.endswith(".html")) and path not in {"site/privacy.html", "site/terms.html"} else "monthly"
        urls.append(
            "  <url>\n"
            f"    <loc>{html.escape(loc)}</loc>\n"
            f"    <lastmod>{LAST_UPDATED}</lastmod>\n"
            f"    <changefreq>{changefreq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            "  </url>"
        )

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")


def main() -> None:
    markdown_files = iter_markdown_files()
    for source in markdown_files:
        render_page(source)
    render_docs_index(markdown_files)
    render_license()
    render_sitemap(markdown_files)
    print(f"Rendered {len(markdown_files)} markdown files plus docs/index.html and LICENSE.html")


if __name__ == "__main__":
    main()
