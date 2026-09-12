import { dataMeta, policyData as manualBaseline } from "./data.js";
import { createBrief, derivePolicyStatus, searchPolicies } from "./engine.js";

const elements = {
  query: document.querySelector("#queryInput"), search: document.querySelector("#searchButton"), match: document.querySelector("#matchButton"),
  region: document.querySelector("#regionFilter"), status: document.querySelector("#statusFilter"),
  profileRegion: document.querySelector("#profileRegion"), profileIndustry: document.querySelector("#profileIndustry"),
  profileScale: document.querySelector("#profileScale"), profileGoal: document.querySelector("#profileGoal"),
  policyList: document.querySelector("#policyList"), empty: document.querySelector("#emptyState"), summary: document.querySelector("#resultSummary"),
  brief: document.querySelector("#briefContent"), briefProfile: document.querySelector("#briefProfile"),
  export: document.querySelector("#exportButton"), exportStatus: document.querySelector("#exportStatus"),
  dialog: document.querySelector("#policyDialog"), dialogContent: document.querySelector("#dialogContent"), dialogClose: document.querySelector("#dialogClose"),
  lastChecked: document.querySelector("#lastChecked"), healthDot: document.querySelector("#healthDot"), healthLabel: document.querySelector("#healthLabel"),
  dataStatus: document.querySelector("#dataStatus"), dataStatusTitle: document.querySelector("#dataStatusTitle"),
  dataStatusDetail: document.querySelector("#dataStatusDetail"), dataMode: document.querySelector("#dataMode"),
  sourceMetric: document.querySelector("#metricSources"), sourceMetricNote: document.querySelector("#metricSourcesNote")
};

const asOfDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
let policies = manualBaseline.map((policy) => ({ ...policy, dataOrigin: "人工核验基线" }));
let currentResults = [];
let currentBrief = null;
let snapshotMeta = null;

function profile() {
  return {
    region: elements.profileRegion.value, industry: elements.profileIndustry.value,
    scale: elements.profileScale.value, goal: elements.profileGoal.value,
    capabilities: [...document.querySelectorAll("fieldset input:checked")].map((input) => input.value)
  };
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

function formatShanghaiTime(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "时间待核验";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false
  }).format(new Date(timestamp)).replaceAll("/", ".");
}

