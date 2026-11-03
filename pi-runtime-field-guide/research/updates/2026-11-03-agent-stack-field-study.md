# Multica → Pi → Magpie：三层 Agent 工作流研究与联测手册

冻结时间：2026-11-03 21:20:47，Asia/Shanghai。Pi 正式版 v1.5.0，源码 `f9a26365568127461c47a07a37dcb42c140a3ac5`；Multica 正式版 v0.8.0；Magpie 默认/latest v0.1.2858，stable v0.1.2115。本轮核对资料与源码，未登录三工具账号，未用账号跑三层联合实验。第 11–13 章已在 Node 22.23.2 与 v1.5.0 依赖中离线实跑：分支投影、两次进程恢复、项目扩展信任检查均通过；不能据此认定整条业务链路通过。

## 1. 三个控制层分别决定什么

Multica 把 issue、chat 或触发器变成 run，由 daemon 所在电脑执行；它管理排队、派工、运行状态和协作记录。Pi 负责本次请求带什么上下文、调用哪些工具、何时继续推理、如何形成会话。Magpie 把 Pi 等 Agent 的模型请求接到选定供应商，转换协议、选择账号、进行路由和额度回退。

这条分工有实现依据：Multica 正式支持 Pi，Magpie 也有 Pi 适配。但两对集成成立，并不证明任意配置的三者联合运行成立。Magpie 的 Library 还能分发 instructions、skills、MCP 和 subagents 文件；它分发的是配置，不因此承担 Multica 的团队任务编排。Claude 订阅路径会驱动真实 Claude Code 并桥接工具，故也不能把 Magpie 所有路径简化为 HTTP 透传。

Pi CLI 会话续接和独立 Pi Durable 要分开。Multica 调用普通 Pi CLI，不会自动获得 Durable 的任务检查点、存储事务和重放策略。

## 2. 数据与凭证沿哪条路走

Multica 服务端保存任务、评论、Agent 配置、run 上下文与写回结果；本地目录不会自动整份上传，但回复里包含的代码和文件片段会随结果回去。Agent 的 custom environment 与受管 MCP 配置可能存服务端再下发，不能把“本地执行”写成“所有秘密永不离机”。运行专用 MULTICA_TOKEN 也会由进程环境传给子进程，应避免进入 prompt、文件和日志。

Pi 读取的内容可能进入模型上下文和原始会话。经 Magpie 时，提示词流向实际选中的上游。Magpie 的模型请求路径不经过其自营服务端，发布版仍有默认开启、可关闭的每日统计。隐私脱敏默认关闭；开启后也依赖规则与可选本机模型识别，不能替代权限隔离。会话 context_edit 隐藏某条消息，只改变未来模型投影，原日志仍可能含原值。

三层初次配置应放在同一台机器、同一系统用户下，先减少变量。容器内 localhost 指向容器本身；Pi 被放进隔离环境后，网关地址、访问密钥与网络策略都要重新验证，不能直接照搬宿主的 127.0.0.1。

## 3. 谁决定模型，谁验收结果

先用 `magpie models` 查供应商实际模型 ID，再用 `magpie pi <ID>` 接入 Pi；随后用 Pi 自己的 `--list-models` 查完整 provider/model。不能把网页举例、订阅名称或另一个 Agent 的模型别名当作当前 runtime 必有的 ID。

Multica 显式选择模型、Pi 默认模型、已续接会话的模型和 Magpie 路由组可能共同影响请求。先固定一个模型，启动新 Pi 会话，再在 Multica 新 issue 中使用同一选择；确认后才测试旧会话续接。Magpie 可按轮选择模型并保留工具轮次的路由，真实上游以其请求记录为准；Pi 看到的网关名称未必足以证明底下哪个账号回答。

Multica 的绿色 run 状态证明执行器报告结束，不证明任务合同达成。验收应把 run ID、Pi 会话路径、Magpie 请求记录和实际产物关联起来。费用栏多为估算，供应商账单才用于结算。多层重试也不保证外部动作去重：有邮件、支付或远端写入时，业务必须提供稳定幂等键并核对外部结果。

## 4. 最常见的冲突与定位顺序

