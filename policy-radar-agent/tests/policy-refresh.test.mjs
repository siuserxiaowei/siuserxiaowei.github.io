import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const refreshModuleUrl = new URL("../scripts/policy-refresh.mjs", import.meta.url);

async function loadRefreshModule(cacheKey = "contract") {
  const url = new URL(refreshModuleUrl);
  url.searchParams.set("test", cacheKey);
  return import(url.href);
}

function officialSource(overrides = {}) {
  return {
    id: "dongguan-industry",
    label: "东莞市工业和信息化局",
    url: "https://im.dg.gov.cn/gkmlpt/index",
    ...overrides
  };
}

function rawPolicy(overrides = {}) {
  return {
    externalId: "notice-42",
    title: "  关于开展 2026 年人工智能项目申报的通知  ",
    agency: " 东莞市工业和信息化局 ",
    region: "东莞",
    publishedAt: "2026-08-20T09:30:00+08:00",
    deadline: "2026-09-30T23:59:59+08:00",
    type: "项目申报",
    industries: ["人工智能", "制造业", "人工智能"],
    scales: ["中小企业"],
    goals: ["资金申报"],
    tags: [" AI ", "项目申报", "AI"],
    summary: "支持制造企业申报人工智能应用项目。",
    support: "项目入库与资金支持",
    evidence: ["申报截止日期为 2026 年 9 月 30 日"],
    source: "https://im.dg.gov.cn/policy/notice-42/?utm_source=rss#申报要求",
    ...overrides
  };
}

function canonicalPolicy(overrides = {}) {
  return {
    id: "policy-dongguan-notice-42",
    title: "关于开展2026年人工智能项目申报的通知",
    agency: "东莞市工业和信息化局",
    region: "东莞",
    publishedAt: "2026-08-20",
    deadline: "2026-09-30",
    status: "有效",
    type: "项目申报",
    industries: ["人工智能", "制造业"],
    scales: ["中小企业"],
    goals: ["资金申报"],
    tags: ["AI", "项目申报"],
    summary: "支持制造企业申报人工智能应用项目。",
    support: "项目入库与资金支持",
    evidence: ["申报截止日期为 2026 年 9 月 30 日"],
    source: "https://im.dg.gov.cn/policy/notice-42",
    sourceLabel: "东莞市工业和信息化局",
    sources: [
      {
        id: "dongguan-industry",
        label: "东莞市工业和信息化局",
        url: "https://im.dg.gov.cn/policy/notice-42"
      }
    ],
    ...overrides
  };
}

