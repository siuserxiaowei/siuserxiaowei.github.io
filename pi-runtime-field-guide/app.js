const curriculum = window.PI_CURRICULUM || { meta: {}, chapters: [] };
const chapters = curriculum.chapters;
const escapeText = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[char]));

const comparisons = [
  ["产品边界", "8 月：primitives + 成品 coding agent + 实验性 AgentHarness", "8 月：local-first Web/headless harness；profile/bundle 组合全栈", "历史架构对照；新版 Pi 已将 Durable 独立"],
  ["Loop", "steering/tool 内环 + follow-up 外环", "driver → turn → step → provider request retry", "比较队列与 durable boundary，不只数层数"],
  ["Provider", "pi-ai 统一多供应商", "DeepSeek adapter + 基于 pi-ai 的通用 adapter", "可以组合，不是纯替代"],
  ["工具治理", "validate / before / execute / after / result", "durable call + guard / permission / sandbox / approval / wrappers / durable result", "DSH seam 更完整；Pi 更易读"],
  ["工具重试", "默认不透明自动重试", "base 同样不自动重试，可用 wrapper plugin", "都必须显式处理幂等与副作用"],
  ["持久化", "8 月：单 JSONL entry tree；实验性 Harness 加 store/ledger/transaction", "8 月：typed append-only session event log", "此行不描述 v1.5.0 的独立 Pi Durable"],
  ["分叉", "同 session 内 parent tree 与 active path", "复制 session prefix 到 child，跨 session 成谱系", "产品体验相似，恢复和分享边界不同"],
  ["安全", "官方无内建 permission，需扩展 + 外部 sandbox", "base 有 policy/sandbox/approval seams", "Pi 的自由必须配外部治理"],
  ["8 月版本", "当时为 v0.84.3 stable", "当时为 v0.1.1 RC / developer preview", "只代表 2026-08-26；DSH 未在本轮重新核验"]
];

const coverage = [
  ["CSDN","complete",12],["微信公众号","blocked",0],["知乎","complete",5],["小红书","blocked",0],
  ["微博","blocked",0],["抖音","blocked",0],["X / Twitter","partial",4],["Bilibili","complete",35],
  ["掘金","complete",3],["YouTube","complete",15],["Linux.do","complete",8],["GitHub","complete",48],
  ["百度搜索","partial",0],["Google 搜索","blocked",0],["Bing 搜索","partial",0],["今日头条","partial",0],
  ["36氪","complete",5],["InfoQ","complete",3],["SegmentFault","complete",7],["开源中国","partial",0],
  ["V2EX","complete",6],["Reddit","blocked",0],["Hacker News","complete",8],["Medium","partial",3],
  ["LinkedIn","partial",2],["快手","blocked",0],["微信视频号","blocked",0],["TikTok","blocked",0],
  ["Official Web","complete",4],["npm","complete",7],["DEV.to","complete",4],["Stack Overflow","partial",0],
  ["Product Hunt","complete",1],["Substack","complete",4],["arXiv / OpenReview","partial",1],["Gitee","partial",2],
  ["Zenn","complete",1],["HackerNoon","complete",1],["Qiita","complete",1],["Hashnode","partial",1],
  ["note","complete",1],["Hugging Face","partial",1],["Bluesky","complete",1],["GitLab","complete",1],
  ["Composio","complete",1],["PyPI","complete",1],["Docker Hub","partial",1]
];

