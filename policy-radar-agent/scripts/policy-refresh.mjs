#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_OUTPUT_PATH = fileURLToPath(new URL("../data/policies.json", import.meta.url));
const DEFAULT_SOURCE_CONFIG_PATH = fileURLToPath(new URL("../data/policy-sources.json", import.meta.url));
const DEFAULT_SOURCES = [
  {
    id: "dongguan-industry-notices",
    label: "东莞市工业和信息化局 · 通知公告",
    url: "https://im.dg.gov.cn/gkmlpt/api/all/368?page={page}&sid=769033",
    homepage: "https://im.dg.gov.cn/dtxw/tzgg/index.html",
    type: "dongguan-gkmlpt",
    classifyId: 368,
    maxPages: 30
  },
  {
    id: "dongguan-industry-policies",
    label: "东莞市工业和信息化局 · 政策文件",
    url: "https://im.dg.gov.cn/gkmlpt/api/all/354?page={page}&sid=769033",
    homepage: "https://im.dg.gov.cn/zwgk/zcwj/index.html",
    type: "dongguan-gkmlpt",
    classifyId: 354,
    maxPages: 5
  }
];

const OFFICIAL_HOSTS = new Set([
  "im.dg.gov.cn",
  "www.dg.gov.cn",
  "dg.gov.cn",
  "www.gd.gov.cn",
  "gd.gov.cn",
  "www.miit.gov.cn",
  "miit.gov.cn",
  "www.gov.cn",
  "gov.cn"
]);
const TRACKING_PARAMETERS = new Set([
  "from",
  "source",
  "spm",
  "ref",
  "referrer"
]);
const RELEVANT_TITLE = /政策|措施|办法|细则|规划|方案|意见|申报|申请|征集|遴选|认定|入库|资助|补贴|奖励|贴息|专项资金|揭榜|人工智能|大模型|智能体|数字化|技术改造|技改|算力|制造业|中小企业|专精特新|绿色工厂|绿色制造|零碳|机器人|工业母机|软件/i;
const EXCLUDED_TITLE = /采购|中标|成交|结果|拨付|名单|公示|年度报表|行政执法|招聘|工作总结|部门预算|决算公开|法治政府|政府信息公开工作年度报告/i;

function trimText(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function uniqueStrings(values) {
  const result = [];
  const seen = new Set();
  for (const value of Array.isArray(values) ? values : []) {
    const cleaned = trimText(value);
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    result.push(cleaned);
  }
  return result;
}

function normalizeIdentityText(value) {
  return trimText(value)
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

function stablePolicyId(record, source) {
  const externalId = trimText(record.externalId ?? record.id);
  const seed = externalId
    ? `${trimText(source?.id)}:${externalId}`
    : `${normalizeIdentityText(record.title)}:${normalizeDate(record.publishedAt) ?? "unknown"}`;
  return `policy-${createHash("sha256").update(seed).digest("hex").slice(0, 16)}`;
}

function timestampToShanghaiDate(timestamp) {
  const numeric = Number(timestamp);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const milliseconds = numeric < 1e12 ? numeric * 1000 : numeric;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date(milliseconds));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function isStrictDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimText(value))) return false;
  const [year, month, day] = trimText(value).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function normalizeDate(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" || /^\d{10,13}$/.test(trimText(value))) {
    return timestampToShanghaiDate(value);
  }
  const text = trimText(value);
  if (isStrictDate(text)) return text;
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|\s)/);
  if (match && isStrictDate(`${match[1]}-${match[2]}-${match[3]}`)) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
}

function isOfficialHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && OFFICIAL_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function canonicalizeOfficialUrl(value) {
  let candidate = trimText(value);
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "http:" && OFFICIAL_HOSTS.has(parsed.hostname.toLowerCase())) {
      parsed.protocol = "https:";
      candidate = parsed.toString();
    }
  } catch {
    return candidate;
  }
  if (!isOfficialHttpsUrl(candidate)) return candidate;
  const url = new URL(candidate);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith("utm_") || TRACKING_PARAMETERS.has(key.toLowerCase())) {
      url.searchParams.delete(key);
    }
  }
  url.pathname = url.pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
  const sorted = [...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
  url.search = "";
  for (const [key, valuePart] of sorted) url.searchParams.append(key, valuePart);
  return url.toString().replace(/\?$/, "");
}

function normalizeSourceReference(source, recordUrl) {
  return {
    id: trimText(source?.id) || "official-source",
    label: trimText(source?.label) || trimText(source?.name) || "官方来源",
    url: canonicalizeOfficialUrl(recordUrl)
  };
}

function inferType(title, source) {
  const text = trimText(title);
  if (/申报|申请|征集|遴选|认定|入库|资助|补贴|奖励|揭榜/.test(text)) return "项目申报";
  if (/办法|措施|细则|规定|政策/.test(text)) return "产业政策";
  if (/规划|方案|意见/.test(text)) return "行动方案";
  return trimText(source?.defaultType) || "通知公告";
}

function inferTags(record) {
  const haystack = `${trimText(record.title)} ${trimText(record.description)} ${trimText(record.abstract)} ${trimText(record.keywords)}`;
  const candidates = [
    ["人工智能", /人工智能|大模型|智能体|算法/],
    ["机器人", /机器人/],
    ["制造业", /制造业|工业|工厂|技改/],
    ["数字化", /数字化|信息化|软件/],
    ["中小企业", /中小企业|专精特新|小巨人/],
    ["资金申报", /申报|资助|补贴|奖励|专项资金|贴息/],
    ["绿色制造", /绿色|零碳|节能|减排/]
  ];
  return candidates.filter(([, expression]) => expression.test(haystack)).map(([tag]) => tag);
}

function inferIndustries(tags) {
  const industries = [];
  if (tags.includes("人工智能")) industries.push("人工智能");
  if (tags.includes("制造业") || tags.includes("机器人") || tags.includes("绿色制造")) industries.push("制造业");
  if (tags.includes("数字化")) industries.push("软件服务");
  return industries.length ? industries : ["制造业"];
}

function inferGoals(title, tags) {
  const goals = [];
  if (tags.includes("人工智能")) goals.push("人工智能应用");
  if (tags.includes("数字化")) goals.push("数字化转型");
  if (/申报|申请|资助|补贴|奖励|资金|贴息/.test(title)) goals.push("资金申报");
  return goals.length ? goals : ["品牌与质量"];
}

export function derivePolicyStatus(policy, asOfDate = shanghaiDate(new Date())) {
  const deadline = normalizeDate(policy?.deadline);
  if (!deadline) return "有效";
  if (!isStrictDate(asOfDate)) throw new TypeError(`Invalid asOfDate: ${asOfDate}`);
  return deadline < asOfDate ? "已截止" : "有效";
}

function decodeHtmlEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"'
  };
  return String(value).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, key) => {
    const lower = key.toLowerCase();
    if (lower.startsWith("#x")) return String.fromCodePoint(Number.parseInt(lower.slice(2), 16));
    if (lower.startsWith("#")) return String.fromCodePoint(Number.parseInt(lower.slice(1), 10));
    return named[lower] ?? entity;
  });
}

