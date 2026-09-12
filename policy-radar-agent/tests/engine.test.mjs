import test from "node:test";
import assert from "node:assert/strict";
import { policyData } from "../src/data.js";
import { createBrief, expandQuery, scorePolicy, searchPolicies } from "../src/engine.js";

const dongguanManufacturer = {
  region: "东莞",
  industry: "制造业",
  scale: "中小企业",
  goal: "人工智能应用",
  capabilities: ["研发", "数据"]
};

test("query expansion links AI and manufacturing concepts", () => {
  const terms = expandQuery("AI制造业");
  assert.ok(terms.includes("人工智能"));
  assert.ok(terms.includes("工业"));
});

test("Dongguan manufacturing query prioritizes relevant active policies", () => {
  const results = searchPolicies(policyData, {
    query: "东莞制造企业人工智能支持政策",
    region: "全部",
    status: "全部",
    profile: dongguanManufacturer
  });
  assert.ok(results.length >= 4);
  assert.equal(results[0].region, "东莞");
  assert.ok(results[0].score >= 80);
  assert.ok(results.some((item) => item.id === "P-001"));
});

test("status filter excludes closed opportunities", () => {
  const results = searchPolicies(policyData, { status: "有效", profile: dongguanManufacturer });
  assert.ok(results.every((item) => item.status === "有效"));
});

test("score remains explainable and bounded", () => {
  const scored = scorePolicy(policyData[0], "人工智能制造业", dongguanManufacturer);
  assert.ok(scored.score >= 1 && scored.score <= 99);
  assert.ok(scored.reasons.length > 0);
});

test("brief includes official evidence links and sole author", () => {
  const results = searchPolicies(policyData, { query: "人工智能", profile: dongguanManufacturer });
  const brief = createBrief(results, dongguanManufacturer, "人工智能", { asOfDate: "2026-08-23" });
  assert.match(brief.markdown, /siuser小伟/);
  assert.match(brief.markdown, /https:\/\//);
  assert.match(brief.markdown, /2026-08-23/);
  assert.doesNotMatch(brief.markdown, /待填写|TODO|example\.com/i);
});

test("search recalculates policy lifecycle from the requested Shanghai date", () => {
  const expiringPolicy = {
    ...policyData[0],
    id: "deadline-contract",
    deadline: "2026-08-23",
    status: "已截止"
  };

  const onDeadline = searchPolicies([expiringPolicy], {
    status: "有效",
    profile: dongguanManufacturer,
    asOfDate: "2026-08-23"
  });
  const afterDeadline = searchPolicies([expiringPolicy], {
    status: "有效",
    profile: dongguanManufacturer,
    asOfDate: "2026-08-24"
  });

  assert.equal(onDeadline.length, 1, "a policy stays active through its deadline date");
  assert.equal(onDeadline[0].status, "有效");
  assert.equal(afterDeadline.length, 0);
});

test("an automatically collected application without a verified deadline stays pending verification", () => {
  const pendingPolicy = {
    ...policyData[0],
    id: "pending-deadline-contract",
    type: "项目申报",
    deadline: null,
    dataOrigin: "自动核验"
  };

  const [result] = searchPolicies([pendingPolicy], { asOfDate: "2026-08-23" });
  assert.equal(result.status, "待核验");
});