| 现象 | 先检查什么 | 最小处理 |
|---|---|---|
| 终端能用，Multica 找不到 Pi | daemon 用户、PATH 与实际可执行文件 | 同环境确认路径，重新检测；兼容 profile 可设绝对路径 |
| 改了模型仍不生效 | 显式模型、旧会话、enabledModels、配置目录 | 新会话与新 issue 固定模型对照，不同时开启自动路由 |
| 同 issue 后续运行失忆 | 原 JSONL、记录的 cwd、原电脑及清理情况 | 核对会话路径是否复用；回落新会话单独记失败 |
| MCP 缺失或重复 | 受管临时扩展、Pi 版本、用户本机配置、同名服务 | 一次只加一个只读服务，检查真实工具与错误日志 |
| skill 绑定却未生效 | 实际注入名、SKILL.md 内容、显式路径 | 用一条独有只读规则验收，不靠“已绑定”徽标 |
| 连接错误或权限越界 | 网关进程/地址/额度；daemon 系统权限/挂载 | 分开处理连接和隔离，禁止靠无限加权限排障 |

Multica v0.8.0 的 Pi 适配把绑定 skills 逐个经 `--skill` 显式传入。受管 MCP 要求 Pi 至少 v0.99.0，通过临时扩展调用 `registerMcpServer`。它不为此自动信任整个项目，也不默认用 `--tools` 把扩展工具截掉。Pi 本机配置仍可能参与加载；不要为了修受管资源而一股脑 `--approve` 所有项目内容。

## 5. 可操作的联测合同

1. 记录三个版本、主机、系统用户、CLI 绝对路径、Pi 配置目录与会话目录。选择固定单模型，确认 Magpie 网关可达，保留账号凭证在其合法配置位置。
2. 用临时项目在 Pi 中记住 nonce `STACK-42`；退出再续接，要求只复述 nonce。核对真实会话文件与 Magpie 两次请求。不要把 key 当 nonce。
3. 在 Multica 绑定同机 Pi runtime，新建测试 issue。只允许在测试仓库生成 `stack-proof.json`：含 nonce、输入文件名、实际 SHA-256、执行的检查与结果；人工独立核对摘要。
4. 在同 issue 追加一次追问，核对会话复用；再分别测取消/steering、一条 skill 和一个只读 MCP。取消要检查实际进程和后续请求停止，不能只看按钮变灰。
5. 记录每项通过、失败、未验证及四层证据。基线通过后，一次只加路由组、定时触发、Squad 或远程 runtime 中的一项；有外部写动作再增加幂等验收。

选型按缺口决定：已有 Agent 只想换模型，先评估 Magpie；要改上下文、工具和执行逻辑，选 Pi；需要多人分工、定时派活与交付复核，再加 Multica。三者相加会增加排障面，只有需要相应控制层时才引入。

## 版本与来源

- [Pi v1.5.0 release](https://github.com/earendil-works/pi/releases/tag/v1.5.0)、[固定版会话](https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/session-format.md)、[固定版 Durable](https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/README.md)、[安全边界](https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/security.md)。
- [Multica releases 总览](https://github.com/multica-ai/multica/releases)与 latest 端点均为 v0.8.0，发布于上海时间 11 月 3 日 18:30:52；[固定版 Providers](https://github.com/multica-ai/multica/blob/v0.8.0/apps/docs/content/docs/providers.mdx)、[Pi 后端](https://github.com/multica-ai/multica/blob/v0.8.0/server/pkg/agent/pi.go)、[daemon 数据边界](https://github.com/multica-ai/multica/blob/v0.8.0/apps/docs/content/docs/daemon-runtimes.mdx)、[安全模型](https://github.com/multica-ai/multica/blob/v0.8.0/apps/docs/content/docs/security-model.mdx)。
- [Magpie 默认 API](https://usemagpie.ai/api/latest?audit=20261103T132047Z)与[分发 releases 总览](https://github.com/yetone/magpie-releases/releases)交叉确认 v0.1.2858，上海时间 11 月 3 日 21:10:10 发布；[stable API](https://usemagpie.ai/api/latest?channel=stable&audit=20261103T132047Z)仍指向[v0.1.2115](https://github.com/yetone/magpie-releases/releases/tag/v0.1.2115)，上海时间 10 月 30 日 07:08:31 发布。第一次无审计参数的读取曾返回旧 v2854，换新查询 URL 后与发布列表一致；这可能是缓存或更新延迟，因此以交叉核验后的冻结记录为准，不追逐未发布 tag。
- [Magpie v0.1.2858 README](https://github.com/yetone/magpie/blob/v0.1.2858/README.md)、[CLI 命令参考](https://github.com/yetone/magpie/blob/v0.1.2858/docs/reference.md)、[Pi 适配](https://github.com/yetone/magpie/blob/v0.1.2858/internal/agent/pi.go)、[隐私文档](https://usemagpie.ai/docs/privacy)。项目支持的跨客户端订阅接法不等于供应商认可全部用途；本轮未逐家核验服务条款，也没有质量、成本或延迟排名。
