const synonymGroups = [
  ["人工智能", "AI", "大模型", "智能体", "算法"],
  ["制造业", "制造", "工业", "新型工业化", "工厂"],
  ["数字化", "数字化转型", "智改数转", "信息化"],
  ["中小企业", "专精特新", "小巨人", "规上企业"],
  ["申报", "项目", "资金", "补贴", "认定", "入库"],
  ["质量", "品质", "品牌", "标准"],
  ["东莞", "广东", "粤港澳大湾区"]
];

export function normalize(value = "") {
  return String(value).toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
}

function textFragments(value = "") {
  const fragments = new Set();
  const compact = normalize(value);
  if (compact) fragments.add(compact);
  const words = String(value).toLowerCase().match(/[a-z0-9]+|[\u3400-\u9fff]{2,}/g) || [];
  words.forEach((word) => fragments.add(word));
  return [...fragments].filter((item) => item.length >= 2);
}

export function expandQuery(query = "") {
  const fragments = new Set(textFragments(query));
  const normalizedQuery = normalize(query);
  for (const group of synonymGroups) {
    if (group.some((term) => normalizedQuery.includes(normalize(term)))) {
      group.forEach((term) => fragments.add(normalize(term)));
    }
  }
  return [...fragments];
}

function activeConcepts(query = "") {
  const normalizedQuery = normalize(query);
  return synonymGroups.filter((group) => group.some((term) => normalizedQuery.includes(normalize(term))));
}

function includesAny(value, terms) {
  const target = normalize(Array.isArray(value) ? value.join(" ") : value);
  return terms.some((term) => target.includes(normalize(term)));
}

