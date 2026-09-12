
"use strict";

const data = window.moneyHunterContent || {};
const stats = data.stats || {};
const files = data.files || [];
const links = data.links || [];
const uniqueLinks = data.uniqueLinks || [];
const attachments = data.attachments || [];
const rootPrefix = document.body.dataset.rootPrefix || "";
const fileByPath = new Map(files.map(file => [file.path, file]));
const numberFormatter = new Intl.NumberFormat("zh-CN");

const searchInput = document.querySelector("#searchInput");
const yearFilter = document.querySelector("#yearFilter");
const tagFilter = document.querySelector("#tagFilter");
const riskFilter = document.querySelector("#riskFilter");
const fileResults = document.querySelector("#fileResults");
const resultCount = document.querySelector("#resultCount");
const directoryTree = document.querySelector("#directoryTree");
const treeCount = document.querySelector("#treeCount");
const fileDetail = document.querySelector("#fileDetail");
const attachmentGrid = document.querySelector("#attachmentGrid");
const attachmentCount = document.querySelector("#attachmentCount");
const domainGrid = document.querySelector("#domainGrid");

const linkSearchInput = document.querySelector("#linkSearchInput");
const domainFilter = document.querySelector("#domainFilter");
const groupFilter = document.querySelector("#groupFilter");
const linkTableBody = document.querySelector("#linkTableBody");
const linkCount = document.querySelector("#linkCount");
const linkDomainChips = document.querySelector("#linkDomainChips");
const clearLinkFilters = document.querySelector("#clearLinkFilters");
const linkPrev = document.querySelector("#linkPrev");
const linkNext = document.querySelector("#linkNext");
const linkPager = document.querySelector("#linkPager");

const rawSearchInput = document.querySelector("#rawSearchInput");
const rawTypeFilter = document.querySelector("#rawTypeFilter");
const rawDirectoryTree = document.querySelector("#rawDirectoryTree");
const rawTreeCount = document.querySelector("#rawTreeCount");
const rawTableBody = document.querySelector("#rawTableBody");
const rawCount = document.querySelector("#rawCount");

const groupLabels = {
  app_market_intel: "应用/数据",
  social_video: "社媒/视频",
  community_entry: "社群入口",
  ads_competitor_research: "广告/竞品",
  code_ai_infra: "代码/AI",
  affiliate_tracking_redirect: "联盟/追踪",
  ai_saas_tools: "AI/SaaS"
};

let activePath = "";
let selectedFilePath = "";
let rawActivePath = "";
let linkPage = 1;
const linkPageSize = 80;