test("policy refresh module is import-safe and does not run the CLI on import", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error("import must not fetch official sources");
  };

  try {
    const module = await loadRefreshModule(`import-safe-${Date.now()}`);
    assert.equal(typeof module.refreshPolicySnapshot, "function");
    assert.equal(fetchCalls, 0, "importing policy-refresh.mjs must not start a refresh");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("normalizeOfficialRecord creates a stable canonical policy with provenance", async () => {
  const { normalizeOfficialRecord } = await loadRefreshModule();
  const source = officialSource();
  const first = normalizeOfficialRecord(rawPolicy(), source, { asOfDate: "2026-08-23" });
  const second = normalizeOfficialRecord(rawPolicy(), source, { asOfDate: "2026-08-23" });

  assert.equal(first.id, second.id, "the same official record must receive a stable id");
  assert.ok(first.id, "canonical records require a non-empty id");
  assert.equal(first.title, "关于开展 2026 年人工智能项目申报的通知");
  assert.equal(first.agency, "东莞市工业和信息化局");
  assert.equal(first.publishedAt, "2026-08-20");
  assert.equal(first.deadline, "2026-09-30");
  assert.equal(first.status, "有效");
  assert.equal(first.dataOrigin, "自动核验");
  assert.equal(first.deadlineVerified, true);
  assert.deepEqual(first.industries, ["人工智能", "制造业"]);
  assert.deepEqual(first.tags, ["AI", "项目申报"]);
  assert.equal(first.source, "https://im.dg.gov.cn/policy/notice-42");
  assert.equal(first.sourceLabel, source.label);
  assert.deepEqual(first.sources, [
    {
      id: source.id,
      label: source.label,
      url: "https://im.dg.gov.cn/policy/notice-42"
    }
  ]);

  const legacyOfficialUrl = normalizeOfficialRecord(rawPolicy({
    externalId: "legacy-http",
    source: "http://www.dg.gov.cn/zwgk/policy/legacy.html"
  }), source, { asOfDate: "2026-08-23" });
  assert.equal(legacyOfficialUrl.source, "https://www.dg.gov.cn/zwgk/policy/legacy.html");
});

test("validatePolicyRecord accepts only strict dates and official HTTPS URLs", async () => {
  const { validatePolicyRecord } = await loadRefreshModule();

  const accepted = validatePolicyRecord(canonicalPolicy());
  assert.equal(accepted.valid, true);
  assert.deepEqual(accepted.errors, []);

  const rejected = validatePolicyRecord(canonicalPolicy({
    publishedAt: "2026-02-30",
    deadline: "30/09/2026",
    source: "http://gov.cn.attacker.example/policy/42",
    sources: [{ id: "spoof", label: "伪造来源", url: "https://gov.cn.attacker.example/policy/42" }]
  }));

  assert.equal(rejected.valid, false);
  assert.ok(rejected.errors.some((error) => /publishedAt/i.test(String(error))));
  assert.ok(rejected.errors.some((error) => /deadline/i.test(String(error))));
  assert.ok(rejected.errors.some((error) => /source|url/i.test(String(error))));
});

test("deduplicatePolicies merges URL and cross-source identity duplicates without losing provenance", async () => {
  const { deduplicatePolicies } = await loadRefreshModule();

  const primary = canonicalPolicy();
  const trackingDuplicate = canonicalPolicy({
    id: "feed-copy",
    source: "https://im.dg.gov.cn/policy/notice-42/?utm_medium=feed#top",
    tags: ["项目申报", "工业AI"],
    sources: [{
      id: "dongguan-rss",
      label: "东莞工信局 RSS",
      url: "https://im.dg.gov.cn/policy/notice-42/?utm_medium=feed#top"
    }]
  });
  const crossSourceDuplicate = canonicalPolicy({
    id: "city-portal-copy",
    source: "https://www.dg.gov.cn/zwgk/policy/notice-42.html",
    sourceLabel: "东莞市人民政府",
    evidence: ["支持制造企业开展人工智能应用", "申报截止日期为 2026 年 9 月 30 日"],
    sources: [{
      id: "dongguan-government",
      label: "东莞市人民政府",
      url: "https://www.dg.gov.cn/zwgk/policy/notice-42.html"
    }]
  });

  const result = deduplicatePolicies([primary, trackingDuplicate, crossSourceDuplicate]);

  assert.equal(result.length, 1);
  assert.deepEqual(result[0].tags, ["AI", "项目申报", "工业AI"]);
  assert.deepEqual(result[0].evidence, [
    "申报截止日期为 2026 年 9 月 30 日",
    "支持制造企业开展人工智能应用"
  ]);
  assert.deepEqual(new Set(result[0].sources.map((source) => source.id)), new Set([
    "dongguan-industry",
    "dongguan-rss",
    "dongguan-government"
  ]));
});

test("derivePolicyStatus keeps a policy active through its Shanghai deadline date", async () => {
  const { derivePolicyStatus } = await loadRefreshModule();

  assert.equal(derivePolicyStatus({ deadline: null }, "2026-08-23"), "有效");
  assert.equal(derivePolicyStatus({ deadline: "2026-08-23" }, "2026-08-23"), "有效");
  assert.equal(derivePolicyStatus({ deadline: "2026-08-24" }, "2026-08-23"), "有效");
  assert.equal(derivePolicyStatus({ deadline: "2026-08-22" }, "2026-08-23"), "已截止");
});

test("extractDeadlineFromHtml prefers the online application deadline over later paper-material dates", async () => {
  const { extractDeadlineFromHtml } = await loadRefreshModule();
  const result = extractDeadlineFromHtml(`
    <html><body>
      <div class="article-content">
        <p>开始申报时间：2026年8月19日。</p>
        <p>网上申报的截止时间：2026年9月1日（星期二）17:00。逾期未提交，视同放弃申报。</p>
        <p>网上预审通过后，提交纸质材料的截止时间：2026年9月8日17:00。</p>
        <p>东莞市工业和信息化局</p><p>2026年8月14日</p>
      </div>
    </body></html>
  `);

  assert.deepEqual(result, {
    deadline: "2026-09-01",
    evidence: "网上申报的截止时间：2026年9月1日（星期二）17:00。逾期未提交，视同放弃申报。"
  });
});

test("extractDeadlineFromHtml resolves yearless dates and date-range endpoints from the policy reference year", async () => {
  const { extractDeadlineFromHtml } = await loadRefreshModule();

  assert.deepEqual(extractDeadlineFromHtml(`
    <div class="article-content">
      <p>（一）网上填报</p>
      <p>企业登录“广东省数字工信平台”，于9月30日24时前提交申报材料，逾期不予受理。</p>
      <p>（三）线下提交</p>
      <p>形式审查通过后，企业于2026年10月16日前报送纸质材料。</p>
    </div>
  `, { referenceYear: 2026 }), {
    deadline: "2026-09-30",
    evidence: "企业登录“广东省数字工信平台”，于9月30日24时前提交申报材料，逾期不予受理。"
  });

  assert.deepEqual(extractDeadlineFromHtml(`
    <div class="article-content">
      <p>二、申报时间</p>
      <p>2026年8月4日-9月4日17时，逾期将不再受理申报。</p>
      <p>三、申报方式</p>
    </div>
  `, { referenceYear: 2026 }), {
    deadline: "2026-09-04",
    evidence: "2026年8月4日-9月4日17时，逾期将不再受理申报。"
  });
});

test("fetchDongguanSource traverses the full directory and fetches details only for conservative candidates", async () => {
  const { fetchDongguanSource } = await loadRefreshModule();
  const calls = [];
  const jsonResponse = (value) => new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
  const htmlResponse = (value) => new Response(value, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
  const eligibleArticle = {
    id: 101,
    title: "关于组织申报2026年制造业数字化转型项目的通知",
    publisher: "东莞市工业和信息化局",
    date: 1786636800,
    url: "https://im.dg.gov.cn/gkmlpt/content/1/101/post_101.html"
  };
  const excludedResult = {
    id: 102,
    title: "关于拨付2026年制造业项目资金结果的公示",
    publisher: "东莞市工业和信息化局",
    date: 1786636800,
    url: "https://im.dg.gov.cn/gkmlpt/content/1/102/post_102.html"
  };
  const oldArticle = {
    id: 103,
    title: "关于组织申报2024年技术改造项目的通知",
    publisher: "东莞市工业和信息化局",
    date: 1722441600,
    url: "https://im.dg.gov.cn/gkmlpt/content/1/103/post_103.html"
  };
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url.includes("page=0")) return jsonResponse({ total: 3, articles: [eligibleArticle, excludedResult] });
    if (url.includes("page=2")) return jsonResponse({ total: 3, articles: [oldArticle] });
    if (url === eligibleArticle.url) {
      return htmlResponse('<div class="article-content"><p>网上申报截止时间：2026年9月1日17:00。</p></div>');
    }
    throw new Error(`unexpected fetch: ${url}`);
  };

  const records = await fetchDongguanSource({
    id: "dongguan-test",
    label: "东莞工信测试源",
    url: "https://im.dg.gov.cn/gkmlpt/api/all/368?page={page}&sid=769033",
    maxPages: 5
  }, {
    fetchImpl,
    minimumPublishedAt: "2025-01-01"
  });

  assert.deepEqual(calls, [
    "https://im.dg.gov.cn/gkmlpt/api/all/368?page=0&sid=769033",
    "https://im.dg.gov.cn/gkmlpt/api/all/368?page=2&sid=769033",
    eligibleArticle.url
  ]);
  assert.equal(records.length, 1);
  assert.equal(records[0].id, eligibleArticle.id);
  assert.equal(records[0].deadline, "2026-09-01");
  assert.deepEqual(records[0].evidence, ["网上申报截止时间：2026年9月1日17:00。"]);
});

