#!/usr/bin/env python3
"""Build the browser dataset, Markdown lessons and complete reading page."""
from html import escape
from pathlib import Path
import json
import re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
COURSE = ROOT / "curriculum"


def inline(text):
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", escape(str(text)))


def requirements(value):
    return {"offline": "离线（需预先安装固定版本依赖）", "installed CLI": "已安装 Pi CLI", "provider credentials": "需要可用模型凭证与对应服务"}.get(value, value)


def list_html(items, ordered=False):
    tag = "ol" if ordered else "ul"
    return f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>"


def lesson_html(chapter):
    parts = [f'<p class="chapter-summary">{inline(chapter["summary"])}</p>']
    for section in chapter["sections"]:
        parts.append(f'<section class="lesson-section"><h4>{inline(section["title"])}</h4>')
        parts.extend(f"<p>{inline(p)}</p>" for p in section["paragraphs"])
        if section.get("bullets"):
            parts.append(list_html(section["bullets"]))
        parts.append("</section>")
    parts.append('<section class="lesson-pitfalls"><h4>容易混淆的地方</h4>')
    parts.append(list_html(chapter["pitfalls"]) + "</section>")
    return "\n".join(parts)


def lab_html(lab):
    parts = [f'<h4>{inline(lab["title"])}</h4>', f'<p>{inline(lab["objective"])}</p>',
             f'<p class="lab-requires">运行条件：{inline(requirements(lab["requires"]))}</p>',
             list_html(lab["steps"], True)]
    if lab["code"]:
        parts.append(f'<pre><code class="language-{escape(lab["codeLanguage"])}">{escape(lab["code"])}</code></pre>')
    parts.append("<h5>预期结果</h5>" + list_html(lab["expected"]))
    parts.append(f'<p><strong>验收：</strong>{inline(lab["verification"])}</p>')
    if lab.get("notes"):
        parts.append(f'<p class="lab-note">{inline(lab["notes"])}</p>')
    return "\n".join(parts)


def sources_html(chapter):
    return '<ul class="lesson-sources">' + "".join(
        f'<li><a href="{escape(s["url"], quote=True)}" target="_blank" rel="noreferrer">{inline(s["title"])} ↗</a></li>'
        for s in chapter["sources"]
    ) + "</ul>"


def lesson_markdown(chapter, meta):
    number = chapter["number"]
    lines = [f'# {number:02d} · {chapter["title"]}', "",
             f'版本：Pi v{meta["version"]} · 核验：{meta["verifiedAt"]} · 固定源码：`{meta["sourceCommit"]}`', "",
             chapter["summary"], "", "## 先想三个问题", ""]
    lines.extend(f'{i}. {q}' for i, q in enumerate(chapter["questions"], 1))
    for section in chapter["sections"]:
        lines.extend(["", f'## {section["title"]}', ""])
        for p in section["paragraphs"]:
            lines.extend([p, ""])
        lines.extend(f'- {p}' for p in section.get("bullets", []))
    lab = chapter["lab"]
    lines.extend(["", f'## 实验：{lab["title"]}', "", lab["objective"], "",
                  f'运行条件：{requirements(lab["requires"])}', ""])
    lines.extend(f'{i}. {s}' for i, s in enumerate(lab["steps"], 1))
    if lab["code"]:
        lines.extend(["", f'```{lab["codeLanguage"]}', lab["code"], "```"])
    lines.extend(["", "### 预期结果", ""] + [f'- {s}' for s in lab["expected"]])
    lines.extend(["", f'验收：{lab["verification"]}', "", lab.get("notes", ""), "", "## 容易混淆的地方", ""])
    lines.extend(f'- {s}' for s in chapter["pitfalls"])
    lines.extend(["", "## 版本变化", "", chapter["migration"], "", "## 源码与官方文档", ""])
    lines.extend(f'- [{s["title"]}]({s["url"]})' for s in chapter["sources"])
    lines.extend(["", f'[教程目录](README.md) · [网页阅读](https://siuserxiaowei.github.io/pi-runtime-field-guide/#chapter-{number:02d})', ""])
    return "\n".join(lines)


def validate(chapters, meta):
    assert [c["number"] for c in chapters] == list(range(1, 15)), "Need exactly chapters 01–14"
    assert meta["chapterCount"] == len(chapters)
    for c in chapters:
        assert c["id"] == f'chapter-{c["number"]:02d}'
        assert len(c["questions"]) == 3 and len(c["sections"]) >= 3, c["id"]
        assert len(c["sources"]) >= 2 and c["pitfalls"] and c["migration"], c["id"]
        prose = "".join(p for s in c["sections"] for p in s["paragraphs"])
        assert len(re.findall(r"[\u4e00-\u9fff]", prose)) >= 350, f'{c["id"]}: substantive current-version prose required'
        lab = c["lab"]
        for key in ("title", "objective", "steps", "expected", "verification", "requires", "codeLanguage"):
            assert lab[key], (c["id"], key)
        assert re.fullmatch(r"[a-zA-Z0-9_-]+", lab["codeLanguage"])
        for source in c["sources"]:
            u = urlsplit(source["url"])
            assert u.scheme == "https" and u.netloc, source
            if "/earendil-works/pi/blob/" in source["url"]:
                assert f'/blob/{meta["sourceCommit"]}/' in source["url"], source