const expansionSources = [
  ["Zenn", "源码实测", "把 Pi 当自建 Agent 基座，而非又一个成品 CLI", "https://zenn.dev/53able/articles/c619b3f3cabf4e"],
  ["HackerNoon", "实践", "用 SSH extension 管理 VPS", "https://hackernoon.com/how-i-manage-my-vps-with-pis-ssh-extension"],
  ["Qiita", "教程", "从最小聊天循环到自定义工具与 Skill", "https://qiita.com/otakumesi/items/414c2e1836df4d8e278d"],
  ["Hashnode", "相邻案例", "Kata / Pi harness 如何进入编排系统", "https://plzai.hashnode.dev/2026-04-30-openai-symphony-codex-orchestration-linear"],
  ["note", "架构导读", "用“减法设计”理解模型切换、会话树与扩展", "https://note.com/_kihonushi/n/n4e4bd035c453"],
  ["Hugging Face", "生态记录", "公开 session dataset；仅作采用信号，不作源码事实", "https://huggingface.co/datasets/badlogicgames/pi-mono/blob/main/2026-01-16T02-58-05-814Z_14c806f6-4fde-4121-9a73-a8a167199723.jsonl"],
  ["Product Hunt", "商业化", "产品定位、用户评论与生态采用", "https://www.producthunt.com/products/pi-coding-agent-3"],
  ["Bluesky", "公开帖子", "Pi + Tiny LLM + Devcontainer 的本地路线", "https://bsky.app/profile/k33gorg.bsky.social/post/3me6k6usdns2d"],
  ["GitLab", "部署案例", "把 Pi 封装成容器、API、MCP、Telegram 与 cron", "https://gitlab.com/psyb0t/docker-pibox"],
  ["Composio", "集成教程", "Pi 作为推理内核，外接 Slack 与用户级工具授权", "https://docs.composio.dev/examples/general-agent-with-pi"],
  ["PyPI", "跨语言", "用 RPC 从 Python 驱动真实 Pi runtime", "https://pypi.org/project/pi-py-sdk/"],
  ["Docker Hub", "分发工件", "可复现的 pi-coding-agent 多架构镜像层", "https://hub.docker.com/layers/stephengpope/thepopebot/coding-agent-pi-coding-agent-1.2.78/images/sha256-8203151c3ee00422b2a8a9dbed716557c80f49ef2d37bae4ef72e23782cb34db"]
];

function readCompletion(key) {
  try {
    const values = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(values) ? values.filter(x => Number.isInteger(x) && x >= 0 && x < chapters.length) : []);
  } catch {
    return new Set();
  }
}

function renderChapters() {
  const root = document.querySelector("#chapter-list");
  if (!chapters.length) {
    root.innerHTML = '<p class="risk-strip">课程数据未加载，请刷新页面，或打开<a href="./curriculum/">完整教程阅读页</a>。</p>';
    updateProgress(0);
    return;
  }
  const completed = readCompletion(curriculum.meta.progressKey);
  root.innerHTML = chapters.map((chapter, index) => `
    <article class="chapter${index === 0 ? " open" : ""}" id="${chapter.id}" data-index="${index}" data-version="${curriculum.meta.version}">
      <button class="chapter-head" aria-expanded="${index === 0}" aria-controls="${chapter.id}-body">
        <span class="number">${String(index + 1).padStart(2,"0")}</span>
        <h3>${escapeText(chapter.title)}</h3><span class="chapter-tag">${escapeText(chapter.tag)}</span>
      </button>
      <div class="chapter-body" id="${chapter.id}-body">
        <p class="chapter-version">Pi v${curriculum.meta.version} · 2026-11-03 全文核验 · <a href="./curriculum/index.html#${chapter.id}">独立阅读</a> · <a href="#${chapter.id}">章节链接</a></p>
        <div class="question-box"><span>READ BEFORE ANSWERS</span><ol>${chapter.questions.map(q => `<li>${escapeText(q)}</li>`).join("")}</ol></div>
        <div class="chapter-columns">
          <div class="chapter-copy">${chapter.copy}</div>
          <aside class="chapter-lab"><span>HANDS-ON LAB</span>${chapter.labHtml}
            <label class="complete-label"><input type="checkbox" data-complete="${index}" ${completed.has(index) ? "checked" : ""}>我已完成实验，并能解释三个问题</label>
          </aside>
        </div>
        <section class="chapter-evidence"><h4>源码与官方文档</h4>${chapter.sourcesHtml}<a class="source-link" href="./${chapter.markdownPath}">Markdown 原文 ↗</a></section>
        <details class="chapter-migration"><summary>从旧版到本章的变化</summary><p>${escapeText(chapter.migration)}</p></details>
      </div>
    </article>`).join("");

  root.addEventListener("click", event => {
    const head = event.target.closest(".chapter-head");
    if (!head) return;
    const article = head.closest(".chapter");
    article.classList.toggle("open");
    head.setAttribute("aria-expanded", String(article.classList.contains("open")));
  });
  root.addEventListener("change", event => {
    const input = event.target.closest("[data-complete]");
    if (!input) return;
    const index = Number(input.dataset.complete);
    input.checked ? completed.add(index) : completed.delete(index);
    localStorage.setItem(curriculum.meta.progressKey, JSON.stringify([...completed]));
    updateProgress(completed.size);
  });
  updateProgress(completed.size);
}