function articleTextFromHtml(html) {
  const contentMatch = String(html).match(/<div\b[^>]*class=["'][^"']*\barticle-content\b[^"']*["'][^>]*>([\s\S]*?)(?=<div\b[^>]*class=["'][^"']*\barticle-content\b|<\/article>|<\/main>|<footer\b|$)/i);
  const content = contentMatch?.[1] ?? String(html);
  return decodeHtmlEntities(content)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\t\f\v ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function chineseDateToIso(value, referenceYear) {
  const match = trimText(value).match(/(?:(20\d{2})年\s*)?(\d{1,2})月\s*(\d{1,2})日/);
  if (!match) return null;
  const year = match[1] ?? String(referenceYear ?? "");
  if (!/^20\d{2}$/.test(year)) return null;
  const date = `${year}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  return isStrictDate(date) ? date : null;
}

export function extractDeadlineFromHtml(html, options = {}) {
  const text = articleTextFromHtml(html);
  const referenceYear = Number(options.referenceYear ?? options.publishedAt?.slice?.(0, 4));
  const sentences = text
    .split(/(?<=[。；;！？!?])|\n+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const candidates = [];

  for (const [index, sentence] of sentences.entries()) {
    const dates = [...sentence.matchAll(/(?:(?:20\d{2})年\s*)?\d{1,2}月\s*\d{1,2}日/g)]
      .map((match) => chineseDateToIso(match[0], referenceYear))
      .filter(Boolean);
    if (!dates.length) continue;
    const nextSentence = sentences[index + 1] ?? "";
    const deadlineContext = `${sentence}${nextSentence}`;
    const mentionsDeadline = /截止|截至|申报时间|申请时间|受理时间|提交时间/.test(sentence)
      || (/逾期.{0,20}(?:受理|申报|提交)/.test(deadlineContext) && dates.length >= 1);
    const beforeDeadline = /(?:于|截至?)\s*(?:(?:20\d{2})年\s*)?\d{1,2}月\s*\d{1,2}日.{0,20}(?:前|之前)/.test(sentence)
      || /(?:申报|申请|提交|报送).{0,30}(?:前|之前)/.test(sentence);
    if (!mentionsDeadline && !beforeDeadline) continue;
    if (/纸质|书面材料|现场提交|线下提交|邮寄/.test(sentence)) continue;

    let score = 0;
    if (/网上|线上|系统|平台|在线/.test(sentence)) score += 100;
    if (/申报|申请|提交|报送|受理/.test(sentence)) score += 60;
    if (/截止|截至/.test(sentence)) score += 40;
    if (/逾期/.test(sentence)) score += 10;
    const evidence = /逾期/.test(nextSentence) && !/(?:(?:20\d{2})年\s*)?\d{1,2}月\s*\d{1,2}日/.test(nextSentence)
      ? `${sentence}${nextSentence}`
      : sentence;
    candidates.push({
      deadline: dates.at(-1),
      evidence,
      score
    });
  }

  if (!candidates.length) return { deadline: null, evidence: null };
  candidates.sort((left, right) => right.score - left.score);
  const { deadline, evidence } = candidates[0];
  return { deadline, evidence };
}

export function normalizeOfficialRecord(record, source, options = {}) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new TypeError("Official record must be an object");
  }
  const asOfDate = options.asOfDate ?? shanghaiDate(new Date());
  const recordUrl = canonicalizeOfficialUrl(record.source ?? record.url ?? record.post_url ?? "");
  const publishedAt = normalizeDate(record.publishedAt ?? record.date ?? record.display_publish_time ?? record.create_time);
  const explicitDeadline = normalizeDate(record.deadline);
  const title = trimText(record.title);
  const tags = uniqueStrings(record.tags?.length ? record.tags : inferTags(record));
  const industries = uniqueStrings(record.industries?.length ? record.industries : inferIndustries(tags));
  const goals = uniqueStrings(record.goals?.length ? record.goals : inferGoals(title, tags));
  const statusBasis = {
    deadline: explicitDeadline
  };
  const status = record.is_abolished === 1 || record.is_abolished === "1"
    ? "已截止"
    : derivePolicyStatus(statusBasis, asOfDate);
  const sourceReference = normalizeSourceReference(source, recordUrl);

  return {
    id: trimText(record.canonicalId) || stablePolicyId(record, source),
    title,
    agency: trimText(record.agency ?? record.publisher) || sourceReference.label,
    region: trimText(record.region) || "东莞",
    publishedAt,
    deadline: explicitDeadline,
    status,
    dataOrigin: trimText(record.dataOrigin) || "自动核验",
    deadlineVerified: Boolean(explicitDeadline),
    type: trimText(record.typeLabel) || inferType(title, source),
    industries,
    scales: uniqueStrings(record.scales?.length ? record.scales : ["中小企业", "专精特新", "规上企业"]),
    goals,
    tags,
    summary: trimText(record.summary ?? record.description ?? record.abstract) || `${title}。请查看官方原文核对适用条件与执行口径。`,
    support: trimText(record.support) || (goals.includes("资金申报") ? "项目申报、认定或资金支持，以官方通知为准" : "政策指引与产业支持，以官方原文为准"),
    evidence: uniqueStrings(record.evidence?.length ? record.evidence : [title]),
    source: recordUrl,
    sourceLabel: sourceReference.label,
    sources: [sourceReference]
  };
}

export function validatePolicyRecord(policy) {
  const errors = [];
  if (!policy || typeof policy !== "object" || Array.isArray(policy)) {
    return { valid: false, errors: ["record must be an object"] };
  }
  for (const field of ["id", "title", "agency", "region", "type", "summary", "source", "sourceLabel"]) {
    if (!trimText(policy[field])) errors.push(`${field} is required`);
  }
  if (!isStrictDate(policy.publishedAt)) errors.push("publishedAt must be a real YYYY-MM-DD date");
  if (policy.deadline !== null && !isStrictDate(policy.deadline)) errors.push("deadline must be null or a real YYYY-MM-DD date");
  if (!isOfficialHttpsUrl(policy.source)) errors.push("source URL must use HTTPS on an approved official government host");
  if (!["有效", "已截止"].includes(policy.status)) errors.push("status must be 有效 or 已截止");
  if (policy.deadlineVerified !== undefined && typeof policy.deadlineVerified !== "boolean") {
    errors.push("deadlineVerified must be a boolean when present");
  }
  for (const field of ["industries", "scales", "goals", "tags", "evidence", "sources"]) {
    if (!Array.isArray(policy[field])) errors.push(`${field} must be an array`);
  }
  for (const [index, source] of (Array.isArray(policy.sources) ? policy.sources : []).entries()) {
    if (!trimText(source?.id) || !trimText(source?.label)) errors.push(`sources[${index}] requires id and label`);
    if (!isOfficialHttpsUrl(source?.url)) errors.push(`sources[${index}].url must be an approved official HTTPS URL`);
  }
  return { valid: errors.length === 0, errors };
}

function mergeUnique(target, incoming) {
  return uniqueStrings([...(Array.isArray(target) ? target : []), ...(Array.isArray(incoming) ? incoming : [])]);
}

function mergeSources(target, incoming) {
  const merged = [];
  const seen = new Set();
  for (const source of [...(target ?? []), ...(incoming ?? [])]) {
    const url = canonicalizeOfficialUrl(source?.url ?? "");
    const key = trimText(source?.id) || url;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push({
      id: trimText(source.id) || `source-${createHash("sha256").update(url).digest("hex").slice(0, 10)}`,
      label: trimText(source.label) || "官方来源",
      url
    });
  }
  return merged;
}

function duplicateIdentity(policy) {
  return `${normalizeIdentityText(policy.title)}|${normalizeDate(policy.publishedAt) ?? ""}`;
}

export function deduplicatePolicies(policies) {
  const output = [];
  const byUrl = new Map();
  const byIdentity = new Map();

  for (const candidate of policies ?? []) {
    const url = canonicalizeOfficialUrl(candidate.source ?? "");
    const identity = duplicateIdentity(candidate);
    const index = byUrl.get(url) ?? byIdentity.get(identity);
    if (index === undefined) {
      const policy = {
        ...candidate,
        source: url,
        industries: uniqueStrings(candidate.industries),
        scales: uniqueStrings(candidate.scales),
        goals: uniqueStrings(candidate.goals),
        tags: uniqueStrings(candidate.tags),
        evidence: uniqueStrings(candidate.evidence),
        sources: mergeSources([], candidate.sources)
      };
      output.push(policy);
      const newIndex = output.length - 1;
      if (url) byUrl.set(url, newIndex);
      if (identity !== "|") byIdentity.set(identity, newIndex);
      continue;
    }

    const current = output[index];
    current.industries = mergeUnique(current.industries, candidate.industries);
    current.scales = mergeUnique(current.scales, candidate.scales);
    current.goals = mergeUnique(current.goals, candidate.goals);
    current.tags = mergeUnique(current.tags, candidate.tags);
    current.evidence = mergeUnique(current.evidence, candidate.evidence);
    current.sources = mergeSources(current.sources, candidate.sources);
    if (url) byUrl.set(url, index);
    if (identity !== "|") byIdentity.set(identity, index);
  }

  return output;
}

function shanghaiDate(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(value instanceof Date ? value : new Date(value));
  const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${fields.year}-${fields.month}-${fields.day}`;
}

