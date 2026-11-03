# Pi Runtime Field Guide

**网页阅读：[Pi Runtime Field Guide](https://siuserxiaowei.github.io/pi-runtime-field-guide/) · [11 月更新与三工具对比](https://siuserxiaowei.github.io/pi-runtime-field-guide/updates/2026-11-03.html)**

源码维护于 [xiaowei-ai-tools 的 Pi 项目目录](https://github.com/siuserxiaowei/xiaowei-ai-tools/tree/main/projects/AI%20%E7%BC%96%E7%A8%8B%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99/pi-runtime-field-guide)，公开阅读版由个人主页仓库的 `pi-runtime-field-guide/` 目录发布。旧独立仓库的历史来源见整合仓库根目录 `MIGRATION.json`。

## 最新研究 · 2026-11-03

新增 **Pi v1.5.0 更新与 Multica、Magpie 对比**，可直接阅读 [完整网页](updates/2026-11-03.html)、[研究原文](research/updates/2026-11-03-pi-multica-magpie.md) 和 [发布渠道快照](research/updates/2026-11-03-release-snapshot.json)。[首页](index.html#latest) 也已加入新版机制与三者对照。

- Pi 最新正式版：v1.5.0；原生 MCP、可选 Codemode，持久化能力拆到仍属实验阶段的 `pi-durable`。
- Multica 最新正式版：v0.8.0；负责任务、队列、定时触发与团队协作，官方支持 Pi 执行后端。
- Magpie：默认/latest v0.1.2854；stable 渠道 v0.1.2115。负责模型协议、账户与路由，也支持 Pi。
- 版本冻结于 2026-11-03 20:50:20（上海时间）；组合链路尚未端到端实测。来源与许可边界见完整报告。

## 历史课程与研究 · 2026-08-26

一份面向中文开发者的 Pi Agent 源码学习知识库，覆盖：

- 14 章学习路线，每章先放 3 个无答案问题
- Pi v0.80.2 中文教程基线 → v0.84.3 历史源码差分
- Agent Loop、工具管道、retry、context、compaction、session tree、AgentHarness
- Pi 与 DeepSeek Harness 的源码级架构对照
- 47 条平台路线，其中 33 个平台读到原页；另有经过证据合同校验的 Top 50
- 安全边界、商业化方向与最小可运行实验

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173`。站点没有运行时依赖或构建步骤。

## 研究证据

主要产物位于 [`research/run-pi-agent-runtime-20260826`](./research/run-pi-agent-runtime-20260826)：

- `query_plan.json` / `route-bundle.json`：查询与路由冻结
- `platform_coverage_36.tsv`：canonical 28 + 首轮 adjacent 的历史终态
- `platform_expansion_sources.tsv` / `platform_expansion_audit.json`：12 个补充原页与“33 个原页平台”验收
- `candidates.json` / `sources.tsv` / `evidence_cards.tsv`：策展与证据账本
- `rank-input-manifest.json` / `curate-result.json`：不可变输入与独立主审
- `engine_plan.json` / `engine_execution.json`：三引擎真实 probe、Python rank 重放与完成结果
- `ranking-output/`：Top 50、rejected、coverage、validation 与报告

Top 50 是截至 2026-08-26、在本次主题、时间窗、平台路线与 deterministic-v2 评分下的策展结果，不是“全网绝对排名”。

## 历史源码冻结

- Pi source：`8fa7eebd235355522c8104166b4f1f959b4e2f10`
- Pi release（2026-08-26）：`v0.84.3`
- DeepSeek Harness：`b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`
- DSH release：`v0.1.1-rc.2`，官方标为 developer preview

## 许可

- 本站前端代码：MIT，见 [`LICENSE`](./LICENSE)
- 原创研究文字：CC BY-SA 4.0，见 [`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md)
- 第三方材料：版权与许可归原作者，见 [`ATTRIBUTION.md`](./ATTRIBUTION.md)