function openHashChapter() {
  if (!/^#chapter-\d{2}$/.test(location.hash)) return;
  const article = document.getElementById(location.hash.slice(1));
  if (!article) return;
  article.classList.add("open");
  article.querySelector(".chapter-head").setAttribute("aria-expanded", "true");
  article.scrollIntoView({block: "start"});
}

function updateProgress(count) {
  document.querySelector("#chapter-progress").style.width = `${count / Math.max(chapters.length, 1) * 100}%`;
  document.querySelector("#progress-copy").textContent = `${count} / ${chapters.length} 已标记完成`;
}

function renderComparisons() {
  const body = document.querySelector("#comparison-body");
  const table = body.closest("table");
  if (!table.caption) {
    const caption = table.createCaption();
    caption.innerHTML = `2026-08-26 历史对照 · Pi v0.84.3 / DeepSeek Harness v0.1.1 RC。<a href="./updates/2026-11-03.html">查看 11 月更新 ↗</a>`;
  }
  body.innerHTML = comparisons.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("");
}

function renderCoverage() {
  document.querySelector("#coverage-grid").innerHTML = coverage.map(([name,status,count]) => `
    <article class="coverage-card ${status}"><span class="coverage-pill">${status}</span><h3>${name}</h3><p>${count ? `${count} 条候选召回` : "严格主题零召回 / 受阻"}</p></article>`).join("");
}

function renderExpansionSources() {
  document.querySelector("#expansion-source-grid").innerHTML = expansionSources.map(([platform, type, title, url]) => `
    <a href="${url}" target="_blank" rel="noreferrer"><span>${platform} · ${type}</span><strong>${title}</strong><i>↗</i></a>`).join("");
}

let allSources = [];
let activeFilter = "全部";

function renderSourceFilters() {
  const filters = ["全部", ...new Set(allSources.map(item => item.track))];
  document.querySelector("#source-filters").innerHTML = filters.map(filter => `<button class="filter-button${filter === activeFilter ? " active" : ""}" data-filter="${filter}">${filter}</button>`).join("");
}

function renderSources() {
  const query = document.querySelector("#source-search").value.trim().toLowerCase();
  const rows = allSources.filter(item => {
    const haystack = `${item.title} ${item.finding} ${item.platform} ${item.author} ${item.track}`.toLowerCase();
    return (activeFilter === "全部" || item.track === activeFilter) && haystack.includes(query);
  });
  document.querySelector("#result-count").textContent = `${rows.length} / ${allSources.length}`;
  document.querySelector("#source-grid").innerHTML = rows.length ? rows.map(item => `
    <article class="source-card">
      <div class="source-card-top"><span class="source-rank">${String(item.curator_rank).padStart(2,"0")}</span><span class="source-platform">${item.actual_platform || item.platform}</span></div>
      <h3>${item.title}</h3><p>${item.finding}</p>
      <div class="source-meta"><span>${item.track} · ${item.evidence_grade}</span><a href="${item.url}" target="_blank" rel="noreferrer">OPEN ↗</a></div>
    </article>`).join("") : `<div class="empty-state">没有匹配资料。换一个关键词试试。</div>`;
}

async function loadSources() {
  try {
    const response = await fetch("./research/run-pi-agent-runtime-20260826/curated-top50.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    allSources = (await response.json()).items;
    renderSourceFilters(); renderSources();
  } catch (error) {
    document.querySelector("#source-grid").innerHTML = `<div class="empty-state">Top 50 数据加载失败：${error.message}</div>`;
    document.querySelector("#result-count").textContent = "ERROR";
  }
}

function bindLibrary() {
  document.querySelector("#source-search").addEventListener("input", renderSources);
  document.querySelector("#source-filters").addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    renderSourceFilters(); renderSources();
  });
}

function observeReveals() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible")); return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), {threshold: .07});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

renderChapters();
window.addEventListener("hashchange", openHashChapter);
requestAnimationFrame(openHashChapter);
renderComparisons();
renderCoverage();
renderExpansionSources();
bindLibrary();
observeReveals();
loadSources();