function sourcePageUrl(source, page) {
  if (source.url?.includes("{page}")) return source.url.replaceAll("{page}", String(page));
  const url = new URL(source.url);
  url.searchParams.set("page", String(page));
  return url.toString();
}

function isRelevantOfficialRecord(record) {
  const title = trimText(record.title);
  if (!title || !RELEVANT_TITLE.test(title)) return false;
  if (!EXCLUDED_TITLE.test(title)) return true;
  return /申报/.test(title) && /通知/.test(title);
}

function assertApiPayload(payload, source, page) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(`${source.id} page ${page}: expected a JSON object`);
  }
  if (!Number.isInteger(payload.total) || payload.total < 0 || !Array.isArray(payload.articles)) {
    throw new Error(`${source.id} page ${page}: unexpected official API shape`);
  }
}

export async function fetchDongguanSource(source, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") throw new TypeError("fetch implementation is required");
  const maxPages = Number.isInteger(source.maxPages) ? source.maxPages : 30;
  const minimumPublishedAt = normalizeDate(source.minimumPublishedAt ?? options.minimumPublishedAt ?? "2025-01-01");
  const candidates = [];
  const seenIds = new Set();
  let page = 0;
  let expectedTotal = null;

  while (page <= maxPages) {
    const url = sourcePageUrl(source, page);
    const response = await fetchImpl(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "PolicyRadarRefresh/1.0 (+https://siuserxiaowei.github.io/policy-radar-agent/)"
      },
      signal: AbortSignal.timeout(options.timeoutMs ?? 20_000)
    });
    if (!response.ok) throw new Error(`${source.id} page ${page}: HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error(`${source.id} page ${page}: expected application/json, received ${contentType || "unknown"}`);
    }
    let payload;
    try {
      payload = await response.json();
    } catch (error) {
      throw new Error(`${source.id} page ${page}: invalid JSON (${error.message})`);
    }
    assertApiPayload(payload, source, page);
    if (expectedTotal === null) expectedTotal = payload.total;
    else if (payload.total !== expectedTotal) throw new Error(`${source.id}: total changed during pagination`);

    for (const article of payload.articles) {
      const id = trimText(article.id);
      if (!id || seenIds.has(id)) continue;
      seenIds.add(id);
      const publishedAt = normalizeDate(article.date ?? article.display_publish_time ?? article.create_time);
      if (minimumPublishedAt && publishedAt && publishedAt < minimumPublishedAt) continue;
      if (isRelevantOfficialRecord(article)) candidates.push(article);
    }

    if (seenIds.size >= expectedTotal || payload.articles.length === 0) break;
    page = page === 0 ? 2 : page + 1;
  }

  if (seenIds.size < expectedTotal) {
    throw new Error(`${source.id}: pagination incomplete (${seenIds.size}/${expectedTotal} unique records)`);
  }

  const records = [];
  let skippedInvalidDetailUrlCount = 0;
  for (const article of candidates) {
    const detailUrl = canonicalizeOfficialUrl(article.url ?? article.post_url ?? "");
    if (!isOfficialHttpsUrl(detailUrl)) {
      skippedInvalidDetailUrlCount += 1;
      continue;
    }
    const response = await fetchImpl(detailUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "PolicyRadarRefresh/1.0 (+https://siuserxiaowei.github.io/policy-radar-agent/)"
      },
      signal: AbortSignal.timeout(options.timeoutMs ?? 20_000)
    });
    if (!response.ok) throw new Error(`${source.id} article ${article.id}: HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("text/html")) {
      throw new Error(`${source.id} article ${article.id}: expected text/html, received ${contentType || "unknown"}`);
    }
    const html = await response.text();
    const publishedAt = normalizeDate(article.date ?? article.display_publish_time ?? article.create_time);
    const titleYear = trimText(article.title).match(/20\d{2}/)?.[0];
    const deadlineResult = extractDeadlineFromHtml(html, {
      publishedAt,
      referenceYear: Number(titleYear ?? publishedAt?.slice(0, 4))
    });
    records.push({
      ...article,
      deadline: deadlineResult.deadline,
      evidence: deadlineResult.evidence ? [deadlineResult.evidence] : [trimText(article.title)]
    });
  }

  if (options.includeAudit) {
    return {
      records,
      audit: {
        directoryCount: seenIds.size,
        candidateCount: candidates.length,
        skippedInvalidDetailUrlCount
      }
    };
  }
  return records;
}

