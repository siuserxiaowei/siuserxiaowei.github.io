# Pi 最新研究更新：与 Multica、Magpie 有什么区别

核验日期：2026-11-03，Asia/Shanghai；发布渠道快照截至 20:50:20。旧研究基线：8 月 26 日 Pi v0.84.3；8 月 31 日长文 v0.84.4。

本次复核官方发布总览、包注册表、固定版本源码和官方文档。属于资料与源码核验，未安装运行三个项目，未做模型质量、成本、性能或三者联合测试。8 月课程、Top 50、平台采集账本仍按原日期归档。

## 先说结论

三个项目解决的是不同层的问题：**Multica 管任务和团队；Pi 执行 Agent 的推理与工具循环；Magpie 接通 Agent 与不同厂商的模型。** Pi 同时有可直接使用的 Coding Agent 和供开发者组合的底层库，不能只把它理解成一个 CLI。

| 用户要解决的问题 | 对应项目 | 交付的主要能力 |
|---|---|---|
| 给 Agent 分任务、排队、定时运行、看进度与交付 | Multica | 工作台、任务/运行记录、runtime 管理和团队协作 |
| 自己控制上下文、工具、执行循环，或开发 Agent 产品 | Pi | 可扩展终端 Agent、模型 SDK、Agent Loop；另有实验性 Durable 库 |
| 继续用熟悉的 Agent，把底下模型换成其他厂商 | Magpie | 本地模型网关、协议转换、模型和账户接入 |