test("fetchDongguanSource skips candidates without an approved official detail URL and audits the skip", async () => {
  const { fetchDongguanSource } = await loadRefreshModule();
  const source = {
    id: "dongguan-test",
    label: "东莞工信测试源",
    url: "https://im.dg.gov.cn/gkmlpt/api/all/368?page={page}&sid=769033"
  };
  const fetchImpl = async () => new Response(JSON.stringify({
    total: 1,
    articles: [{
      id: 4457029,
      title: "2025年度东莞市人才认定申报公告",
      publisher: "东莞市工业和信息化局",
      date: 1762358400,
      url: "https://example.com/not-an-official-detail"
    }]
  }), { status: 200, headers: { "content-type": "application/json" } });

  const result = await fetchDongguanSource(source, {
    fetchImpl,
    minimumPublishedAt: "2025-01-01",
    includeAudit: true
  });

  assert.deepEqual(result, {
    records: [],
    audit: {
      directoryCount: 1,
      candidateCount: 1,
      skippedInvalidDetailUrlCount: 1
    }
  });
});

test("refreshPolicySnapshot writes a validated, deduplicated snapshot with audit metadata", async (t) => {
  const { refreshPolicySnapshot } = await loadRefreshModule();
  const directory = await mkdtemp(join(tmpdir(), "policy-refresh-success-"));
  const outputPath = join(directory, "policies.json");
  t.after(() => rm(directory, { recursive: true, force: true }));

  const sources = [
    officialSource(),
    officialSource({
      id: "dongguan-government",
      label: "东莞市人民政府",
      url: "https://www.dg.gov.cn/zwgk/policy/index.html"
    })
  ];
  const recordsBySource = new Map([
    ["dongguan-industry", [rawPolicy()]],
    ["dongguan-government", [rawPolicy({
      externalId: "city-copy-42",
      source: "https://www.dg.gov.cn/zwgk/policy/notice-42.html",
      evidence: ["支持制造企业开展人工智能应用"]
    })]]
  ]);

  const snapshot = await refreshPolicySnapshot({
    sources,
    outputPath,
    now: "2026-08-23T09:30:00.000Z",
    asOfDate: "2026-08-23",
    fetchSource: async (source) => recordsBySource.get(source.id)
  });
  const persisted = JSON.parse(await readFile(outputPath, "utf8"));

  assert.deepEqual(persisted, snapshot);
  assert.equal(snapshot.policies.length, 1, "duplicates from two official feeds must be published once");
  assert.deepEqual(snapshot.meta, {
    schemaVersion: 1,
    generatedAt: "2026-08-23T09:30:00.000Z",
    lastSuccessfulAt: "2026-08-23T09:30:00.000Z",
    sourceCount: 2,
    successfulSourceCount: 2,
    failedSourceCount: 0,
    recordCount: 1,
    sourceResults: [
      { id: "dongguan-industry", status: "success", fetchedCount: 1, acceptedCount: 1 },
      { id: "dongguan-government", status: "success", fetchedCount: 1, acceptedCount: 1 }
    ]
  });
});