function byId(id) {
  return document.querySelector(id);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatNumber(value) {
  return numberFormatter.format(value || 0);
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function fileHref(file) {
  return `${rootPrefix}${file.publicPath}`;
}

function githubHref(file) {
  return `https://github.com/siuserxiaowei/moneyhunter-learning-hub/blob/main/${file.publicPath}`;
}

function statCards() {
  const target = byId("#stats");
  if (!target) return;
  const items = [
    ["公开文件", stats.fileCount],
    ["Markdown", stats.markdownCount],
    ["总行数", stats.markdownTotalLines],
    ["附件", stats.attachmentCount],
    ["URL 出现", stats.linkOccurrenceCount],
    ["唯一链接", stats.uniqueLinkCount]
  ];
  target.innerHTML = items
    .map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${formatNumber(value)}</strong></article>`)
    .join("");
}

function fillSelect(select, options, allLabel, labeler = value => value) {
  if (!select) return;
  const optionHtml = options.map(option => {
    const label = labeler(option);
    return `<option value="${escapeHtml(option)}">${escapeHtml(label)}</option>`;
  });
  select.innerHTML = [`<option value="">${allLabel}</option>`].concat(optionHtml).join("");
}

function pillList(items, risk = false) {
  return (items || [])
    .slice(0, 8)
    .map(item => `<span class="pill${risk ? " risk" : ""}">${escapeHtml(item)}</span>`)
    .join("");
}

function truncateText(value, limit = 120) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1)}…`;
}

function dimensionMini(file) {
  const dimensions = file.fiveDimensions || [];
  return `<span class="dimension-mini" aria-label="道法术器势">${
    dimensions.map(item => `<span class="${item.confidence === "needs_review" ? "needs-review" : ""}">${escapeHtml(item.label)}</span>`).join("")
  }</span>`;
}

function dimensionCards(file) {
  const dimensions = file.fiveDimensions || [];
  if (!dimensions.length) return "";
  return `<section class="dimension-grid" aria-label="道法术器势拆解">${dimensions.map(item => {
    const body = (item.items || []).map(point => `<li>${escapeHtml(point)}</li>`).join("");
    const review = item.confidence === "needs_review" ? " needs-review" : "";
    return `<article class="dimension-card${review}">
      <div class="dimension-head">
        <span class="dimension-label">${escapeHtml(item.label)}</span>
        <span>
          <strong>${escapeHtml(item.subtitle)}</strong>
          <em>${item.confidence === "needs_review" ? "待复盘" : "有证据"}</em>
        </span>
      </div>
      <ul>${body}</ul>
    </article>`;
  }).join("")}</section>`;
}

function buildDirectoryCounts() {
  const counts = new Map();
  files.forEach(file => {
    const parts = file.path.split("/");
    for (let index = 1; index < parts.length; index += 1) {
      const path = parts.slice(0, index).join("/");
      counts.set(path, (counts.get(path) || 0) + 1);
    }
  });
  return counts;
}

const directoryCounts = buildDirectoryCounts();

function renderTreeButtons(container, counter, currentPath, onSelect) {
  if (!container) return;
  const paths = Array.from(directoryCounts.keys()).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  if (counter) counter.textContent = `${formatNumber(paths.length)} 个目录`;
  const allButton = `<button type="button" data-path="" class="${!currentPath ? "is-active" : ""}" style="--depth:0">全部文件 <span class="muted">${formatNumber(files.length)}</span></button>`;
  container.innerHTML = [allButton].concat(paths.map(path => {
    const parts = path.split("/");
    const label = parts[parts.length - 1];
    const depth = parts.length - 1;
    const active = path === currentPath ? " is-active" : "";
    return `<button type="button" data-path="${escapeHtml(path)}" class="${active}" style="--depth:${depth}">${escapeHtml(label)} <span class="muted">${formatNumber(directoryCounts.get(path))}</span></button>`;
  })).join("");
  container.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => onSelect(button.dataset.path || ""));
  });
}

function initHomeFilters() {
  fillSelect(yearFilter, Object.keys(stats.yearCounts || {}), "全部年份");
  fillSelect(tagFilter, Object.keys(stats.tagCounts || {}), "全部主题");
  const risks = Array.from(new Set(files.flatMap(file => file.riskTags || []))).sort();
  fillSelect(riskFilter, risks, "全部风险标签");
}

function fileMatches(file) {
  const query = (searchInput?.value || "").trim().toLowerCase();
  const year = yearFilter?.value || "";
  const tag = tagFilter?.value || "";
  const risk = riskFilter?.value || "";
  const pathMatch = !activePath || file.path.startsWith(activePath + "/");
  const yearMatch = !year || file.year === year;
  const tagMatch = !tag || file.tags.includes(tag);
  const riskMatch = !risk || file.riskTags.includes(risk);
  const haystack = [
    file.path, file.title, file.excerpt, file.content,
    file.tags.join(" "), file.riskTags.join(" "), file.headings.join(" "),
    (file.fiveDimensions || []).map(item => `${item.label} ${item.subtitle} ${(item.items || []).join(" ")}`).join(" ")
  ].join(" ").toLowerCase();
  const queryMatch = !query || haystack.includes(query);
  return pathMatch && yearMatch && tagMatch && riskMatch && queryMatch;
}