async function writeSnapshotAtomically(outputPath, snapshot) {
  await mkdir(dirname(outputPath), { recursive: true });
  const tempPath = `${outputPath}.tmp-${process.pid}-${Date.now()}`;
  try {
    await writeFile(tempPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    await rename(tempPath, outputPath);
  } catch (error) {
    await unlink(tempPath).catch(() => {});
    throw error;
  }
}

export async function refreshPolicySnapshot(options = {}) {
  const sources = options.sources ?? DEFAULT_SOURCES;
  const outputPath = resolve(options.outputPath ?? DEFAULT_OUTPUT_PATH);
  const instant = options.now instanceof Date ? options.now : new Date(options.now ?? Date.now());
  if (!Number.isFinite(instant.getTime())) throw new TypeError(`Invalid now: ${options.now}`);
  const generatedAt = instant.toISOString();
  const asOfDate = options.asOfDate ?? shanghaiDate(instant);
  const fetchSource = options.fetchSource ?? ((source) => fetchDongguanSource(source, { ...options, includeAudit: true }));
  if (!Array.isArray(sources) || sources.length === 0) throw new TypeError("At least one official source is required");

  const sourceResults = [];
  const normalized = [];
  const failures = [];

  for (const source of sources) {
    try {
      const fetched = await fetchSource(source);
      const records = Array.isArray(fetched) ? fetched : fetched?.records;
      const audit = Array.isArray(fetched) ? null : fetched?.audit;
      if (!Array.isArray(records)) throw new TypeError("source fetcher must return an array or { records, audit }");
      let acceptedCount = 0;
      for (const rawRecord of records) {
        const policy = normalizeOfficialRecord(rawRecord, source, { asOfDate });
        const validation = validatePolicyRecord(policy);
        if (!validation.valid) {
          throw new Error(`invalid policy ${policy.id || "unknown"}: ${validation.errors.join("; ")}`);
        }
        normalized.push(policy);
        acceptedCount += 1;
      }
      const sourceResult = {
        id: source.id,
        status: "success",
        fetchedCount: records.length,
        acceptedCount
      };
      if (audit) {
        sourceResult.directoryCount = audit.directoryCount;
        sourceResult.candidateCount = audit.candidateCount;
        sourceResult.skippedInvalidDetailUrlCount = audit.skippedInvalidDetailUrlCount;
      }
      sourceResults.push(sourceResult);
    } catch (error) {
      failures.push({ source, error });
      sourceResults.push({
        id: source.id,
        status: "failed",
        fetchedCount: 0,
        acceptedCount: 0
      });
    }
  }

  if (failures.length) {
    const detail = failures.map(({ source, error }) => `${source.id}: ${error.message}`).join("; ");
    throw new Error(`Policy refresh aborted; last successful snapshot preserved. ${detail}`);
  }

  const recentCutoff = options.recentCutoff ?? "2026-04-01";
  const policies = deduplicatePolicies(normalized)
    .filter((policy) => {
      const isPolicyDocument = policy.sources.some((source) => source.id === "dongguan-industry-policies");
      const hasCurrentWindow = policy.deadline !== null && policy.deadline >= asOfDate;
      return isPolicyDocument || hasCurrentWindow || policy.publishedAt >= recentCutoff;
    })
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.title.localeCompare(right.title, "zh-CN"));
  if (!policies.length) {
    throw new Error("Policy refresh produced no valid records; last successful snapshot preserved.");
  }
  for (const policy of policies) {
    const validation = validatePolicyRecord(policy);
    if (!validation.valid) throw new Error(`Merged policy ${policy.id} is invalid: ${validation.errors.join("; ")}`);
  }
  const snapshot = {
    meta: {
      schemaVersion: 1,
      generatedAt,
      lastSuccessfulAt: generatedAt,
      sourceCount: sources.length,
      successfulSourceCount: sources.length,
      failedSourceCount: 0,
      recordCount: policies.length,
      sourceResults
    },
    policies
  };
  await writeSnapshotAtomically(outputPath, snapshot);
  return snapshot;
}