test("refreshPolicySnapshot rejects a partial refresh and preserves the last successful snapshot byte-for-byte", async (t) => {
  const { refreshPolicySnapshot } = await loadRefreshModule();
  const directory = await mkdtemp(join(tmpdir(), "policy-refresh-failure-"));
  const outputPath = join(directory, "policies.json");
  t.after(() => rm(directory, { recursive: true, force: true }));

  const previousSnapshot = {
    meta: {
      schemaVersion: 1,
      generatedAt: "2026-08-22T08:00:00.000Z",
      lastSuccessfulAt: "2026-08-22T08:00:00.000Z",
      sourceCount: 2,
      successfulSourceCount: 2,
      failedSourceCount: 0,
      recordCount: 1,
      sourceResults: []
    },
    policies: [canonicalPolicy()]
  };
  const originalBytes = `${JSON.stringify(previousSnapshot, null, 2)}\n`;
  await writeFile(outputPath, originalBytes, "utf8");

  await assert.rejects(
    refreshPolicySnapshot({
      sources: [
        officialSource(),
        officialSource({ id: "unavailable-source", url: "https://www.gov.cn/policy/index.htm" })
      ],
      outputPath,
      now: "2026-08-23T09:30:00.000Z",
      asOfDate: "2026-08-23",
      fetchSource: async (source) => {
        if (source.id === "unavailable-source") throw new Error("official source unavailable");
        return [rawPolicy()];
      }
    }),
    /unavailable-source|official source unavailable/i
  );

  assert.equal(
    await readFile(outputPath, "utf8"),
    originalBytes,
    "a failed refresh must not replace or rewrite the last-known-good snapshot"
  );
});