function fileRow(file) {
  const selected = file.path === selectedFilePath ? " is-selected" : "";
  const excerpt = truncateText(file.excerpt || "附件或空文件，打开原始文件查看。", 108);
  return `<button class="file-row${selected}" type="button" data-path="${escapeHtml(file.path)}">
    <span class="file-main">
      <span class="file-title"><strong>${escapeHtml(file.title)}</strong>${dimensionMini(file)}${pillList(file.riskTags, true)}</span>
      <span class="file-path">${escapeHtml(file.path)}</span>
      <span class="file-excerpt">${escapeHtml(excerpt)}</span>
    </span>
    <span class="row-meta">
      ${pillList(file.tags)}
      <span class="pill neutral">${escapeHtml(file.year)}</span>
      <span class="pill neutral">${escapeHtml(file.extension || "file")}</span>
      <span class="pill neutral">${formatNumber(file.urlCount)} links</span>
    </span>
  </button>`;
}

function renderHomeTree() {
  renderTreeButtons(directoryTree, treeCount, activePath, path => {
    activePath = path;
    renderHomeTree();
    renderFiles();
  });
}

function renderFiles() {
  if (!fileResults) return;
  const visible = files.filter(fileMatches);
  if (!visible.some(file => file.path === selectedFilePath)) {
    selectedFilePath = visible[0]?.path || "";
  }
  fileResults.innerHTML = visible.map(fileRow).join("");
  if (resultCount) resultCount.textContent = `显示 ${formatNumber(visible.length)} / ${formatNumber(files.length)} 个文件`;
  fileResults.querySelectorAll(".file-row").forEach(row => {
    row.addEventListener("click", () => {
      selectedFilePath = row.dataset.path || "";
      renderFiles();
      const file = fileByPath.get(selectedFilePath);
      if (file) {
        renderDetail(file);
        if (window.innerWidth <= 860) fileDetail?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
  const selected = fileByPath.get(selectedFilePath);
  if (selected) renderDetail(selected);
}

function uniqueSourceLinks(file) {
  const seen = new Set();
  return links.filter(link => {
    if (link.sourcePath !== file.path || seen.has(link.url)) return false;
    seen.add(link.url);
    return true;
  }).slice(0, 36);
}

function renderDetail(file) {
  if (!fileDetail) return;
  const sourceLinks = uniqueSourceLinks(file)
    .map(link => `<li><a class="text-link" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.url)}</a></li>`)
    .join("");
  const content = file.content
    ? `<details class="source-preview"><summary>原文预览</summary><pre>${escapeHtml(file.content)}</pre></details>`
    : `<p class="muted">附件资料可通过公开入口打开或下载。</p>`;
  fileDetail.innerHTML = `<article class="detail-hero">
      <div class="detail-kicker">${dimensionMini(file)}<span>${escapeHtml(file.extension || "file")}</span></div>
      <h2>${escapeHtml(file.title)}</h2>
      <p class="file-path">${escapeHtml(file.path)}</p>
      <div class="meta-row">${pillList(file.tags)}${pillList(file.riskTags, true)}<span class="pill neutral">${escapeHtml(file.year)}</span><span class="pill neutral">${formatBytes(file.size)}</span></div>
      <div class="detail-actions">
        <a class="button primary" href="${fileHref(file)}" target="_blank" rel="noreferrer">打开原始文件</a>
        <a class="button secondary" href="${githubHref(file)}" target="_blank" rel="noreferrer">GitHub 查看</a>
      </div>
    </article>
    <div class="dimension-title">
      <span>道 · 法 · 术 · 器 · 势</span>
      <strong>五维拆解</strong>
    </div>
    ${dimensionCards(file)}
    ${content}
    ${sourceLinks ? `<h3>本文外链</h3><ul class="source-list">${sourceLinks}</ul>` : ""}`;
}

function renderAttachments() {
  if (!attachmentGrid) return;
  if (attachmentCount) attachmentCount.textContent = `${formatNumber(attachments.length)} 个附件`;
  attachmentGrid.innerHTML = attachments.map(file => {
    const detail = file.attachment?.kind === "pptx"
      ? `${file.attachment.slides.length} 页幻灯片，${file.attachment.mediaCount || 0} 个媒体`
      : file.attachment?.kind === "xlsx"
        ? `${file.attachment.sheets?.[0]?.rows || 0} 行，${file.attachment.sheets?.[0]?.columns || 0} 列`
        : "图片附件";
    return `<article class="attachment-card">
      <h3>${escapeHtml(file.title)}</h3>
      <p class="muted">${escapeHtml(file.path)}</p>
      <p>${escapeHtml(detail)}</p>
      <div class="detail-actions"><a class="text-link" href="${fileHref(file)}" target="_blank" rel="noreferrer">打开/下载</a></div>
    </article>`;
  }).join("");
}

function renderDomains() {
  if (!domainGrid) return;
  domainGrid.innerHTML = (stats.topDomains || []).slice(0, 14).map(item =>
    `<article class="domain-card"><strong>${escapeHtml(item.domain)}</strong><span>${formatNumber(item.count)} 次</span></article>`
  ).join("");
}

function initLinkFilters() {
  const domainCounts = new Map();
  uniqueLinks.forEach(link => domainCounts.set(link.domain, (domainCounts.get(link.domain) || 0) + link.count));
  const domains = Array.from(domainCounts.keys()).sort((a, b) => (domainCounts.get(b) - domainCounts.get(a)) || a.localeCompare(b));
  const groups = Array.from(new Set(uniqueLinks.map(link => link.group))).sort();
  fillSelect(domainFilter, domains, "全部域名", domain => `${domain} (${formatNumber(domainCounts.get(domain))})`);
  fillSelect(groupFilter, groups, "全部分组", group => groupLabels[group] || group);
}

function linkMatches(link) {
  const query = (linkSearchInput?.value || "").trim().toLowerCase();
  const domain = domainFilter?.value || "";
  const group = groupFilter?.value || "";
  const domainMatch = !domain || link.domain === domain;
  const groupMatch = !group || link.group === group;
  const haystack = [
    link.url, link.domain, groupLabels[link.group] || link.group, link.tags.join(" "), link.riskTags.join(" "),
    link.sources.map(source => `${source.path} ${source.title}`).join(" ")
  ].join(" ").toLowerCase();
  const queryMatch = !query || haystack.includes(query);
  return domainMatch && groupMatch && queryMatch;
}

function renderLinkDomainChips() {
  if (!linkDomainChips) return;
  const activeDomain = domainFilter?.value || "";
  linkDomainChips.innerHTML = (stats.topDomains || []).slice(0, 24).map(item => {
    const active = item.domain === activeDomain ? " is-active" : "";
    return `<button class="domain-chip${active}" type="button" data-domain="${escapeHtml(item.domain)}">${escapeHtml(item.domain)} · ${formatNumber(item.count)}</button>`;
  }).join("");
  linkDomainChips.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      if (domainFilter) domainFilter.value = button.dataset.domain || "";
      linkPage = 1;
      renderLinkDomainChips();
      renderLinks();
    });
  });
}

function renderLinks() {
  if (!linkTableBody) return;
  const visible = uniqueLinks.filter(linkMatches);
  const totalPages = Math.max(1, Math.ceil(visible.length / linkPageSize));
  linkPage = Math.min(Math.max(1, linkPage), totalPages);
  const start = (linkPage - 1) * linkPageSize;
  const pageItems = visible.slice(start, start + linkPageSize);
  if (linkCount) linkCount.textContent = `显示 ${formatNumber(visible.length)} / ${formatNumber(uniqueLinks.length)} 个唯一链接`;
  if (linkPager) linkPager.textContent = `${formatNumber(linkPage)} / ${formatNumber(totalPages)}`;
  if (linkPrev) linkPrev.disabled = linkPage <= 1;
  if (linkNext) linkNext.disabled = linkPage >= totalPages;
  linkTableBody.innerHTML = pageItems.map(link => {
    const first = link.sources[0] || {};
    const sourceFile = fileByPath.get(first.path);
    const sourceText = sourceFile?.excerpt || first.title || first.path || "";
    return `<article class="link-card">
      <div>
        <a class="link-url" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.url)}</a>
        <p class="link-context">${escapeHtml(truncateText(sourceText, 150))}</p>
        <p class="muted">来源：<a class="text-link" href="${rootPrefix}${escapeHtml(first.publicPath || "")}" target="_blank" rel="noreferrer">${escapeHtml(first.path || "unknown")}</a></p>
      </div>
      <div class="link-side">
        ${sourceFile ? dimensionMini(sourceFile) : ""}
        <span>${escapeHtml(link.domain)}</span>
        <span>${escapeHtml(groupLabels[link.group] || link.group)}</span>
        <span>${formatNumber(link.count)} 次出现</span>
        <span class="link-tags">${pillList(link.tags)}${pillList(link.riskTags, true)}</span>
      </div>
    </article>`;
  }).join("");
}

function initRawFilters() {
  const extensions = Array.from(new Set(files.map(file => file.extension || "no-ext"))).sort();
  fillSelect(rawTypeFilter, extensions, "全部类型", value => value === "no-ext" ? "无扩展名" : value);
}

function rawMatches(file) {
  const query = (rawSearchInput?.value || "").trim().toLowerCase();
  const type = rawTypeFilter?.value || "";
  const pathMatch = !rawActivePath || file.path.startsWith(rawActivePath + "/");
  const typeMatch = !type || (file.extension || "no-ext") === type;
  const haystack = [file.path, file.title, file.type, file.year, file.tags.join(" ")].join(" ").toLowerCase();
  const queryMatch = !query || haystack.includes(query);
  return pathMatch && typeMatch && queryMatch;
}

function renderRawTree() {
  renderTreeButtons(rawDirectoryTree, rawTreeCount, rawActivePath, path => {
    rawActivePath = path;
    renderRawTree();
    renderRawTable();
  });
}

function renderRawTable() {
  if (!rawTableBody) return;
  const visible = files.filter(rawMatches);
  if (rawCount) rawCount.textContent = `显示 ${formatNumber(visible.length)} / ${formatNumber(files.length)} 个文件`;
  rawTableBody.innerHTML = visible.map(file => `<tr>
    <td class="raw-path-cell" data-label="文件"><a href="${fileHref(file)}" target="_blank" rel="noreferrer">${escapeHtml(file.path)}</a></td>
    <td data-label="类型">${escapeHtml(file.type)}</td>
    <td data-label="年份">${escapeHtml(file.year)}</td>
    <td data-label="标签">${pillList(file.tags)}${pillList(file.riskTags, true)}</td>
    <td data-label="大小">${formatBytes(file.size)}</td>
  </tr>`).join("");
}

function wireEvents() {
  [searchInput, yearFilter, tagFilter, riskFilter].forEach(control => {
    control?.addEventListener("input", renderFiles);
    control?.addEventListener("change", renderFiles);
  });
  [linkSearchInput, domainFilter, groupFilter].forEach(control => {
    control?.addEventListener("input", () => { linkPage = 1; renderLinks(); });
    control?.addEventListener("change", () => { linkPage = 1; renderLinkDomainChips(); renderLinks(); });
  });
  clearLinkFilters?.addEventListener("click", () => {
    if (linkSearchInput) linkSearchInput.value = "";
    if (domainFilter) domainFilter.value = "";
    if (groupFilter) groupFilter.value = "";
    linkPage = 1;
    renderLinkDomainChips();
    renderLinks();
  });
  linkPrev?.addEventListener("click", () => { linkPage -= 1; renderLinks(); });
  linkNext?.addEventListener("click", () => { linkPage += 1; renderLinks(); });
  [rawSearchInput, rawTypeFilter].forEach(control => {
    control?.addEventListener("input", renderRawTable);
    control?.addEventListener("change", renderRawTable);
  });
}

statCards();
initHomeFilters();
renderHomeTree();
renderFiles();
renderAttachments();
renderDomains();
initLinkFilters();
renderLinkDomainChips();
renderLinks();
initRawFilters();
renderRawTree();
renderRawTable();
wireEvents();