function todayInShanghai(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function recencyBonus(dateString, asOfDate = todayInShanghai()) {
  const timestamp = Date.parse(dateString);
  if (!Number.isFinite(timestamp)) return 0;
  const ageDays = Math.max(0, (Date.parse(asOfDate) - timestamp) / 86400000);
  if (ageDays < 240) return 3;
  if (ageDays < 540) return 2;
  return 1;
}

export function derivePolicyStatus(policy, asOfDate = todayInShanghai()) {
  if (!policy.deadline) {
    if (policy.status === "已截止") return "已截止";
    if (policy.dataOrigin === "自动核验" && ["项目申报", "资质认定"].includes(policy.type)) return "待核验";
    return "有效";
  }
  return policy.deadline < asOfDate ? "已截止" : "有效";
}

export function scorePolicy(policy, query = "", profile = {}, options = {}) {
  const asOfDate = options.asOfDate || todayInShanghai();
  const currentPolicy = { ...policy, status: derivePolicyStatus(policy, asOfDate) };
  const terms = expandQuery(query);
  const concepts = activeConcepts(query);
  let score = 8;
  const reasons = [];

  const fieldWeights = [
    [currentPolicy.title, 14, "标题命中"],
    [currentPolicy.tags, 10, "主题标签吻合"],
    [currentPolicy.summary, 8, "政策内容相关"],
    [currentPolicy.support, 6, "支持方向相关"],
    [currentPolicy.agency, 3, "发布机构相关"]
  ];

  if (terms.length) {
    for (const [value, weight, label] of fieldWeights) {
      const conceptHits = concepts.filter((group) => includesAny(value, group)).length;
      const directHit = includesAny(value, textFragments(query));
      if (conceptHits || directHit) {
        const divisor = Math.max(1, Math.min(3, concepts.length));
        const contribution = conceptHits ? Math.min(weight, Math.ceil(weight / divisor) * conceptHits) : weight;
        score += contribution;
        reasons.push(label);
      }
    }
  }

  if (profile.region && [profile.region, "全国"].includes(currentPolicy.region)) {
    score += currentPolicy.region === profile.region ? 12 : 7;
    reasons.push(currentPolicy.region === profile.region ? "地区精准覆盖" : "全国政策覆盖");
  }
  if (profile.industry && includesAny(currentPolicy.industries, [profile.industry])) {
    score += 12;
    reasons.push("行业匹配");
  }
  if (profile.scale && includesAny(currentPolicy.scales, [profile.scale])) {
    score += 8;
    reasons.push("企业规模匹配");
  }
  if (profile.goal && includesAny(currentPolicy.goals, [profile.goal])) {
    score += 8;
    reasons.push("发展诉求匹配");
  }
  if (currentPolicy.status === "有效") {
    score += 5;
    reasons.push("当前有效");
  }
  score += recencyBonus(currentPolicy.publishedAt, asOfDate);

  return {
    ...currentPolicy,
    score: Math.max(1, Math.min(99, Math.round(score))),
    reasons: [...new Set(reasons)].slice(0, 4)
  };
}

export function searchPolicies(policies, options = {}) {
  const { query = "", region = "全部", status = "全部", profile = {}, asOfDate = todayInShanghai() } = options;
  const terms = expandQuery(query);
  return policies
    .filter((policy) => region === "全部" || policy.region === region || (region === "东莞" && policy.region === "全国"))
    .map((policy) => ({ ...policy, status: derivePolicyStatus(policy, asOfDate) }))
    .filter((policy) => status === "全部" || policy.status === status)
    .map((policy) => scorePolicy(policy, query, profile, { asOfDate }))
    .filter((policy) => !terms.length || policy.score >= 34)
    .sort((a, b) => b.score - a.score || b.publishedAt.localeCompare(a.publishedAt));
}

export function createBrief(results, profile = {}, query = "", options = {}) {
  const asOfDate = options.asOfDate || todayInShanghai();
  const top = results.slice(0, 3);
  const profileText = [profile.region, profile.industry, profile.scale, profile.goal].filter(Boolean).join(" · ");
  const actions = [];
  if (top.some((item) => item.status === "有效")) actions.push("优先核对有效政策的适用条件和主管部门执行口径。");
  if (top.some((item) => item.status === "待核验")) actions.push("先打开官方原文确认申报窗口；系统未确认截止时间的记录不视为当前开放。");
  if (top.some((item) => item.type === "项目申报" && item.status === "已截止")) actions.push("建立同类项目复开提醒，提前准备企业资质和应用成效材料。");
  if (profile.capabilities?.includes("场景")) actions.push("整理一个可量化的工业应用场景，用于后续项目申报与试点沟通。");
  else actions.push("先定义一个可量化的工业应用场景，补齐投入、产出和数据基础说明。");
  actions.push("所有申报结论回到官方原文复核，并保留政策版本与核验日期。");

  return {
    title: query ? `“${query}”政策研判简报` : "企业政策机会研判简报",
    profileText: profileText || "未设置企业画像",
    generatedAt: asOfDate,
    top,
    actions,
    markdown: [
      "# 智策雷达政策研判简报",
      "",
      `- 企业画像：${profileText || "未设置"}`,
      `- 检索问题：${query || "综合政策机会"}`,
      `- 生成日期：${asOfDate}`,
      "- 作者：siuser小伟",
      "",
      "## 优先政策",
      ...top.flatMap((item, index) => [
        `### ${index + 1}. ${item.title}`,
        `- 匹配度：${item.score}%`,
        `- 发布机构：${item.agency}`,
        `- 状态：${item.status}`,
        `- 截止日期：${item.deadline || (["项目申报", "资质认定"].includes(item.type) ? "待核验官方原文" : "未设固定截止日 / 以官方原文为准")}`,
        `- 匹配依据：${item.reasons.join("、") || "综合相关"}`,
        `- 官方来源：${item.source}`,
        ""
      ]),
      "## 建议动作",
      ...actions.map((action, index) => `${index + 1}. ${action}`),
      "",
      "> 本简报用于政策信息筛选，不替代主管部门正式解释。"
    ].join("\n")
  };
}
