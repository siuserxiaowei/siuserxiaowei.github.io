window.PI_CURRICULUM = {
  "meta": {
    "title": "Pi v1.5.0：14 章源码与实践教程",
    "version": "1.5.0",
    "verifiedAt": "2026-11-03T21:19:39+08:00",
    "sourceCommit": "f9a26365568127461c47a07a37dcb42c140a3ac5",
    "releaseUrl": "https://github.com/earendil-works/pi/releases/tag/v1.5.0",
    "nodeRequirement": ">=22.19.0",
    "progressKey": "pi-guide-completed:v1.5.0",
    "chapterCount": 14,
    "archive": "archive/2026-08-26-chapters.json",
    "scope": "14 章正文、实验及源码引用均按本次固定发布版更新；旧 DSH 比较和 Top 50 仍按原日期保留。",
    "integrations": {
      "verifiedAt": "2026-11-03T21:20:47+08:00",
      "multica": "0.8.0",
      "magpieLatest": "0.1.2858",
      "magpieStable": "0.1.2115",
      "endToEnd": "not_run_requires_real_credentials"
    }
  },
  "chapters": [
    {
      "number": 1,
      "id": "chapter-01",
      "tag": "地图",
      "title": "Pi v1.5.0：包边界、安装与四种入口",
      "summary": "先区分终端产品、基础循环和持久任务运行库，再选择安装方式与交互入口；本章全部按 v1.5.0 的包边界讲解。",
      "questions": [
        "pi-coding-agent、pi-agent-core 与 pi-durable 分别解决什么问题？",
        "为什么 CLI 能续接 JSONL 会话，不等于自动获得 Durable 的任务恢复？",
        "交互、print、JSON 和 RPC 分别由谁驱动，输出供谁消费？"
      ],
      "sections": [
        {
          "title": "从产品向下看三个边界",
          "paragraphs": [
            "Pi 是一个 monorepo，也是一组可组合库。pi-coding-agent 是直接可用的终端产品，包含资源加载、会话与交互；pi-agent-core 提供 Agent、工具循环和状态事件；pi-ai 负责供应商模型与请求语义。应用可以直接嵌入库，而不必启动终端界面。",
            "pi-tui 处理终端渲染，pi-telemetry 提供观测契约。独立的 pi-durable 构建可恢复的 conversation、task 和 document；它依赖 pi-ai 与 Chord，仍是实验 API。CLI 当前依赖不包含 pi-durable，两者不是同一套会话实现。"
          ],
          "bullets": [
            "选择成品：CLI；嵌入现有程序：SDK / RPC；控制执行循环：core；构建持久任务：另评估 Durable。"
          ]
        },
        {
          "title": "安装必须同时检查版本和运行环境",
          "paragraphs": [
            "v1.5.0 的 Node 要求是 >=22.19.0。官网安装器按发布锁文件固定传递依赖，并用 pi update 更新；直接 npm 安装不会固定全部传递依赖。课程实验应在独立目录固定包版本，避免把更新学习材料变成修改现有工作环境。",
            "CLI 默认开启 read、bash、edit、write。Codemode 与 tool_search 是内建扩展，通常关闭；MCP 服务器的 exposure 需要它们时，MCP 扩展可自动开启。默认工具集不是操作系统权限边界。"
          ],
          "bullets": [
            "Pi 不内置完整的文件、进程或网络权限隔离；工具与扩展继承启动用户的权限。"
          ]
        },
        {
          "title": "四种入口共享 Agent 与会话机制",
          "paragraphs": [
            "交互模式面向终端中的人；print 模式运行提示并写出最终回答；JSON 模式输出事件 JSONL，方便程序追踪中间状态；RPC 模式从 stdin 接收 JSONL 命令，向 stdout 写响应和事件。TypeScript SDK 则在进程内直接创建与控制会话。",
            "选择入口时先决定谁拥有会话和生命周期：只是脚本拿最终文本可用 print；需要可视化事件可用 JSON；外部宿主要持续控制可用 RPC。CLI 默认没有 subagents 或 plan mode，这些需要扩展或包定制。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "不发模型请求，核对 CLI 身份",
        "objective": "确认本机运行环境、CLI 版本和模式参数，建立可复现的学习基线。",
        "steps": [
          "准备 Node.js 22.19.0 或更高版本；若还未安装 CLI，在独立实验环境按官方说明固定安装 @earendil-works/pi-coding-agent@1.5.0。",
          "执行下面三个只读命令；不要运行 pi update 或替换已有全局安装。",
          "从帮助中找到 --print、--mode、--tools，并写出四种入口分别面向人还是程序。"
        ],
        "codeLanguage": "bash",
        "code": "node --version\npi --version\npi --help",
        "expected": [
          "Node 版本满足 >=22.19.0，CLI 版本为 1.5.0；若不同，应记录实际版本并切换隔离实验环境。",
          "帮助包含 print / JSON / RPC 等参数说明；这三个命令不需要供应商 API 凭证。"
        ],
        "verification": "版本输出与固定源码一致，能解释交互、print、JSON、RPC 的驱动方与输出；本章未要求向真实模型发送任务。",
        "requires": "installed CLI",
        "notes": "首次获取 npm 包或安装器需要联网；命令核对本身不调用模型 API。安装器与 npm 的依赖固定方式不同。"
      },
      "pitfalls": [
        "把根仓库的所有包看成 CLI 默认已启用的功能。",
        "把 project trust、--tools 或工作目录当作完整安全隔离。",
        "把终端会话续接和 Durable 任务恢复混为一谈。"
      ],
      "sources": [
        {
          "title": "v1.5.0 包图、安装与权限",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/README.md"
        },
        {
          "title": "CLI 模式、默认工具与开关",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/cli.md"
        },
        {
          "title": "CLI 依赖与 Node engines",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/package.json"
        },
        {
          "title": "CLI 的会话与接口机制",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/how-pi-works.md"
        }
      ],
      "migration": "8 月的 core 内 AgentHarness 已被移除；当前持久任务路线是独立、实验性的 pi-durable。",
      "copy": "<p class=\"chapter-summary\">先区分终端产品、基础循环和持久任务运行库，再选择安装方式与交互入口；本章全部按 v1.5.0 的包边界讲解。<\/p>\n<section class=\"lesson-section\"><h4>从产品向下看三个边界<\/h4>\n<p>Pi 是一个 monorepo，也是一组可组合库。pi-coding-agent 是直接可用的终端产品，包含资源加载、会话与交互；pi-agent-core 提供 Agent、工具循环和状态事件；pi-ai 负责供应商模型与请求语义。应用可以直接嵌入库，而不必启动终端界面。<\/p>\n<p>pi-tui 处理终端渲染，pi-telemetry 提供观测契约。独立的 pi-durable 构建可恢复的 conversation、task 和 document；它依赖 pi-ai 与 Chord，仍是实验 API。CLI 当前依赖不包含 pi-durable，两者不是同一套会话实现。<\/p>\n<ul><li>选择成品：CLI；嵌入现有程序：SDK / RPC；控制执行循环：core；构建持久任务：另评估 Durable。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>安装必须同时检查版本和运行环境<\/h4>\n<p>v1.5.0 的 Node 要求是 &gt;=22.19.0。官网安装器按发布锁文件固定传递依赖，并用 pi update 更新；直接 npm 安装不会固定全部传递依赖。课程实验应在独立目录固定包版本，避免把更新学习材料变成修改现有工作环境。<\/p>\n<p>CLI 默认开启 read、bash、edit、write。Codemode 与 tool_search 是内建扩展，通常关闭；MCP 服务器的 exposure 需要它们时，MCP 扩展可自动开启。默认工具集不是操作系统权限边界。<\/p>\n<ul><li>Pi 不内置完整的文件、进程或网络权限隔离；工具与扩展继承启动用户的权限。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>四种入口共享 Agent 与会话机制<\/h4>\n<p>交互模式面向终端中的人；print 模式运行提示并写出最终回答；JSON 模式输出事件 JSONL，方便程序追踪中间状态；RPC 模式从 stdin 接收 JSONL 命令，向 stdout 写响应和事件。TypeScript SDK 则在进程内直接创建与控制会话。<\/p>\n<p>选择入口时先决定谁拥有会话和生命周期：只是脚本拿最终文本可用 print；需要可视化事件可用 JSON；外部宿主要持续控制可用 RPC。CLI 默认没有 subagents 或 plan mode，这些需要扩展或包定制。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>把根仓库的所有包看成 CLI 默认已启用的功能。<\/li><li>把 project trust、--tools 或工作目录当作完整安全隔离。<\/li><li>把终端会话续接和 Durable 任务恢复混为一谈。<\/li><\/ul><\/section>",
      "labHtml": "<h4>不发模型请求，核对 CLI 身份<\/h4>\n<p>确认本机运行环境、CLI 版本和模式参数，建立可复现的学习基线。<\/p>\n<p class=\"lab-requires\">运行条件：已安装 Pi CLI<\/p>\n<ol><li>准备 Node.js 22.19.0 或更高版本；若还未安装 CLI，在独立实验环境按官方说明固定安装 @earendil-works/pi-coding-agent@1.5.0。<\/li><li>执行下面三个只读命令；不要运行 pi update 或替换已有全局安装。<\/li><li>从帮助中找到 --print、--mode、--tools，并写出四种入口分别面向人还是程序。<\/li><\/ol>\n<pre><code class=\"language-bash\">node --version\npi --version\npi --help<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>Node 版本满足 &gt;=22.19.0，CLI 版本为 1.5.0；若不同，应记录实际版本并切换隔离实验环境。<\/li><li>帮助包含 print / JSON / RPC 等参数说明；这三个命令不需要供应商 API 凭证。<\/li><\/ul>\n<p><strong>验收：<\/strong>版本输出与固定源码一致，能解释交互、print、JSON、RPC 的驱动方与输出；本章未要求向真实模型发送任务。<\/p>\n<p class=\"lab-note\">首次获取 npm 包或安装器需要联网；命令核对本身不调用模型 API。安装器与 npm 的依赖固定方式不同。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/README.md\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 包图、安装与权限 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/cli.md\" target=\"_blank\" rel=\"noreferrer\">CLI 模式、默认工具与开关 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/package.json\" target=\"_blank\" rel=\"noreferrer\">CLI 依赖与 Node engines ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/how-pi-works.md\" target=\"_blank\" rel=\"noreferrer\">CLI 的会话与接口机制 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/01.md"
    },
    {
      "number": 2,
      "id": "chapter-02",
      "tag": "Provider",
      "title": "pi-ai：用 Models 集合统一模型、错误与用量",
      "summary": "以当前 Models 与 provider factory API 建立模型集合，区分供应商接入、模型操作类型、流式错误和费用来源。",
      "questions": [
        "Models 集合与某一家 provider factory 各自持有什么？",
        "流返回后的失败，为什么需要同时观察 error 事件和最终消息？",
        "usage.cost.total 是供应商账单，还是目录价格估算，如何判断？"
      ],
      "sections": [
        {
          "title": "显式构建 provider 集合",
          "paragraphs": [
            "当前推荐从 createModels() 建立集合，再用 setProvider() 注册需要的 factory，例如 openaiProvider()。这比依赖隐式全局注册更容易确定鉴权、模型目录和应用边界。builtinModels() 会显式注册全部内置供应商，方便使用，但也会引入更大的目录与模块入口。",
            "getModels() 和 getModel() 同步读取最后已知的 chat 模型；动态目录获取是显式异步操作。读取模型目录并不证明凭证可用。chat、image、classifier 具有不同操作入口，不能把图像模型对象传给对话 stream。"
          ],
          "bullets": [
            "生产应用只接需要的 provider；离线学习可用官方 fauxProvider，不访问真实服务。"
          ]
        },
        {
          "title": "先统一消息与流，再判断失败",
          "paragraphs": [
            "Models 的公开方法接收 Context，并先归一化为 TranscriptContext。供应商实现负责把文本、thinking、工具调用、停止原因和 usage 转换成共同语义。统一接口不能消除模型能力差异，也不能保证换模型后工具表现相同。",
            "流返回后，请求失败通过 error 事件与最终 AssistantMessage 表达，stopReason 为 error 或 aborted；最终消息可以保留部分内容和用量。集合中的鉴权失败会进入流错误，但直接 API 的 streamSimple 在缺少鉴权时可能同步抛错，调用边界仍要做异常处理。"
          ],
          "bullets": [
            "先看 stopReason 和 errorMessage，再决定重试；看到部分文本不代表请求成功。"
          ]
        },
        {
          "title": "用量、费用和重试分开处理",
          "paragraphs": [
            "Usage 区分 input、output、cacheRead、cacheWrite 和 totalTokens，并记录相应费用。cost.totalFromProvider 为 true 才表示 total 来自供应商报告的收费；false 或旧记录缺少该字段时，应按目录估算理解，不能当结算账单。",
            "供应商网络失败与执行工具失败属于不同层。模型请求可以按适配器策略做有界重试；工具可能已经发送消息或写入外部系统，不能因为请求重试可行就重复执行。跨模型接续还需要适配历史消息、thinking 与工具格式。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "用官方 Faux 供应商观察成功与失败",
        "objective": "在不使用 API key 的情况下执行两次 pi-ai 请求，核对停止状态和结构化 usage。",
        "steps": [
          "在独立实验目录准备 @earendil-works/pi-ai@1.5.0；以下代码保存为 provider-lab.mjs。",
          "运行 node provider-lab.mjs，保留两次结果。",
          "观察脚本注入的错误如何作为最终消息返回；它不是一次真实供应商故障测评。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from \"node:assert/strict\";\nimport { createModels, fauxProvider, fauxAssistantMessage } from \"@earendil-works/pi-ai\";\nconst faux = fauxProvider();\nconst models = createModels();\nmodels.setProvider(faux.provider);\nfaux.setResponses([\n  fauxAssistantMessage(\"hello offline\"),\n  fauxAssistantMessage(\"\", { stopReason: \"error\", errorMessage: \"injected-error\" }),\n]);\nconst context = { messages: [{ role: \"user\", content: \"test\", timestamp: Date.now() }] };\nconst first = await models.complete(faux.getModel(), context);\nconst second = await models.complete(faux.getModel(), context);\nassert.equal(first.stopReason, \"stop\");\nassert.equal(second.stopReason, \"error\");\nassert.match(second.errorMessage, /injected-error/);\nassert.equal(typeof first.usage.totalTokens, \"number\");\nconsole.log({ first: first.stopReason, second: second.stopReason, usage: first.usage });",
        "expected": [
          "first 为 stop，second 为 error，并带 injected-error。",
          "usage 有数字字段；Faux 的合成 usage 只用于检查结构，不代表真实计费。"
        ],
        "verification": "断言通过，且没有配置或读取真实供应商凭证；实验验证程序接口，不验证模型质量、成本或重试效果。",
        "requires": "offline",
        "notes": "需要预先安装固定版本依赖；首次下载依赖需联网。Faux 数据不能拿来推算真实 token 或价格。"
      },
      "pitfalls": [
        "照搬旧全局模型 API，却没有显式注册 provider。",
        "只捕获 throw，遗漏流中的 error 与最终 stopReason。",
        "把目录读取当鉴权成功，把估算费用当供应商账单。"
      ],
      "sources": [
        {
          "title": "Models、错误、usage 与 Faux 用法",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/README.md"
        },
        {
          "title": "供应商集合实现",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/models.ts"
        },
        {
          "title": "当前消息与用量类型",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/types.ts"
        },
        {
          "title": "官方 Faux 供应商实现",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/providers/faux.ts"
        }
      ],
      "migration": "示例统一使用 createModels / provider factory，避免把兼容层旧全局 API 当作新应用的默认入口。",
      "copy": "<p class=\"chapter-summary\">以当前 Models 与 provider factory API 建立模型集合，区分供应商接入、模型操作类型、流式错误和费用来源。<\/p>\n<section class=\"lesson-section\"><h4>显式构建 provider 集合<\/h4>\n<p>当前推荐从 createModels() 建立集合，再用 setProvider() 注册需要的 factory，例如 openaiProvider()。这比依赖隐式全局注册更容易确定鉴权、模型目录和应用边界。builtinModels() 会显式注册全部内置供应商，方便使用，但也会引入更大的目录与模块入口。<\/p>\n<p>getModels() 和 getModel() 同步读取最后已知的 chat 模型；动态目录获取是显式异步操作。读取模型目录并不证明凭证可用。chat、image、classifier 具有不同操作入口，不能把图像模型对象传给对话 stream。<\/p>\n<ul><li>生产应用只接需要的 provider；离线学习可用官方 fauxProvider，不访问真实服务。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>先统一消息与流，再判断失败<\/h4>\n<p>Models 的公开方法接收 Context，并先归一化为 TranscriptContext。供应商实现负责把文本、thinking、工具调用、停止原因和 usage 转换成共同语义。统一接口不能消除模型能力差异，也不能保证换模型后工具表现相同。<\/p>\n<p>流返回后，请求失败通过 error 事件与最终 AssistantMessage 表达，stopReason 为 error 或 aborted；最终消息可以保留部分内容和用量。集合中的鉴权失败会进入流错误，但直接 API 的 streamSimple 在缺少鉴权时可能同步抛错，调用边界仍要做异常处理。<\/p>\n<ul><li>先看 stopReason 和 errorMessage，再决定重试；看到部分文本不代表请求成功。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>用量、费用和重试分开处理<\/h4>\n<p>Usage 区分 input、output、cacheRead、cacheWrite 和 totalTokens，并记录相应费用。cost.totalFromProvider 为 true 才表示 total 来自供应商报告的收费；false 或旧记录缺少该字段时，应按目录估算理解，不能当结算账单。<\/p>\n<p>供应商网络失败与执行工具失败属于不同层。模型请求可以按适配器策略做有界重试；工具可能已经发送消息或写入外部系统，不能因为请求重试可行就重复执行。跨模型接续还需要适配历史消息、thinking 与工具格式。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>照搬旧全局模型 API，却没有显式注册 provider。<\/li><li>只捕获 throw，遗漏流中的 error 与最终 stopReason。<\/li><li>把目录读取当鉴权成功，把估算费用当供应商账单。<\/li><\/ul><\/section>",
      "labHtml": "<h4>用官方 Faux 供应商观察成功与失败<\/h4>\n<p>在不使用 API key 的情况下执行两次 pi-ai 请求，核对停止状态和结构化 usage。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>在独立实验目录准备 @earendil-works/pi-ai@1.5.0；以下代码保存为 provider-lab.mjs。<\/li><li>运行 node provider-lab.mjs，保留两次结果。<\/li><li>观察脚本注入的错误如何作为最终消息返回；它不是一次真实供应商故障测评。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &quot;node:assert/strict&quot;;\nimport { createModels, fauxProvider, fauxAssistantMessage } from &quot;@earendil-works/pi-ai&quot;;\nconst faux = fauxProvider();\nconst models = createModels();\nmodels.setProvider(faux.provider);\nfaux.setResponses([\n  fauxAssistantMessage(&quot;hello offline&quot;),\n  fauxAssistantMessage(&quot;&quot;, { stopReason: &quot;error&quot;, errorMessage: &quot;injected-error&quot; }),\n]);\nconst context = { messages: [{ role: &quot;user&quot;, content: &quot;test&quot;, timestamp: Date.now() }] };\nconst first = await models.complete(faux.getModel(), context);\nconst second = await models.complete(faux.getModel(), context);\nassert.equal(first.stopReason, &quot;stop&quot;);\nassert.equal(second.stopReason, &quot;error&quot;);\nassert.match(second.errorMessage, /injected-error/);\nassert.equal(typeof first.usage.totalTokens, &quot;number&quot;);\nconsole.log({ first: first.stopReason, second: second.stopReason, usage: first.usage });<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>first 为 stop，second 为 error，并带 injected-error。<\/li><li>usage 有数字字段；Faux 的合成 usage 只用于检查结构，不代表真实计费。<\/li><\/ul>\n<p><strong>验收：<\/strong>断言通过，且没有配置或读取真实供应商凭证；实验验证程序接口，不验证模型质量、成本或重试效果。<\/p>\n<p class=\"lab-note\">需要预先安装固定版本依赖；首次下载依赖需联网。Faux 数据不能拿来推算真实 token 或价格。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/README.md\" target=\"_blank\" rel=\"noreferrer\">Models、错误、usage 与 Faux 用法 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/models.ts\" target=\"_blank\" rel=\"noreferrer\">供应商集合实现 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/types.ts\" target=\"_blank\" rel=\"noreferrer\">当前消息与用量类型 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/providers/faux.ts\" target=\"_blank\" rel=\"noreferrer\">官方 Faux 供应商实现 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/02.md"
    },
    {
      "number": 3,
      "id": "chapter-03",
      "tag": "Messages",
      "title": "消息与上下文：把历史、执行工具和模型请求分清",
      "summary": "理解 AgentMessage 到模型消息的转换，以及当前 transcript 中的 system sections、工具声明和持久上下文投影。",
      "questions": [
        "内部 AgentMessage 为什么可以比供应商消息更丰富？",
        "工具的 execute 函数和发给模型的工具声明是不是同一对象？",
        "修改未来模型上下文时，为什么不应直接抹掉原始历史？"
      ],
      "sections": [
        {
          "title": "应用消息先富化，再收敛",
          "paragraphs": [
            "Agent 内部使用 AgentMessage，可以包含标准 system、user、assistant、toolResult，也可以通过 TypeScript 声明合并增加应用角色。默认 convertToLlm 仅保留标准模型角色；自定义通知、UI 状态和审计字段必须由应用明确过滤或转换，不能直接发给供应商。",
            "发送请求前，transformContext 先在应用消息层做裁剪或注入，convertToLlm 再转换为模型消息，最后 normalizeContext 形成只有 messages 的 TranscriptContext。转换应保持工具调用与结果的对应关系，不要为省 token 删掉一半协议记录。"
          ],
          "bullets": [
            "工具给模型的 content 与应用使用的 details 各有用途；业务详情不应无选择地进入上下文。"
          ]
        },
        {
          "title": "系统提示与工具声明属于 transcript",
          "paragraphs": [
            "Context 的 systemPrompt 与 tools 是公开入口的简写；归一化后，初始提示、命名 sections 和 toolsAdded 进入首条 system message。后续 system message 可以补充说明、按名称替换或删除 section，并声明 toolsAdded / toolsRemoved。",
            "getCurrentSystemPrompt() 与 getCurrentTools() 按顺序重放这些变更。Agent 的 systemPrompt 是从 transcript 重放得到的只读视图；state.tools 则是本进程可执行的工具集合。它变化后，循环会在下一次请求前把声明差异写入 system message，execute 函数不发送给模型。"
          ],
          "bullets": [
            "供应商若不支持中途 system 或工具变化，适配器会按兼容能力折叠消息，不能假定所有模型保留相同缓存前缀。"
          ]
        },
        {
          "title": "持久会话以投影构造请求",
          "paragraphs": [
            "基础 Agent 管当前内存 transcript，CLI 的 AgentSession 则由 SessionManager 生成持久会话上下文。ContextEditEntry 通过追加记录省略或替换早先消息的模型可见内容，原始历史、导出和用量并不会随之删除。",
            "因此，临时 transformContext 与持久 context_edit 不是一回事。前者改变一次请求的输入；后者改变所在分支以后的上下文投影。需要恢复或导航 CLI 会话时，应使用会话管理接口，而不是认为给 agent.state.messages 赋数组就改好了持久历史。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "离线重放提示 section 与工具移除",
        "objective": "验证后续 system 变更只改变当前有效视图，原始消息仍可检查。",
        "steps": [
          "在已准备 pi-ai@1.5.0 的实验目录，将代码保存为 transcript-lab.mjs。",
          "运行 node transcript-lab.mjs；对比重放前的记录和重放后的当前提示、工具。",
          "把第二条 system 的 rules 改成 null 再运行，观察该 section 被删除。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from \"node:assert/strict\";\nimport { normalizeContext, getCurrentSystemPrompt, getCurrentTools } from \"@earendil-works/pi-ai\";\nconst echo = { name: \"echo\", description: \"Echo text\", parameters: { type: \"object\" } };\nconst messages = [\n  { role: \"system\", content: \"BASE\", sections: { rules: \"SHORT\" }, toolsAdded: [echo], timestamp: 1 },\n  { role: \"user\", content: \"hi\", timestamp: 2 },\n  { role: \"system\", content: \"\", sections: { rules: \"LONG\" }, toolsRemoved: [{ name: \"echo\" }], timestamp: 3 },\n];\nconst context = normalizeContext({ messages });\nconst prompt = getCurrentSystemPrompt(context.messages);\nconst tools = getCurrentTools(context.messages);\nassert.equal(prompt, \"BASE\\n\\nLONG\");\nassert.deepEqual(tools, []);\nassert.equal(messages[0].sections.rules, \"SHORT\");\nconsole.log({ prompt, tools, originalRules: messages[0].sections.rules });",
        "expected": [
          "有效 prompt 为 BASE、空行、LONG；当前工具为空。",
          "第一条原始消息仍记录 SHORT，说明重放视图与原始记录有区别。"
        ],
        "verification": "三条断言通过；能指出当前有效声明、历史声明与工具执行函数之间的边界。",
        "requires": "offline",
        "notes": "这段实验只重放 pi-ai transcript，不冒充 CLI SessionManager 或 context_edit 的端到端测试。"
      },
      "pitfalls": [
        "在自定义 StreamFn 内继续读取不存在的 context.systemPrompt / context.tools。",
        "直接给只读 systemPrompt 赋值，或把 execute 函数塞进供应商工具声明。",
        "把一次请求的裁剪当成已持久保存的会话变更。"
      ],
      "sources": [
        {
          "title": "系统消息与归一化契约",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/README.md#system-messages"
        },
        {
          "title": "transcript 重放函数",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/utils/transcript.ts"
        },
        {
          "title": "Agent 状态与消息转换",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent.ts"
        },
        {
          "title": "CLI ContextEditEntry 与投影",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/session-format.md#contexteditentry"
        }
      ],
      "migration": "当前请求以 transcript 的 system messages 表达提示和工具变化；CLI 持久上下文以 SessionManager 为准。",
      "copy": "<p class=\"chapter-summary\">理解 AgentMessage 到模型消息的转换，以及当前 transcript 中的 system sections、工具声明和持久上下文投影。<\/p>\n<section class=\"lesson-section\"><h4>应用消息先富化，再收敛<\/h4>\n<p>Agent 内部使用 AgentMessage，可以包含标准 system、user、assistant、toolResult，也可以通过 TypeScript 声明合并增加应用角色。默认 convertToLlm 仅保留标准模型角色；自定义通知、UI 状态和审计字段必须由应用明确过滤或转换，不能直接发给供应商。<\/p>\n<p>发送请求前，transformContext 先在应用消息层做裁剪或注入，convertToLlm 再转换为模型消息，最后 normalizeContext 形成只有 messages 的 TranscriptContext。转换应保持工具调用与结果的对应关系，不要为省 token 删掉一半协议记录。<\/p>\n<ul><li>工具给模型的 content 与应用使用的 details 各有用途；业务详情不应无选择地进入上下文。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>系统提示与工具声明属于 transcript<\/h4>\n<p>Context 的 systemPrompt 与 tools 是公开入口的简写；归一化后，初始提示、命名 sections 和 toolsAdded 进入首条 system message。后续 system message 可以补充说明、按名称替换或删除 section，并声明 toolsAdded / toolsRemoved。<\/p>\n<p>getCurrentSystemPrompt() 与 getCurrentTools() 按顺序重放这些变更。Agent 的 systemPrompt 是从 transcript 重放得到的只读视图；state.tools 则是本进程可执行的工具集合。它变化后，循环会在下一次请求前把声明差异写入 system message，execute 函数不发送给模型。<\/p>\n<ul><li>供应商若不支持中途 system 或工具变化，适配器会按兼容能力折叠消息，不能假定所有模型保留相同缓存前缀。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>持久会话以投影构造请求<\/h4>\n<p>基础 Agent 管当前内存 transcript，CLI 的 AgentSession 则由 SessionManager 生成持久会话上下文。ContextEditEntry 通过追加记录省略或替换早先消息的模型可见内容，原始历史、导出和用量并不会随之删除。<\/p>\n<p>因此，临时 transformContext 与持久 context_edit 不是一回事。前者改变一次请求的输入；后者改变所在分支以后的上下文投影。需要恢复或导航 CLI 会话时，应使用会话管理接口，而不是认为给 agent.state.messages 赋数组就改好了持久历史。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>在自定义 StreamFn 内继续读取不存在的 context.systemPrompt / context.tools。<\/li><li>直接给只读 systemPrompt 赋值，或把 execute 函数塞进供应商工具声明。<\/li><li>把一次请求的裁剪当成已持久保存的会话变更。<\/li><\/ul><\/section>",
      "labHtml": "<h4>离线重放提示 section 与工具移除<\/h4>\n<p>验证后续 system 变更只改变当前有效视图，原始消息仍可检查。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>在已准备 pi-ai@1.5.0 的实验目录，将代码保存为 transcript-lab.mjs。<\/li><li>运行 node transcript-lab.mjs；对比重放前的记录和重放后的当前提示、工具。<\/li><li>把第二条 system 的 rules 改成 null 再运行，观察该 section 被删除。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &quot;node:assert/strict&quot;;\nimport { normalizeContext, getCurrentSystemPrompt, getCurrentTools } from &quot;@earendil-works/pi-ai&quot;;\nconst echo = { name: &quot;echo&quot;, description: &quot;Echo text&quot;, parameters: { type: &quot;object&quot; } };\nconst messages = [\n  { role: &quot;system&quot;, content: &quot;BASE&quot;, sections: { rules: &quot;SHORT&quot; }, toolsAdded: [echo], timestamp: 1 },\n  { role: &quot;user&quot;, content: &quot;hi&quot;, timestamp: 2 },\n  { role: &quot;system&quot;, content: &quot;&quot;, sections: { rules: &quot;LONG&quot; }, toolsRemoved: [{ name: &quot;echo&quot; }], timestamp: 3 },\n];\nconst context = normalizeContext({ messages });\nconst prompt = getCurrentSystemPrompt(context.messages);\nconst tools = getCurrentTools(context.messages);\nassert.equal(prompt, &quot;BASE\\n\\nLONG&quot;);\nassert.deepEqual(tools, []);\nassert.equal(messages[0].sections.rules, &quot;SHORT&quot;);\nconsole.log({ prompt, tools, originalRules: messages[0].sections.rules });<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>有效 prompt 为 BASE、空行、LONG；当前工具为空。<\/li><li>第一条原始消息仍记录 SHORT，说明重放视图与原始记录有区别。<\/li><\/ul>\n<p><strong>验收：<\/strong>三条断言通过；能指出当前有效声明、历史声明与工具执行函数之间的边界。<\/p>\n<p class=\"lab-note\">这段实验只重放 pi-ai transcript，不冒充 CLI SessionManager 或 context_edit 的端到端测试。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/README.md#system-messages\" target=\"_blank\" rel=\"noreferrer\">系统消息与归一化契约 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/utils/transcript.ts\" target=\"_blank\" rel=\"noreferrer\">transcript 重放函数 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent.ts\" target=\"_blank\" rel=\"noreferrer\">Agent 状态与消息转换 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/session-format.md#contexteditentry\" target=\"_blank\" rel=\"noreferrer\">CLI ContextEditEntry 与投影 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/03.md"
    },
    {
      "number": 4,
      "id": "chapter-04",
      "tag": "Loop",
      "title": "新版 Agent Loop：两个队列与明确的请求边界",
      "summary": "用 steering、follow-up、prepareRequest 和 finishTurn 理解 v1.5.0 的调度与停止，而不是用一个 while 黑盒解释所有继续。",
      "questions": [
        "steering 什么时候进入上下文，为什么不能回滚正在执行的工具？",
        "prepareRequest 与 finishTurn 分别位于一轮的哪个位置？",
        "finishTurn 返回 continue 时，已有工具或队列触发的请求会不会再多算一次？"
      ],
      "sections": [
        {
          "title": "turn 与 run 不是同一层",
          "paragraphs": [
            "一个 turn 包含一次供应商响应及其工具结果；一个 run 可以有多个 turn。模型给出工具调用后，工具执行结果回到上下文，循环再请求模型。没有工具调用时，也要检查待处理输入与宿主决策，不能仅看最终文本是否出现。",
            "steering 影响当前工作链，在当前工具批次完成后的正常轮询点进入；follow-up 等当前工作自然停止后再开启后续工作。默认两类队列均逐条取出，也可配置 all。steering 不会撤销已经发生的文件写入或中断正在运行的工具体。"
          ],
          "bullets": [
            "已结束工具批次 → steering；没有更多工具或 steering 时 → follow-up。"
          ]
        },
        {
          "title": "请求前准备和轮次收口",
          "paragraphs": [
            "已选中的输入写入上下文后，prepareRequest 在每次供应商请求之前运行，首轮也包括在内。它可以返回 canonical context、model 或 thinkingLevel 的更新；它本身不轮询队列，执行期间到来的 steering 等下一次正常轮询。",
            "assistant 与全部工具结果完成后，finishTurn 在 turn_end 之前运行，决策在 turn_end 之后应用。返回 undefined 保留调度；end 直接结束本次 run，跳过队列；continue 确保还有一次请求。若工具或队列已经触发该请求，就不会额外再加一次。"
          ],
          "bullets": [
            "对 error / aborted 响应仍调用 finishTurn，但它们是硬退出，其决策不生效。"
          ]
        },
        {
          "title": "停止与 settled 是可观察的时序",
          "paragraphs": [
            "工具结果可以给 terminate 提示，只有同批全部最终结果都要求终止，循环才跳过自动续推；混合批次继续正常调度。宿主若用 finishTurn 一直无条件返回 continue，会制造无限循环，应定义任务预算或退出条件。",
            "Agent 的事件订阅按注册顺序等待。agent_end 表示循环不再发新事件，但异步订阅还可能做收尾；prompt() 和 waitForIdle() 要等这些工作结束才 settle。此期间 isStreaming 仍为 true，因此界面不能只凭最后一段文本就宣布全部完成。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "离线验证 steering 先于 follow-up",
        "objective": "用三条预设回答观察队列顺序，并计数 prepareRequest 与 finishTurn。",
        "steps": [
          "在实验目录准备 pi-ai@1.5.0 与 pi-agent-core@1.5.0；将代码保存为 loop-lab.mjs。",
          "运行 node loop-lab.mjs，不配置任何供应商密钥。",
          "第二轮实验可让 finishTurn 在首次响应返回 end；观察两个队列没有被自动消费，再恢复代码。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from \"node:assert/strict\";\nimport { Agent } from \"@earendil-works/pi-agent-core\";\nimport { createModels, fauxProvider, fauxAssistantMessage } from \"@earendil-works/pi-ai\";\nconst faux = fauxProvider();\nconst models = createModels();\nmodels.setProvider(faux.provider);\nfaux.setResponses([\"first\", \"steered\", \"followed\"].map(x => fauxAssistantMessage(x)));\nlet requests = 0, finishes = 0, queued = false;\nconst agent = new Agent({\n  initialState: { model: faux.getModel() },\n  streamFn: models.streamSimple.bind(models),\n  prepareRequest: async () => { requests++; },\n  finishTurn: async () => { finishes++; },\n});\nagent.subscribe(event => {\n  if (!queued && event.type === \"message_end\" && event.message.role === \"assistant\") {\n    queued = true;\n    agent.steer({ role: \"user\", content: \"STEER\", timestamp: 2 });\n    agent.followUp({ role: \"user\", content: \"FOLLOW\", timestamp: 3 });\n  }\n});\nawait agent.prompt(\"START\");\nconst users = agent.state.messages.filter(x => x.role === \"user\").map(x => typeof x.content === \"string\" ? x.content : x.content.filter(b => b.type === \"text\").map(b => b.text).join(\"\"));\nassert.deepEqual(users, [\"START\", \"STEER\", \"FOLLOW\"]);\nassert.equal(requests, 3);\nassert.equal(finishes, 3);\nassert.equal(agent.state.isStreaming, false);\nconsole.log({ users, requests, finishes, idle: !agent.state.isStreaming });",
        "expected": [
          "users 严格依次为 START、STEER、FOLLOW。",
          "prepareRequest 与 finishTurn 各运行三次，prompt 返回时 idle 为 true。"
        ],
        "verification": "四条断言通过，能解释每条用户输入被哪个队列选择；Faux 仅验证调度，不测试真实供应商。",
        "requires": "offline",
        "notes": "使用绑定到 Models 的 streamSimple 作为 StreamFn，接口来自当前官方 Agent README。示例不会执行文件或网络工具。"
      },
      "pitfalls": [
        "把 steering 理解为能抢占并回滚任意工具。",
        "在 prepareRequest 中偷偷消费队列，导致调度顺序改变。",
        "无条件返回 continue，或把 agent_end 通知当成异步收尾已经结束。"
      ],
      "sources": [
        {
          "title": "Agent 调度与当前公开接口",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/README.md"
        },
        {
          "title": "loop 请求、工具、队列与退出顺序",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent-loop.ts"
        },
        {
          "title": "Agent 队列和异步订阅状态",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent.ts"
        },
        {
          "title": "finishTurn 迁移记录",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/CHANGELOG.md#0870---2026-09-21"
        }
      ],
      "migration": "shouldStopAfterTurn 已移除；新代码用 finishTurn，处理正常与 error / aborted 的调用差异。",
      "copy": "<p class=\"chapter-summary\">用 steering、follow-up、prepareRequest 和 finishTurn 理解 v1.5.0 的调度与停止，而不是用一个 while 黑盒解释所有继续。<\/p>\n<section class=\"lesson-section\"><h4>turn 与 run 不是同一层<\/h4>\n<p>一个 turn 包含一次供应商响应及其工具结果；一个 run 可以有多个 turn。模型给出工具调用后，工具执行结果回到上下文，循环再请求模型。没有工具调用时，也要检查待处理输入与宿主决策，不能仅看最终文本是否出现。<\/p>\n<p>steering 影响当前工作链，在当前工具批次完成后的正常轮询点进入；follow-up 等当前工作自然停止后再开启后续工作。默认两类队列均逐条取出，也可配置 all。steering 不会撤销已经发生的文件写入或中断正在运行的工具体。<\/p>\n<ul><li>已结束工具批次 → steering；没有更多工具或 steering 时 → follow-up。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>请求前准备和轮次收口<\/h4>\n<p>已选中的输入写入上下文后，prepareRequest 在每次供应商请求之前运行，首轮也包括在内。它可以返回 canonical context、model 或 thinkingLevel 的更新；它本身不轮询队列，执行期间到来的 steering 等下一次正常轮询。<\/p>\n<p>assistant 与全部工具结果完成后，finishTurn 在 turn_end 之前运行，决策在 turn_end 之后应用。返回 undefined 保留调度；end 直接结束本次 run，跳过队列；continue 确保还有一次请求。若工具或队列已经触发该请求，就不会额外再加一次。<\/p>\n<ul><li>对 error / aborted 响应仍调用 finishTurn，但它们是硬退出，其决策不生效。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>停止与 settled 是可观察的时序<\/h4>\n<p>工具结果可以给 terminate 提示，只有同批全部最终结果都要求终止，循环才跳过自动续推；混合批次继续正常调度。宿主若用 finishTurn 一直无条件返回 continue，会制造无限循环，应定义任务预算或退出条件。<\/p>\n<p>Agent 的事件订阅按注册顺序等待。agent_end 表示循环不再发新事件，但异步订阅还可能做收尾；prompt() 和 waitForIdle() 要等这些工作结束才 settle。此期间 isStreaming 仍为 true，因此界面不能只凭最后一段文本就宣布全部完成。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>把 steering 理解为能抢占并回滚任意工具。<\/li><li>在 prepareRequest 中偷偷消费队列，导致调度顺序改变。<\/li><li>无条件返回 continue，或把 agent_end 通知当成异步收尾已经结束。<\/li><\/ul><\/section>",
      "labHtml": "<h4>离线验证 steering 先于 follow-up<\/h4>\n<p>用三条预设回答观察队列顺序，并计数 prepareRequest 与 finishTurn。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>在实验目录准备 pi-ai@1.5.0 与 pi-agent-core@1.5.0；将代码保存为 loop-lab.mjs。<\/li><li>运行 node loop-lab.mjs，不配置任何供应商密钥。<\/li><li>第二轮实验可让 finishTurn 在首次响应返回 end；观察两个队列没有被自动消费，再恢复代码。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &quot;node:assert/strict&quot;;\nimport { Agent } from &quot;@earendil-works/pi-agent-core&quot;;\nimport { createModels, fauxProvider, fauxAssistantMessage } from &quot;@earendil-works/pi-ai&quot;;\nconst faux = fauxProvider();\nconst models = createModels();\nmodels.setProvider(faux.provider);\nfaux.setResponses([&quot;first&quot;, &quot;steered&quot;, &quot;followed&quot;].map(x =&gt; fauxAssistantMessage(x)));\nlet requests = 0, finishes = 0, queued = false;\nconst agent = new Agent({\n  initialState: { model: faux.getModel() },\n  streamFn: models.streamSimple.bind(models),\n  prepareRequest: async () =&gt; { requests++; },\n  finishTurn: async () =&gt; { finishes++; },\n});\nagent.subscribe(event =&gt; {\n  if (!queued &amp;&amp; event.type === &quot;message_end&quot; &amp;&amp; event.message.role === &quot;assistant&quot;) {\n    queued = true;\n    agent.steer({ role: &quot;user&quot;, content: &quot;STEER&quot;, timestamp: 2 });\n    agent.followUp({ role: &quot;user&quot;, content: &quot;FOLLOW&quot;, timestamp: 3 });\n  }\n});\nawait agent.prompt(&quot;START&quot;);\nconst users = agent.state.messages.filter(x =&gt; x.role === &quot;user&quot;).map(x =&gt; typeof x.content === &quot;string&quot; ? x.content : x.content.filter(b =&gt; b.type === &quot;text&quot;).map(b =&gt; b.text).join(&quot;&quot;));\nassert.deepEqual(users, [&quot;START&quot;, &quot;STEER&quot;, &quot;FOLLOW&quot;]);\nassert.equal(requests, 3);\nassert.equal(finishes, 3);\nassert.equal(agent.state.isStreaming, false);\nconsole.log({ users, requests, finishes, idle: !agent.state.isStreaming });<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>users 严格依次为 START、STEER、FOLLOW。<\/li><li>prepareRequest 与 finishTurn 各运行三次，prompt 返回时 idle 为 true。<\/li><\/ul>\n<p><strong>验收：<\/strong>四条断言通过，能解释每条用户输入被哪个队列选择；Faux 仅验证调度，不测试真实供应商。<\/p>\n<p class=\"lab-note\">使用绑定到 Models 的 streamSimple 作为 StreamFn，接口来自当前官方 Agent README。示例不会执行文件或网络工具。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/README.md\" target=\"_blank\" rel=\"noreferrer\">Agent 调度与当前公开接口 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent-loop.ts\" target=\"_blank\" rel=\"noreferrer\">loop 请求、工具、队列与退出顺序 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent.ts\" target=\"_blank\" rel=\"noreferrer\">Agent 队列和异步订阅状态 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/CHANGELOG.md#0870---2026-09-21\" target=\"_blank\" rel=\"noreferrer\">finishTurn 迁移记录 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/04.md"
    },
    {
      "number": 5,
      "id": "chapter-05",
      "tag": "Streaming",
      "title": "流式与取消：看到片段，不等于允许执行",
      "summary": "将流式展示、最终响应、工具参数验证和 AbortSignal 分开，理解 v1.5.0 如何避免执行输出截断的工具调用。",
      "questions": [
        "toolcall_delta 中看起来完整的参数，为什么仍不能马上执行？",
        "stopReason 为 length 时，即使 Schema 验证能通过，工具能否运行？",
        "取消请求能保证什么，又不能撤销哪些已经发生的外部行为？"
      ],
      "sections": [
        {
          "title": "流事件用于观察，最终消息决定下一步",
          "paragraphs": [
            "pi-ai 把一次回答表示为 start、文本或 thinking 增量、工具参数增量，最后以 done 或 error 收口。AssistantMessageEventStream.result() 给出最终 AssistantMessage。Agent 把流映射为 message_start / update / end，再进入工具阶段。",
            "流中工具参数可以增量解析，用于 UI 展示和减少重复解析开销，但片段不是执行许可。Agent 先结算最终响应，等待 assistant message_end 的订阅屏障，再预检工具；这样审计或宿主不会在工具已经动手后才收到完整请求。"
          ],
          "bullets": [
            "部分内容可展示；停止原因、完整工具参数和验证结果决定能否执行。"
          ]
        },
        {
          "title": "输出截断时拒绝本条回答的全部调用",
          "paragraphs": [
            "如果最终 stopReason 是 length，模型输出可能在任何工具参数中间被截断。修复型 JSON 解析器有时能得到看似合法的对象，甚至能通过 Schema；这仍不证明模型本来就打算执行这个值。",
            "v1.5.0 的 loop 对该 assistant message 中所有工具调用生成失败结果，不执行工具体，然后让模型按正常工具/队列规则继续。普通参数校验失败、未知工具和工具体异常也应变成明确错误结果，不要把半截参数当作成功输入继续写入。"
          ],
          "bullets": [
            "“可解析”不等于“完整”；Schema 约束也不能恢复模型尚未生成的意图。"
          ]
        },
        {
          "title": "取消是协作终止，不是事务回滚",
          "paragraphs": [
            "models.stream() 接收 AbortSignal，Agent.abort() 会触发当前运行的取消信号；自定义 StreamFn、工具及外部程序必须配合响应。最终 aborted 消息可以保留部分内容与用量，不能把用户按下停止键解释为本次请求从未发生。",
            "模型请求已经收费、文件已经写入或消息已经发送时，取消不会自动撤销副作用。工具还要有清理、超时、幂等或补偿设计。CLI 保存历史与 Durable 的恢复策略也不是继续同一条供应商流，不能承诺从断开的 token 原位恢复。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "截断调用不执行，取消保留明确终态",
        "objective": "用 Faux 构造能通过类型检查但输出被截断的调用，再观察协作取消。",
        "steps": [
          "在实验目录保存为 stream-lab.mjs，依赖版本与第 4 章相同。",
          "运行 node stream-lab.mjs；echo 只修改内存计数，不写文件或发网络请求。",
          "先检查截断分支的零执行计数，再检查慢速文本流被 abort 后的终态。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from \"node:assert/strict\";\nimport { Agent } from \"@earendil-works/pi-agent-core\";\nimport { createModels, fauxProvider, fauxAssistantMessage, fauxToolCall } from \"@earendil-works/pi-ai\";\nconst models = createModels();\nconst faux = fauxProvider();\nmodels.setProvider(faux.provider);\nlet executed = 0;\nconst echo = {\n  name: \"echo\", label: \"Echo\", description: \"Count executions\",\n  parameters: { type: \"object\", properties: { value: { type: \"string\" } }, required: [\"value\"] },\n  execute: async () => { executed++; return { content: [{ type: \"text\", text: \"ok\" }], details: {} }; },\n};\nfaux.setResponses([\n  fauxAssistantMessage([fauxToolCall(\"echo\", { value: \"hel\" })], { stopReason: \"length\" }),\n  fauxAssistantMessage(\"recovered\"),\n]);\nconst agent = new Agent({ initialState: { model: faux.getModel(), tools: [echo] }, streamFn: models.streamSimple.bind(models) });\nawait agent.prompt(\"test truncation\");\nconst errors = agent.state.messages.filter(x => x.role === \"toolResult\" && x.isError);\nassert.equal(executed, 0);\nassert.equal(errors.length, 1);\nconst slow = fauxProvider({ tokensPerSecond: 20 });\nmodels.setProvider(slow.provider);\nslow.setResponses([fauxAssistantMessage(\"a deliberately long offline response for cancellation\")]);\nconst cancelled = new Agent({ initialState: { model: slow.getModel() }, streamFn: models.streamSimple.bind(models) });\ncancelled.subscribe(event => {\n  if (event.type === \"message_update\" && event.assistantMessageEvent.type === \"text_delta\") cancelled.abort();\n});\nawait cancelled.prompt(\"test abort\");\nconst last = cancelled.state.messages.at(-1);\nassert.equal(last.stopReason, \"aborted\");\nconsole.log({ executed, toolErrors: errors.length, cancelled: last.stopReason });",
        "expected": [
          "executed 为 0，toolErrors 为 1；字符串 hel 虽符合 Schema，也没有被执行。",
          "第二次运行的最终 stopReason 为 aborted，脚本断言通过。"
        ],
        "verification": "观察零副作用计数和明确的 aborted 终态；该测试不证明任意第三方工具或供应商都能及时响应取消。",
        "requires": "offline",
        "notes": "依赖准备后不调用真实 API。Faux 只控制事件，不代表网络断流、计费或进程恢复测试。"
      },
      "pitfalls": [
        "在 toolcall_delta 到达时提前运行工具。",
        "仅因 JSON 可修复或 Schema 通过，就忽略 length 停止原因。",
        "把 abort、UI 不再输出和外部副作用回滚当成同一结果。"
      ],
      "sources": [
        {
          "title": "loop 最终响应与截断保护",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent-loop.ts"
        },
        {
          "title": "官方截断调用回归测试",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/test/agent-loop.test.ts"
        },
        {
          "title": "事件流与最终结果实现",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/utils/event-stream.ts"
        },
        {
          "title": "流式错误与 AbortSignal",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/README.md#error-handling"
        }
      ],
      "migration": "length 响应中的全部工具调用仍转为失败结果；增量解析不代表可提前执行。",
      "copy": "<p class=\"chapter-summary\">将流式展示、最终响应、工具参数验证和 AbortSignal 分开，理解 v1.5.0 如何避免执行输出截断的工具调用。<\/p>\n<section class=\"lesson-section\"><h4>流事件用于观察，最终消息决定下一步<\/h4>\n<p>pi-ai 把一次回答表示为 start、文本或 thinking 增量、工具参数增量，最后以 done 或 error 收口。AssistantMessageEventStream.result() 给出最终 AssistantMessage。Agent 把流映射为 message_start / update / end，再进入工具阶段。<\/p>\n<p>流中工具参数可以增量解析，用于 UI 展示和减少重复解析开销，但片段不是执行许可。Agent 先结算最终响应，等待 assistant message_end 的订阅屏障，再预检工具；这样审计或宿主不会在工具已经动手后才收到完整请求。<\/p>\n<ul><li>部分内容可展示；停止原因、完整工具参数和验证结果决定能否执行。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>输出截断时拒绝本条回答的全部调用<\/h4>\n<p>如果最终 stopReason 是 length，模型输出可能在任何工具参数中间被截断。修复型 JSON 解析器有时能得到看似合法的对象，甚至能通过 Schema；这仍不证明模型本来就打算执行这个值。<\/p>\n<p>v1.5.0 的 loop 对该 assistant message 中所有工具调用生成失败结果，不执行工具体，然后让模型按正常工具/队列规则继续。普通参数校验失败、未知工具和工具体异常也应变成明确错误结果，不要把半截参数当作成功输入继续写入。<\/p>\n<ul><li>“可解析”不等于“完整”；Schema 约束也不能恢复模型尚未生成的意图。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>取消是协作终止，不是事务回滚<\/h4>\n<p>models.stream() 接收 AbortSignal，Agent.abort() 会触发当前运行的取消信号；自定义 StreamFn、工具及外部程序必须配合响应。最终 aborted 消息可以保留部分内容与用量，不能把用户按下停止键解释为本次请求从未发生。<\/p>\n<p>模型请求已经收费、文件已经写入或消息已经发送时，取消不会自动撤销副作用。工具还要有清理、超时、幂等或补偿设计。CLI 保存历史与 Durable 的恢复策略也不是继续同一条供应商流，不能承诺从断开的 token 原位恢复。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>在 toolcall_delta 到达时提前运行工具。<\/li><li>仅因 JSON 可修复或 Schema 通过，就忽略 length 停止原因。<\/li><li>把 abort、UI 不再输出和外部副作用回滚当成同一结果。<\/li><\/ul><\/section>",
      "labHtml": "<h4>截断调用不执行，取消保留明确终态<\/h4>\n<p>用 Faux 构造能通过类型检查但输出被截断的调用，再观察协作取消。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>在实验目录保存为 stream-lab.mjs，依赖版本与第 4 章相同。<\/li><li>运行 node stream-lab.mjs；echo 只修改内存计数，不写文件或发网络请求。<\/li><li>先检查截断分支的零执行计数，再检查慢速文本流被 abort 后的终态。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &quot;node:assert/strict&quot;;\nimport { Agent } from &quot;@earendil-works/pi-agent-core&quot;;\nimport { createModels, fauxProvider, fauxAssistantMessage, fauxToolCall } from &quot;@earendil-works/pi-ai&quot;;\nconst models = createModels();\nconst faux = fauxProvider();\nmodels.setProvider(faux.provider);\nlet executed = 0;\nconst echo = {\n  name: &quot;echo&quot;, label: &quot;Echo&quot;, description: &quot;Count executions&quot;,\n  parameters: { type: &quot;object&quot;, properties: { value: { type: &quot;string&quot; } }, required: [&quot;value&quot;] },\n  execute: async () =&gt; { executed++; return { content: [{ type: &quot;text&quot;, text: &quot;ok&quot; }], details: {} }; },\n};\nfaux.setResponses([\n  fauxAssistantMessage([fauxToolCall(&quot;echo&quot;, { value: &quot;hel&quot; })], { stopReason: &quot;length&quot; }),\n  fauxAssistantMessage(&quot;recovered&quot;),\n]);\nconst agent = new Agent({ initialState: { model: faux.getModel(), tools: [echo] }, streamFn: models.streamSimple.bind(models) });\nawait agent.prompt(&quot;test truncation&quot;);\nconst errors = agent.state.messages.filter(x =&gt; x.role === &quot;toolResult&quot; &amp;&amp; x.isError);\nassert.equal(executed, 0);\nassert.equal(errors.length, 1);\nconst slow = fauxProvider({ tokensPerSecond: 20 });\nmodels.setProvider(slow.provider);\nslow.setResponses([fauxAssistantMessage(&quot;a deliberately long offline response for cancellation&quot;)]);\nconst cancelled = new Agent({ initialState: { model: slow.getModel() }, streamFn: models.streamSimple.bind(models) });\ncancelled.subscribe(event =&gt; {\n  if (event.type === &quot;message_update&quot; &amp;&amp; event.assistantMessageEvent.type === &quot;text_delta&quot;) cancelled.abort();\n});\nawait cancelled.prompt(&quot;test abort&quot;);\nconst last = cancelled.state.messages.at(-1);\nassert.equal(last.stopReason, &quot;aborted&quot;);\nconsole.log({ executed, toolErrors: errors.length, cancelled: last.stopReason });<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>executed 为 0，toolErrors 为 1；字符串 hel 虽符合 Schema，也没有被执行。<\/li><li>第二次运行的最终 stopReason 为 aborted，脚本断言通过。<\/li><\/ul>\n<p><strong>验收：<\/strong>观察零副作用计数和明确的 aborted 终态；该测试不证明任意第三方工具或供应商都能及时响应取消。<\/p>\n<p class=\"lab-note\">依赖准备后不调用真实 API。Faux 只控制事件，不代表网络断流、计费或进程恢复测试。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent-loop.ts\" target=\"_blank\" rel=\"noreferrer\">loop 最终响应与截断保护 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/test/agent-loop.test.ts\" target=\"_blank\" rel=\"noreferrer\">官方截断调用回归测试 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/utils/event-stream.ts\" target=\"_blank\" rel=\"noreferrer\">事件流与最终结果实现 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/README.md#error-handling\" target=\"_blank\" rel=\"noreferrer\">流式错误与 AbortSignal ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/05.md"
    },
    {
      "number": 6,
      "id": "chapter-06",
      "tag": "Tools / MCP",
      "title": "工具管道：参数验证、并发与 MCP / Codemode",
      "summary": "沿 v1.5.0 的真实工具管道，从 JSON Schema、Hook 和执行顺序，理解 MCP 与脚本调用如何进入同一套工具契约。",
      "questions": [
        "参数验证通过，为什么仍不代表允许执行工具？",
        "并行工具的完成事件顺序，为什么可以不同于持久化结果顺序？",
        "MCP 和 Codemode 分别增加什么能力，又不能替代什么安全控制？"
      ],
      "sections": [
        {
          "title": "先把工具定义与执行权限分开",
          "paragraphs": [
            "工具不仅是一个函数，还包括名称、说明、JSON Schema 参数、执行函数和可选的参数准备逻辑。v1.5.0 使用 pi-schema 处理验证与类型推导；Schema 可以是普通 JSON 对象，不再要求依赖 TypeBox。TypeBox 的常见 JSON Schema 类型仍有兼容路径，但 JavaScript 专属类型、refinement 或 codec 不能当成通用 Schema 使用。",
            "pi-schema 的 check 判断值是否合法，开启 coerce 后才提供转换与 parse；转换不会直接改写调用者的原对象。默认值只是注释，不会自动补入参数。参数合法只解决形状和类型问题，业务权限、路径范围、额度和副作用仍要由工具与宿主决定。"
          ],
          "bullets": [
            "把危险参数约束写进 Schema，也在工具执行边界检查真实资源。",
            "不要把“模型能看见这个工具”理解成“这个调用已经获得授权”。"
          ]
        },
        {
          "title": "一次调用经过哪些阶段",
          "paragraphs": [
            "管道依次查找工具，调用可选 prepareArguments，再验证参数、运行 beforeToolCall、执行工具并收集进度，最后运行 afterToolCall。未知工具、无效参数、阻止执行以及抛出的异常都会形成 isError 结果，交给上层处理。验证失败不会进入前置 Hook；被前置 Hook 阻止的调用也不会进入执行和后置 Hook。",
            "runToolCall 提供同样的准备、验证和 Hook 语义，适合工具内部再调用工具。它自己不发送事件，也不追加会话消息。Codemode 等组合工具可以沿这个入口调用底层工具，保留宿主的拦截策略，而不是绕开管道直接调用函数。"
          ],
          "bullets": [
            "afterToolCall 可以改写结果，但不应掩盖已经发生的外部副作用。",
            "durationMs 度量工具 execute 的耗时，不包含 Hook 和队列等待。"
          ]
        },
        {
          "title": "并发不等于结果乱序",
          "paragraphs": [
            "默认 parallel 模式按 assistant 中的调用顺序依次预检，再并发运行获准工具。tool_execution_end 按实际完成顺序发出，但最终 toolResult 消息和 turn_end.toolResults 按 assistant 的原始顺序提交。因此 UI 看到 B 先完成，并不表示历史里 B 应排在 A 前面。",
            "任一工具声明 executionMode 为 sequential 时，整个批次顺序执行。批次中每个最终结果都设置 terminate:true，才会跳过自动后续模型请求；混合批次不会因其中一个工具要求停止就全部结束。"
          ],
          "bullets": []
        },
        {
          "title": "MCP 提供工具，Codemode 组织调用",
          "paragraphs": [
            "原生 MCP 支持 stdio 和 streamable HTTP，不支持旧 SSE；用户配置与经过信任确认的项目配置共同决定连接和暴露方式。pi mcp list 会实际连接启用的服务器，不只是读取配置。Codemode 不在基础默认工具列表中，可用 pi --tools +codemode 追加；MCP 也会按 codemode 或 deferred 暴露需求自动启用 Codemode 或 tool_search。",
            "Codemode 的输入是 JavaScript 源码，运行于没有 Node、文件系统、网络与计时器 API 的 QuickJS 环境。脚本通过工具调用外部资源，可并发筛选结果，只把必要输出交给模型。但被调用工具会真实执行；脚本后续报错不会撤销此前的写入，QuickJS 也不会把 bash 自动变成安全沙箱。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "离线验证合法、无效、被拦截与不存在的工具",
        "objective": "调用真实 runToolCall，证明验证和 Hook 的先后边界；本实验不测试模型是否会选对工具。",
        "steps": [
          "准备 Node.js 22.19 或更新版本，以及临时 Node 项目中的 @earendil-works/pi-agent-core@1.5.0 和 @earendil-works/pi-schema@1.5.0。首次安装依赖需要联网，实验执行不需要账号。",
          "将下面代码保存为 tool-pipeline.mjs，在该临时项目目录执行 node tool-pipeline.mjs。",
          "查看结果与日志，确认只有合法且未被拦截的调用进入 execute。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from 'node:assert/strict';\nimport { runToolCall } from '@earendil-works/pi-agent-core';\nimport { obj, str } from '@earendil-works/pi-schema';\nlet executions = 0;\nconst hooks = [];\nconst tool = {\n  name: 'echo', label: 'Echo', description: 'Return a string',\n  parameters: obj({ value: str() }),\n  async execute(_id, args) {\n    executions++;\n    return { content: [{ type: 'text', text: args.value }], details: {} };\n  },\n};\nconst usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0,\n  totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };\nconst options = {\n  tools: [tool], context: { messages: [] },\n  assistantMessage: { role: 'assistant', content: [], api: 'faux',\n    provider: 'faux', model: 'faux-1', usage, stopReason: 'stop', timestamp: 0 },\n  beforeToolCall: async ({ toolCall, args }) => {\n    hooks.push(`before:${toolCall.id}`);\n    if (args.value === 'blocked') return { block: true, reason: 'blocked by lab' };\n  },\n  afterToolCall: async ({ toolCall }) => { hooks.push(`after:${toolCall.id}`); },\n};\nconst results = [];\nfor (const [id, name, args] of [\n  ['ok', 'echo', { value: 'ok' }],\n  ['invalid', 'echo', { value: { nested: true } }],\n  ['blocked', 'echo', { value: 'blocked' }],\n  ['missing', 'missing', {}],\n]) results.push(await runToolCall({ type: 'toolCall', id, name, arguments: args }, options));\nassert.deepEqual(results.map(x => x.isError), [false, true, true, true]);\nassert.equal(executions, 1);\nassert.deepEqual(hooks, ['before:ok', 'after:ok', 'before:blocked']);\nconsole.log(JSON.stringify({ errors: results.map(x => x.isError), executions, hooks }));\n",
        "expected": [
          "isError 序列为 false、true、true、true；所有调用都返回结果对象，工具失败不会让本探针直接抛出未处理异常。",
          "execute 只运行一次；invalid 和 missing 不进入 Hook，blocked 进入前置 Hook 后停止。"
        ],
        "verification": "所有 assert 通过且进程退出码为 0；修改为无效参数后 execute 计数仍不增加。",
        "requires": "offline",
        "notes": "离线指依赖已就绪后的执行阶段。这里只测 runToolCall，不会发 provider 请求，不会启动 MCP，也不产生 Agent 会话事件；并发和 MCP 连通性需要另做集成实验。"
      },
      "pitfalls": [
        "把 Schema 验证当作权限检查，或以为 default 会自动补值。",
        "按照 tool_execution_end 的到达顺序重排持久化工具结果。",
        "把 Codemode 的 QuickJS 隔离等同于所有被调用工具的操作系统隔离。"
      ],
      "sources": [
        {
          "title": "Agent 工具执行、并发与 runToolCall",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/README.md"
        },
        {
          "title": "pi-schema 构建器、验证与类型边界",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/schema/README.md"
        },
        {
          "title": "原生 MCP 配置与传输协议",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/mcp.md"
        },
        {
          "title": "Codemode 脚本、工具调用与限制",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/codemode.md"
        }
      ],
      "migration": "用当前 pi-schema、默认并行执行、runToolCall 和原生 MCP/Codemode 重新解释工具契约；旧 TypeBox 专属假设和第三方 MCP 限制不再作为本章前提。",
      "copy": "<p class=\"chapter-summary\">沿 v1.5.0 的真实工具管道，从 JSON Schema、Hook 和执行顺序，理解 MCP 与脚本调用如何进入同一套工具契约。<\/p>\n<section class=\"lesson-section\"><h4>先把工具定义与执行权限分开<\/h4>\n<p>工具不仅是一个函数，还包括名称、说明、JSON Schema 参数、执行函数和可选的参数准备逻辑。v1.5.0 使用 pi-schema 处理验证与类型推导；Schema 可以是普通 JSON 对象，不再要求依赖 TypeBox。TypeBox 的常见 JSON Schema 类型仍有兼容路径，但 JavaScript 专属类型、refinement 或 codec 不能当成通用 Schema 使用。<\/p>\n<p>pi-schema 的 check 判断值是否合法，开启 coerce 后才提供转换与 parse；转换不会直接改写调用者的原对象。默认值只是注释，不会自动补入参数。参数合法只解决形状和类型问题，业务权限、路径范围、额度和副作用仍要由工具与宿主决定。<\/p>\n<ul><li>把危险参数约束写进 Schema，也在工具执行边界检查真实资源。<\/li><li>不要把“模型能看见这个工具”理解成“这个调用已经获得授权”。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>一次调用经过哪些阶段<\/h4>\n<p>管道依次查找工具，调用可选 prepareArguments，再验证参数、运行 beforeToolCall、执行工具并收集进度，最后运行 afterToolCall。未知工具、无效参数、阻止执行以及抛出的异常都会形成 isError 结果，交给上层处理。验证失败不会进入前置 Hook；被前置 Hook 阻止的调用也不会进入执行和后置 Hook。<\/p>\n<p>runToolCall 提供同样的准备、验证和 Hook 语义，适合工具内部再调用工具。它自己不发送事件，也不追加会话消息。Codemode 等组合工具可以沿这个入口调用底层工具，保留宿主的拦截策略，而不是绕开管道直接调用函数。<\/p>\n<ul><li>afterToolCall 可以改写结果，但不应掩盖已经发生的外部副作用。<\/li><li>durationMs 度量工具 execute 的耗时，不包含 Hook 和队列等待。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>并发不等于结果乱序<\/h4>\n<p>默认 parallel 模式按 assistant 中的调用顺序依次预检，再并发运行获准工具。tool_execution_end 按实际完成顺序发出，但最终 toolResult 消息和 turn_end.toolResults 按 assistant 的原始顺序提交。因此 UI 看到 B 先完成，并不表示历史里 B 应排在 A 前面。<\/p>\n<p>任一工具声明 executionMode 为 sequential 时，整个批次顺序执行。批次中每个最终结果都设置 terminate:true，才会跳过自动后续模型请求；混合批次不会因其中一个工具要求停止就全部结束。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>MCP 提供工具，Codemode 组织调用<\/h4>\n<p>原生 MCP 支持 stdio 和 streamable HTTP，不支持旧 SSE；用户配置与经过信任确认的项目配置共同决定连接和暴露方式。pi mcp list 会实际连接启用的服务器，不只是读取配置。Codemode 不在基础默认工具列表中，可用 pi --tools +codemode 追加；MCP 也会按 codemode 或 deferred 暴露需求自动启用 Codemode 或 tool_search。<\/p>\n<p>Codemode 的输入是 JavaScript 源码，运行于没有 Node、文件系统、网络与计时器 API 的 QuickJS 环境。脚本通过工具调用外部资源，可并发筛选结果，只把必要输出交给模型。但被调用工具会真实执行；脚本后续报错不会撤销此前的写入，QuickJS 也不会把 bash 自动变成安全沙箱。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>把 Schema 验证当作权限检查，或以为 default 会自动补值。<\/li><li>按照 tool_execution_end 的到达顺序重排持久化工具结果。<\/li><li>把 Codemode 的 QuickJS 隔离等同于所有被调用工具的操作系统隔离。<\/li><\/ul><\/section>",
      "labHtml": "<h4>离线验证合法、无效、被拦截与不存在的工具<\/h4>\n<p>调用真实 runToolCall，证明验证和 Hook 的先后边界；本实验不测试模型是否会选对工具。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>准备 Node.js 22.19 或更新版本，以及临时 Node 项目中的 @earendil-works/pi-agent-core@1.5.0 和 @earendil-works/pi-schema@1.5.0。首次安装依赖需要联网，实验执行不需要账号。<\/li><li>将下面代码保存为 tool-pipeline.mjs，在该临时项目目录执行 node tool-pipeline.mjs。<\/li><li>查看结果与日志，确认只有合法且未被拦截的调用进入 execute。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &#x27;node:assert/strict&#x27;;\nimport { runToolCall } from &#x27;@earendil-works/pi-agent-core&#x27;;\nimport { obj, str } from &#x27;@earendil-works/pi-schema&#x27;;\nlet executions = 0;\nconst hooks = [];\nconst tool = {\n  name: &#x27;echo&#x27;, label: &#x27;Echo&#x27;, description: &#x27;Return a string&#x27;,\n  parameters: obj({ value: str() }),\n  async execute(_id, args) {\n    executions++;\n    return { content: [{ type: &#x27;text&#x27;, text: args.value }], details: {} };\n  },\n};\nconst usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0,\n  totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };\nconst options = {\n  tools: [tool], context: { messages: [] },\n  assistantMessage: { role: &#x27;assistant&#x27;, content: [], api: &#x27;faux&#x27;,\n    provider: &#x27;faux&#x27;, model: &#x27;faux-1&#x27;, usage, stopReason: &#x27;stop&#x27;, timestamp: 0 },\n  beforeToolCall: async ({ toolCall, args }) =&gt; {\n    hooks.push(`before:${toolCall.id}`);\n    if (args.value === &#x27;blocked&#x27;) return { block: true, reason: &#x27;blocked by lab&#x27; };\n  },\n  afterToolCall: async ({ toolCall }) =&gt; { hooks.push(`after:${toolCall.id}`); },\n};\nconst results = [];\nfor (const [id, name, args] of [\n  [&#x27;ok&#x27;, &#x27;echo&#x27;, { value: &#x27;ok&#x27; }],\n  [&#x27;invalid&#x27;, &#x27;echo&#x27;, { value: { nested: true } }],\n  [&#x27;blocked&#x27;, &#x27;echo&#x27;, { value: &#x27;blocked&#x27; }],\n  [&#x27;missing&#x27;, &#x27;missing&#x27;, {}],\n]) results.push(await runToolCall({ type: &#x27;toolCall&#x27;, id, name, arguments: args }, options));\nassert.deepEqual(results.map(x =&gt; x.isError), [false, true, true, true]);\nassert.equal(executions, 1);\nassert.deepEqual(hooks, [&#x27;before:ok&#x27;, &#x27;after:ok&#x27;, &#x27;before:blocked&#x27;]);\nconsole.log(JSON.stringify({ errors: results.map(x =&gt; x.isError), executions, hooks }));\n<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>isError 序列为 false、true、true、true；所有调用都返回结果对象，工具失败不会让本探针直接抛出未处理异常。<\/li><li>execute 只运行一次；invalid 和 missing 不进入 Hook，blocked 进入前置 Hook 后停止。<\/li><\/ul>\n<p><strong>验收：<\/strong>所有 assert 通过且进程退出码为 0；修改为无效参数后 execute 计数仍不增加。<\/p>\n<p class=\"lab-note\">离线指依赖已就绪后的执行阶段。这里只测 runToolCall，不会发 provider 请求，不会启动 MCP，也不产生 Agent 会话事件；并发和 MCP 连通性需要另做集成实验。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/README.md\" target=\"_blank\" rel=\"noreferrer\">Agent 工具执行、并发与 runToolCall ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/schema/README.md\" target=\"_blank\" rel=\"noreferrer\">pi-schema 构建器、验证与类型边界 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/mcp.md\" target=\"_blank\" rel=\"noreferrer\">原生 MCP 配置与传输协议 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/codemode.md\" target=\"_blank\" rel=\"noreferrer\">Codemode 脚本、工具调用与限制 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/06.md"
    },
    {
      "number": 7,
      "id": "chapter-07",
      "tag": "Retry / Effects",
      "title": "重试与副作用：先判断能不能再做一次",
      "summary": "区分模型请求重试、Agent 轮次恢复与外部工具副作用；用实际重试分类器和幂等设计控制重复执行。",
      "questions": [
        "同为 HTTP 429，为什么限流和余额耗尽不能使用相同策略？",
        "工具超时后，为什么不能直接认定外部操作没有成功？",
        "Pi Durable 的 replay:safe 能保证外部系统 exactly-once 吗？"
      ],
      "sections": [
        {
          "title": "先分类，再计算退避时间",
          "paragraphs": [
            "v1.5.0 的重试判断基于 assistant 的 stopReason 和 errorMessage。正常结果立即返回，aborted 是终态；只有错误且具有瞬时故障特征时才进入有限重试。网络断连、部分服务端错误和短期限流属于候选，账户额度、预算、计费耗尽则优先排除，即使错误文本同时带有 429。",
            "isRetryableAssistantError 是分类器，不负责整个恢复流程。调用者要先识别上下文溢出，再应用重试预算与报告策略。不能见到 timeout 或状态码就无限重复，也不能通过换一个错误字符串掩盖原始失败原因。"
          ],
          "bullets": [
            "错误分类需要同时看供应商语义与账户状态，不能只看 HTTP 数字。",
            "用户取消与认证、额度问题应让流程可见地停止或等待处理。"
          ]
        },
        {
          "title": "预算属于哪一层",
          "paragraphs": [
            "retryAssistantCall 接收 enabled、maxRetries、baseDelayMs 和可选 maxAgentDelayMs。初次调用不计入 maxRetries；每次重试按指数退避计算，默认单次等待上限为六十秒。调度前、真正重试前和最终结束时可以发送回调，退避等待也会响应 AbortSignal。",
            "provider 适配层的请求重试与 AgentSession 的 assistant 级恢复不是同一个边界。前者处理一次传输，后者可能重新生成一轮回答。叠加时必须知道总尝试次数和等待上限；否则每层都看似有界，用户却仍会经历很长的等待。"
          ],
          "bullets": [
            "记录原始错误、尝试编号、最终结果和取消原因。",
            "不要把一次重试成功理解成之前的请求没有消耗费用。"
          ]
        },
        {
          "title": "工具错误先保留不确定性",
          "paragraphs": [
            "工具执行可能已经发邮件、提交订单或写入数据库，结果却在返回途中丢失。因此超时代表“结果未知”，不是“操作未发生”。普通 Agent 的工具异常会回流为 isError 结果；是否再次调用应由明确策略决定，不能套用 provider 的网络重试规则。",
            "可写工具应由业务系统记录稳定的操作标识与幂等键。同一业务动作的重试沿用同一个键；先查询既有结果，再决定继续、补偿或请求人工处理。日志要区分未执行、已确认成功、已确认失败和状态未知，不能仅凭进程是否收到返回值记账。"
          ],
          "bullets": []
        },
        {
          "title": "持久化恢复仍有外部边界",
          "paragraphs": [
            "独立 Pi Durable 会持久化任务意图与检查点，崩溃后只对声明 replay:safe 的工具执行安全重放，其他中断调用会报告给模型处理。这个声明是开发者对操作性质的承诺，不会自动让任意写接口获得幂等能力。",
            "持久化提交、客户端 requestId 去重和外部系统副作用各有边界。给任务去重，不等于银行、邮件服务或发布平台也参与了同一事务。设计恢复策略时，应把业务幂等与可查询结果放在真实副作用所在的系统中，再用重放声明表达已经具备的安全性。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "离线比较瞬时失败、额度耗尽与取消",
        "objective": "使用 v1.5.0 的真实 retryAssistantCall 和分类器，验证有限重试、终态和等待上限；不访问任何模型服务。",
        "steps": [
          "在含 @earendil-works/pi-ai@1.5.0 的临时 Node 项目保存 retry-probe.mjs。依赖未安装时先联网准备；执行阶段无需 provider 凭证。",
          "运行 node retry-probe.mjs；生产等待被替换为零延迟，produce 返回本地构造的 assistant 消息。",
          "核对瞬时错误的调用次数与额度错误、取消的调用次数，避免把本地 mock 解释成真实供应商可用性测试。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from 'node:assert/strict';\nimport { isRetryableAssistantError, retryAssistantCall, retryDelayMs } from '@earendil-works/pi-ai';\nconst usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0,\n  totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };\nconst message = (stopReason, errorMessage) => ({ role: 'assistant', content: [],\n  api: 'faux', provider: 'faux', model: 'faux-1', usage, stopReason,\n  ...(errorMessage ? { errorMessage } : {}), timestamp: 0 });\nconst policy = { enabled: true, maxRetries: 2, baseDelayMs: 0 };\nlet transientCalls = 0;\nconst result = await retryAssistantCall(async () => {\n  transientCalls++;\n  return transientCalls === 1 ? message('error', '503 service unavailable') : message('stop');\n}, policy, undefined);\nlet quotaCalls = 0;\nawait retryAssistantCall(async () => {\n  quotaCalls++;\n  return message('error', '429 insufficient_quota');\n}, policy, undefined);\nlet abortedCalls = 0;\nawait retryAssistantCall(async () => {\n  abortedCalls++;\n  return message('aborted');\n}, policy, undefined);\nassert.equal(isRetryableAssistantError(message('error', '429 insufficient_quota')), false);\nassert.equal(result.stopReason, 'stop');\nassert.deepEqual([transientCalls, quotaCalls, abortedCalls], [2, 1, 1]);\nassert.equal(retryDelayMs({ baseDelayMs: 1000, maxAgentDelayMs: 2500 }, 5), 2500);\nconsole.log(JSON.stringify({ transientCalls, quotaCalls, abortedCalls, cappedDelayMs: 2500 }));\n",
        "expected": [
          "瞬时 503 先失败后成功，共调用两次；额度耗尽和 aborted 各只调用一次。",
          "第五次计算出的退避时间受 2500ms 的自设上限限制。"
        ],
        "verification": "assert 全部通过、退出码 0；把 maxRetries 改为 0 后，瞬时错误也不应再调用第二次。",
        "requires": "offline",
        "notes": "这是重试策略的本地探针，不执行邮件、支付、部署或模型调用，也不证明外部写操作具有幂等性。"
      },
      "pitfalls": [
        "将 429 一律归为可重试，持续重试余额或订阅额度耗尽。",
        "工具已发生副作用却因未收到结果而生成新的业务幂等键。",
        "把 replay:safe 当作框架提供的外部事务保证。"
      ],
      "sources": [
        {
          "title": "Assistant 重试分类与有界策略",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/utils/retry.ts"
        },
        {
          "title": "Provider 级请求重试实现",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/utils/provider-retry.ts"
        },
        {
          "title": "工具异常如何成为结果",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent-loop.ts"
        },
        {
          "title": "Durable 工具重放与存储边界",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/README.md"
        }
      ],
      "migration": "重试按当前公开策略与独立 Pi Durable 的边界讲解，不再将 8 月 core 中的实验性 AgentHarness 当作当前恢复实现。",
      "copy": "<p class=\"chapter-summary\">区分模型请求重试、Agent 轮次恢复与外部工具副作用；用实际重试分类器和幂等设计控制重复执行。<\/p>\n<section class=\"lesson-section\"><h4>先分类，再计算退避时间<\/h4>\n<p>v1.5.0 的重试判断基于 assistant 的 stopReason 和 errorMessage。正常结果立即返回，aborted 是终态；只有错误且具有瞬时故障特征时才进入有限重试。网络断连、部分服务端错误和短期限流属于候选，账户额度、预算、计费耗尽则优先排除，即使错误文本同时带有 429。<\/p>\n<p>isRetryableAssistantError 是分类器，不负责整个恢复流程。调用者要先识别上下文溢出，再应用重试预算与报告策略。不能见到 timeout 或状态码就无限重复，也不能通过换一个错误字符串掩盖原始失败原因。<\/p>\n<ul><li>错误分类需要同时看供应商语义与账户状态，不能只看 HTTP 数字。<\/li><li>用户取消与认证、额度问题应让流程可见地停止或等待处理。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>预算属于哪一层<\/h4>\n<p>retryAssistantCall 接收 enabled、maxRetries、baseDelayMs 和可选 maxAgentDelayMs。初次调用不计入 maxRetries；每次重试按指数退避计算，默认单次等待上限为六十秒。调度前、真正重试前和最终结束时可以发送回调，退避等待也会响应 AbortSignal。<\/p>\n<p>provider 适配层的请求重试与 AgentSession 的 assistant 级恢复不是同一个边界。前者处理一次传输，后者可能重新生成一轮回答。叠加时必须知道总尝试次数和等待上限；否则每层都看似有界，用户却仍会经历很长的等待。<\/p>\n<ul><li>记录原始错误、尝试编号、最终结果和取消原因。<\/li><li>不要把一次重试成功理解成之前的请求没有消耗费用。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>工具错误先保留不确定性<\/h4>\n<p>工具执行可能已经发邮件、提交订单或写入数据库，结果却在返回途中丢失。因此超时代表“结果未知”，不是“操作未发生”。普通 Agent 的工具异常会回流为 isError 结果；是否再次调用应由明确策略决定，不能套用 provider 的网络重试规则。<\/p>\n<p>可写工具应由业务系统记录稳定的操作标识与幂等键。同一业务动作的重试沿用同一个键；先查询既有结果，再决定继续、补偿或请求人工处理。日志要区分未执行、已确认成功、已确认失败和状态未知，不能仅凭进程是否收到返回值记账。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>持久化恢复仍有外部边界<\/h4>\n<p>独立 Pi Durable 会持久化任务意图与检查点，崩溃后只对声明 replay:safe 的工具执行安全重放，其他中断调用会报告给模型处理。这个声明是开发者对操作性质的承诺，不会自动让任意写接口获得幂等能力。<\/p>\n<p>持久化提交、客户端 requestId 去重和外部系统副作用各有边界。给任务去重，不等于银行、邮件服务或发布平台也参与了同一事务。设计恢复策略时，应把业务幂等与可查询结果放在真实副作用所在的系统中，再用重放声明表达已经具备的安全性。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>将 429 一律归为可重试，持续重试余额或订阅额度耗尽。<\/li><li>工具已发生副作用却因未收到结果而生成新的业务幂等键。<\/li><li>把 replay:safe 当作框架提供的外部事务保证。<\/li><\/ul><\/section>",
      "labHtml": "<h4>离线比较瞬时失败、额度耗尽与取消<\/h4>\n<p>使用 v1.5.0 的真实 retryAssistantCall 和分类器，验证有限重试、终态和等待上限；不访问任何模型服务。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>在含 @earendil-works/pi-ai@1.5.0 的临时 Node 项目保存 retry-probe.mjs。依赖未安装时先联网准备；执行阶段无需 provider 凭证。<\/li><li>运行 node retry-probe.mjs；生产等待被替换为零延迟，produce 返回本地构造的 assistant 消息。<\/li><li>核对瞬时错误的调用次数与额度错误、取消的调用次数，避免把本地 mock 解释成真实供应商可用性测试。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &#x27;node:assert/strict&#x27;;\nimport { isRetryableAssistantError, retryAssistantCall, retryDelayMs } from &#x27;@earendil-works/pi-ai&#x27;;\nconst usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0,\n  totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };\nconst message = (stopReason, errorMessage) =&gt; ({ role: &#x27;assistant&#x27;, content: [],\n  api: &#x27;faux&#x27;, provider: &#x27;faux&#x27;, model: &#x27;faux-1&#x27;, usage, stopReason,\n  ...(errorMessage ? { errorMessage } : {}), timestamp: 0 });\nconst policy = { enabled: true, maxRetries: 2, baseDelayMs: 0 };\nlet transientCalls = 0;\nconst result = await retryAssistantCall(async () =&gt; {\n  transientCalls++;\n  return transientCalls === 1 ? message(&#x27;error&#x27;, &#x27;503 service unavailable&#x27;) : message(&#x27;stop&#x27;);\n}, policy, undefined);\nlet quotaCalls = 0;\nawait retryAssistantCall(async () =&gt; {\n  quotaCalls++;\n  return message(&#x27;error&#x27;, &#x27;429 insufficient_quota&#x27;);\n}, policy, undefined);\nlet abortedCalls = 0;\nawait retryAssistantCall(async () =&gt; {\n  abortedCalls++;\n  return message(&#x27;aborted&#x27;);\n}, policy, undefined);\nassert.equal(isRetryableAssistantError(message(&#x27;error&#x27;, &#x27;429 insufficient_quota&#x27;)), false);\nassert.equal(result.stopReason, &#x27;stop&#x27;);\nassert.deepEqual([transientCalls, quotaCalls, abortedCalls], [2, 1, 1]);\nassert.equal(retryDelayMs({ baseDelayMs: 1000, maxAgentDelayMs: 2500 }, 5), 2500);\nconsole.log(JSON.stringify({ transientCalls, quotaCalls, abortedCalls, cappedDelayMs: 2500 }));\n<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>瞬时 503 先失败后成功，共调用两次；额度耗尽和 aborted 各只调用一次。<\/li><li>第五次计算出的退避时间受 2500ms 的自设上限限制。<\/li><\/ul>\n<p><strong>验收：<\/strong>assert 全部通过、退出码 0；把 maxRetries 改为 0 后，瞬时错误也不应再调用第二次。<\/p>\n<p class=\"lab-note\">这是重试策略的本地探针，不执行邮件、支付、部署或模型调用，也不证明外部写操作具有幂等性。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/utils/retry.ts\" target=\"_blank\" rel=\"noreferrer\">Assistant 重试分类与有界策略 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/ai/src/utils/provider-retry.ts\" target=\"_blank\" rel=\"noreferrer\">Provider 级请求重试实现 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/src/agent-loop.ts\" target=\"_blank\" rel=\"noreferrer\">工具异常如何成为结果 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/README.md\" target=\"_blank\" rel=\"noreferrer\">Durable 工具重放与存储边界 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/07.md"
    },
    {
      "number": 8,
      "id": "chapter-08",
      "tag": "Events / SDK / RPC",
      "title": "事件与集成：什么时候真的结束了",
      "summary": "用事件边界区分请求被接受、一次低层运行结束和会话完全静止，并选择 SDK 或 JSONL RPC 接入。",
      "questions": [
        "RPC 的 prompt success:true，是否代表任务已经完成？",
        "agent_end 与 AgentSession 的 agent_settled 有什么区别？",
        "为什么工具完成事件、会话记录和遥测不能互相替代？"
      ],
      "sections": [
        {
          "title": "先读懂一次低层运行的时间线",
          "paragraphs": [
            "一次正常 Agent 运行从 agent_start、turn_start 开始，依次产生消息开始、流式更新、消息结束；若有工具调用，再经过工具执行事件与结果消息，最后发出 turn_end。工具结果需要后续判断时会进入下一轮，直到 agent_end 收口。message_update 是 assistant 的增量事件，不能当成已经完成的一条消息。",
            "Agent.subscribe 的监听器按注册顺序被等待。agent_end 表示不会再发出该低层运行的事件，但它的异步监听器仍可能尚未结束；prompt 和 waitForIdle 要等待这些工作结算。把“收到最后一个事件”和“调用方的 Promise 已完成”当成同一瞬间，会制造资源释放和 UI 状态竞态。"
          ],
          "bullets": []
        },
        {
          "title": "会话结束比一轮结束更高一层",
          "paragraphs": [
            "Coding Agent 的 AgentSession 还负责自动重试、溢出恢复、压缩和输入队列。因此某次 agent_end 后，仍可能启动新的运行。外部客户端需要确认 Pi 不会自动继续时，应等待会话层的 agent_settled，而不是在第一个 agent_end 就展示最终交付。",
            "RPC prompt 的成功响应只是输入已经开始、排队或被扩展处理；handled 表示没有为这条输入开启运行，不能机械等待一个不会出现的 agent_settled。订阅应先于发送 prompt，避免快任务在订阅建立前就结束。"
          ],
          "bullets": [
            "显示“已受理”“运行中”“等待复核”和“已静止”等不同业务状态。",
            "完成事件不自动代表用户的验收条件已经满足。"
          ]
        },
        {
          "title": "SDK 与 RPC 是两种边界",
          "paragraphs": [
            "Node.js 或 Bun 应用可用 SDK 在进程内直接访问 AgentSession、会话和工具，生命周期结束时 dispose。其他语言、IDE 或需要进程隔离的宿主可使用 pi --mode rpc，以 stdin/stdout 的 JSONL 命令、响应和事件通信；TypeScript 子进程集成也可使用官方 RpcClient。",
            "每条协议记录必须是一个完整 JSON 对象，以 LF 结束。并发命令按唯一 id 关联响应，不能依赖返回顺序；U+2028 和 U+2029 可以出现在 JSON 字符串内，不能把它们当协议换行。持续读取 stdout 并处理背压；诊断在 stderr，进程退出与超时必须由客户端处理。"
          ],
          "bullets": []
        },
        {
          "title": "进度、持久事实和遥测各有用途",
          "paragraphs": [
            "并行工具的完成事件按实际结束先后到达，而持久化结果仍按模型原调用顺序。界面可以先显示已完成的工具，历史重建却要遵守持久记录。durationMs 只表示 execute 的耗时，不包含 Hook、队列和整个业务请求。",
            "pi-telemetry 提供与供应商无关的诊断契约和适配器边界。Trace 不是持久应用状态，carrier 也不是授权凭证；更换适配器不能改变会话的业务事实。默认不要把完整提示词、文件、工具输出和凭证写进观测属性；记录可用的低基数操作信息即可。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "无 prompt 的 RPC 协议探针",
        "objective": "在隔离配置中向真实 Pi CLI 查询状态、统计与消息，验证 JSONL framing 和按 id 匹配响应。",
        "steps": [
          "准备已安装的 @earendil-works/pi-coding-agent@1.5.0 与 Node.js 22.19+；将代码保存为 rpc-inspect.mjs，放在能解析该包的临时 Node 项目中。",
          "执行 node rpc-inspect.mjs。脚本使用临时工作目录和临时 PI_CODING_AGENT_DIR，禁用发现的扩展、技能、模板、主题和上下文文件。",
          "代码不发送 prompt，不发起模型推理；读取完三条命令响应后关闭 stdin。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from 'node:assert/strict';\nimport { spawn } from 'node:child_process';\nimport { once } from 'node:events';\nimport { mkdtemp } from 'node:fs/promises';\nimport { tmpdir } from 'node:os';\nimport { dirname, join } from 'node:path';\nimport { fileURLToPath } from 'node:url';\nconst cli = join(dirname(fileURLToPath(import.meta.resolve('@earendil-works/pi-coding-agent'))), 'cli.js');\nconst work = await mkdtemp(join(tmpdir(), 'pi-rpc-inspect-'));\nconst child = spawn(process.execPath, [cli, '--mode', 'rpc', '--no-session',\n  '--no-extensions', '--no-skills', '--no-prompt-templates', '--no-themes', '--no-context-files'],\n  { cwd: work, env: { PATH: process.env.PATH ?? '', TERM: 'dumb', NO_COLOR: '1',\n      PI_CODING_AGENT_DIR: join(work, 'agent') },\n    stdio: ['pipe', 'pipe', 'inherit'] });\nlet buffer = '';\nconst waiting = new Map();\nchild.stdout.setEncoding('utf8');\nchild.stdout.on('data', chunk => {\n  buffer += chunk;\n  let end;\n  while ((end = buffer.indexOf('\\n')) >= 0) {\n    const line = buffer.slice(0, end).replace(/\\r$/, '');\n    buffer = buffer.slice(end + 1);\n    if (!line) continue;\n    const record = JSON.parse(line);\n    if (record.type === 'response' && waiting.has(record.id)) {\n      const { resolve, timer } = waiting.get(record.id);\n      clearTimeout(timer); waiting.delete(record.id); resolve(record);\n    }\n  }\n});\nfunction ask(type) {\n  const id = `lab-${type}`;\n  return new Promise((resolve, reject) => {\n    const timer = setTimeout(() => { waiting.delete(id); reject(new Error(`Timeout: ${id}`)); }, 30000);\n    waiting.set(id, { resolve, timer });\n    child.stdin.write(JSON.stringify({ id, type }) + '\\n');\n  });\n}\ntry {\n  for (const type of ['get_state', 'get_session_stats', 'get_messages']) {\n    const response = await ask(type);\n    assert.equal(response.id, `lab-${type}`);\n    assert.equal(response.command, type);\n    assert.equal(response.success, true, JSON.stringify(response));\n    console.log(JSON.stringify({ id: response.id, command: type, success: response.success }));\n  }\n  const exited = once(child, 'exit');\n  child.stdin.end();\n  const [status] = await exited;\n  assert.equal(status, 0);\n} finally {\n  if (child.exitCode === null) child.kill();\n}\n",
        "expected": [
          "收到三条 id 与 command 对应且 success:true 的 response；不要求按随机启动事件的位置取第 N 行。",
          "没有发送 prompt，因此本实验不验证模型输出、工具调用和 agent_settled 的整段生命周期。"
        ],
        "verification": "三条查询断言通过且 Pi 正常退出；手工把某条命令改为不存在的 type，应得到失败响应而不是把它解释为任务成功。",
        "requires": "installed CLI",
        "notes": "这是无模型推理的协议检查，需要已安装的 CLI 包；子进程只继承 PATH，不继承模型 API 凭证环境变量，使用临时配置目录，不读取或覆盖用户真实 Pi 配置。完整事件实验需额外 provider 凭证，本节不声称已完成该测评。"
      },
      "pitfalls": [
        "把 prompt 的 success:true 或第一个 agent_end 当作业务任务完成。",
        "用按所有 Unicode 换行切割的通用 reader 解析 JSONL。",
        "把遥测事件当作恢复所需的持久状态，或把 trace id 当作授权凭证。"
      ],
      "sources": [
        {
          "title": "低层 Agent 事件与监听器结算",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/README.md"
        },
        {
          "title": "RPC framing、响应与运行生命周期",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/rpc.md"
        },
        {
          "title": "SDK 会话生命周期",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/sdk.md"
        },
        {
          "title": "遥测契约与安全边界",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/telemetry/README.md"
        }
      ],
      "migration": "用当前 RPC 文档的受理语义和 agent_settled 边界重写，不再用旧 agent_end 事件推断整个会话已经结束。",
      "copy": "<p class=\"chapter-summary\">用事件边界区分请求被接受、一次低层运行结束和会话完全静止，并选择 SDK 或 JSONL RPC 接入。<\/p>\n<section class=\"lesson-section\"><h4>先读懂一次低层运行的时间线<\/h4>\n<p>一次正常 Agent 运行从 agent_start、turn_start 开始，依次产生消息开始、流式更新、消息结束；若有工具调用，再经过工具执行事件与结果消息，最后发出 turn_end。工具结果需要后续判断时会进入下一轮，直到 agent_end 收口。message_update 是 assistant 的增量事件，不能当成已经完成的一条消息。<\/p>\n<p>Agent.subscribe 的监听器按注册顺序被等待。agent_end 表示不会再发出该低层运行的事件，但它的异步监听器仍可能尚未结束；prompt 和 waitForIdle 要等待这些工作结算。把“收到最后一个事件”和“调用方的 Promise 已完成”当成同一瞬间，会制造资源释放和 UI 状态竞态。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>会话结束比一轮结束更高一层<\/h4>\n<p>Coding Agent 的 AgentSession 还负责自动重试、溢出恢复、压缩和输入队列。因此某次 agent_end 后，仍可能启动新的运行。外部客户端需要确认 Pi 不会自动继续时，应等待会话层的 agent_settled，而不是在第一个 agent_end 就展示最终交付。<\/p>\n<p>RPC prompt 的成功响应只是输入已经开始、排队或被扩展处理；handled 表示没有为这条输入开启运行，不能机械等待一个不会出现的 agent_settled。订阅应先于发送 prompt，避免快任务在订阅建立前就结束。<\/p>\n<ul><li>显示“已受理”“运行中”“等待复核”和“已静止”等不同业务状态。<\/li><li>完成事件不自动代表用户的验收条件已经满足。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>SDK 与 RPC 是两种边界<\/h4>\n<p>Node.js 或 Bun 应用可用 SDK 在进程内直接访问 AgentSession、会话和工具，生命周期结束时 dispose。其他语言、IDE 或需要进程隔离的宿主可使用 pi --mode rpc，以 stdin/stdout 的 JSONL 命令、响应和事件通信；TypeScript 子进程集成也可使用官方 RpcClient。<\/p>\n<p>每条协议记录必须是一个完整 JSON 对象，以 LF 结束。并发命令按唯一 id 关联响应，不能依赖返回顺序；U+2028 和 U+2029 可以出现在 JSON 字符串内，不能把它们当协议换行。持续读取 stdout 并处理背压；诊断在 stderr，进程退出与超时必须由客户端处理。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>进度、持久事实和遥测各有用途<\/h4>\n<p>并行工具的完成事件按实际结束先后到达，而持久化结果仍按模型原调用顺序。界面可以先显示已完成的工具，历史重建却要遵守持久记录。durationMs 只表示 execute 的耗时，不包含 Hook、队列和整个业务请求。<\/p>\n<p>pi-telemetry 提供与供应商无关的诊断契约和适配器边界。Trace 不是持久应用状态，carrier 也不是授权凭证；更换适配器不能改变会话的业务事实。默认不要把完整提示词、文件、工具输出和凭证写进观测属性；记录可用的低基数操作信息即可。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>把 prompt 的 success:true 或第一个 agent_end 当作业务任务完成。<\/li><li>用按所有 Unicode 换行切割的通用 reader 解析 JSONL。<\/li><li>把遥测事件当作恢复所需的持久状态，或把 trace id 当作授权凭证。<\/li><\/ul><\/section>",
      "labHtml": "<h4>无 prompt 的 RPC 协议探针<\/h4>\n<p>在隔离配置中向真实 Pi CLI 查询状态、统计与消息，验证 JSONL framing 和按 id 匹配响应。<\/p>\n<p class=\"lab-requires\">运行条件：已安装 Pi CLI<\/p>\n<ol><li>准备已安装的 @earendil-works/pi-coding-agent@1.5.0 与 Node.js 22.19+；将代码保存为 rpc-inspect.mjs，放在能解析该包的临时 Node 项目中。<\/li><li>执行 node rpc-inspect.mjs。脚本使用临时工作目录和临时 PI_CODING_AGENT_DIR，禁用发现的扩展、技能、模板、主题和上下文文件。<\/li><li>代码不发送 prompt，不发起模型推理；读取完三条命令响应后关闭 stdin。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &#x27;node:assert/strict&#x27;;\nimport { spawn } from &#x27;node:child_process&#x27;;\nimport { once } from &#x27;node:events&#x27;;\nimport { mkdtemp } from &#x27;node:fs/promises&#x27;;\nimport { tmpdir } from &#x27;node:os&#x27;;\nimport { dirname, join } from &#x27;node:path&#x27;;\nimport { fileURLToPath } from &#x27;node:url&#x27;;\nconst cli = join(dirname(fileURLToPath(import.meta.resolve(&#x27;@earendil-works/pi-coding-agent&#x27;))), &#x27;cli.js&#x27;);\nconst work = await mkdtemp(join(tmpdir(), &#x27;pi-rpc-inspect-&#x27;));\nconst child = spawn(process.execPath, [cli, &#x27;--mode&#x27;, &#x27;rpc&#x27;, &#x27;--no-session&#x27;,\n  &#x27;--no-extensions&#x27;, &#x27;--no-skills&#x27;, &#x27;--no-prompt-templates&#x27;, &#x27;--no-themes&#x27;, &#x27;--no-context-files&#x27;],\n  { cwd: work, env: { PATH: process.env.PATH ?? &#x27;&#x27;, TERM: &#x27;dumb&#x27;, NO_COLOR: &#x27;1&#x27;,\n      PI_CODING_AGENT_DIR: join(work, &#x27;agent&#x27;) },\n    stdio: [&#x27;pipe&#x27;, &#x27;pipe&#x27;, &#x27;inherit&#x27;] });\nlet buffer = &#x27;&#x27;;\nconst waiting = new Map();\nchild.stdout.setEncoding(&#x27;utf8&#x27;);\nchild.stdout.on(&#x27;data&#x27;, chunk =&gt; {\n  buffer += chunk;\n  let end;\n  while ((end = buffer.indexOf(&#x27;\\n&#x27;)) &gt;= 0) {\n    const line = buffer.slice(0, end).replace(/\\r$/, &#x27;&#x27;);\n    buffer = buffer.slice(end + 1);\n    if (!line) continue;\n    const record = JSON.parse(line);\n    if (record.type === &#x27;response&#x27; &amp;&amp; waiting.has(record.id)) {\n      const { resolve, timer } = waiting.get(record.id);\n      clearTimeout(timer); waiting.delete(record.id); resolve(record);\n    }\n  }\n});\nfunction ask(type) {\n  const id = `lab-${type}`;\n  return new Promise((resolve, reject) =&gt; {\n    const timer = setTimeout(() =&gt; { waiting.delete(id); reject(new Error(`Timeout: ${id}`)); }, 30000);\n    waiting.set(id, { resolve, timer });\n    child.stdin.write(JSON.stringify({ id, type }) + &#x27;\\n&#x27;);\n  });\n}\ntry {\n  for (const type of [&#x27;get_state&#x27;, &#x27;get_session_stats&#x27;, &#x27;get_messages&#x27;]) {\n    const response = await ask(type);\n    assert.equal(response.id, `lab-${type}`);\n    assert.equal(response.command, type);\n    assert.equal(response.success, true, JSON.stringify(response));\n    console.log(JSON.stringify({ id: response.id, command: type, success: response.success }));\n  }\n  const exited = once(child, &#x27;exit&#x27;);\n  child.stdin.end();\n  const [status] = await exited;\n  assert.equal(status, 0);\n} finally {\n  if (child.exitCode === null) child.kill();\n}\n<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>收到三条 id 与 command 对应且 success:true 的 response；不要求按随机启动事件的位置取第 N 行。<\/li><li>没有发送 prompt，因此本实验不验证模型输出、工具调用和 agent_settled 的整段生命周期。<\/li><\/ul>\n<p><strong>验收：<\/strong>三条查询断言通过且 Pi 正常退出；手工把某条命令改为不存在的 type，应得到失败响应而不是把它解释为任务成功。<\/p>\n<p class=\"lab-note\">这是无模型推理的协议检查，需要已安装的 CLI 包；子进程只继承 PATH，不继承模型 API 凭证环境变量，使用临时配置目录，不读取或覆盖用户真实 Pi 配置。完整事件实验需额外 provider 凭证，本节不声称已完成该测评。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/agent/README.md\" target=\"_blank\" rel=\"noreferrer\">低层 Agent 事件与监听器结算 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/rpc.md\" target=\"_blank\" rel=\"noreferrer\">RPC framing、响应与运行生命周期 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/sdk.md\" target=\"_blank\" rel=\"noreferrer\">SDK 会话生命周期 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/telemetry/README.md\" target=\"_blank\" rel=\"noreferrer\">遥测契约与安全边界 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/08.md"
    },
    {
      "number": 9,
      "id": "chapter-09",
      "tag": "Context / Projection",
      "title": "上下文预算：历史保存与模型可见内容分开管理",
      "summary": "从 SessionManager 的规范投影出发，使用 ContextEditEntry 改变后续模型输入，同时保留原始历史与用量记录。",
      "questions": [
        "为什么修改 agent.state.messages 不能可靠替换 Coding Agent 的持久上下文？",
        "ContextEditEntry 的 replacement:null 会删除原始记录吗？",
        "上下文溢出恢复为什么要先保存失败尝试，再修复投影？"
      ],
      "sections": [
        {
          "title": "预算计算针对模型真正会看到的内容",
          "paragraphs": [
            "上下文预算不仅是历史消息长度，还包括系统提示、工具声明、新输入、工具结果、预留输出和安全余量。v1.5.0 在每次请求前使用 SessionManager 构造规范投影；已压缩或省略的原始记录仍可保存，但不会继续占据同一份模型输入预算。",
            "系统提示和工具加载变化也会以 system 消息记录。重放这些变更后得到当前提示与工具集合，压缩时还会保存完整系统检查点。因此要分清原始 entry、当前分支、投影消息和最终 provider 请求，而不是把一份数组当作所有层的唯一真相。"
          ],
          "bullets": []
        },
        {
          "title": "ContextEditEntry 追加修改，不覆盖历史",
          "paragraphs": [
            "context_edit 指向当前分支上一条已经产生模型内容的记录。replacement:null 省略该记录；非空 replacement 只替换 content，不改角色、模型、时间或用量等原始元数据。user、assistant、toolResult 和 custom_message 都可成为目标，元数据项和任意跨分支记录不能当作可编辑目标。",
            "同一个目标出现多个编辑时，活动分支上最后的编辑生效。导航回编辑之前，原始内容重新参与上下文；这让摘要、脱敏和失败清理能保持分支语义。原记录仍可被 UI、导出、历史查询和会话账务读取，不能把省略操作当成数据删除或隐私擦除。"
          ],
          "bullets": [
            "assistant 和 toolResult 的字符串替换会规范成文本块数组。",
            "自定义状态用 custom entry；需要模型读取的信息才进入 custom_message。"
          ]
        },
        {
          "title": "规范上下文由会话管理器重建",
          "paragraphs": [
            "buildContextEntries 沿活动 leaf 回到根并处理压缩边界；buildSessionProjection 再应用 context_edit；buildSessionContext 生成交给模型的消息列表。这条链决定 finalized context，不能靠直接赋值 session.agent.state.messages 来持久替换它，下一次规范重建可能覆盖临时改动。",
            "SDK 恢复外部历史时，应提供已含对应 entries 的 SessionManager。临时应用消息可以通过 Agent 的 transformContext 和 convertToLlm 分层处理，但这不等于已经写入会话；任何长期有效的变化都要有可重放来源。"
          ],
          "bullets": []
        },
        {
          "title": "溢出恢复也要保留证据",
          "paragraphs": [
            "CLI 在新用户输入前以及工具结果完成、准备下一次响应时检查规范上下文。provider 拒绝过长请求或部分 length 终止可触发一次压缩恢复；带工具调用的 length 响应还要保留合成失败工具结果并遵守原有调度，不能粗暴丢弃整个轮次。",
            "失败尝试先成为真实历史，并经过 turn_end、agent_end，再追加 context_edit 修复未来输入，成功压缩后才开始新的重试运行。压缩失败或取消时保留省略编辑，不写成功 compaction，也不安排内部恢复重试。这样错误可审计，后续模型又不会不断读到同一份失败现场。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "在内存会话中替换、省略，再回到编辑之前",
        "objective": "验证 ContextEditEntry 的投影语义和原始历史保留，完全不调用模型。",
        "steps": [
          "准备含 @earendil-works/pi-coding-agent@1.5.0 的临时 Node 项目，保存 context-edit.mjs；使用已就绪依赖后可离线执行。",
          "运行 node context-edit.mjs，依次观察原文、替换文本、省略后的空消息列表及回到原 leaf 的状态。",
          "原文使用实验哨兵，不放真实敏感数据；本节只验证内存投影，不做隐私删除承诺。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from 'node:assert/strict';\nimport { SessionManager } from '@earendil-works/pi-coding-agent';\nconst manager = SessionManager.inMemory();\nconst original = 'RAW_CONTEXT_SENTINEL';\nconst id = manager.appendMessage({ role: 'user', content: original, timestamp: 0 });\nmanager.appendContextEdit(id, { content: 'short replacement' });\nassert.equal(manager.getEntry(id).message.content, original);\nassert.equal(manager.buildSessionContext().messages[0].content, 'short replacement');\nmanager.appendContextEdit(id, null);\nassert.equal(manager.buildSessionContext().messages.length, 0);\nassert.equal(manager.getEntry(id).message.content, original);\nmanager.branch(id);\nassert.equal(manager.buildSessionContext().messages[0].content, original);\nassert.equal(manager.getEntries().filter(e => e.type === 'context_edit').length, 2);\nconsole.log(JSON.stringify({ rawPreserved: true, replacementApplied: true,\n  omissionApplied: true, beforeEditRestored: true }));\n",
        "expected": [
          "替换后，原始 entry 的内容仍为哨兵文本，模型投影为 short replacement。",
          "省略后投影没有该消息；切回原始 entry 时哨兵文本重新出现，两个 context_edit 仍留在原始 entries 中。"
        ],
        "verification": "四个状态的断言全部通过；不要仅检查 TUI 文本是否变化。",
        "requires": "offline",
        "notes": "需已安装固定版 Coding Agent 包；首次准备依赖可能联网。SessionManager.inMemory 不创建会话文件，实验不发起 provider 请求。"
      },
      "pitfalls": [
        "把从模型输入省略等同于从文件、导出或账务记录永久删除。",
        "直接修改 agent.state.messages 后，认为会话恢复也会保留这个修改。",
        "按原始历史的总字符数估计当前窗口，忽略压缩、分支和 context_edit 投影。"
      ],
      "sources": [
        {
          "title": "ContextEditEntry 与上下文重建契约",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/session-format.md"
        },
        {
          "title": "SessionManager 编辑验证与投影实现",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/session-manager.ts"
        },
        {
          "title": "AgentSession 请求准备与恢复流程",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/agent-session.ts"
        },
        {
          "title": "SDK 的规范会话来源",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/sdk.md"
        }
      ],
      "migration": "用 v1.5.0 的规范会话投影、系统消息检查点与追加式 context_edit 解释预算，不再把修改内存消息数组当作完整上下文管理方案。",
      "copy": "<p class=\"chapter-summary\">从 SessionManager 的规范投影出发，使用 ContextEditEntry 改变后续模型输入，同时保留原始历史与用量记录。<\/p>\n<section class=\"lesson-section\"><h4>预算计算针对模型真正会看到的内容<\/h4>\n<p>上下文预算不仅是历史消息长度，还包括系统提示、工具声明、新输入、工具结果、预留输出和安全余量。v1.5.0 在每次请求前使用 SessionManager 构造规范投影；已压缩或省略的原始记录仍可保存，但不会继续占据同一份模型输入预算。<\/p>\n<p>系统提示和工具加载变化也会以 system 消息记录。重放这些变更后得到当前提示与工具集合，压缩时还会保存完整系统检查点。因此要分清原始 entry、当前分支、投影消息和最终 provider 请求，而不是把一份数组当作所有层的唯一真相。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>ContextEditEntry 追加修改，不覆盖历史<\/h4>\n<p>context_edit 指向当前分支上一条已经产生模型内容的记录。replacement:null 省略该记录；非空 replacement 只替换 content，不改角色、模型、时间或用量等原始元数据。user、assistant、toolResult 和 custom_message 都可成为目标，元数据项和任意跨分支记录不能当作可编辑目标。<\/p>\n<p>同一个目标出现多个编辑时，活动分支上最后的编辑生效。导航回编辑之前，原始内容重新参与上下文；这让摘要、脱敏和失败清理能保持分支语义。原记录仍可被 UI、导出、历史查询和会话账务读取，不能把省略操作当成数据删除或隐私擦除。<\/p>\n<ul><li>assistant 和 toolResult 的字符串替换会规范成文本块数组。<\/li><li>自定义状态用 custom entry；需要模型读取的信息才进入 custom_message。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>规范上下文由会话管理器重建<\/h4>\n<p>buildContextEntries 沿活动 leaf 回到根并处理压缩边界；buildSessionProjection 再应用 context_edit；buildSessionContext 生成交给模型的消息列表。这条链决定 finalized context，不能靠直接赋值 session.agent.state.messages 来持久替换它，下一次规范重建可能覆盖临时改动。<\/p>\n<p>SDK 恢复外部历史时，应提供已含对应 entries 的 SessionManager。临时应用消息可以通过 Agent 的 transformContext 和 convertToLlm 分层处理，但这不等于已经写入会话；任何长期有效的变化都要有可重放来源。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>溢出恢复也要保留证据<\/h4>\n<p>CLI 在新用户输入前以及工具结果完成、准备下一次响应时检查规范上下文。provider 拒绝过长请求或部分 length 终止可触发一次压缩恢复；带工具调用的 length 响应还要保留合成失败工具结果并遵守原有调度，不能粗暴丢弃整个轮次。<\/p>\n<p>失败尝试先成为真实历史，并经过 turn_end、agent_end，再追加 context_edit 修复未来输入，成功压缩后才开始新的重试运行。压缩失败或取消时保留省略编辑，不写成功 compaction，也不安排内部恢复重试。这样错误可审计，后续模型又不会不断读到同一份失败现场。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>把从模型输入省略等同于从文件、导出或账务记录永久删除。<\/li><li>直接修改 agent.state.messages 后，认为会话恢复也会保留这个修改。<\/li><li>按原始历史的总字符数估计当前窗口，忽略压缩、分支和 context_edit 投影。<\/li><\/ul><\/section>",
      "labHtml": "<h4>在内存会话中替换、省略，再回到编辑之前<\/h4>\n<p>验证 ContextEditEntry 的投影语义和原始历史保留，完全不调用模型。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>准备含 @earendil-works/pi-coding-agent@1.5.0 的临时 Node 项目，保存 context-edit.mjs；使用已就绪依赖后可离线执行。<\/li><li>运行 node context-edit.mjs，依次观察原文、替换文本、省略后的空消息列表及回到原 leaf 的状态。<\/li><li>原文使用实验哨兵，不放真实敏感数据；本节只验证内存投影，不做隐私删除承诺。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &#x27;node:assert/strict&#x27;;\nimport { SessionManager } from &#x27;@earendil-works/pi-coding-agent&#x27;;\nconst manager = SessionManager.inMemory();\nconst original = &#x27;RAW_CONTEXT_SENTINEL&#x27;;\nconst id = manager.appendMessage({ role: &#x27;user&#x27;, content: original, timestamp: 0 });\nmanager.appendContextEdit(id, { content: &#x27;short replacement&#x27; });\nassert.equal(manager.getEntry(id).message.content, original);\nassert.equal(manager.buildSessionContext().messages[0].content, &#x27;short replacement&#x27;);\nmanager.appendContextEdit(id, null);\nassert.equal(manager.buildSessionContext().messages.length, 0);\nassert.equal(manager.getEntry(id).message.content, original);\nmanager.branch(id);\nassert.equal(manager.buildSessionContext().messages[0].content, original);\nassert.equal(manager.getEntries().filter(e =&gt; e.type === &#x27;context_edit&#x27;).length, 2);\nconsole.log(JSON.stringify({ rawPreserved: true, replacementApplied: true,\n  omissionApplied: true, beforeEditRestored: true }));\n<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>替换后，原始 entry 的内容仍为哨兵文本，模型投影为 short replacement。<\/li><li>省略后投影没有该消息；切回原始 entry 时哨兵文本重新出现，两个 context_edit 仍留在原始 entries 中。<\/li><\/ul>\n<p><strong>验收：<\/strong>四个状态的断言全部通过；不要仅检查 TUI 文本是否变化。<\/p>\n<p class=\"lab-note\">需已安装固定版 Coding Agent 包；首次准备依赖可能联网。SessionManager.inMemory 不创建会话文件，实验不发起 provider 请求。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/session-format.md\" target=\"_blank\" rel=\"noreferrer\">ContextEditEntry 与上下文重建契约 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/session-manager.ts\" target=\"_blank\" rel=\"noreferrer\">SessionManager 编辑验证与投影实现 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/agent-session.ts\" target=\"_blank\" rel=\"noreferrer\">AgentSession 请求准备与恢复流程 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/sdk.md\" target=\"_blank\" rel=\"noreferrer\">SDK 的规范会话来源 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/09.md"
    },
    {
      "number": 10,
      "id": "chapter-10",
      "tag": "Compaction / Branches",
      "title": "压缩与分支摘要：重建工作现场，不删除历史",
      "summary": "学习当前压缩的触发、合法切点、系统检查点与摘要累计机制，再把它和离开分支时的信息交接分开。",
      "questions": [
        "reserveTokens 与摘要模型的最大输出长度，为什么不是同一个参数？",
        "压缩为何不能从一条 toolResult 开始保留上下文？",
        "compaction 的 firstKeptEntryId 与 branch_summary 的 fromId 分别回答什么问题？"
      ],
      "sections": [
        {
          "title": "阈值决定何时压缩，不决定摘要写多长",
          "paragraphs": [
            "默认条件仍是 contextTokens 大于 contextWindow 减 reserveTokens，默认 reserveTokens 为 16384，可由用户、项目和按模型设置调整。它决定何时开始压缩，不是摘要输出上限；当前摘要请求按模型输出能力和剩余窗口共同约束，不能把 reserveTokens 直接当 maxTokens。",
            "会话会在新用户输入前检查，也会在工具结果追加后、下一响应准备阶段检查规范投影。若本批工具已终止运行且没有排队输入要求继续，就跳过该轮间检查。手工 /compact 可以附带说明；溢出和部分 length 情况另外走一次恢复尝试。"
          ],
          "bullets": []
        },
        {
          "title": "切点必须留下完整的调用关系",
          "paragraphs": [
            "算法从当前投影往前估算，默认保留约 20000 个近期 token，再摘要较旧部分。优先按用户消息跨度切分；一个跨度本身过大时，可从 assistant 消息切开，将前缀单独摘要。合法边界不会落在 toolResult 上，否则模型会看见结果却失去发起调用的 assistant。",
            "一次压缩追加 CompactionEntry，记录 summary、firstKeptEntryId、tokensBefore 和可用的 usage，还保存压缩边界的系统提示与工具检查点。后续上下文由该检查点、摘要、保留区间和新 entries 重建。原始历史继续存在，保留范围为空时 firstKeptEntryId 指向该压缩 entry 自身。"
          ],
          "bullets": []
        },
        {
          "title": "重复压缩处理的是投影，不是原始文件切片",
          "paragraphs": [
            "再次压缩时，从上次保留边界接着摘要，并把上一份摘要作为迭代上下文；不应从上一条 compaction 的物理位置盲目切片。被 context_edit 省略的原始条目不参与切点、摘要和窗口估算，tokensBefore 也要按重建后的实际投影计算。",
            "默认摘要保留目标、约束、进展、关键决定和下一步，压缩摘要还包含继续任务必需的关键背景。序列化不包含 thinking 块，并截断过长工具结果以控制摘要请求体积。读写文件清单会在 Pi 默认摘要间累计；扩展自供摘要的 details 需要由扩展自己维护。"
          ],
          "bullets": []
        },
        {
          "title": "离开分支时，摘要负责交接另一条路径",
          "paragraphs": [
            "/tree 导航可把从旧 leaf 到共同祖先之间、不会出现在新活动路径中的工作做成 branch_summary。它的 parentId 指向新分支续接位置，fromId 记录离开的旧 leaf。这个摘要解决切换路径后的信息交接；compaction 解决当前路径的窗口压力，两者不能互相替代。",
            "扩展可通过 session_before_compact 取消或自供摘要，通过失败事件观察压缩终态，也可参与树导航摘要。无论默认还是自供摘要，都应保留能验证的完成事项、未解决问题和原始证据位置；摘要只是工作交接材料，无法保证模型没有遗漏或曲解。"
          ],
          "bullets": []
        }
      ],
      "lab": {
        "title": "手工摘要探针：比较压缩与离开分支",
        "objective": "用内存 SessionManager 验证摘要 entry 的上下文重建语义；手工提供摘要，隔离掉模型质量和计费变量。",
        "steps": [
          "在已准备 @earendil-works/pi-coding-agent@1.5.0 的临时 Node 项目保存 summary-projection.mjs。",
          "运行代码：第一份会话追加 compaction 并保留新消息；第二份会话从共同祖先建立带摘要的新分支。",
          "核对原始哨兵记录仍可读取，却不直接进入新上下文；再检查 firstKeptEntryId、parentId、fromId 的含义。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from 'node:assert/strict';\nimport { SessionManager } from '@earendil-works/pi-coding-agent';\nconst user = content => ({ role: 'user', content, timestamp: 0 });\nconst compacted = SessionManager.inMemory();\nconst oldId = compacted.appendMessage(user('OLD_RAW_SENTINEL'));\nconst keptId = compacted.appendMessage(user('continue with the query test'));\nconst compactId = compacted.appendCompaction('Earlier work chose SQLite.', keptId, 1234);\nconst projected = JSON.stringify(compacted.buildSessionContext().messages);\nassert.equal(compacted.getEntry(oldId).message.content, 'OLD_RAW_SENTINEL');\nassert.equal(compacted.getEntry(compactId).firstKeptEntryId, keptId);\nassert.ok(projected.includes('Earlier work chose SQLite.'));\nassert.ok(projected.includes('continue with the query test'));\nassert.ok(!projected.includes('OLD_RAW_SENTINEL'));\nconst branched = SessionManager.inMemory();\nconst common = branched.appendMessage(user('shared goal'));\nconst oldLeaf = branched.appendMessage(user('LEFT_RAW_SENTINEL'));\nconst summaryId = branched.branchWithSummary(common, 'Approach A was explored.', undefined, true);\nconst summary = branched.getEntry(summaryId);\nassert.equal(summary.parentId, common);\nassert.equal(summary.fromId, oldLeaf);\nassert.equal(branched.getEntry(oldLeaf).message.content, 'LEFT_RAW_SENTINEL');\nconst newContext = JSON.stringify(branched.buildSessionContext().messages);\nassert.ok(newContext.includes('Approach A was explored.'));\nassert.ok(!newContext.includes('LEFT_RAW_SENTINEL'));\nconsole.log(JSON.stringify({ compactionRebuilt: true, branchSummaryLinked: true, rawHistoryPreserved: true }));\n",
        "expected": [
          "compaction 投影包含手工摘要与保留的新消息，不包含旧哨兵原文；旧 entry 仍存在。",
          "branch_summary 的 parentId 为共同祖先，fromId 为离开的 leaf，新路径只携带它的摘要而不复制旧路径原文。"
        ],
        "verification": "所有断言通过且退出码 0；能够解释“模型没看见原文”和“原文已经删除”的区别。",
        "requires": "offline",
        "notes": "固定版依赖已准备后无需网络或模型账户。本探针不执行 /compact、不调用摘要模型，不验证自动切点、真实 token 估算或 LLM 摘要质量；这些需要另做 provider 集成测试。"
      },
      "pitfalls": [
        "以为 reserveTokens 就是摘要请求固定输出上限。",
        "为了省 token，从 toolResult 截断，拆散工具调用与结果。",
        "把分支摘要当作合并两条完整历史，或宣称压缩删除了原始记录。"
      ],
      "sources": [
        {
          "title": "压缩触发、边界、恢复与扩展契约",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/compaction.md"
        },
        {
          "title": "当前 compaction 实现",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/compaction/compaction.ts"
        },
        {
          "title": "分支摘要收集与生成",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/compaction/branch-summarization.ts"
        },
        {
          "title": "摘要 entry 与上下文重建实现",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/session-manager.ts"
        }
      ],
      "migration": "完整按当前规范投影、系统检查点和摘要预算讲解；保留仍成立的 16384/20000 默认值，同时说明它们与按模型设置、摘要输出上限的区别。",
      "copy": "<p class=\"chapter-summary\">学习当前压缩的触发、合法切点、系统检查点与摘要累计机制，再把它和离开分支时的信息交接分开。<\/p>\n<section class=\"lesson-section\"><h4>阈值决定何时压缩，不决定摘要写多长<\/h4>\n<p>默认条件仍是 contextTokens 大于 contextWindow 减 reserveTokens，默认 reserveTokens 为 16384，可由用户、项目和按模型设置调整。它决定何时开始压缩，不是摘要输出上限；当前摘要请求按模型输出能力和剩余窗口共同约束，不能把 reserveTokens 直接当 maxTokens。<\/p>\n<p>会话会在新用户输入前检查，也会在工具结果追加后、下一响应准备阶段检查规范投影。若本批工具已终止运行且没有排队输入要求继续，就跳过该轮间检查。手工 /compact 可以附带说明；溢出和部分 length 情况另外走一次恢复尝试。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>切点必须留下完整的调用关系<\/h4>\n<p>算法从当前投影往前估算，默认保留约 20000 个近期 token，再摘要较旧部分。优先按用户消息跨度切分；一个跨度本身过大时，可从 assistant 消息切开，将前缀单独摘要。合法边界不会落在 toolResult 上，否则模型会看见结果却失去发起调用的 assistant。<\/p>\n<p>一次压缩追加 CompactionEntry，记录 summary、firstKeptEntryId、tokensBefore 和可用的 usage，还保存压缩边界的系统提示与工具检查点。后续上下文由该检查点、摘要、保留区间和新 entries 重建。原始历史继续存在，保留范围为空时 firstKeptEntryId 指向该压缩 entry 自身。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>重复压缩处理的是投影，不是原始文件切片<\/h4>\n<p>再次压缩时，从上次保留边界接着摘要，并把上一份摘要作为迭代上下文；不应从上一条 compaction 的物理位置盲目切片。被 context_edit 省略的原始条目不参与切点、摘要和窗口估算，tokensBefore 也要按重建后的实际投影计算。<\/p>\n<p>默认摘要保留目标、约束、进展、关键决定和下一步，压缩摘要还包含继续任务必需的关键背景。序列化不包含 thinking 块，并截断过长工具结果以控制摘要请求体积。读写文件清单会在 Pi 默认摘要间累计；扩展自供摘要的 details 需要由扩展自己维护。<\/p>\n<\/section>\n<section class=\"lesson-section\"><h4>离开分支时，摘要负责交接另一条路径<\/h4>\n<p>/tree 导航可把从旧 leaf 到共同祖先之间、不会出现在新活动路径中的工作做成 branch_summary。它的 parentId 指向新分支续接位置，fromId 记录离开的旧 leaf。这个摘要解决切换路径后的信息交接；compaction 解决当前路径的窗口压力，两者不能互相替代。<\/p>\n<p>扩展可通过 session_before_compact 取消或自供摘要，通过失败事件观察压缩终态，也可参与树导航摘要。无论默认还是自供摘要，都应保留能验证的完成事项、未解决问题和原始证据位置；摘要只是工作交接材料，无法保证模型没有遗漏或曲解。<\/p>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>以为 reserveTokens 就是摘要请求固定输出上限。<\/li><li>为了省 token，从 toolResult 截断，拆散工具调用与结果。<\/li><li>把分支摘要当作合并两条完整历史，或宣称压缩删除了原始记录。<\/li><\/ul><\/section>",
      "labHtml": "<h4>手工摘要探针：比较压缩与离开分支<\/h4>\n<p>用内存 SessionManager 验证摘要 entry 的上下文重建语义；手工提供摘要，隔离掉模型质量和计费变量。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>在已准备 @earendil-works/pi-coding-agent@1.5.0 的临时 Node 项目保存 summary-projection.mjs。<\/li><li>运行代码：第一份会话追加 compaction 并保留新消息；第二份会话从共同祖先建立带摘要的新分支。<\/li><li>核对原始哨兵记录仍可读取，却不直接进入新上下文；再检查 firstKeptEntryId、parentId、fromId 的含义。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &#x27;node:assert/strict&#x27;;\nimport { SessionManager } from &#x27;@earendil-works/pi-coding-agent&#x27;;\nconst user = content =&gt; ({ role: &#x27;user&#x27;, content, timestamp: 0 });\nconst compacted = SessionManager.inMemory();\nconst oldId = compacted.appendMessage(user(&#x27;OLD_RAW_SENTINEL&#x27;));\nconst keptId = compacted.appendMessage(user(&#x27;continue with the query test&#x27;));\nconst compactId = compacted.appendCompaction(&#x27;Earlier work chose SQLite.&#x27;, keptId, 1234);\nconst projected = JSON.stringify(compacted.buildSessionContext().messages);\nassert.equal(compacted.getEntry(oldId).message.content, &#x27;OLD_RAW_SENTINEL&#x27;);\nassert.equal(compacted.getEntry(compactId).firstKeptEntryId, keptId);\nassert.ok(projected.includes(&#x27;Earlier work chose SQLite.&#x27;));\nassert.ok(projected.includes(&#x27;continue with the query test&#x27;));\nassert.ok(!projected.includes(&#x27;OLD_RAW_SENTINEL&#x27;));\nconst branched = SessionManager.inMemory();\nconst common = branched.appendMessage(user(&#x27;shared goal&#x27;));\nconst oldLeaf = branched.appendMessage(user(&#x27;LEFT_RAW_SENTINEL&#x27;));\nconst summaryId = branched.branchWithSummary(common, &#x27;Approach A was explored.&#x27;, undefined, true);\nconst summary = branched.getEntry(summaryId);\nassert.equal(summary.parentId, common);\nassert.equal(summary.fromId, oldLeaf);\nassert.equal(branched.getEntry(oldLeaf).message.content, &#x27;LEFT_RAW_SENTINEL&#x27;);\nconst newContext = JSON.stringify(branched.buildSessionContext().messages);\nassert.ok(newContext.includes(&#x27;Approach A was explored.&#x27;));\nassert.ok(!newContext.includes(&#x27;LEFT_RAW_SENTINEL&#x27;));\nconsole.log(JSON.stringify({ compactionRebuilt: true, branchSummaryLinked: true, rawHistoryPreserved: true }));\n<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>compaction 投影包含手工摘要与保留的新消息，不包含旧哨兵原文；旧 entry 仍存在。<\/li><li>branch_summary 的 parentId 为共同祖先，fromId 为离开的 leaf，新路径只携带它的摘要而不复制旧路径原文。<\/li><\/ul>\n<p><strong>验收：<\/strong>所有断言通过且退出码 0；能够解释“模型没看见原文”和“原文已经删除”的区别。<\/p>\n<p class=\"lab-note\">固定版依赖已准备后无需网络或模型账户。本探针不执行 /compact、不调用摘要模型，不验证自动切点、真实 token 估算或 LLM 摘要质量；这些需要另做 provider 集成测试。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/compaction.md\" target=\"_blank\" rel=\"noreferrer\">压缩触发、边界、恢复与扩展契约 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/compaction/compaction.ts\" target=\"_blank\" rel=\"noreferrer\">当前 compaction 实现 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/compaction/branch-summarization.ts\" target=\"_blank\" rel=\"noreferrer\">分支摘要收集与生成 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/session-manager.ts\" target=\"_blank\" rel=\"noreferrer\">摘要 entry 与上下文重建实现 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/10.md"
    },
    {
      "number": 11,
      "id": "chapter-11",
      "tag": "SESSION / CONTEXT",
      "title": "会话树、上下文编辑与 CLI 恢复",
      "summary": "把磁盘原始历史、当前分支和下一次模型上下文分开，才能解释回退、压缩和恢复。Pi v1.5.0 的 ContextEditEntry 改变后续模型投影，不擦除原始记录，也不回滚已经发生的文件或网络副作用。",
      "questions": [
        "同一 JSONL 保存多个分支时，为什么不能把所有 message 按时间拼给模型？",
        "把一条工具结果从上下文隐藏后，原文、用量和外部文件分别会怎样？",
        "Multica 记录了 Pi 会话标识，为什么换一台 runtime 仍可能无法续接？"
      ],
      "sections": [
        {
          "title": "一份文件保存历史，一条路径组成当前现场",
          "paragraphs": [
            "CLI 默认把会话放在 `~/.pi/agent/sessions/--<path>--/`。表头记录版本、会话 ID 与 cwd；其余条目用 `id/parentId` 连接。当前 leaf 到根的路径决定活动分支；切换 leaf 后追加，形成另一条路径，旧条目继续保留。表头的会话 ID 不是树节点的 ID。",
            "`/tree` 在当前文件内导航；`/fork`、`/clone` 可创建关联的新会话。恢复是按记录重建上下文，不是重新执行过去每个 bash。修改代码后的分支切换不会自动把工作目录恢复到旧版本，文件回滚应由 Git 或快照单独完成。"
          ],
          "bullets": [
            "区分：全量原始条目、active branch、模型可见 messages。",
            "`custom`、`usage`、`context_edit` 不各自产生一条普通模型消息。"
          ]
        },
        {
          "title": "ContextEditEntry 是追加的投影变更",
          "paragraphs": [
            "`appendContextEdit(targetId, {content: ...})` 给当前分支上的可编辑消息追加替换；传 `null` 则使目标不参与未来上下文。可编辑目标包括 user、assistant、toolResult 和 custom_message。连续修改同一目标时，当前活动路径上最后一次生效。",
            "`buildSessionProjection()` 把编辑应用到消息内容；目标的角色、来源和账务元数据保留。回到编辑之前的分支，原内容重新参与上下文。压缩另由 CompactionEntry 的摘要、系统检查点和 `firstKeptEntryId` 控制，不能把编辑理解为截断整个日志。"
          ],
          "bullets": [
            "原始文件、UI、导出和会话计费保留原记录；隐藏上下文不等于脱敏删除。",
            "编辑必须指向活动分支上的上下文消息，不能任意修改另一分支或 usage 条目。"
          ]
        },
        {
          "title": "恢复要核对路径、进程和真实副作用",
          "paragraphs": [
            "`pi --continue` 继续当前目录最近会话；`pi --resume` 打开选择器；`pi --session <path|id>` 打开指定会话，恢复到其记录的 cwd。`--session-dir` 覆盖查找和存储位置，`--no-session` 则仅在内存中保存。迁移电脑时，只有会话标识还不够，文件、原 cwd 和所需工具也必须可访问。",
            "先检查会话文件与工作目录，再检查 provider 配置与凭证，最后验证真实产物。对发送消息、收费、远端写入等动作，恢复前核对外部结果；CLI JSONL 会话不能提供这些动作的 exactly-once 保证。"
          ],
          "bullets": [
            "SDK 内存实验验证投影和分支；磁盘续接要另在临时项目检查。",
            "不要把 CLI 的 SessionManager 与第 12 章独立 Durable 存储 API 混用。"
          ]
        }
      ],
      "lab": {
        "title": "不调用模型，验证编辑只影响活动分支",
        "objective": "用 v1.5.0 的真实 SessionManager API 同时观察原历史、编辑后的上下文、编辑前的分支。",
        "steps": [
          "在独立实验目录预先准备 `@earendil-works/pi-coding-agent@1.5.0` 依赖，Node 至少 22.19；本实验不需要模型凭证。",
          "把代码保存为 `session-projection.mjs`，执行 `node session-projection.mjs`。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from \"node:assert/strict\";\nimport { SessionManager } from \"@earendil-works/pi-coding-agent\";\n\nconst session = SessionManager.inMemory();\nconst original = \"原记录 A\";\nconst first = session.appendMessage({ role: \"user\", content: original, timestamp: Date.now() });\nsession.appendMessage({ role: \"user\", content: \"另一条消息\", timestamp: Date.now() });\nsession.appendContextEdit(first, { content: \"未来模型只见 B\" });\nconst editedLeaf = session.getLeafId();\nassert.equal(session.buildSessionContext().messages[0].content, \"未来模型只见 B\");\nassert.equal(session.getEntries().find((entry) => entry.id === first).message.content, original);\n\nsession.branch(first);\nsession.appendMessage({ role: \"user\", content: \"从编辑之前分叉\", timestamp: Date.now() });\nassert.equal(session.buildSessionContext().messages[0].content, original);\nsession.branch(editedLeaf);\nassert.equal(session.buildSessionContext().messages[0].content, \"未来模型只见 B\");\nconsole.log(\"PASS: raw history preserved; context edits are branch-relative\");",
        "expected": [
          "断言全部通过，输出 PASS。",
          "全量条目中的第一条仍是“原记录 A”，编辑后的模型上下文为 B。",
          "回到编辑前分支时可见 A；返回编辑后的 leaf 时再次可见 B。"
        ],
        "verification": "比较 `getEntries()` 与 `buildSessionContext()` 的输出；内存实验不证明磁盘耐久性，也不验证外部副作用恢复。",
        "requires": "offline",
        "notes": "本轮已在 Node 22.23.2 与预装 v1.5.0 SDK 中离线实跑通过；不需要模型凭证。不要拿真实密钥测试“隐藏后是否还在原日志”。 可选扩展（需要真实模型凭证，未计入本章离线通过）：另用已登录的 CLI 在临时目录创建一条会话，退出后用 `pi --session <实际JSONL路径>` 续接，并检查恢复的 cwd；这一步会发模型请求。"
      },
      "pitfalls": [
        "把 context_edit 当成原始记录删除，误以为分享会话已无敏感信息。",
        "只改 leaf 就期待已经写入的代码或数据库跟着回滚。",
        "跨机器只复制 session ID，却缺失 JSONL、cwd 或 provider 配置。"
      ],
      "sources": [
        {
          "title": "v1.5.0 Session format 与 ContextEditEntry",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/session-format.md"
        },
        {
          "title": "v1.5.0 SessionManager 实现",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/session-manager.ts"
        },
        {
          "title": "v1.5.0 CLI session 参数",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/cli.md#sessions"
        }
      ],
      "migration": "8 月关于 JSONL 树的基本判断仍成立；本章补入 v1.5.0 的分支相对 context_edit、系统检查点和当前恢复参数。旧会话继续由 CLI 迁移，不应把其文件直接交给 pi-durable。",
      "copy": "<p class=\"chapter-summary\">把磁盘原始历史、当前分支和下一次模型上下文分开，才能解释回退、压缩和恢复。Pi v1.5.0 的 ContextEditEntry 改变后续模型投影，不擦除原始记录，也不回滚已经发生的文件或网络副作用。<\/p>\n<section class=\"lesson-section\"><h4>一份文件保存历史，一条路径组成当前现场<\/h4>\n<p>CLI 默认把会话放在 <code>~/.pi/agent/sessions/--&lt;path&gt;--/<\/code>。表头记录版本、会话 ID 与 cwd；其余条目用 <code>id/parentId<\/code> 连接。当前 leaf 到根的路径决定活动分支；切换 leaf 后追加，形成另一条路径，旧条目继续保留。表头的会话 ID 不是树节点的 ID。<\/p>\n<p><code>/tree<\/code> 在当前文件内导航；<code>/fork<\/code>、<code>/clone<\/code> 可创建关联的新会话。恢复是按记录重建上下文，不是重新执行过去每个 bash。修改代码后的分支切换不会自动把工作目录恢复到旧版本，文件回滚应由 Git 或快照单独完成。<\/p>\n<ul><li>区分：全量原始条目、active branch、模型可见 messages。<\/li><li><code>custom<\/code>、<code>usage<\/code>、<code>context_edit<\/code> 不各自产生一条普通模型消息。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>ContextEditEntry 是追加的投影变更<\/h4>\n<p><code>appendContextEdit(targetId, {content: ...})<\/code> 给当前分支上的可编辑消息追加替换；传 <code>null<\/code> 则使目标不参与未来上下文。可编辑目标包括 user、assistant、toolResult 和 custom_message。连续修改同一目标时，当前活动路径上最后一次生效。<\/p>\n<p><code>buildSessionProjection()<\/code> 把编辑应用到消息内容；目标的角色、来源和账务元数据保留。回到编辑之前的分支，原内容重新参与上下文。压缩另由 CompactionEntry 的摘要、系统检查点和 <code>firstKeptEntryId<\/code> 控制，不能把编辑理解为截断整个日志。<\/p>\n<ul><li>原始文件、UI、导出和会话计费保留原记录；隐藏上下文不等于脱敏删除。<\/li><li>编辑必须指向活动分支上的上下文消息，不能任意修改另一分支或 usage 条目。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>恢复要核对路径、进程和真实副作用<\/h4>\n<p><code>pi --continue<\/code> 继续当前目录最近会话；<code>pi --resume<\/code> 打开选择器；<code>pi --session &lt;path|id&gt;<\/code> 打开指定会话，恢复到其记录的 cwd。<code>--session-dir<\/code> 覆盖查找和存储位置，<code>--no-session<\/code> 则仅在内存中保存。迁移电脑时，只有会话标识还不够，文件、原 cwd 和所需工具也必须可访问。<\/p>\n<p>先检查会话文件与工作目录，再检查 provider 配置与凭证，最后验证真实产物。对发送消息、收费、远端写入等动作，恢复前核对外部结果；CLI JSONL 会话不能提供这些动作的 exactly-once 保证。<\/p>\n<ul><li>SDK 内存实验验证投影和分支；磁盘续接要另在临时项目检查。<\/li><li>不要把 CLI 的 SessionManager 与第 12 章独立 Durable 存储 API 混用。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>把 context_edit 当成原始记录删除，误以为分享会话已无敏感信息。<\/li><li>只改 leaf 就期待已经写入的代码或数据库跟着回滚。<\/li><li>跨机器只复制 session ID，却缺失 JSONL、cwd 或 provider 配置。<\/li><\/ul><\/section>",
      "labHtml": "<h4>不调用模型，验证编辑只影响活动分支<\/h4>\n<p>用 v1.5.0 的真实 SessionManager API 同时观察原历史、编辑后的上下文、编辑前的分支。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>在独立实验目录预先准备 <code>@earendil-works/pi-coding-agent@1.5.0<\/code> 依赖，Node 至少 22.19；本实验不需要模型凭证。<\/li><li>把代码保存为 <code>session-projection.mjs<\/code>，执行 <code>node session-projection.mjs<\/code>。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &quot;node:assert/strict&quot;;\nimport { SessionManager } from &quot;@earendil-works/pi-coding-agent&quot;;\n\nconst session = SessionManager.inMemory();\nconst original = &quot;原记录 A&quot;;\nconst first = session.appendMessage({ role: &quot;user&quot;, content: original, timestamp: Date.now() });\nsession.appendMessage({ role: &quot;user&quot;, content: &quot;另一条消息&quot;, timestamp: Date.now() });\nsession.appendContextEdit(first, { content: &quot;未来模型只见 B&quot; });\nconst editedLeaf = session.getLeafId();\nassert.equal(session.buildSessionContext().messages[0].content, &quot;未来模型只见 B&quot;);\nassert.equal(session.getEntries().find((entry) =&gt; entry.id === first).message.content, original);\n\nsession.branch(first);\nsession.appendMessage({ role: &quot;user&quot;, content: &quot;从编辑之前分叉&quot;, timestamp: Date.now() });\nassert.equal(session.buildSessionContext().messages[0].content, original);\nsession.branch(editedLeaf);\nassert.equal(session.buildSessionContext().messages[0].content, &quot;未来模型只见 B&quot;);\nconsole.log(&quot;PASS: raw history preserved; context edits are branch-relative&quot;);<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>断言全部通过，输出 PASS。<\/li><li>全量条目中的第一条仍是“原记录 A”，编辑后的模型上下文为 B。<\/li><li>回到编辑前分支时可见 A；返回编辑后的 leaf 时再次可见 B。<\/li><\/ul>\n<p><strong>验收：<\/strong>比较 <code>getEntries()<\/code> 与 <code>buildSessionContext()<\/code> 的输出；内存实验不证明磁盘耐久性，也不验证外部副作用恢复。<\/p>\n<p class=\"lab-note\">本轮已在 Node 22.23.2 与预装 v1.5.0 SDK 中离线实跑通过；不需要模型凭证。不要拿真实密钥测试“隐藏后是否还在原日志”。 可选扩展（需要真实模型凭证，未计入本章离线通过）：另用已登录的 CLI 在临时目录创建一条会话，退出后用 <code>pi --session &lt;实际JSONL路径&gt;<\/code> 续接，并检查恢复的 cwd；这一步会发模型请求。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/session-format.md\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 Session format 与 ContextEditEntry ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/core/session-manager.ts\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 SessionManager 实现 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/cli.md#sessions\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 CLI session 参数 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/11.md"
    },
    {
      "number": 12,
      "id": "chapter-12",
      "tag": "DURABLE / EXPERIMENTAL",
      "title": "独立 Pi Durable：任务检查点、存储与崩溃恢复",
      "summary": "v1.5.0 的持久任务路线在独立的 @earendil-works/pi-durable。它把对话、任务状态与应用文档提交到存储；API 仍标 Experimental，默认终端 CLI 没有自动换用这套引擎。",
      "questions": [
        "一个工具在“外部动作成功、结果尚未提交”之间崩溃，为什么仍需要幂等键？",
        "MemoryStorage、SQLite 和 JSONL 分别能保住哪些状态，谁负责单一写入者？",
        "为什么一个 JavaScript Promise 或内存变量不能充当跨进程任务检查点？"
      ],
      "sections": [
        {
          "title": "先分开 Conversation、Task 和 Document",
          "paragraphs": [
            "`Harness.open(storage, {models, registry}, context)` 打开持久 Session；`harness.root(context)` 取得同一个根对话。Conversation 保存 transcript；Document 保存类型化 JSON 状态；Task 是有版本、phase 与 checkpoint 的持久状态机。`conversation.commit()` 可把追加条目、文档变更和创建任务放在同一个原子提交。",
            "任务定义由 registry 的扩展提供；存储保存名字与状态，不替你保存程序代码。恢复进程要装回相容任务定义；缺失或不能迁移的定义会阻塞任务。`requestId` 可去重重复输入提交，但不自动去重任务里面的外部写操作。"
          ],
          "bullets": [
            "`pi.generation` 调模型并拥有其 `pi.tool` 子任务。",
            "需要重启后继续使用的数据，应进入 checkpoint、文档或任务结果。"
          ]
        },
        {
          "title": "恢复从提交点继续，副作用要另作保证",
          "paragraphs": [
            "`resume()`、提交输入或等待任务会启动调度。phase 在重启后可能从头执行，所以先保存意图，再执行外部动作，再保存结果；等待时间用 `sleepUntil()` 结束当前 phase，把下一 phase 的 checkpoint 一起持久化。",
            "工具只有声明 `replay: \"safe\"` 才会在进程中断后重跑；否则给模型 interrupted 错误及已提交输出。即使标为 safe，外部系统仍应使用稳定幂等键。持续崩溃受 restartLimit 约束，不能把自动恢复描述成无限重试或任意步骤只执行一次。"
          ],
          "bullets": [
            "任务状态提交与外部邮件、支付、数据库写入不属于同一事务。",
            "进度输出可能延迟落盘；默认约 1 秒的未持久窗口，不能声称每个已显示字符都抗崩溃。"
          ]
        },
        {
          "title": "选择后端，同时定义存储所有权",
          "paragraphs": [
            "MemoryStorage 不持久化。SQLite 的 WAL/NORMAL 可承受进程崩溃，但最新提交在断电或宿主故障时仍可能丢失。JSONL 提供追加日志与可选 fsync，且把全量历史留在内存中；长任务通常更适合 SQLite。浏览器还有 IndexedDB，服务端有 Cloudflare Durable Object 适配。",
            "一份 storage 同时由一个进程拥有，库不提供跨进程锁。多个 worker 不应随意打开同一目录抢任务；只读观察者使用 readOnly，不能调用 resume 或写入。实验性版本升级要先备份并在副本演练定义与存储兼容。"
          ],
          "bullets": [
            "CLI JSONL 会话树与 Durable 的 JSONL 存储不是同一格式。",
            "关闭进程与突然崩溃的恢复细节不同，验收时要分别记录故障注入点。"
          ]
        }
      ],
      "lab": {
        "title": "保存睡眠检查点，结束进程后重新启动",
        "objective": "不用模型和外部副作用，通过真实 JSONL storage 验证任务跨两个 Node 进程恢复。",
        "steps": [
          "在独立 Node 项目准备 `@earendil-works/pi-durable@1.5.0`、`@earendil-works/pi-ai@1.5.0` 与 `@earendil-works/chord@1.5.0`，Node 至少 22.19。",
          "保存为 `durable-recovery.mjs`。用一个全新目录执行 `node durable-recovery.mjs crash ./recovery-lab`；预期以 77 退出，这是实验故障注入。",
          "再执行 `node durable-recovery.mjs resume ./recovery-lab`。保留目录检查证据，不同时启动第二个写入进程。"
        ],
        "codeLanguage": "javascript",
        "code": "import assert from \"node:assert/strict\";\nimport { existsSync } from \"node:fs\";\nimport { mkdir, readFile, writeFile } from \"node:fs/promises\";\nimport { join, resolve } from \"node:path\";\nimport { BACKGROUND_CONTEXT } from \"@earendil-works/chord/context\";\nimport { createModels } from \"@earendil-works/pi-ai/models\";\nimport { createRegistry, defineExtension, defineTask, Harness } from \"@earendil-works/pi-durable\";\nimport { openNodeJsonlStorage } from \"@earendil-works/pi-durable/storage/jsonl/node\";\n\nconst mode = process.argv[2];\nif (![\"crash\", \"resume\"].includes(mode)) throw new Error(\"Choose crash or resume\");\nconst directory = resolve(process.argv[3] ?? \"./recovery-lab\");\nawait mkdir(directory, { recursive: true });\nconst idFile = join(directory, \"task-id.json\");\nconst context = BACKGROUND_CONTEXT;\nconst Probe = defineTask({\n  name: \"lab.recovery\", version: 1,\n  initial: () => ({ phase: \"prepare\" }),\n  phases: {\n    prepare: async (_task, runtime, ctx) => {\n      await runtime.sleepUntil(runtime.now() + 1000, { phase: \"finish\" }, ctx);\n      console.log(\"sleep checkpoint committed\");\n      if (mode === \"crash\") process.exit(77);\n    },\n    finish: (_task, runtime, ctx) => runtime.commit(\n      () => ({ status: \"terminal\", outcome: { status: \"completed\", result: \"recovered\" } }), ctx),\n  },\n  abort: (_task, runtime, ctx) => runtime.commit(\n    () => ({ status: \"terminal\", outcome: { status: \"aborted\" } }), ctx),\n});\nconst registry = createRegistry();\nregistry.install(defineExtension({ name: \"recovery-lab\", tasks: [Probe] }));\nconst storage = await openNodeJsonlStorage(join(directory, \"store\"), context, { fsync: true });\nconst harness = await Harness.open(storage, { models: createModels(), registry }, context);\nlet id;\nif (mode === \"crash\") {\n  if (existsSync(idFile)) throw new Error(\"Use a fresh experiment directory\");\n  const root = await harness.root(context);\n  id = await root.commit((tx) => tx.createTask(Probe, null, { ownership: { kind: \"conversation\" } }), context);\n  await writeFile(idFile, JSON.stringify(id));\n} else {\n  id = JSON.parse(await readFile(idFile, \"utf8\"));\n}\nconst record = await harness.waitForTask(id, context);\nassert.equal(record.state.status, \"terminal\");\nassert.equal(record.state.outcome.status, \"completed\");\nassert.equal(record.state.outcome.result, \"recovered\");\nconsole.log(\"PASS: same task recovered\", id);\nawait harness.close(context);",
        "expected": [
          "首次输出 sleep checkpoint committed，进程退出码为 77。",
          "第二次以保存的同一 task ID 完成，输出 PASS 与 recovered。",
          "未注册任何模型 provider，不产生模型 API 请求；存储与 task-id.json 保留。"
        ],
        "verification": "记录两次进程退出码、同一 task ID、terminal/completed 结果。它验证已提交 checkpoint 的恢复，不证明外部支付或邮件的 exactly-once。",
        "requires": "offline",
        "notes": "本轮在 Node 22.23.2 与预装 v1.5.0 依赖中实跑：首次退出 77，第二次恢复同一 task ID 并 completed；没有模型请求。TaskId 按 JSON 保存与读取，保留其原始类型。"
      },
      "pitfalls": [
        "给有外部副作用的工具加 replay:safe，却没有业务幂等键。",
        "用 MemoryStorage 做测试后声称断进程仍可恢复。",
        "让多个进程同时写同一 storage，或把 readOnly 当可调度副本。",
        "把 TaskId 假定为字符串；应保存并恢复原始 ID 类型。"
      ],
      "sources": [
        {
          "title": "v1.5.0 Durable API 与存储限制",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/README.md"
        },
        {
          "title": "v1.5.0 官方恢复实验",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/test/examples/12-recovery.ts"
        },
        {
          "title": "v1.5.0 JSONL Node 适配入口",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/src/storage/jsonl/node.ts"
        }
      ],
      "migration": "从 v1.0.0 起，旧 core 实验 Harness 导出已拆除。本章以独立 pi-durable 的 Harness/Conversation/Task/Document API 重写；不要继续照抄 8 月 core AgentHarness 接口。",
      "copy": "<p class=\"chapter-summary\">v1.5.0 的持久任务路线在独立的 @earendil-works/pi-durable。它把对话、任务状态与应用文档提交到存储；API 仍标 Experimental，默认终端 CLI 没有自动换用这套引擎。<\/p>\n<section class=\"lesson-section\"><h4>先分开 Conversation、Task 和 Document<\/h4>\n<p><code>Harness.open(storage, {models, registry}, context)<\/code> 打开持久 Session；<code>harness.root(context)<\/code> 取得同一个根对话。Conversation 保存 transcript；Document 保存类型化 JSON 状态；Task 是有版本、phase 与 checkpoint 的持久状态机。<code>conversation.commit()<\/code> 可把追加条目、文档变更和创建任务放在同一个原子提交。<\/p>\n<p>任务定义由 registry 的扩展提供；存储保存名字与状态，不替你保存程序代码。恢复进程要装回相容任务定义；缺失或不能迁移的定义会阻塞任务。<code>requestId<\/code> 可去重重复输入提交，但不自动去重任务里面的外部写操作。<\/p>\n<ul><li><code>pi.generation<\/code> 调模型并拥有其 <code>pi.tool<\/code> 子任务。<\/li><li>需要重启后继续使用的数据，应进入 checkpoint、文档或任务结果。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>恢复从提交点继续，副作用要另作保证<\/h4>\n<p><code>resume()<\/code>、提交输入或等待任务会启动调度。phase 在重启后可能从头执行，所以先保存意图，再执行外部动作，再保存结果；等待时间用 <code>sleepUntil()<\/code> 结束当前 phase，把下一 phase 的 checkpoint 一起持久化。<\/p>\n<p>工具只有声明 <code>replay: &quot;safe&quot;<\/code> 才会在进程中断后重跑；否则给模型 interrupted 错误及已提交输出。即使标为 safe，外部系统仍应使用稳定幂等键。持续崩溃受 restartLimit 约束，不能把自动恢复描述成无限重试或任意步骤只执行一次。<\/p>\n<ul><li>任务状态提交与外部邮件、支付、数据库写入不属于同一事务。<\/li><li>进度输出可能延迟落盘；默认约 1 秒的未持久窗口，不能声称每个已显示字符都抗崩溃。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>选择后端，同时定义存储所有权<\/h4>\n<p>MemoryStorage 不持久化。SQLite 的 WAL/NORMAL 可承受进程崩溃，但最新提交在断电或宿主故障时仍可能丢失。JSONL 提供追加日志与可选 fsync，且把全量历史留在内存中；长任务通常更适合 SQLite。浏览器还有 IndexedDB，服务端有 Cloudflare Durable Object 适配。<\/p>\n<p>一份 storage 同时由一个进程拥有，库不提供跨进程锁。多个 worker 不应随意打开同一目录抢任务；只读观察者使用 readOnly，不能调用 resume 或写入。实验性版本升级要先备份并在副本演练定义与存储兼容。<\/p>\n<ul><li>CLI JSONL 会话树与 Durable 的 JSONL 存储不是同一格式。<\/li><li>关闭进程与突然崩溃的恢复细节不同，验收时要分别记录故障注入点。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>给有外部副作用的工具加 replay:safe，却没有业务幂等键。<\/li><li>用 MemoryStorage 做测试后声称断进程仍可恢复。<\/li><li>让多个进程同时写同一 storage，或把 readOnly 当可调度副本。<\/li><li>把 TaskId 假定为字符串；应保存并恢复原始 ID 类型。<\/li><\/ul><\/section>",
      "labHtml": "<h4>保存睡眠检查点，结束进程后重新启动<\/h4>\n<p>不用模型和外部副作用，通过真实 JSONL storage 验证任务跨两个 Node 进程恢复。<\/p>\n<p class=\"lab-requires\">运行条件：离线（需预先安装固定版本依赖）<\/p>\n<ol><li>在独立 Node 项目准备 <code>@earendil-works/pi-durable@1.5.0<\/code>、<code>@earendil-works/pi-ai@1.5.0<\/code> 与 <code>@earendil-works/chord@1.5.0<\/code>，Node 至少 22.19。<\/li><li>保存为 <code>durable-recovery.mjs<\/code>。用一个全新目录执行 <code>node durable-recovery.mjs crash ./recovery-lab<\/code>；预期以 77 退出，这是实验故障注入。<\/li><li>再执行 <code>node durable-recovery.mjs resume ./recovery-lab<\/code>。保留目录检查证据，不同时启动第二个写入进程。<\/li><\/ol>\n<pre><code class=\"language-javascript\">import assert from &quot;node:assert/strict&quot;;\nimport { existsSync } from &quot;node:fs&quot;;\nimport { mkdir, readFile, writeFile } from &quot;node:fs/promises&quot;;\nimport { join, resolve } from &quot;node:path&quot;;\nimport { BACKGROUND_CONTEXT } from &quot;@earendil-works/chord/context&quot;;\nimport { createModels } from &quot;@earendil-works/pi-ai/models&quot;;\nimport { createRegistry, defineExtension, defineTask, Harness } from &quot;@earendil-works/pi-durable&quot;;\nimport { openNodeJsonlStorage } from &quot;@earendil-works/pi-durable/storage/jsonl/node&quot;;\n\nconst mode = process.argv[2];\nif (![&quot;crash&quot;, &quot;resume&quot;].includes(mode)) throw new Error(&quot;Choose crash or resume&quot;);\nconst directory = resolve(process.argv[3] ?? &quot;./recovery-lab&quot;);\nawait mkdir(directory, { recursive: true });\nconst idFile = join(directory, &quot;task-id.json&quot;);\nconst context = BACKGROUND_CONTEXT;\nconst Probe = defineTask({\n  name: &quot;lab.recovery&quot;, version: 1,\n  initial: () =&gt; ({ phase: &quot;prepare&quot; }),\n  phases: {\n    prepare: async (_task, runtime, ctx) =&gt; {\n      await runtime.sleepUntil(runtime.now() + 1000, { phase: &quot;finish&quot; }, ctx);\n      console.log(&quot;sleep checkpoint committed&quot;);\n      if (mode === &quot;crash&quot;) process.exit(77);\n    },\n    finish: (_task, runtime, ctx) =&gt; runtime.commit(\n      () =&gt; ({ status: &quot;terminal&quot;, outcome: { status: &quot;completed&quot;, result: &quot;recovered&quot; } }), ctx),\n  },\n  abort: (_task, runtime, ctx) =&gt; runtime.commit(\n    () =&gt; ({ status: &quot;terminal&quot;, outcome: { status: &quot;aborted&quot; } }), ctx),\n});\nconst registry = createRegistry();\nregistry.install(defineExtension({ name: &quot;recovery-lab&quot;, tasks: [Probe] }));\nconst storage = await openNodeJsonlStorage(join(directory, &quot;store&quot;), context, { fsync: true });\nconst harness = await Harness.open(storage, { models: createModels(), registry }, context);\nlet id;\nif (mode === &quot;crash&quot;) {\n  if (existsSync(idFile)) throw new Error(&quot;Use a fresh experiment directory&quot;);\n  const root = await harness.root(context);\n  id = await root.commit((tx) =&gt; tx.createTask(Probe, null, { ownership: { kind: &quot;conversation&quot; } }), context);\n  await writeFile(idFile, JSON.stringify(id));\n} else {\n  id = JSON.parse(await readFile(idFile, &quot;utf8&quot;));\n}\nconst record = await harness.waitForTask(id, context);\nassert.equal(record.state.status, &quot;terminal&quot;);\nassert.equal(record.state.outcome.status, &quot;completed&quot;);\nassert.equal(record.state.outcome.result, &quot;recovered&quot;);\nconsole.log(&quot;PASS: same task recovered&quot;, id);\nawait harness.close(context);<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>首次输出 sleep checkpoint committed，进程退出码为 77。<\/li><li>第二次以保存的同一 task ID 完成，输出 PASS 与 recovered。<\/li><li>未注册任何模型 provider，不产生模型 API 请求；存储与 task-id.json 保留。<\/li><\/ul>\n<p><strong>验收：<\/strong>记录两次进程退出码、同一 task ID、terminal/completed 结果。它验证已提交 checkpoint 的恢复，不证明外部支付或邮件的 exactly-once。<\/p>\n<p class=\"lab-note\">本轮在 Node 22.23.2 与预装 v1.5.0 依赖中实跑：首次退出 77，第二次恢复同一 task ID 并 completed；没有模型请求。TaskId 按 JSON 保存与读取，保留其原始类型。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/README.md\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 Durable API 与存储限制 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/test/examples/12-recovery.ts\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 官方恢复实验 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/durable/src/storage/jsonl/node.ts\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 JSONL Node 适配入口 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/12.md"
    },
    {
      "number": 13,
      "id": "chapter-13",
      "tag": "TRUST / PERMISSIONS",
      "title": "信任资源不等于限制权限：真正的安全边界",
      "summary": "Pi 的 project trust 决定加载哪些项目资源，不给每个工具创建权限边界。工具、扩展和子进程通常继承启动用户权限；要保护宿主文件和凭证，必须明确整个进程或各工具实际运行在哪里。",
      "questions": [
        "已拒绝 project trust，为什么 AGENTS.md 仍可能影响模型？",
        "--no-tools 为什么挡不住一个已加载扩展的模块代码？",
        "只把 bash 放进微型虚拟机，与把整个 Pi 放进容器，保护范围差在哪里？"
      ],
      "sections": [
        {
          "title": "Project trust 只控制受保护资源加载",
          "paragraphs": [
            "当前文档保护 `.pi/settings.json`、项目 MCP、extensions、skills、prompts、themes 和系统提示文件，以及项目层 `.agents/skills`。显式 `--approve` 或 `--no-approve` 优先；否则依次由可处理信任事件的扩展、已保存路径决定和全局 defaultProjectTrust 决定。默认 ask 在 print/JSON/RPC 无交互模式下会跳过受保护资源。",
            "它不是完整启动边界：选择会话时会先读取项目 sessionDir；普通 AGENTS.override.md、AGENTS.md、CLAUDE.md 也不受这项项目信任控制，除非关闭上下文加载。拒绝信任不能让仓库里的自然语言自动变可信。"
          ],
          "bullets": [
            "`/trust` 的决定按规范化路径保存在用户 trust.json。",
            "批准资源加载不等于授予一个隔离的“仅此目录”权限。"
          ]
        },
        {
          "title": "工具过滤、Hook 和 QuickJS 各有范围",
          "paragraphs": [
            "`--no-tools` 禁用向模型开放的工具，不阻止已经加载的 TypeScript 扩展在 Pi 进程内读写文件。扩展还能访问提示词、工具参数、凭证和历史；工具前 Hook 可以拦截约定调用，却挡不住扩展自己调用 Node API 或其他拥有同权限的进程。",
            "Codemode 的 QuickJS 没有 Node、文件系统和网络 API，但可调用被提供的工具；bash 的实际权限不会因此降低。`--tools read` 也不自动移除全部 MCP；应结合 `--no-mcp` 或明确 MCP 过滤，按当前 CLI 文档核查暴露集合。"
          ],
          "bullets": [
            "少给工具可减少误操作入口，不能代替操作系统隔离。",
            "显式 -e 加载的扩展与项目自动发现路径不同，要分别审查来源。"
          ]
        },
        {
          "title": "把边界放在可验证的位置",
          "paragraphs": [
            "直接启动 Pi 时，cwd 只影响资源发现和默认工具位置；同一用户能访问的其他目录仍可被进程访问。完整 Pi 跑在容器、虚拟机或 sandbox 中，边界覆盖 Pi、扩展和子进程；宿主 Pi 只把内建工具委托给 Gondolin，则其他扩展仍在宿主。",
            "卷挂载、环境变量和网络决定隔离内仍能触及什么。只读挂载与短期窄权限凭证有明确效果；共享 HOME、挂整个凭证目录或开放网络会扩大暴露。Multica 的普通 run 同样不提供文件系统沙箱，应在 daemon 外设置边界。"
          ],
          "bullets": [
            "先用自建哨兵文件验证边界，不读取真实 SSH key 或个人文件。",
            "会话可能含文件内容、命令结果和凭证；分享前审查原日志。"
          ]
        }
      ],
      "lab": {
        "title": "离线证明 trust 与工具开关是两道不同的控制",
        "objective": "仅在自建临时目录里，验证项目扩展受信任开关控制，而已加载扩展即使无模型工具仍能写入 cwd 之外。",
        "steps": [
          "需要已安装的 Pi v1.5.0 与 Node；下面使用全新的 PI_CODING_AGENT_DIR，不改现有配置和信任记录。",
          "把代码保存为 `trust-lab.sh`，执行 `bash trust-lab.sh`。脚本只创建自身临时目录与实验标记，不发模型请求。",
          "对照两次 help 输出与标记文件；全部材料保留在打印的目录中，供手工检查。"
        ],
        "codeLanguage": "bash",
        "code": "set -eu\nsecurity_lab=\"$(mktemp -d \"${TMPDIR:-/tmp}/pi-trust-lab.XXXXXX\")\"\nmkdir -p \"$security_lab/project/.pi/extensions\" \"$security_lab/agent-home\"\ncat > \"$security_lab/project/.pi/extensions/probe.ts\" <<'EXT'\nimport { writeFileSync } from \"node:fs\";\nimport { resolve } from \"node:path\";\nexport default function () {\n  writeFileSync(resolve(process.cwd(), \"..\", \"extension-loaded.txt\"), \"self-created experiment marker\\n\");\n}\nEXT\n(\n  cd \"$security_lab/project\"\n  PI_CODING_AGENT_DIR=\"$security_lab/agent-home\" pi --offline --no-session --no-approve --no-tools --no-mcp --help > \"$security_lab/declined-help.txt\"\n)\ntest ! -e \"$security_lab/extension-loaded.txt\"\n(\n  cd \"$security_lab/project\"\n  PI_CODING_AGENT_DIR=\"$security_lab/agent-home\" pi --offline --no-session --approve --no-tools --no-mcp --help > \"$security_lab/approved-help.txt\"\n)\ntest -f \"$security_lab/extension-loaded.txt\"\nprintf 'PASS: trust controls loading; no-tools is not a process sandbox\\nEvidence: %s\\n' \"$security_lab\"",
        "expected": [
          "拒绝项目资源时没有标记；批准加载后出现父目录中的实验标记。",
          "两次运行都没有模型工具、MCP 连接和模型请求。",
          "原用户的 ~/.pi/agent 配置与 trust.json 不因本实验被修改。"
        ],
        "verification": "同时检查第一轮标记不存在与第二轮标记存在；只出现一次成功结果不算完成。该实验不声称拒绝信任会阻止所有上下文文件读取。",
        "requires": "installed CLI",
        "notes": "本轮使用隔离目录中的预装 Pi v1.5.0 实跑通过；所有实验文件位于新建临时根目录，未读取用户真实 Pi 配置，未调用模型。help 前会按信任决定加载项目扩展。"
      },
      "pitfalls": [
        "用提示词“不要越界”代替文件系统或网络策略。",
        "以为项目已批准就安全，或拒绝后所有文本都不会加载。",
        "把只隔离内建工具的方案当成整个 Pi 与扩展都已隔离。"
      ],
      "sources": [
        {
          "title": "v1.5.0 Security 与 project trust",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/security.md"
        },
        {
          "title": "v1.5.0 完整进程与工具隔离",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/containerization.md"
        },
        {
          "title": "v1.5.0 扩展权限",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/extensions.md"
        },
        {
          "title": "v1.5.0 启动与 help 资源加载顺序",
          "url": "https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/main.ts"
        }
      ],
      "migration": "旧稿“Pi 无内建逐工具审批/沙箱”的边界仍重要；当前已增加 project trust，必须补上其资源加载作用与明确例外，不能把它误写成全面权限系统。",
      "copy": "<p class=\"chapter-summary\">Pi 的 project trust 决定加载哪些项目资源，不给每个工具创建权限边界。工具、扩展和子进程通常继承启动用户权限；要保护宿主文件和凭证，必须明确整个进程或各工具实际运行在哪里。<\/p>\n<section class=\"lesson-section\"><h4>Project trust 只控制受保护资源加载<\/h4>\n<p>当前文档保护 <code>.pi/settings.json<\/code>、项目 MCP、extensions、skills、prompts、themes 和系统提示文件，以及项目层 <code>.agents/skills<\/code>。显式 <code>--approve<\/code> 或 <code>--no-approve<\/code> 优先；否则依次由可处理信任事件的扩展、已保存路径决定和全局 defaultProjectTrust 决定。默认 ask 在 print/JSON/RPC 无交互模式下会跳过受保护资源。<\/p>\n<p>它不是完整启动边界：选择会话时会先读取项目 sessionDir；普通 AGENTS.override.md、AGENTS.md、CLAUDE.md 也不受这项项目信任控制，除非关闭上下文加载。拒绝信任不能让仓库里的自然语言自动变可信。<\/p>\n<ul><li><code>/trust<\/code> 的决定按规范化路径保存在用户 trust.json。<\/li><li>批准资源加载不等于授予一个隔离的“仅此目录”权限。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>工具过滤、Hook 和 QuickJS 各有范围<\/h4>\n<p><code>--no-tools<\/code> 禁用向模型开放的工具，不阻止已经加载的 TypeScript 扩展在 Pi 进程内读写文件。扩展还能访问提示词、工具参数、凭证和历史；工具前 Hook 可以拦截约定调用，却挡不住扩展自己调用 Node API 或其他拥有同权限的进程。<\/p>\n<p>Codemode 的 QuickJS 没有 Node、文件系统和网络 API，但可调用被提供的工具；bash 的实际权限不会因此降低。<code>--tools read<\/code> 也不自动移除全部 MCP；应结合 <code>--no-mcp<\/code> 或明确 MCP 过滤，按当前 CLI 文档核查暴露集合。<\/p>\n<ul><li>少给工具可减少误操作入口，不能代替操作系统隔离。<\/li><li>显式 -e 加载的扩展与项目自动发现路径不同，要分别审查来源。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>把边界放在可验证的位置<\/h4>\n<p>直接启动 Pi 时，cwd 只影响资源发现和默认工具位置；同一用户能访问的其他目录仍可被进程访问。完整 Pi 跑在容器、虚拟机或 sandbox 中，边界覆盖 Pi、扩展和子进程；宿主 Pi 只把内建工具委托给 Gondolin，则其他扩展仍在宿主。<\/p>\n<p>卷挂载、环境变量和网络决定隔离内仍能触及什么。只读挂载与短期窄权限凭证有明确效果；共享 HOME、挂整个凭证目录或开放网络会扩大暴露。Multica 的普通 run 同样不提供文件系统沙箱，应在 daemon 外设置边界。<\/p>\n<ul><li>先用自建哨兵文件验证边界，不读取真实 SSH key 或个人文件。<\/li><li>会话可能含文件内容、命令结果和凭证；分享前审查原日志。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>用提示词“不要越界”代替文件系统或网络策略。<\/li><li>以为项目已批准就安全，或拒绝后所有文本都不会加载。<\/li><li>把只隔离内建工具的方案当成整个 Pi 与扩展都已隔离。<\/li><\/ul><\/section>",
      "labHtml": "<h4>离线证明 trust 与工具开关是两道不同的控制<\/h4>\n<p>仅在自建临时目录里，验证项目扩展受信任开关控制，而已加载扩展即使无模型工具仍能写入 cwd 之外。<\/p>\n<p class=\"lab-requires\">运行条件：已安装 Pi CLI<\/p>\n<ol><li>需要已安装的 Pi v1.5.0 与 Node；下面使用全新的 PI_CODING_AGENT_DIR，不改现有配置和信任记录。<\/li><li>把代码保存为 <code>trust-lab.sh<\/code>，执行 <code>bash trust-lab.sh<\/code>。脚本只创建自身临时目录与实验标记，不发模型请求。<\/li><li>对照两次 help 输出与标记文件；全部材料保留在打印的目录中，供手工检查。<\/li><\/ol>\n<pre><code class=\"language-bash\">set -eu\nsecurity_lab=&quot;$(mktemp -d &quot;${TMPDIR:-/tmp}/pi-trust-lab.XXXXXX&quot;)&quot;\nmkdir -p &quot;$security_lab/project/.pi/extensions&quot; &quot;$security_lab/agent-home&quot;\ncat &gt; &quot;$security_lab/project/.pi/extensions/probe.ts&quot; &lt;&lt;&#x27;EXT&#x27;\nimport { writeFileSync } from &quot;node:fs&quot;;\nimport { resolve } from &quot;node:path&quot;;\nexport default function () {\n  writeFileSync(resolve(process.cwd(), &quot;..&quot;, &quot;extension-loaded.txt&quot;), &quot;self-created experiment marker\\n&quot;);\n}\nEXT\n(\n  cd &quot;$security_lab/project&quot;\n  PI_CODING_AGENT_DIR=&quot;$security_lab/agent-home&quot; pi --offline --no-session --no-approve --no-tools --no-mcp --help &gt; &quot;$security_lab/declined-help.txt&quot;\n)\ntest ! -e &quot;$security_lab/extension-loaded.txt&quot;\n(\n  cd &quot;$security_lab/project&quot;\n  PI_CODING_AGENT_DIR=&quot;$security_lab/agent-home&quot; pi --offline --no-session --approve --no-tools --no-mcp --help &gt; &quot;$security_lab/approved-help.txt&quot;\n)\ntest -f &quot;$security_lab/extension-loaded.txt&quot;\nprintf &#x27;PASS: trust controls loading; no-tools is not a process sandbox\\nEvidence: %s\\n&#x27; &quot;$security_lab&quot;<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>拒绝项目资源时没有标记；批准加载后出现父目录中的实验标记。<\/li><li>两次运行都没有模型工具、MCP 连接和模型请求。<\/li><li>原用户的 ~/.pi/agent 配置与 trust.json 不因本实验被修改。<\/li><\/ul>\n<p><strong>验收：<\/strong>同时检查第一轮标记不存在与第二轮标记存在；只出现一次成功结果不算完成。该实验不声称拒绝信任会阻止所有上下文文件读取。<\/p>\n<p class=\"lab-note\">本轮使用隔离目录中的预装 Pi v1.5.0 实跑通过；所有实验文件位于新建临时根目录，未读取用户真实 Pi 配置，未调用模型。help 前会按信任决定加载项目扩展。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/security.md\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 Security 与 project trust ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/containerization.md\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 完整进程与工具隔离 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/docs/extensions.md\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 扩展权限 ↗<\/a><\/li><li><a href=\"https://github.com/earendil-works/pi/blob/f9a26365568127461c47a07a37dcb42c140a3ac5/packages/coding-agent/src/main.ts\" target=\"_blank\" rel=\"noreferrer\">v1.5.0 启动与 help 资源加载顺序 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/13.md"
    },
    {
      "number": 14,
      "id": "chapter-14",
      "tag": "MULTICA × PI × MAGPIE",
      "title": "三层实践：Multica、Pi 与 Magpie",
      "summary": "Multica–Pi 与 Magpie–Pi 都有官方适配；完整 Multica → Pi → Magpie → 模型服务的链路仍需联测。本章给出同机基线、配置顺序、故障定位和验收办法，不把三者画在一起就当成已集成成功。",
      "questions": [
        "Multica 选定的模型、Pi 已有会话模型与 Magpie 路由组同时存在时，谁决定这次实际请求？",
        "某个 run 显示完成，为什么仍要核对产物、真实服务模型和续接上下文？",
        "项目 MCP、绑定 skills 与用户本机配置冲突时，应怎样判断谁加载了什么？"
      ],
      "sections": [
        {
          "title": "先冻结版本与职责，再接通两个官方适配",
          "paragraphs": [
            "本章冻结 2026-11-03 21:20:47 上海时间：Pi v1.5.0，Multica v0.8.0，Magpie 默认 latest v0.1.2858、stable v0.1.2115。Magpie 两个渠道分别发布于 11 月 3 日 21:10:10 与 10 月 30 日 07:08:31；不能把源码新 tag 直接当成客户端发布。",
            "Multica 的 daemon 领取任务并调用 Pi，记录 run、日志与交付；Pi 管上下文、模型/工具循环与 CLI 会话；Magpie 管模型连接、协议转换和路由。默认三层同机、同用户先做基线，避免把 PATH、用户配置目录与网关网络问题混在一起。"
          ],
          "bullets": [
            "本轮已核对官方资料与源码，并实跑第 11–13 章离线实验；没有登录账号或运行完整三层链路。",
            "独立 Pi Durable 不会因 Multica 调用了 Pi CLI 就自动启用。"
          ]
        },
        {
          "title": "配置顺序：先单机模型，再 Pi，再 Multica",
          "paragraphs": [
            "第一步在 Magpie 供应商页添加已有凭证，或完成其支持的登录；从 `magpie models` 获取实际可选 ID，再由 `magpie pi <清单中的ID>` 为 Pi 设置模型。不要复制官网示意模型名当作账户必有额度。用 `pi --list-models` 再确认 Pi 自己的完整 provider/model，先测试固定单模型，暂不加路由组和故障转移。",
            "第二步启动全新 Pi 会话，核对响应和 Magpie 路由记录；再续接同一测试会话。第三步让相同机器和用户的 Multica daemon 检测到同一 Pi 可执行文件；重启检测后，新建测试 issue，选择 Pi runtime。先留空 Multica 模型字段使用 Pi 默认值，或刷新 runtime 清单后选完全相同的模型；不要沿用其他后端的模型值。"
          ],
          "bullets": [
            "配置改变通常要新会话/新 run；旧会话续接必须单独验收。",
            "服务启动环境与终端可能不同：核对 PATH、PI_CODING_AGENT_DIR、会话目录及网关进程。",
            "容器里的 127.0.0.1 不是宿主 Magpie；先解决可达地址和访问密钥再继续。"
          ]
        },
        {
          "title": "MCP 与 skills：按当前适配实际加载",
          "paragraphs": [
            "Multica v0.8.0 对 Pi 的受管 MCP 要求 Pi 至少 v0.99.0：它创建临时扩展，通过显式 `--extension` 调用 `registerMcpServer`，不等于信任全部项目资源。绑定 skills 写到 `.pi/skills/` 后逐个显式传 `--skill`；同名已有技能保留，受管副本采用另名。",
            "先只测试基础任务，再逐个增加 MCP 和一项可识别的只读 skill。Pi 自己也加载用户层 MCP；同一服务器由不同管理层重复配置可能造成冲突。不要为排障盲目加 `--approve`、共享凭证目录或关掉边界；先看真实启动参数、扩展错误、运行记录与工具清单。"
          ],
          "bullets": [
            "CLI 路径找不到：同一 daemon 环境核对 command -v，再重新检测；自定义兼容 profile 可设置绝对路径。",
            "模型不生效：查显式模型覆盖、旧会话、enabledModels 与新 run，再对照 Magpie 的实际 served 模型。",
            "续接失败：查原 JSONL/cwd 是否仍在原 runtime；回落新会话不算续接通过。",
            "MCP 缺失：查 Pi 版本、受管扩展错误、本机配置和同名定义；不要只看设置页面。",
            "skill 缺失：查绑定、实际注入名称和 --skill 路径，确认任务能展示一条独有只读规则。",
            "网关报认证或连接错：查 Magpie 是否运行、账户额度和当前用户配置；不要把真实 key 写入 issue。",
            "权限越界：停止加权限，核对 daemon 用户、完整进程隔离、卷挂载和网络边界。"
          ]
        },
        {
          "title": "验收产物，不只验收绿色状态",
          "paragraphs": [
            "给测试 issue 写明确合同：只在指定测试仓库生成 `stack-proof.json`，字段含固定 nonce、输入文件摘要和检查结果；先不访问外部写服务。核对 Multica run ID、Pi 会话路径、Magpie 请求记录与真实文件四者能相互对应，再做同 issue 的一次续接、一次取消/steering 和一项受管能力测试。",
            "只有这些证据齐全，才记录该主机、版本、模型、配置的组合通过；不得推广成所有模型和订阅都兼容。之后一次只加一个变量：路由组、定时触发、Squad 或远端 runtime。run 完成由系统报告，业务验收由任务合同和使用者决定；成本数字只是估算，还要对供应商账单。"
          ],
          "bullets": [
            "三层共同失败时先缩回 Pi → 单模型，再定位模型接入或任务调度。",
            "带副作用的联测必须有幂等键与外部结果核对，避免多层重试重复执行。"
          ]
        }
      ],
      "lab": {
        "title": "固定模型的两段烟雾检查与任务证据合同",
        "objective": "先验证 Pi → Magpie 的新会话和续接，再把同一模型交给 Multica，留下可核对的四层证据。",
        "steps": [
          "前置：三个工具已安装、Magpie 已添加一个可用供应商。运行下方命令；按实际清单输入 ID，不在命令行输入真实 key。",
          "在 Multica 新建测试 agent，绑定本机 Pi runtime，模型留空或选清单中的对应 ID。新建 issue，要求只在测试目录生成 stack-proof.json：nonce=STACK-42、sourceFile=README.md、sha256=文件实际摘要；附检查命令及结果。",
          "首次完成后在同一 issue 追问 STACK-42 的来源，不重复给 nonce；核对 Pi 会话路径是否复用。再单独测试一项 skill、一个只读 MCP 和取消/steering，各记录结果。"
        ],
        "codeLanguage": "bash",
        "code": "set -eu\ncommand -v pi\npi --version\ncommand -v magpie\nmagpie --version\nmagpie models\nread -r -p '复制 magpie models 中一个真实 provider/model：' gateway_model\ntest -n \"$gateway_model\"\nmagpie pi \"$gateway_model\"\npi --offline --list-models\nread -r -p '复制 Pi 清单对应的完整 provider/model：' pi_model\ntest -n \"$pi_model\"\nstack_lab=\"$(mktemp -d \"${TMPDIR:-/tmp}/pi-stack-lab.XXXXXX\")\"\nmkdir -p \"$stack_lab/sessions\"\n(\n  cd \"$stack_lab\"\n  pi --model \"$pi_model\" --session-dir \"$stack_lab/sessions\" --session-id stack-smoke --no-tools --no-mcp -p '记住本会话测试标记 STACK-42；只回复 STACK-42。'\n  pi --model \"$pi_model\" --session-dir \"$stack_lab/sessions\" --session-id stack-smoke --no-tools --no-mcp -p '只回复上轮的测试标记。'\n)\nmagpie ls\nmultica daemon status\n# 仅在测试环境需要重新检测 CLI/环境时运行，不与生产任务混用：\n# multica daemon restart\nprintf 'Local evidence directory: %s\\n' \"$stack_lab\"",
        "expected": [
          "两次独立 Pi 调用返回 STACK-42，Magpie 可找到对应请求与实际服务模型。",
          "Multica 首次任务产物的 SHA-256 与测试文件相符；同 issue 后续 run 使用原 Pi 会话。",
          "取消/steering、skill、MCP 分别有日志和结果；未做的项目保留为未验证。"
        ],
        "verification": "保存版本/主机/模型、run ID、Pi 会话路径、Magpie 请求记录、stack-proof.json 与检查输出。只有模型能回复或 run 显示完成均不足以通过。",
        "requires": "provider credentials",
        "notes": "此实验会消耗所选模型额度；需要用户在自己的测试环境操作。本轮只提供并核对步骤，未宣称链路联测通过。不要导出凭证，也不要把已有生产 issue 当第一次烟雾测试。"
      },
      "pitfalls": [
        "把两对官方适配误报为所有三层配置已经联合测试。",
        "只改 Magpie 默认模型，却忽略 Multica 显式模型或旧 Pi 会话。",
        "把 task/run 自动重试与模型连接回退当成外部动作的去重保证。",
        "把 project trust、Multica worktree 和 Magpie 脱敏误当成文件系统沙箱。"
      ],
      "sources": [
        {
          "title": "Multica v0.8.0 Providers：模型、续接、MCP 与 skills",
          "url": "https://github.com/multica-ai/multica/blob/v0.8.0/apps/docs/content/docs/providers.mdx"
        },
        {
          "title": "Multica v0.8.0 Pi 后端与显式资源加载",
          "url": "https://github.com/multica-ai/multica/blob/v0.8.0/server/pkg/agent/pi.go"
        },
        {
          "title": "Multica v0.8.0 daemon、数据与配置边界",
          "url": "https://github.com/multica-ai/multica/blob/v0.8.0/apps/docs/content/docs/daemon-runtimes.mdx"
        },
        {
          "title": "Magpie v0.1.2858：模型网关、配置与路由",
          "url": "https://github.com/yetone/magpie/blob/v0.1.2858/README.md"
        }
      ],
      "migration": "把旧“Pi 与其他工具谁更强”的平面对照，改成任务管理、Agent 执行、模型接入三个控制层。当前官方两对适配已有实现，三层组合保留版本化联测门禁；旧20:50快照Magpie v2854仍作为历史记录。",
      "copy": "<p class=\"chapter-summary\">Multica–Pi 与 Magpie–Pi 都有官方适配；完整 Multica → Pi → Magpie → 模型服务的链路仍需联测。本章给出同机基线、配置顺序、故障定位和验收办法，不把三者画在一起就当成已集成成功。<\/p>\n<section class=\"lesson-section\"><h4>先冻结版本与职责，再接通两个官方适配<\/h4>\n<p>本章冻结 2026-11-03 21:20:47 上海时间：Pi v1.5.0，Multica v0.8.0，Magpie 默认 latest v0.1.2858、stable v0.1.2115。Magpie 两个渠道分别发布于 11 月 3 日 21:10:10 与 10 月 30 日 07:08:31；不能把源码新 tag 直接当成客户端发布。<\/p>\n<p>Multica 的 daemon 领取任务并调用 Pi，记录 run、日志与交付；Pi 管上下文、模型/工具循环与 CLI 会话；Magpie 管模型连接、协议转换和路由。默认三层同机、同用户先做基线，避免把 PATH、用户配置目录与网关网络问题混在一起。<\/p>\n<ul><li>本轮已核对官方资料与源码，并实跑第 11–13 章离线实验；没有登录账号或运行完整三层链路。<\/li><li>独立 Pi Durable 不会因 Multica 调用了 Pi CLI 就自动启用。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>配置顺序：先单机模型，再 Pi，再 Multica<\/h4>\n<p>第一步在 Magpie 供应商页添加已有凭证，或完成其支持的登录；从 <code>magpie models<\/code> 获取实际可选 ID，再由 <code>magpie pi &lt;清单中的ID&gt;<\/code> 为 Pi 设置模型。不要复制官网示意模型名当作账户必有额度。用 <code>pi --list-models<\/code> 再确认 Pi 自己的完整 provider/model，先测试固定单模型，暂不加路由组和故障转移。<\/p>\n<p>第二步启动全新 Pi 会话，核对响应和 Magpie 路由记录；再续接同一测试会话。第三步让相同机器和用户的 Multica daemon 检测到同一 Pi 可执行文件；重启检测后，新建测试 issue，选择 Pi runtime。先留空 Multica 模型字段使用 Pi 默认值，或刷新 runtime 清单后选完全相同的模型；不要沿用其他后端的模型值。<\/p>\n<ul><li>配置改变通常要新会话/新 run；旧会话续接必须单独验收。<\/li><li>服务启动环境与终端可能不同：核对 PATH、PI_CODING_AGENT_DIR、会话目录及网关进程。<\/li><li>容器里的 127.0.0.1 不是宿主 Magpie；先解决可达地址和访问密钥再继续。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>MCP 与 skills：按当前适配实际加载<\/h4>\n<p>Multica v0.8.0 对 Pi 的受管 MCP 要求 Pi 至少 v0.99.0：它创建临时扩展，通过显式 <code>--extension<\/code> 调用 <code>registerMcpServer<\/code>，不等于信任全部项目资源。绑定 skills 写到 <code>.pi/skills/<\/code> 后逐个显式传 <code>--skill<\/code>；同名已有技能保留，受管副本采用另名。<\/p>\n<p>先只测试基础任务，再逐个增加 MCP 和一项可识别的只读 skill。Pi 自己也加载用户层 MCP；同一服务器由不同管理层重复配置可能造成冲突。不要为排障盲目加 <code>--approve<\/code>、共享凭证目录或关掉边界；先看真实启动参数、扩展错误、运行记录与工具清单。<\/p>\n<ul><li>CLI 路径找不到：同一 daemon 环境核对 command -v，再重新检测；自定义兼容 profile 可设置绝对路径。<\/li><li>模型不生效：查显式模型覆盖、旧会话、enabledModels 与新 run，再对照 Magpie 的实际 served 模型。<\/li><li>续接失败：查原 JSONL/cwd 是否仍在原 runtime；回落新会话不算续接通过。<\/li><li>MCP 缺失：查 Pi 版本、受管扩展错误、本机配置和同名定义；不要只看设置页面。<\/li><li>skill 缺失：查绑定、实际注入名称和 --skill 路径，确认任务能展示一条独有只读规则。<\/li><li>网关报认证或连接错：查 Magpie 是否运行、账户额度和当前用户配置；不要把真实 key 写入 issue。<\/li><li>权限越界：停止加权限，核对 daemon 用户、完整进程隔离、卷挂载和网络边界。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-section\"><h4>验收产物，不只验收绿色状态<\/h4>\n<p>给测试 issue 写明确合同：只在指定测试仓库生成 <code>stack-proof.json<\/code>，字段含固定 nonce、输入文件摘要和检查结果；先不访问外部写服务。核对 Multica run ID、Pi 会话路径、Magpie 请求记录与真实文件四者能相互对应，再做同 issue 的一次续接、一次取消/steering 和一项受管能力测试。<\/p>\n<p>只有这些证据齐全，才记录该主机、版本、模型、配置的组合通过；不得推广成所有模型和订阅都兼容。之后一次只加一个变量：路由组、定时触发、Squad 或远端 runtime。run 完成由系统报告，业务验收由任务合同和使用者决定；成本数字只是估算，还要对供应商账单。<\/p>\n<ul><li>三层共同失败时先缩回 Pi → 单模型，再定位模型接入或任务调度。<\/li><li>带副作用的联测必须有幂等键与外部结果核对，避免多层重试重复执行。<\/li><\/ul>\n<\/section>\n<section class=\"lesson-pitfalls\"><h4>容易混淆的地方<\/h4>\n<ul><li>把两对官方适配误报为所有三层配置已经联合测试。<\/li><li>只改 Magpie 默认模型，却忽略 Multica 显式模型或旧 Pi 会话。<\/li><li>把 task/run 自动重试与模型连接回退当成外部动作的去重保证。<\/li><li>把 project trust、Multica worktree 和 Magpie 脱敏误当成文件系统沙箱。<\/li><\/ul><\/section>",
      "labHtml": "<h4>固定模型的两段烟雾检查与任务证据合同<\/h4>\n<p>先验证 Pi → Magpie 的新会话和续接，再把同一模型交给 Multica，留下可核对的四层证据。<\/p>\n<p class=\"lab-requires\">运行条件：需要可用模型凭证与对应服务<\/p>\n<ol><li>前置：三个工具已安装、Magpie 已添加一个可用供应商。运行下方命令；按实际清单输入 ID，不在命令行输入真实 key。<\/li><li>在 Multica 新建测试 agent，绑定本机 Pi runtime，模型留空或选清单中的对应 ID。新建 issue，要求只在测试目录生成 stack-proof.json：nonce=STACK-42、sourceFile=README.md、sha256=文件实际摘要；附检查命令及结果。<\/li><li>首次完成后在同一 issue 追问 STACK-42 的来源，不重复给 nonce；核对 Pi 会话路径是否复用。再单独测试一项 skill、一个只读 MCP 和取消/steering，各记录结果。<\/li><\/ol>\n<pre><code class=\"language-bash\">set -eu\ncommand -v pi\npi --version\ncommand -v magpie\nmagpie --version\nmagpie models\nread -r -p &#x27;复制 magpie models 中一个真实 provider/model：&#x27; gateway_model\ntest -n &quot;$gateway_model&quot;\nmagpie pi &quot;$gateway_model&quot;\npi --offline --list-models\nread -r -p &#x27;复制 Pi 清单对应的完整 provider/model：&#x27; pi_model\ntest -n &quot;$pi_model&quot;\nstack_lab=&quot;$(mktemp -d &quot;${TMPDIR:-/tmp}/pi-stack-lab.XXXXXX&quot;)&quot;\nmkdir -p &quot;$stack_lab/sessions&quot;\n(\n  cd &quot;$stack_lab&quot;\n  pi --model &quot;$pi_model&quot; --session-dir &quot;$stack_lab/sessions&quot; --session-id stack-smoke --no-tools --no-mcp -p &#x27;记住本会话测试标记 STACK-42；只回复 STACK-42。&#x27;\n  pi --model &quot;$pi_model&quot; --session-dir &quot;$stack_lab/sessions&quot; --session-id stack-smoke --no-tools --no-mcp -p &#x27;只回复上轮的测试标记。&#x27;\n)\nmagpie ls\nmultica daemon status\n# 仅在测试环境需要重新检测 CLI/环境时运行，不与生产任务混用：\n# multica daemon restart\nprintf &#x27;Local evidence directory: %s\\n&#x27; &quot;$stack_lab&quot;<\/code><\/pre>\n<h5>预期结果<\/h5><ul><li>两次独立 Pi 调用返回 STACK-42，Magpie 可找到对应请求与实际服务模型。<\/li><li>Multica 首次任务产物的 SHA-256 与测试文件相符；同 issue 后续 run 使用原 Pi 会话。<\/li><li>取消/steering、skill、MCP 分别有日志和结果；未做的项目保留为未验证。<\/li><\/ul>\n<p><strong>验收：<\/strong>保存版本/主机/模型、run ID、Pi 会话路径、Magpie 请求记录、stack-proof.json 与检查输出。只有模型能回复或 run 显示完成均不足以通过。<\/p>\n<p class=\"lab-note\">此实验会消耗所选模型额度；需要用户在自己的测试环境操作。本轮只提供并核对步骤，未宣称链路联测通过。不要导出凭证，也不要把已有生产 issue 当第一次烟雾测试。<\/p>",
      "sourcesHtml": "<ul class=\"lesson-sources\"><li><a href=\"https://github.com/multica-ai/multica/blob/v0.8.0/apps/docs/content/docs/providers.mdx\" target=\"_blank\" rel=\"noreferrer\">Multica v0.8.0 Providers：模型、续接、MCP 与 skills ↗<\/a><\/li><li><a href=\"https://github.com/multica-ai/multica/blob/v0.8.0/server/pkg/agent/pi.go\" target=\"_blank\" rel=\"noreferrer\">Multica v0.8.0 Pi 后端与显式资源加载 ↗<\/a><\/li><li><a href=\"https://github.com/multica-ai/multica/blob/v0.8.0/apps/docs/content/docs/daemon-runtimes.mdx\" target=\"_blank\" rel=\"noreferrer\">Multica v0.8.0 daemon、数据与配置边界 ↗<\/a><\/li><li><a href=\"https://github.com/yetone/magpie/blob/v0.1.2858/README.md\" target=\"_blank\" rel=\"noreferrer\">Magpie v0.1.2858：模型网关、配置与路由 ↗<\/a><\/li><\/ul>",
      "markdownPath": "curriculum/14.md"
    }
  ]
};