def main():
    meta = json.loads((COURSE / "meta.json").read_text())
    chapters = []
    for fragment in sorted((COURSE / "source").glob("*.json")):
        chapters.extend(json.loads(fragment.read_text()))
    chapters.sort(key=lambda c: c["number"])
    validate(chapters, meta)
    for c in chapters:
        c["copy"] = lesson_html(c)
        c["labHtml"] = lab_html(c["lab"])
        c["sourcesHtml"] = sources_html(c)
        c["markdownPath"] = f'curriculum/{c["number"]:02d}.md'
        (COURSE / f'{c["number"]:02d}.md').write_text(lesson_markdown(c, meta))
        if c["lab"]["codeLanguage"] in ("javascript", "js", "mjs") and c["lab"]["code"]:
            (COURSE / "labs").mkdir(exist_ok=True)
            (COURSE / "labs" / f'chapter-{c["number"]:02d}.mjs').write_text(c["lab"]["code"].rstrip() + "\n")
    payload = {"meta": meta, "chapters": chapters}
    data = json.dumps(payload, ensure_ascii=False, indent=2)
    (COURSE / "chapters.json").write_text(data + "\n")
    # Avoid an accidental HTML script terminator if future text is embedded inline.
    (COURSE / "chapters.js").write_text("window.PI_CURRICULUM = " + data.replace("</", "<\\/") + ";\n")
    index = [f'# {meta["title"]}', "", f'全部 14 章已按 Pi v{meta["version"]} 重写。固定源码 `{meta["sourceCommit"]}`；核验时间 {meta["verifiedAt"]}。', "",
             '[完整网页](https://siuserxiaowei.github.io/pi-runtime-field-guide/curriculum/) · [首页逐章阅读](https://siuserxiaowei.github.io/pi-runtime-field-guide/#curriculum)', ""]
    index.extend(f'{c["number"]}. [{c["title"]}]({c["number"]:02d}.md)' for c in chapters)
    index.extend(["", "## 实验说明", "", "每章标明运行条件、代码/步骤、预期结果与验收。课程附带 [离线实验](labs/README.md)，运行使用固定版本 npm 包与确定性模型替身，不调用付费模型。需要真实账号的联合测试单独标明。", "",
                  "## 维护", "", "编辑 `source/*.json`，运行 `python3 scripts/build_curriculum.py`，同时生成本目录 Markdown、浏览器数据和完整阅读页。", "",
                  '[8 月课程数据归档](archive/2026-08-26-chapters.json) · [三层架构研究](../research/updates/2026-11-03-agent-stack-field-study.md)', ""])
    (COURSE / "README.md").write_text("\n".join(index))
    toc = "".join(f'<li><a href="#{c["id"]}">{c["number"]:02d} · {inline(c["title"])}</a></li>' for c in chapters)
    articles = []
    for c in chapters:
        articles.append(f'''<article id="{c['id']}" class="book-chapter">
<h2>{c['number']:02d} · {inline(c['title'])}</h2>
<p class="lesson-version">Pi v{meta['version']} · 固定源码核验</p>
<h3>先想三个问题</h3>{list_html(c['questions'], True)}
{c['copy']}
<section class="chapter-lab"><h3>动手实验</h3>{c['labHtml']}</section>
<h3>版本变化</h3><p>{inline(c['migration'])}</p>
<h3>源码与官方文档</h3>{c['sourcesHtml']}
<p><a href="{c['number']:02d}.md">Markdown 原文</a> · <a href="#toc">返回目录</a></p>
</article>''')
    html = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(meta['title'])}</title><meta name="description" content="14 章完整更新至 Pi v{meta['version']}：源码、实验、上下文、MCP、Durable，以及 Multica / Pi / Magpie 组合实践。">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../updates/report.css">
<link rel="stylesheet" href="book.css"></head><body>
<nav class="report-nav"><a href="../index.html#curriculum">← 课程首页</a><a href="../index.html#tools-compare">三工具对照</a><a href="../updates/agent-stack.html">三层架构研究</a></nav>
<main><header><p class="lesson-version">2026-11-03 · Pi v{meta['version']}</p><h1>{escape(meta['title'])}</h1>
<p>14 章正文、源码链接和实验均已更新。模型访问、基础 Loop、CLI 会话与实验性 Durable 分开讲解；最后一章把任务平台、执行器和模型网关连起来验证。</p>
<p>源码固定到 <code>{meta['sourceCommit']}</code>；Node.js {escape(meta['nodeRequirement'])}。需要真实模型账号的步骤会单独标明。</p></header>
<nav id="toc" aria-label="14 章教程目录"><ol>{toc}</ol></nav>
{''.join(articles)}</main></body></html>'''
    (COURSE / "index.html").write_text(html)
    print(json.dumps({"chapters": len(chapters), "version": meta["version"], "sources": sum(len(c["sources"]) for c in chapters)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
