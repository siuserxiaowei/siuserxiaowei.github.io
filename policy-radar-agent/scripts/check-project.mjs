import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { policyData } from "../src/data.js";
import snapshot from "../data/policies.json" with { type: "json" };

const root = new URL("../", import.meta.url).pathname;
const ignored = new Set([".git", "submission", "demo-output", "node_modules"]);
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignored.has(entry)) continue;
    const target = join(directory, entry);
    if (statSync(target).isDirectory()) walk(target);
    else files.push(target);
  }
}

walk(root);
const placeholders = /(?:^|[\s"'`])(?:TODO|TBD|待填写|example\.com|your[_ -]?name)(?:$|[\s"'`])/im;
const identityClaims = [
  /(?:作者|设计与开发)\s*[：:][^\n<]+/gi,
  /["']author["']\s*:\s*["'][^"']+["']/gi,
  /<meta\s+name=["']author["'][^>]+>/gi,
  /copyright\s*\(c\)[^\n]+/gi
];
const emailPattern = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi;
const allowedAutomationEmail = "41898282+github-actions[bot]@users.noreply.github.com";
const issues = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  if (placeholders.test(content) && !file.endsWith("check-project.mjs")) issues.push(`${relative(root, file)}: 含占位内容`);
  for (const pattern of identityClaims) {
    const claims = content.match(pattern) || [];
    if (claims.some((claim) => !claim.includes("siuser小伟"))) {
      issues.push(`${relative(root, file)}: 存在非 siuser小伟 的身份署名`);
      break;
    }
  }
  const isGeneratedOfficialSnapshot = relative(root, file) === "data/policies.json";
  const unexpectedEmails = (content.match(emailPattern) || []).filter((email) => email.toLowerCase() !== allowedAutomationEmail);
  if (!isGeneratedOfficialSnapshot && unexpectedEmails.length) issues.push(`${relative(root, file)}: 源码中含邮箱地址`);
}

for (const policy of policyData) {
  if (!policy.source.startsWith("https://")) issues.push(`${policy.id}: 来源不是 HTTPS`);
  if (!policy.agency || !policy.publishedAt || !policy.summary) issues.push(`${policy.id}: 关键字段缺失`);
}

if (!Array.isArray(snapshot.policies) || snapshot.policies.length !== snapshot.meta?.recordCount) {
  issues.push("data/policies.json: 自动快照数量与元数据不一致");
}
if (snapshot.meta?.failedSourceCount !== 0 || snapshot.meta?.successfulSourceCount !== snapshot.meta?.sourceCount) {
  issues.push("data/policies.json: 自动快照包含失败来源");
}
for (const policy of snapshot.policies || []) {
  if (!policy.source?.startsWith("https://")) issues.push(`${policy.id}: 自动快照来源不是 HTTPS`);
  if (!policy.agency || !policy.publishedAt || !policy.summary) issues.push(`${policy.id}: 自动快照关键字段缺失`);
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(`检查通过：${files.length} 个源码文件，${snapshot.policies.length} 条自动快照 + ${policyData.length} 条人工基线，作者 siuser小伟。`);
