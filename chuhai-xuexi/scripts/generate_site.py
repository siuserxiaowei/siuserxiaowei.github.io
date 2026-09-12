#!/usr/bin/env python3
"""Generate a static interactive learning site from crawled KDocs content."""

from __future__ import annotations

import argparse
import html
import json
import math
import re
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]


STOPWORDS = set("一个 一种 这个 这些 那些 以及 如果 可以 需要 通过 进行 如何 什么 为什么 我们 你们 他们 内容 文档 学习 方法 工具 数据".split())


def load_manifest() -> dict[str, Any]:
    return json.loads((ROOT / "data" / "manifest.json").read_text(encoding="utf-8"))


def strip_md(text: str) -> str:
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", " ", text)
    text = re.sub(r"\[[^\]]+\]\([^)]+\)", " ", text)
    text = re.sub(r"[#>*_\-|]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def split_sentences(text: str) -> list[str]:
    plain = strip_md(text)
    parts = re.split(r"(?<=[。！？!?])\s*|\n+", plain)
    return [p.strip() for p in parts if len(p.strip()) >= 12]


def headings(md: str) -> list[str]:
    found = re.findall(r"^#{1,3}\s+(.+)$", md, flags=re.M)
    return [h.strip() for h in found if h.strip()][:18]


def keywords(text: str, n: int = 12) -> list[str]:
    tokens = re.findall(r"[\u4e00-\u9fffA-Za-z0-9]{2,}", strip_md(text))
    cleaned = [t for t in tokens if t not in STOPWORDS and len(t) <= 16]
    return [w for w, _ in Counter(cleaned).most_common(n)]


def md_inline(s: str) -> str:
    s = html.escape(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
    return s


def md_to_html(md: str, max_chars: int = 9000) -> str:
    md = md[:max_chars]
    lines = md.splitlines()
    out: list[str] = []
    in_ul = False
    in_ol = False
    in_code = False
    code_lines: list[str] = []
    for line in lines:
        if line.strip().startswith("```"):
            if in_code:
                out.append("<pre><code>" + html.escape("\n".join(code_lines)) + "</code></pre>")
                code_lines = []
                in_code = False
            else:
                in_code = True
            continue
        if in_code:
            code_lines.append(line)
            continue
        if not line.strip():
            if in_ul:
                out.append("</ul>")
                in_ul = False
            if in_ol:
                out.append("</ol>")
                in_ol = False
            continue
        m = re.match(r"^(#{1,4})\s+(.+)$", line)
        if m:
            if in_ul:
                out.append("</ul>")
                in_ul = False
            if in_ol:
                out.append("</ol>")
                in_ol = False
            level = min(len(m.group(1)) + 1, 4)
            out.append(f"<h{level}>{md_inline(m.group(2))}</h{level}>")
            continue
        m = re.match(r"^\s*[-*]\s+(.+)$", line)
        if m:
            if not in_ul:
                out.append("<ul>")
                in_ul = True
            out.append(f"<li>{md_inline(m.group(1))}</li>")
            continue
        m = re.match(r"^\s*\d+[.、]\s+(.+)$", line)
        if m:
            if not in_ol:
                out.append("<ol>")
                in_ol = True
            out.append(f"<li>{md_inline(m.group(1))}</li>")
            continue
        if line.strip().startswith(">"):
            out.append(f"<blockquote>{md_inline(line.strip('> '))}</blockquote>")
        else:
            out.append(f"<p>{md_inline(line)}</p>")
    if in_ul:
        out.append("</ul>")
    if in_ol:
        out.append("</ol>")
    if in_code:
        out.append("<pre><code>" + html.escape("\n".join(code_lines)) + "</code></pre>")
    if len(md) >= max_chars:
        out.append("<p class=\"muted\">本页为学习化摘录，完整正文见来源与下载页。</p>")
    return "\n".join(out)


def pick_by_keywords(sentences: list[str], keys: list[str], fallback: int = 3) -> list[str]:
    scored = []
    for s in sentences:
        score = sum(1 for k in keys if k in s)
        if score:
            scored.append((score, len(s), s))
    scored.sort(reverse=True)
    chosen = [s for _, _, s in scored[:fallback]]
    return chosen or sentences[:fallback]


def dao_fa_shu_qi_shi(md: str) -> dict[str, list[str]]:
    sents = split_sentences(md)
    return {
        "道": pick_by_keywords(sents, ["本质", "目标", "战略", "价值", "定位", "用户", "需求"]),
        "法": pick_by_keywords(sents, ["方法", "框架", "模型", "原则", "路径", "策略"]),
        "术": pick_by_keywords(sents, ["步骤", "操作", "执行", "流程", "实践", "落地"]),
        "器": pick_by_keywords(sents, ["工具", "模板", "脚本", "表格", "数据", "资源", "链接"]),
        "势": pick_by_keywords(sents, ["趋势", "市场", "机会", "变化", "竞价", "流量", "平台"]),
    }


def chunk_content(md: str, min_pages: int = 5, max_pages: int = 18) -> list[str]:
    blocks = re.split(r"\n(?=#{1,3}\s+)", md)
    blocks = [b.strip() for b in blocks if len(strip_md(b)) > 40]
    if len(blocks) < 3:
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", md) if len(strip_md(p)) > 40]
        size = max(1, math.ceil(len(paragraphs) / max(min_pages, 1)))
        blocks = ["\n\n".join(paragraphs[i:i + size]) for i in range(0, len(paragraphs), size)]
    return blocks[:max_pages]


def slide(title: str, body: str, tag: str = "认知", cls: str = "") -> dict[str, str]:
    return {"title": title, "body": body, "tag": tag, "class": cls}


def build_slides(doc: dict[str, Any], md: str, base_url: str) -> list[dict[str, str]]:
    title = doc.get("name") or "未命名文档"
    hds = headings(md)
    kws = keywords(md)
    summary = split_sentences(md)[:4]
    analysis = dao_fa_shu_qi_shi(md)
    source_id = doc.get("file_id", "")
    page_url = f"{base_url}/learn/{doc['slug']}/"

    slides = [
        slide("封面", f"<h1>{html.escape(title)}</h1><p class=\"subtitle\">出海学习互动手册</p><p class=\"muted\">来源：{html.escape(doc.get('path') or title)}</p>", "封面", "cover"),
        slide("学习目标", "<ul>" + "".join(f"<li>理解「{html.escape(k)}」在本文档中的作用</li>" for k in (kws[:3] or ["核心问题", "执行方法", "落地工具"])) + "</ul>", "认知"),
        slide("核心地图", "<div class=\"keyword-grid\">" + "".join(f"<span>{html.escape(k)}</span>" for k in kws[:12]) + "</div>", "认知"),
    ]
    if hds:
        slides.append(slide("章节拆解", "<ol>" + "".join(f"<li>{html.escape(h)}</li>" for h in hds[:12]) + "</ol>", "认知"))
    if summary:
        slides.append(slide("先抓结论", "".join(f"<p>{html.escape(s)}</p>" for s in summary), "认知"))

    for i, block in enumerate(chunk_content(md), start=1):
        title_match = re.match(r"^#{1,3}\s+(.+)$", block)
        block_title = title_match.group(1).strip() if title_match else f"学习卡 {i}"
        slides.append(slide(block_title, md_to_html(block), "拆解"))

    prompt = f"请基于《{title}》帮我输出：1. 三句话核心结论；2. 可执行清单；3. 适合出海项目的应用场景；4. 风险和验证方法。"
    slides.extend([
        slide("操作卡", "<ol><li>先复述目标用户和需求。</li><li>提取可复用流程，而不是停留在观点。</li><li>把工具、数据、脚本、模板单独沉淀。</li><li>用一个小实验验证本文档里的方法。</li></ol>", "操作"),
        slide("可复制提示词", f"<div class=\"prompt-card\"><button class=\"copy-btn\">复制</button><code>{html.escape(prompt)}</code></div>", "操作"),
        slide("常见误区", "<ul><li>只收藏资料，不把资料转成动作。</li><li>只看案例表面，不抽象底层方法。</li><li>忽略数据来源和权限边界。</li><li>把一次性的操作当成稳定 SOP。</li></ul>", "提醒"),
        slide("自测题", "<ol><li>这份文档真正解决的用户问题是什么？</li><li>里面哪一步可以直接变成 SOP？</li><li>需要哪些工具或数据才能复现？</li><li>如果用于 APP 出海，最小验证实验是什么？</li></ol>", "测验"),
        slide("道法术器势", "".join(f"<h3>{k}</h3><ul>{''.join(f'<li>{html.escape(x)}</li>' for x in vals[:3])}</ul>" for k, vals in analysis.items()), "总结"),
        slide("来源与下载", f"<p>金山来源：<a href=\"{html.escape(doc.get('link_url') or '#')}\">打开原文档</a></p><p>内容源码：<a href=\"../../{html.escape(doc.get('content_path') or '')}\">Markdown</a></p><p>互动页：<a href=\"{html.escape(page_url)}\">{html.escape(page_url)}</a></p><p>来源 ID：<code>{html.escape(source_id)}</code></p>", "来源"),
    ])
    return slides[:29]


def render_learning_page(doc: dict[str, Any], slides: list[dict[str, str]]) -> str:
    title = html.escape(doc.get("name") or "互动学习页")
    toc = "\n".join(
        f'<li><a href="#" data-page="{i}">{html.escape(s["title"])} <span class="toc-tag">{html.escape(s["tag"])}</span></a></li>'
        for i, s in enumerate(slides)
    )
    sections = "\n".join(
        f'''<section class="page {'active' if i == 0 else ''} {html.escape(s.get('class',''))}" data-page="{i}">
  <div class="page-inner">
    <div class="section-header"><span></span><h1>{html.escape(s["title"])}</h1></div>
    {s["body"]}
  </div>
</section>'''
        for i, s in enumerate(slides)
    )
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} - 出海学习</title>
  <link rel="stylesheet" href="../../assets/learning.css">
</head>
<body data-doc="{html.escape(doc['slug'])}">
  <div class="progress-bar"></div>
  <div class="page-counter">1 / {len(slides)}</div>
  <div class="keyboard-hint"><kbd>←</kbd><kbd>→</kbd> 翻页</div>
  <button class="toc-toggle" aria-label="目录"><span></span><span></span><span></span></button>
  <div class="toc-overlay"></div>
  <nav class="toc-panel"><h3>目录导航</h3><ul class="toc-list">{toc}</ul></nav>
  <div class="nav-buttons"><button class="nav-btn prev" aria-label="上一页">◀</button><button class="nav-btn next" aria-label="下一页">▶</button></div>
  <main class="pages-container">{sections}</main>
  <script src="../../assets/learning.js"></script>
</body>
</html>'''


def render_index(manifest: dict[str, Any], base_url: str) -> str:
    docs = [d for d in manifest["documents"] if d.get("kind") == "file"]
    cards = []
    for d in docs:
        status = d.get("read_status")
        href = f"learn/{d['slug']}/" if status == "ok" else "unsupported.md"
        cards.append(f'''<article class="doc-card" data-title="{html.escape(d.get('name',''))}">
  <a href="{href}"><h2>{html.escape(d.get('name','未命名'))}</h2></a>
  <p>{html.escape(d.get('path',''))}</p>
  <span>{html.escape(status or 'unknown')}</span>
</article>''')
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>出海学习</title>
  <link rel="stylesheet" href="assets/learning.css">
</head>
<body class="index-body">
  <header class="site-hero">
    <p class="eyebrow">KDocs Archive + Interactive Manuals</p>
    <h1>出海学习</h1>
    <p>从金山文档镜像归档生成的互动学习知识库。每份可读取文档都有翻页式学习页、操作卡、自测题和道法术器势拆解。</p>
    <div class="hero-actions"><a href="reports/dao-fa-shu-qi-shi.html">查看总分析</a><a href="data/manifest.json">Manifest</a></div>
  </header>
  <section class="stats">
    <div><strong>{len(docs)}</strong><span>文件</span></div>
    <div><strong>{sum(1 for d in docs if d.get('read_status') == 'ok')}</strong><span>互动学习页</span></div>
    <div><strong>{len(manifest.get('unsupported', []))}</strong><span>需人工复核</span></div>
  </section>
  <section class="search-panel"><input id="search" placeholder="搜索文档标题、路径、关键词"></section>
  <section class="doc-grid" id="docGrid">{''.join(cards)}</section>
  <script>
  const input = document.getElementById('search');
  const cards = [...document.querySelectorAll('.doc-card')];
  input.addEventListener('input', () => {{
    const q = input.value.trim().toLowerCase();
    cards.forEach(card => card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none');
  }});
  </script>
</body>
</html>'''


def write_assets() -> None:
    (ROOT / "assets" / "learning.css").write_text("""/* 出海学习互动页 */
:root{--red:#d83a34;--blue:#185abc;--yellow:#f5c542;--ink:#171717;--paper:#fffdf7;--muted:#6f6f6f;--line:#171717;--green:#227a52;--card:#fff;--shadow:0 18px 40px rgba(0,0,0,.08)}
*{box-sizing:border-box}html{font-size:16px}body{margin:0;font-family:ui-serif,'Songti SC','Noto Serif SC',serif;background:var(--paper);color:var(--ink);line-height:1.75;height:100vh;overflow:hidden}a{color:var(--blue)}.progress-bar{position:fixed;left:0;top:0;height:4px;background:var(--red);z-index:20;transition:width .25s}.page-counter,.keyboard-hint{position:fixed;z-index:10;background:rgba(255,255,255,.92);border:2px solid #ddd;padding:4px 10px;font-family:ui-monospace,Menlo,monospace;font-size:.8rem}.page-counter{right:18px;bottom:18px}.keyboard-hint{right:18px;top:18px;display:flex;gap:6px;align-items:center}.keyboard-hint kbd{border:1px solid #bbb;padding:1px 5px;background:#f7f7f7}.toc-toggle{position:fixed;z-index:30;top:16px;left:16px;width:44px;height:44px;background:#fff;border:3px solid var(--ink);display:grid;place-content:center;gap:4px;cursor:pointer}.toc-toggle span{display:block;width:20px;height:2px;background:var(--ink)}.toc-panel{position:fixed;z-index:25;top:0;left:-340px;width:320px;height:100vh;background:#fff;border-right:5px solid var(--ink);padding:72px 22px 28px;overflow:auto;transition:left .25s}.toc-panel.open{left:0}.toc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.22);z-index:24;display:none}.toc-overlay.visible{display:block}.toc-list{list-style:none;padding:0;margin:0}.toc-list a{display:block;text-decoration:none;color:var(--ink);padding:9px 0;border-bottom:1px solid #eee}.toc-list a.active{color:var(--red);font-weight:700}.toc-tag{font-size:.72rem;color:#fff;background:var(--blue);padding:1px 6px;margin-left:5px}.nav-buttons{position:fixed;z-index:10;left:50%;bottom:16px;transform:translateX(-50%);display:flex;gap:12px}.nav-btn{width:48px;height:48px;border:3px solid var(--ink);background:#fff;cursor:pointer;font-size:1.1rem}.nav-btn:hover{background:var(--yellow)}.nav-btn:disabled{opacity:.35;cursor:not-allowed}.pages-container{height:100vh;width:100vw;position:relative}.page{display:none;height:100vh;width:100vw;overflow:auto;padding:76px 20px 92px}.page.active{display:block}.page-inner{max-width:880px;margin:0 auto}.section-header{display:flex;align-items:center;gap:14px;margin-bottom:24px}.section-header span{width:18px;height:52px;background:var(--red);border:3px solid var(--ink);display:inline-block}.section-header h1{font-family:ui-sans-serif,'PingFang SC',sans-serif;font-size:clamp(2rem,5vw,3.4rem);line-height:1.1;margin:0}.cover .page-inner{min-height:70vh;display:flex;flex-direction:column;justify-content:center}.cover h1{font-size:clamp(3rem,9vw,6rem);line-height:1}.subtitle{font-size:1.35rem;color:var(--blue);font-weight:700}.muted{color:var(--muted)}p,li{font-size:1.08rem}strong{color:var(--red)}blockquote,.content-card,.prompt-card{background:#fff;border:3px solid var(--ink);box-shadow:var(--shadow);padding:18px;margin:18px 0}.keyword-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}.keyword-grid span{display:block;border:3px solid var(--ink);background:#fff;padding:12px;font-weight:700;text-align:center}.keyword-grid span:nth-child(3n){background:var(--yellow)}.keyword-grid span:nth-child(3n+1){background:var(--red);color:#fff}.keyword-grid span:nth-child(3n+2){background:var(--blue);color:#fff}.prompt-card{position:relative;background:#263238;color:#eef}.prompt-card code{white-space:pre-wrap;display:block;font-family:ui-monospace,Menlo,monospace}.copy-btn{float:right;background:var(--yellow);border:2px solid #111;padding:4px 10px;cursor:pointer}pre{background:#263238;color:#eef;padding:16px;overflow:auto}.index-body{height:auto;overflow:auto}.site-hero{padding:8vw 6vw 4vw;min-height:52vh;background:#fff;border-bottom:5px solid var(--ink)}.site-hero h1{font-size:clamp(3rem,10vw,7rem);margin:.1em 0;font-family:ui-sans-serif,'PingFang SC',sans-serif}.eyebrow{font-family:ui-monospace,Menlo,monospace;color:var(--red);font-weight:700}.hero-actions a{display:inline-block;margin:14px 10px 0 0;border:3px solid var(--ink);padding:10px 14px;text-decoration:none;color:var(--ink);background:var(--yellow);font-weight:700}.stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:3px solid var(--ink)}.stats div{padding:22px;text-align:center;background:#fff;border-right:3px solid var(--ink)}.stats strong{font-size:2rem;display:block}.stats span{color:var(--muted)}.search-panel{padding:24px 6vw}.search-panel input{width:100%;font-size:1.1rem;padding:14px;border:3px solid var(--ink)}.doc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;padding:0 6vw 6vw}.doc-card{background:#fff;border:3px solid var(--ink);padding:18px;box-shadow:var(--shadow)}.doc-card h2{font-size:1.15rem;margin:0 0 10px}.doc-card span{display:inline-block;background:var(--blue);color:#fff;padding:2px 8px;font-size:.75rem}@media(max-width:720px){.keyboard-hint{display:none}.toc-panel{width:86vw;left:-90vw}.page{padding:70px 16px 88px}.stats{grid-template-columns:1fr}.stats div{border-right:0;border-bottom:3px solid var(--ink)}}""", encoding="utf-8")
    (ROOT / "assets" / "learning.js").write_text("""(()=>{let current=0,locked=false;const pages=[...document.querySelectorAll('.page')],bar=document.querySelector('.progress-bar'),counter=document.querySelector('.page-counter'),prev=document.querySelector('.prev'),next=document.querySelector('.next'),toc=document.querySelector('.toc-panel'),overlay=document.querySelector('.toc-overlay'),toggle=document.querySelector('.toc-toggle'),links=[...document.querySelectorAll('.toc-list a')],key='chuhai-progress-'+(document.body.dataset.doc||'index');function show(i){if(i<0||i>=pages.length||locked)return;locked=true;pages[current]?.classList.remove('active');current=i;pages[current].classList.add('active');pages[current].scrollTop=0;bar.style.width=((current+1)/pages.length*100)+'%';counter.textContent=(current+1)+' / '+pages.length;prev.disabled=current===0;next.disabled=current===pages.length-1;links.forEach(a=>a.classList.toggle('active',Number(a.dataset.page)===current));try{localStorage.setItem(key,String(current))}catch(e){}setTimeout(()=>locked=false,120)}function closeToc(){toc.classList.remove('open');overlay.classList.remove('visible')}function openToc(){toc.classList.add('open');overlay.classList.add('visible')}prev?.addEventListener('click',()=>show(current-1));next?.addEventListener('click',()=>show(current+1));toggle?.addEventListener('click',()=>toc.classList.contains('open')?closeToc():openToc());overlay?.addEventListener('click',closeToc);links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(Number(a.dataset.page));closeToc()}));document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(current+1);if(e.key==='ArrowLeft')show(current-1);if(e.key==='Escape')closeToc()});let sx=0,sy=0;document.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});document.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.4)show(current+(dx<0?1:-1))},{passive:true});document.addEventListener('click',e=>{const btn=e.target.closest('.copy-btn');if(!btn)return;const card=btn.closest('.prompt-card');const text=(card.querySelector('code')||card).textContent.trim();navigator.clipboard?.writeText(text).then(()=>{btn.textContent='已复制';setTimeout(()=>btn.textContent='复制',1600)})});let saved=0;try{saved=Number(localStorage.getItem(key)||0)}catch(e){}show(saved&&saved<pages.length?saved:0)})();""", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="https://siuserxiaowei.github.io/chuhai-xuexi")
    args = parser.parse_args()

    manifest = load_manifest()
    (ROOT / "assets").mkdir(exist_ok=True)
    (ROOT / "learn").mkdir(exist_ok=True)
    (ROOT / "reports").mkdir(exist_ok=True)
    write_assets()

    all_analysis: list[str] = ["# 道法术器势总分析", "", f"生成时间：{datetime.now().isoformat(timespec='seconds')}", ""]
    search_rows = []
    unsupported_lines = ["# 不可读取或需复核文档", ""]

    for doc in manifest["documents"]:
        if doc.get("kind") != "file":
            continue
        if doc.get("read_status") != "ok" or not doc.get("content_path"):
            unsupported_lines.append(f"- {doc.get('path') or doc.get('name')}：{doc.get('error') or doc.get('read_status')}")
            continue
        md_path = ROOT / doc["content_path"]
        md = md_path.read_text(encoding="utf-8", errors="replace")
        slides = build_slides(doc, md, args.base_url)
        out_dir = ROOT / "learn" / doc["slug"]
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "index.html").write_text(render_learning_page(doc, slides), encoding="utf-8")
        doc["github_pages_url"] = f"{args.base_url}/learn/{doc['slug']}/"
        doc["slide_count"] = len(slides)
        doc["keywords"] = keywords(md)
        search_rows.append({"title": doc.get("name"), "path": doc.get("path"), "url": doc["github_pages_url"], "keywords": doc["keywords"]})
        per = dao_fa_shu_qi_shi(md)
        all_analysis.append(f"## {doc.get('name')}")
        all_analysis.append("")
        all_analysis.append(f"- 来源 ID：`{doc.get('file_id')}`")
        all_analysis.append(f"- 互动学习页：{doc['github_pages_url']}")
        for k, vals in per.items():
            all_analysis.append(f"- **{k}**：" + "；".join(vals[:2]))
        all_analysis.append("")

    (ROOT / "data" / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "data" / "search.json").write_text(json.dumps(search_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "unsupported.md").write_text("\n".join(unsupported_lines), encoding="utf-8")
    report_md = "\n".join(all_analysis)
    (ROOT / "reports" / "dao-fa-shu-qi-shi.md").write_text(report_md, encoding="utf-8")
    (ROOT / "reports" / "dao-fa-shu-qi-shi.html").write_text("<!doctype html><meta charset='utf-8'><link rel='stylesheet' href='../assets/learning.css'><body class='index-body'><main class='site-hero'>" + md_to_html(report_md, 250000) + "</main></body>", encoding="utf-8")
    (ROOT / "index.html").write_text(render_index(manifest, args.base_url), encoding="utf-8")
    print(f"generated {len(search_rows)} learning pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