Multica 官方已经支持 Pi，Magpie 官方也支持 Pi。两对关系有集成文档与实现依据；这不等于完整三者组合已由本次验证。[Multica Providers](https://multica.ai/docs/providers)、[Magpie 官方仓库](https://github.com/yetone/magpie)、[Pi 包边界](https://github.com/earendil-works/pi/blob/v1.5.0/README.md)。

## 版本核验

| 项目 | 本次确认的发布状态 | 依据与日期 |
|---|---|---|
| Pi | 最新正式版 **v1.5.0** | GitHub 2026-11-02 19:05:31 上海时间发布；releases 总览、tags 与 npm `dist-tags.latest=1.5.0` 一致 |
| Multica | 最新正式版 **v0.8.0** | GitHub 2026-11-03 18:30:52 上海时间发布；releases 总览与 latest 端点交叉核对 |
| Magpie | 默认/latest **v0.1.2854**；stable **v0.1.2115** | 分别发布于上海时间 11 月 3 日 20:30:08、10 月 30 日 07:08:31；渠道 API 与分发仓库 release 一致 |

Pi v1.5.0 的 tag commit 为 `f9a26365568127461c47a07a37dcb42c140a3ac5`。npm 发布于 11 月 2 日 19:05:09.564，早于 GitHub release 约 22 秒，属于两个发布环节；`legacy-node20=0.74.2` 是兼容渠道，不是当前最新版。

版本来源：[Pi releases 总览](https://github.com/earendil-works/pi/releases)、[Pi tags](https://github.com/earendil-works/pi/tags)、[Pi npm registry](https://registry.npmjs.org/@earendil-works%2Fpi-coding-agent)、[Multica releases 总览](https://github.com/multica-ai/multica/releases)、[Multica v0.8.0](https://github.com/multica-ai/multica/releases/tag/v0.8.0)。

Magpie 要特别区分“已发布”和“stable 更新渠道”：v0.1.2854 在 GitHub 是非预发布，但当时 stable API 仍指向 v0.1.2115；源码仓库中已有更高 tag，也不能据此认定已进入分发渠道。依据：[默认更新 API](https://usemagpie.ai/api/latest)、[stable API](https://usemagpie.ai/api/latest?channel=stable)、[v0.1.2854 分发记录](https://github.com/yetone/magpie-releases/releases/tag/v0.1.2854)、[v0.1.2115 分发记录](https://github.com/yetone/magpie-releases/releases/tag/v0.1.2115)。

## Pi 相比 8 月研究，真正需要改的判断

### 1. 旧 AgentHarness 已从 core 拆走

旧稿中“`pi-agent-core` 包含实验性 AgentHarness、durable state”的描述只适用于当时的代码。v1.0.0 起，core 删除旧实验 Harness、session/storage 和 durable runtime 导出，主要保留 Agent、Loop、proxy 和类型。需要 durable sessions 应看独立的 `@earendil-works/pi-durable`。

因此，现在的包地图应把三条线分开：`pi-ai` 接模型；`pi-agent-core` 提供基础执行循环；`pi-coding-agent` 提供终端产品。`pi-durable` 是面向长任务和应用开发的另一条路线，仍标注 Experimental。

依据：[agent v1.0.0 迁移记录](https://github.com/earendil-works/pi/blob/v1.5.0/packages/agent/CHANGELOG.md#100---2026-10-01)、[core 当前导出](https://github.com/earendil-works/pi/blob/v1.5.0/packages/agent/src/index.ts)、[Durable README](https://github.com/earendil-works/pi/blob/v1.5.0/packages/durable/README.md)。

### 2. Pi CLI 已原生支持 MCP

从 v0.99.0 起，MCP 不再只能由第三方扩展接入。当前文档覆盖 stdio、streamable HTTP、OAuth、用户/项目配置和工具资源；legacy SSE 不支持。接入 MCP 和控制执行权限仍是两件事。

依据：[v0.99.0 release](https://github.com/earendil-works/pi/releases/tag/v0.99.0)、[固定版 MCP 文档](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/mcp.md)。

### 3. Codemode 允许模型通过脚本组织工具调用

模型可写 JavaScript 来调用工具、并行处理与筛选结果，再把需要的输出交回模型。脚本在 QuickJS 环境运行，本身没有 Node、文件系统或网络 API，外部行为要经过工具。

`codemode` 与 `tool_search` 默认关闭，默认基础工具仍是 read、bash、edit、write。QuickJS 隔离脚本，不代表被调用的 bash 等工具也进入同一沙箱。

依据：[Codemode](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/codemode.md)、[CLI 开关](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/cli.md#enable-codemode)。

### 4. 上下文编辑和历史留存的边界更清楚

`ContextEditEntry` 允许追加上下文变更记录，改变后续请求看到的内容，同时保留原始历史、UI 和账务。CLI 的 SessionManager 是 provider context 的来源。压缩支持按模型覆盖预算；v1.4.0 调整了压缩摘要的输出预算策略。

依据：[Session format](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/session-format.md#contexteditentry)、[Compaction](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/compaction.md)、[v1.4.0](https://github.com/earendil-works/pi/releases/tag/v1.4.0)。

### 5. 旧 Loop API 不能原样照搬

v0.87.0 已移除旧稿引用的 `shouldStopAfterTurn`，改为 `finishTurn`，并增加 `prepareRequest`。学习“停止取决于多方状态”这个概念仍有价值，写代码时应按新接口迁移。

依据：[v0.87.0 变更](https://github.com/earendil-works/pi/blob/v1.5.0/packages/agent/CHANGELOG.md#0870---2026-09-21)、[当前请求与轮次接口](https://github.com/earendil-works/pi/blob/v1.5.0/packages/agent/README.md#request-preparation-and-turn-finalization)。

### 6. v1.5.0 的直接变化是性能与 Schema 等工程改进

发布记录重点包括大工具参数的增量解析、Markdown/代码高亮复用、扩展包更新日志，以及工具参数验证转向 pi-schema。使用 TypeBox 超出 JSON Schema 的特性时要检查兼容性。

依据：[v1.5.0 release](https://github.com/earendil-works/pi/releases/tag/v1.5.0)。

### 7. Durable 能恢复任务，但仍需要应用自己做集成

Pi Durable 已实现持久化 conversation、task、document、原子 commit 与重启恢复，提供多种存储后端。它仍是实验性 API；单份 storage 由一个进程拥有，没有跨进程锁。工具只在声明可安全重放时重跑，外部写操作仍要靠业务幂等控制。

Pi CLI 的 JSONL 会话树与 Pi Durable 是两套实现。当前 coding-agent 的依赖不包含 pi-durable，不能把“仓库提供 Durable”写成“默认 CLI 自动具有完整持久任务引擎”。

依据：[Durable storage / tools](https://github.com/earendil-works/pi/blob/v1.5.0/packages/durable/README.md)、[CLI 依赖](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/package.json)、[How Pi Works](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/how-pi-works.md)。

## Multica、Pi、Magpie 的实际区别

| 维度 | Multica | Pi | Magpie |
|---|---|---|---|
| 主要层级 | 人与 Agent 的任务/团队管理 | Agent 执行产品与可组合运行库 | 模型接入网关 |
| 用户入口 | 工作台、issue、Squad、运行记录 | 终端 CLI，也可通过 SDK/RPC 嵌入应用 | 菜单栏/本地网关与模型配置 |
| 谁执行推理和工具循环 | 调用已安装的 agent CLI | Pi 自己执行，底层库可供开发者组合 | 由接入的 Codex、Claude Code、Pi 等 Agent 执行 |
| 多 Agent 协作 | Squad leader 接单、@mention 派工、成员回报后继续 | CLI 默认无 subagents；可通过扩展实现，Durable 有构建示例 | 本身不提供任务团队编排 |
| 定时与触发 | Autopilot 有 cron、webhook、手动触发 | 开发者或外部调度系统接入 | 不承担团队任务队列与验收 |
| 会话与恢复 | 保存 run/日志/状态；Pi 续接仍依赖原 runtime 上的会话文件 | CLI JSONL 会话；Durable 另提供持久化任务机制 | 模型连接层的处理不等同于 Agent 任务恢复 |
| 模型选择 | 使用所选 agent 后端的模型与账户能力 | 通过 pi-ai/扩展接模型，可定制上下文与工具 | 转换模型协议，集中接入模型/账户、路由与配额回退 |
| 部署关系 | Cloud/自托管工作台加本地或远端 runtime | 本地/远程终端，或嵌入自己的应用 | 本地桌面网关，也有 headless/服务端部署方式 |
| 软件许可 | Multica License，Apache 2.0 加额外条件 | MIT | MIT |

Multica 行为依据：[工作原理](https://multica.ai/docs/how-multica-works)、[Providers](https://multica.ai/docs/providers)、[Squads](https://multica.ai/docs/squads)、[Autopilots](https://multica.ai/docs/autopilots)、[Daemon/runtimes](https://multica.ai/docs/daemon-runtimes)。Pi 行为依据：[v1.5.0 README](https://github.com/earendil-works/pi/blob/v1.5.0/README.md)。Magpie 行为依据：[官网](https://usemagpie.ai/zh/)、[v0.1.2854 README](https://github.com/yetone/magpie/blob/v0.1.2854/README.md)。

### Multica 增加的到底是什么

它把 issue 变成 run，进入队列，再由连接电脑上的 runtime/daemon 领取，调用已有 agent CLI，并回写日志和结果。它补的是任务管理、运行监控、团队派工与交付复核。一次 run 完成不自动代表业务任务已验收。

Pi 是其正式支持的后端，支持会话续接、模型选择、MCP 管理和 `.pi/skills/` 注入；Multica 管理 Pi MCP 需要 Pi 至少 v0.99.0。v0.8.0 release 还包含 Pi RPC steering 与 skills 修复，说明集成已进入实际维护。

Squad 不等于默认全员并行；由 leader 正式派工，也不会仅因选中 Squad 就增加并发。Autopilot 的 Create issue 可离线排队，Run only 在 runtime 离线时会 skipped，该模式失败不自动重试。

依据：[工作原理](https://multica.ai/docs/how-multica-works)、[Runs](https://multica.ai/docs/tasks)、[Providers](https://multica.ai/docs/providers)、[v0.8.0](https://github.com/multica-ai/multica/releases/tag/v0.8.0)、[Squads](https://multica.ai/docs/squads)、[Autopilots](https://multica.ai/docs/autopilots)。

### Magpie 增加的到底是什么

默认网关在 `127.0.0.1:3425`，转换 OpenAI Chat、Responses、Anthropic Messages 和 Gemini 等协议，处理流式输出、工具调用与 reasoning。它为受支持的 Agent 写入原生配置，不替换 Agent 可执行程序。Pi 适配有实际代码，处理模型列表、默认模型和 thinking 等级。依据：[入门](https://usemagpie.ai/docs/start)、[固定版 README](https://github.com/yetone/magpie/blob/v0.1.2854/README.md)、[Pi 适配实现](https://github.com/yetone/magpie/blob/v0.1.2854/internal/agent/pi.go)。

它也提供账户切换、配额回退、模型路由组、用量观察，以及把 instructions、MCP、skills、hooks、subagents 配置分发给 Agent 的 Library。分发 subagent 配置不等于承担团队任务编排。另有 Claude 订阅桥接路径，会调用本机真实 Claude 二进制并桥接工具，不能把全部实现简化为“永远只是转发 HTTP”。依据：[Library](https://github.com/yetone/magpie/blob/v0.1.2854/docs/subsystems/library.md)、[订阅桥接](https://github.com/yetone/magpie/blob/v0.1.2854/docs/subsystems/claude-subscription-bridge.md)。

它可接 API key、本地模型和多种订阅登录；这是 Magpie 项目提供的接法，不等于模型供应商已认可所有跨客户端订阅用途。本轮未逐家核验订阅条款。软件采用 MIT，但模型 API 和订阅费用仍由供应商收取；自动回退也必须先有可用的后备账户或路由成员。依据：[入门](https://usemagpie.ai/docs/start)、[LICENSE](https://github.com/yetone/magpie/blob/v0.1.2854/LICENSE)。

模型请求路径不经过 Magpie 自营服务端，不代表完全没有外联：官方说明发布版每日统计默认开启、可关闭；隐私脱敏默认关闭；请求存档也默认关闭，开启后的存储位置取决于本机或所配 S3。用量费用是估算，不能当供应商账单。依据：[隐私文档](https://usemagpie.ai/docs/privacy)、[脱敏说明](https://usemagpie.ai/docs/zh/masking)、[Usage and cost](https://github.com/yetone/magpie/blob/v0.1.2854/README.md#usage-and-cost)。

### 权限、费用和许可会影响怎么选

Pi 默认工具和扩展继承启动用户的系统权限；project trust 不等同于逐工具权限系统。Multica 的 runtime 默认也没有文件系统沙箱，官方文档说明其 Codex/Claude Code 后端会使用较宽的执行权限；不同目录或 worktree 不构成安全隔离。[Pi Security](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/docs/security.md)、[Multica Security model](https://multica.ai/docs/security-model)。

Multica 需要自行准备 agent CLI 的账户与模型额度；CLI 登录令牌留在执行电脑，但 `custom_env`、MCP 环境变量等配置会存服务端再下发，不能概括成“所有凭证永不离机”。Analytics 的美元数是估算，非账单；本轮未核验到现行 Cloud 公开价格。[安装说明](https://multica.ai/docs/install-agent-runtime)、[工作原理](https://multica.ai/docs/how-multica-works)、[Analytics](https://multica.ai/docs/analytics)。

Multica 当前 README 使用 source-available 表述。许可证允许组织内部使用；使用它为客户制作并只交付成品也不必然需要商业许可。但替第三方托管实例、让组织外的人驱动实例（免费也算）、或嵌入对外分发的商业产品，需要商业许可；UI 品牌另有保留要求。不能只写“Apache 2.0”或套用 Pi、Magpie 的 MIT 结论。[官方许可场景](https://multica.ai/licensing)、[LICENSE 全文](https://github.com/multica-ai/multica/blob/main/LICENSE)。

## 适合你的选择方式

以下是基于已核验能力的建议，不是三套软件的性能排名：

- **只想让现有 Codex / Claude Code / Pi 换模型：先看 Magpie。** 无需为了换模型先建立团队管理平台。
- **想改 Agent 的上下文组织、工具和执行逻辑：看 Pi。** 需要长期运行与崩溃恢复时，再评估独立的 Pi Durable 及其 API 变更成本。
- **想把研究、写作、审校等角色变成可派工、定时运行、可复核的工作流：看 Multica。** 它可以把 Pi 或其他已有 Agent 放到同一任务工作台中管理。

可以设想 `Multica → Pi → Magpie → 模型服务`：管理层派任务，Pi 执行，Magpie 接通模型。但本轮只确认 Multica–Pi 与 Magpie–Pi 两对官方集成；未对三者的配置覆盖、MCP、streaming、tool calls、取消/steering 和续接做联合测试。

对“换了模型是否仍有原来 Agent 的效果”，本轮没有质量测评。协议兼容与模型能力、训练适配、工具调用表现是不同维度，不能依据工具名称直接推断效果相同。

## 版本范围与研究边界

本报告、对应网页与首页新版区域使用 2026-11-03 核验口径。14 章课程、Pi / DeepSeek Harness 对照、Top 50 与平台账本仍是 2026-08-26 的固定源码研究；旧长文是 2026-08-31 快照。历史 AgentHarness、停止 API、配图与行号引用均须按对应版本阅读。

本轮没有重新运行 8 月的 Top 50 排名，也没有恢复暂停的 47 × 10 平台采集。Pi / Multica / Magpie 的结论来自官方文档、发布记录与源码，没有性能排名或联合部署实测；飞书上的历史长文按其原日期阅读。
