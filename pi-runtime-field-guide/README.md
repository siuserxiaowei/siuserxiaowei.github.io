# Pi Runtime Field Guide

**网页阅读：[14 章完整教程](https://siuserxiaowei.github.io/pi-runtime-field-guide/curriculum/) · [首页逐章阅读](https://siuserxiaowei.github.io/pi-runtime-field-guide/#curriculum) · [三层架构研究](https://siuserxiaowei.github.io/pi-runtime-field-guide/updates/agent-stack.html)**

源码维护于 [xiaowei-ai-tools 的 Pi 项目目录](https://github.com/siuserxiaowei/xiaowei-ai-tools/tree/main/projects/AI%20%E7%BC%96%E7%A8%8B%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99/pi-runtime-field-guide)，公开阅读版由个人主页仓库的 `pi-runtime-field-guide/` 目录发布。旧独立仓库的历史来源见整合仓库根目录 `MIGRATION.json`。

## 完整课程 · Pi v1.5.0

原来的 14 章已逐章重写到 **Pi v1.5.0**，更新正文、接口、实验和固定源码链接。可直接看 [逐章 Markdown](curriculum/README.md)、[完整阅读页](curriculum/index.html) 与 [离线实验](curriculum/labs/README.md)。

- 01–05：包边界、模型集合、消息、双层 Loop、流式与取消。
- 06–10：工具与 MCP/Codemode、重试与副作用、事件与 RPC、上下文预算、压缩。
- 11–14：会话树、独立 Pi Durable、信任与隔离、Multica / Pi / Magpie 组合实践。
- 每章都有 3 个问题、具体实验、预期结果、验收与官方来源；源码固定到 `f9a26365568127461c47a07a37dcb42c140a3ac5`，Node.js 要求 `>=22.19.0`。

新版进度与旧版分开记录。[8 月课程数据](curriculum/archive/2026-08-26-chapters.json) 保留供追溯。

## 三层架构研究 · 2026-11-03

[Multica 管任务团队、Pi 执行 Agent、Magpie 接入模型](research/updates/2026-11-03-agent-stack-field-study.md)：研究实际控制边界、凭证与数据流、运行身份、模型选择、续接与失败验收，并给出分阶段联测顺序。第 14 章把这些落实为操作实验。

本轮冻结：Pi v1.5.0，Multica v0.8.0；Magpie 默认/latest v0.1.2858、stable v0.1.2115（21:20:47 上海时间核验）。旧 [20:50 发布快照](research/updates/2026-11-03-release-snapshot.json) 的 Magpie v0.1.2854 保留原日期，不与本轮混用。两对官方集成已核验，三工具全链仍需实际账号联测。

## 历史研究 · 2026-08-26

旧 Pi / DeepSeek Harness 源码对照、47 条平台路线、33 个原页平台与 Top 50 保留当时的证据范围和日期。本轮更新 14 章教程及三层研究，没有重跑旧策展排名，也没有恢复暂停的 47 × 10 采集。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173`。阅读站没有运行时依赖；实验依赖单独安装在 `curriculum/labs/`。

修改课程后运行 `python3 scripts/build_curriculum.py`，从 `curriculum/source/*.json` 同时生成逐章 Markdown、浏览器数据和完整阅读页。生成文件随源码提交，发布时不必现场构建课程。

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