async function readSources(path) {
  try {
    const value = JSON.parse(await readFile(path, "utf8"));
    const sources = Array.isArray(value) ? value : value.sources;
    if (!Array.isArray(sources) || sources.length === 0) throw new Error("source config must contain a non-empty sources array");
    return sources;
  } catch (error) {
    if (error.code === "ENOENT" && path === DEFAULT_SOURCE_CONFIG_PATH) return DEFAULT_SOURCES;
    throw error;
  }
}

function parseCliArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--output") values.outputPath = argv[++index];
    else if (argument === "--sources") values.sourceConfigPath = argv[++index];
    else if (argument === "--as-of") values.asOfDate = argv[++index];
    else if (argument === "--minimum-published-at") values.minimumPublishedAt = argv[++index];
    else if (argument === "--help" || argument === "-h") values.help = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  return values;
}

async function runCli() {
  const args = parseCliArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write([
      "Usage: node scripts/policy-refresh.mjs [options]",
      "",
      "Options:",
      "  --output <path>                 Snapshot path (default: data/policies.json)",
      "  --sources <path>                JSON source config (default: data/policy-sources.json)",
      "  --as-of <YYYY-MM-DD>            Shanghai date used to derive status",
      "  --minimum-published-at <date>   Oldest official record to include (default: 2025-01-01)",
      "  -h, --help                      Show this help"
    ].join("\n") + "\n");
    return;
  }
  const sourceConfigPath = resolve(args.sourceConfigPath ?? DEFAULT_SOURCE_CONFIG_PATH);
  const sources = await readSources(sourceConfigPath);
  const snapshot = await refreshPolicySnapshot({
    sources,
    outputPath: args.outputPath ?? DEFAULT_OUTPUT_PATH,
    asOfDate: args.asOfDate,
    minimumPublishedAt: args.minimumPublishedAt
  });
  process.stdout.write(`Policy refresh complete: ${snapshot.meta.recordCount} records from ${snapshot.meta.sourceCount} official sources.\n`);
}

const isDirectCli = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectCli) {
  runCli().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