function uniquePolicies(records) {
  const seen = new Set();
  return records.filter((policy) => {
    const key = policy.source || policy.title.replaceAll(/\s+/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function snapshotIsValid(snapshot) {
  return snapshot && Array.isArray(snapshot.policies) && snapshot.policies.length > 0
    && snapshot.meta?.failedSourceCount === 0 && snapshot.meta?.recordCount === snapshot.policies.length
    && snapshot.policies.every((policy) => policy.title && policy.agency && policy.source?.startsWith("https://"));
}

function renderDataHealth({ mode, title, detail, time, sourceCount = 0, healthy = false }) {
  elements.dataStatus.dataset.state = healthy ? "healthy" : "fallback";
  elements.dataStatusTitle.textContent = title;
  elements.dataStatusDetail.textContent = detail;
  elements.dataMode.textContent = mode;
  elements.healthLabel.textContent = healthy ? "最近自动核验成功" : "已降级到人工基线";
  elements.healthDot.classList.toggle("warning", !healthy);
  elements.lastChecked.textContent = time;
  elements.sourceMetric.textContent = sourceCount || "—";
  elements.sourceMetricNote.textContent = healthy ? "自动官方源" : "自动源暂不可用";
}

async function loadPolicySnapshot() {
  try {
    const response = await fetch(`./data/policies.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`快照响应 ${response.status}`);
    const snapshot = await response.json();
    if (!snapshotIsValid(snapshot)) throw new Error("快照结构或来源状态异常");
    snapshotMeta = snapshot.meta;
    const automatic = snapshot.policies.map((policy) => ({ ...policy, dataOrigin: "自动核验" }));
    policies = uniquePolicies([...automatic, ...manualBaseline.map((policy) => ({ ...policy, dataOrigin: "人工核验基线" }))]);
    const sourceLabels = {
      "dongguan-industry-notices": "东莞市工业和信息化局通知公告",
      "dongguan-industry-policies": "东莞市工业和信息化局政策文件"
    };
    const sourceNames = snapshot.meta.sourceResults.filter((source) => source.status === "success")
      .map((source) => source.label || sourceLabels[source.id] || source.id).join("、");
    renderDataHealth({
      mode: "自动快照 + 人工基线", title: `已载入 ${snapshot.meta.recordCount} 条自动核验记录`,
      detail: `${sourceNames || "东莞市工业和信息化局"}；定时任务每日 4 次，失败不会覆盖上次成功快照。`,
      time: formatShanghaiTime(snapshot.meta.lastSuccessfulAt), sourceCount: snapshot.meta.successfulSourceCount, healthy: true
    });
  } catch (error) {
    snapshotMeta = null;
    policies = manualBaseline.map((policy) => ({ ...policy, dataOrigin: "人工核验基线" }));
    renderDataHealth({
      mode: "人工核验基线", title: "自动快照暂不可用，已安全降级",
      detail: `保留 ${policies.length} 条人工复核样本；原因：${error.message}。不以失败结果覆盖可信数据。`,
      time: dataMeta.lastChecked.replaceAll("-", "."), healthy: false
    });
  }
}

function deadlineLabel(policy) {
  if (policy.deadline) return `截止 ${policy.deadline}`;
  if (policy.type === "项目申报" || policy.type === "资质认定") return "截止时间请核验原文";
  return "未设固定截止日";
}

function policyCard(policy) {
  const tags = policy.reasons.length ? policy.reasons : policy.tags.slice(0, 3);
  const originClass = policy.dataOrigin === "自动核验" ? "automatic" : "manual";
  const statusClass = policy.status === "有效" ? "active" : policy.status === "待核验" ? "pending" : "closed";
  return `
    <article class="policy-card" data-policy-id="${escapeHtml(policy.id)}">
      <div class="score" style="--score:${policy.score}"><span>${policy.score}</span></div>
      <div class="policy-main">
        <div class="policy-meta"><span class="origin ${originClass}">${escapeHtml(policy.dataOrigin)}</span><time>${escapeHtml(deadlineLabel(policy))}</time></div>
        <h3>${escapeHtml(policy.title)}</h3><p>${escapeHtml(policy.summary)}</p>
        <div class="tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      </div>
      <div class="policy-side"><span class="status ${statusClass}">${policy.status}</span>
        <button class="detail-button" type="button" data-detail="${escapeHtml(policy.id)}">查看官方证据</button></div>
    </article>`;
}

function renderBrief(brief) {
  elements.briefProfile.textContent = brief.profileText;
  elements.brief.innerHTML = `
    <h3>优先机会</h3>
    ${brief.top.map((item, index) => `<div class="brief-rank"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.title)}</strong><small>${item.score}%</small><time>${escapeHtml(deadlineLabel(item))}</time></div>`).join("") || "<p>当前条件下没有匹配结果。</p>"}
    <h3>建议动作</h3><ol>${brief.actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function runSearch({ focusResults = false } = {}) {
  const currentProfile = profile();
  currentResults = searchPolicies(policies, {
    query: elements.query.value.trim(), region: elements.region.value, status: elements.status.value,
    profile: currentProfile, asOfDate
  });
  elements.policyList.innerHTML = currentResults.map(policyCard).join("");
  elements.empty.hidden = currentResults.length > 0;
  const automaticCount = currentResults.filter((item) => item.dataOrigin === "自动核验").length;
  elements.summary.textContent = currentResults.length
    ? `检出 ${currentResults.length} 条政策（${automaticCount} 条来自自动核验快照），已按企业画像与查询意图排序。`
    : "当前条件没有检出政策。";
  currentBrief = createBrief(currentResults, currentProfile, elements.query.value.trim(), { asOfDate });
  renderBrief(currentBrief);
  document.querySelector("#metricTotal").textContent = policies.length;
  document.querySelector("#metricActive").textContent = policies.filter((item) => derivePolicyStatus(item, asOfDate) === "有效").length;
  document.querySelector("#metricMatched").textContent = currentResults.filter((item) => item.score >= 60).length;
  bindDetailButtons();
  if (focusResults) document.querySelector("#resultsTitle").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showPolicy(policy) {
  const provenance = policy.sources?.length
    ? `<h3>来源追溯</h3><ul>${policy.sources.map((source) => `<li>${escapeHtml(source.label)} · <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">官方页面</a></li>`).join("")}</ul>` : "";
  elements.dialogContent.innerHTML = `
    <article class="dialog-inner"><p class="kicker">${escapeHtml(policy.id)} · 匹配度 ${policy.score}% · ${escapeHtml(policy.dataOrigin)}</p>
      <h2>${escapeHtml(policy.title)}</h2><p>${escapeHtml(policy.summary)}</p>
      <div class="dialog-grid"><div><small>发布机构</small><strong>${escapeHtml(policy.agency)}</strong></div>
        <div><small>政策状态</small><strong>${escapeHtml(policy.status)}</strong></div>
        <div><small>申报截止</small><strong>${escapeHtml(policy.deadline || "未提取，请查原文")}</strong></div></div>
      <h3>匹配依据</h3><ul>${policy.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
      <h3>原文证据</h3><ul>${policy.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>${provenance}
      <a class="source-link" href="${escapeHtml(policy.source)}" target="_blank" rel="noopener noreferrer">打开${escapeHtml(policy.sourceLabel)}原文 ↗</a>
    </article>`;
  elements.dialog.showModal();
}

function bindDetailButtons() {
  document.querySelectorAll("[data-detail]").forEach((button) => button.addEventListener("click", () => {
    const policy = currentResults.find((item) => item.id === button.dataset.detail);
    if (policy) showPolicy(policy);
  }));
}

function exportBrief() {
  if (!currentBrief) return;
  const snapshotLine = snapshotMeta
    ? `\n- 数据快照：${snapshotMeta.lastSuccessfulAt}（${snapshotMeta.successfulSourceCount}/${snapshotMeta.sourceCount} 个官方源成功）\n`
    : "\n- 数据模式：人工核验基线（自动快照不可用）\n";
  const markdown = currentBrief.markdown.replace("- 作者：siuser小伟\n", `- 作者：siuser小伟${snapshotLine}`);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = "智策雷达-政策研判简报-siuser小伟.md"; document.body.append(anchor); anchor.click(); anchor.remove();
  elements.exportStatus.textContent = "简报已导出，包含本次数据快照与官方证据链接。";
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

elements.search.addEventListener("click", () => runSearch({ focusResults: true }));
elements.match.addEventListener("click", () => runSearch());
elements.query.addEventListener("keydown", (event) => { if (event.key === "Enter") runSearch({ focusResults: true }); });
[elements.region, elements.status].forEach((select) => select.addEventListener("change", () => runSearch()));
elements.export.addEventListener("click", exportBrief);
elements.dialogClose.addEventListener("click", () => elements.dialog.close());
elements.dialog.addEventListener("click", (event) => { if (event.target === elements.dialog) elements.dialog.close(); });

elements.query.value = "东莞制造企业近期可申报的人工智能与数字化政策";
await loadPolicySnapshot();
runSearch();
