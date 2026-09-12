"use strict";

(function registerLearningHubContent() {
const lastVerifiedDate = "2026-06-02";

const sourceLinks = {
  sensorTower: "https://sensortower.com/state-of-mobile-2025",
  techCrunchAiApps: "https://techcrunch.com/2026/01/21/consumers-spent-more-on-mobile-apps-than-games-in-2025-driven-by-ai-app-adoption/",
  appleReview: "https://developer.apple.com/app-store/review/guidelines/",
  googleAiPolicy: "https://support.google.com/googleplay/android-developer/answer/14094294?hl=en",
  googleDataSafety: "https://support.google.com/googleplay/android-developer/answer/10787469?hl=en",
  appleLocalization: "https://developer.apple.com/help/app-store-connect/manage-app-information/localize-app-information/",
  appleCustomPages: "https://developer.apple.com/app-store/custom-product-pages/",
  googleExperiments: "https://play.google.com/console/about/store-listing-experiments/",
  appleSubscriptions: "https://developer.apple.com/app-store/subscriptions/",
  revenueCat2026: "https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026/",
  appleDsa: "https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements",
  appleTransparency2024: "https://www.apple.com/legal/more-resources/docs/2024-App-Store-Transparency-Report.pdf",
  gsmaMobileEconomy2025: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/wp-content/uploads/2025/02/030325-The-Mobile-Economy-2025.pdf",
  applePrivacyDetails: "https://developer.apple.com/app-store/app-privacy-details/",
  googleUserDataPolicy: "https://support.google.com/googleplay/android-developer/answer/10144311?hl=en",
  googleDeveloperPolicy: "https://play.google.com/about/developer-content-policy/",
  appleProductPageOptimization: "https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/run-a-test/",
  googlePromotionalContent: "https://support.google.com/googleplay/android-developer/answer/12929029?hl=en",
  googleAcquisitionReports: "https://support.google.com/googleplay/android-developer/answer/9859173?hl=en",
  googlePriceExperiments: "https://support.google.com/googleplay/android-developer/answer/13343030?hl=en",
  appleSubscriptionOffers: "https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-promotional-offers-for-auto-renewable-subscriptions/",
  photoroomCustomerStories: "https://www.photoroom.com/customer-stories",
  revenueCatDubCase: "https://www.revenuecat.com/customers/dub-app"
};

const pathSteps = [
  {
    number: "01",
    meta: "Day 1 / 30-60 分钟",
    title: "建立正确认知",
    body: "先读学习指南，理解出海不是翻译、AI 功能不等于产品、下载量不是最终指标。",
    href: "../docs/learning-guide.html"
  },
  {
    number: "02",
    meta: "Day 2-3 / 2 个案例起步",
    title: "拆一个可迁移案例",
    body: "从竞品学习册里选 2 个案例，回答它服务谁、替代了什么旧流程、为什么能收费。",
    href: "../docs/case-study-workbook.html"
  },
  {
    number: "03",
    meta: "Day 4-5 / 评分与收敛",
    title: "用评分表筛方向",
    body: "把候选方向放进 CSV 评分表，优先看 OPC 适配度、市场拉力、分发难度和合规风险。",
    href: "../data/opportunity-scorecard.csv"
  },
  {
    number: "04",
    meta: "Day 6-7 / 不写代码验证",
    title: "验证渠道与付费意愿",
    body: "按 7 天学习计划找到第一个低成本渠道，至少让 5 个目标用户看过你的方向假设。",
    href: "../docs/7-day-learning-plan.html"
  }
];

const caseTypes = {
  commerce: "电商/素材",
  content: "内容/视频",
  workflow: "文档/工作流",
  wellness: "健康/心理"
};

const cases = [
  {
    name: "Cal AI",
    type: "wellness",
    lesson: "把高频但麻烦的记录动作压缩成一次拍照。",
    avoid: "不要忽视准确性、健康合规和买量成本。"
  },
  {
    name: "Photoroom",
    type: "commerce",
    lesson: "不要做泛图片工具，要绑定卖货结果。",
    avoid: "不要一开始做完整设计平台。"
  },
  {
    name: "Gamma",
    type: "workflow",
    lesson: "用户买的是表达成果，不是 PPT 文件。",
    avoid: "不要做宽泛 PPT 生成器。"
  },
  {
    name: "PDF.ai / ChatPDF",
    type: "workflow",
    lesson: "文档是好入口，但要切行业文件流。",
    avoid: "不要再做泛 PDF Chat。"
  },
  {
    name: "HeyGen / Synthesia",
    type: "content",
    lesson: "视频本地化是真需求，企业愿意为省制作成本付费。",
    avoid: "不要做底层数字人平台。"
  },
  {
    name: "Lovart",
    type: "workflow",
    lesson: "Agent 是替用户完成一串专业决策。",
    avoid: "不要一开始做全能设计 Agent。"
  },
  {
    name: "Captions / CapCut",
    type: "content",
    lesson: "短视频要做平台、人群和任务。",
    avoid: "不要做泛剪辑器。"
  },
  {
    name: "Photo AI / Interior AI",
    type: "commerce",
    lesson: "可展示结果和创始人分发是 OPC 杠杆。",
    avoid: "不要只学一个人做产品，忽略分发资产。"
  },
  {
    name: "Calm / Wysa",
    type: "wellness",
    lesson: "情绪类产品卖的是信任、习惯和安全感。",
    avoid: "不要承诺治疗。"
  },
  {
    name: "ElevenLabs",
    type: "content",
    lesson: "底层能力可以成为别人工作流的基础设施。",
    avoid: "不要自己做底层语音模型。"
  }
];

const topics = [
  {
    id: "market",
    title: "市场与机会",
    eyebrow: "Market Map",
    summary: "先判断大盘、品类和购买力，再决定要不要做 App。",
    tags: ["市场", "AI", "品类"],
    caseName: "ChatGPT / Gemini / DeepSeek",
    caseSummary: "AI 助手证明了需求，但也抬高了通用助手赛道门槛。",
    templateTitle: "机会判断模板",
    template: "目标市场：\n用户正在付费解决的旧问题：\nApp 能把哪一步压缩到 1 分钟内：\n现有竞品的弱点：\n我能触达的第一个渠道：",
    checklist: ["查目标国家付费能力", "找 5 个同类 App 的差评", "确认是否有可复用工作流", "写出一个可收费结果"],
    cards: [
      {
        title: "大盘不是机会，具体工作流才是机会",
        forWhom: "准备从 AI 热点里选方向的独立开发者。",
        conclusion: "移动消费增长说明水位高，但小团队要避开通用助手，转向具体人群和具体任务。",
        steps: ["先列品类，不先列功能", "找用户每周重复做的任务", "把任务改写成可交付结果"],
        pitfalls: ["只看下载榜不看收入", "把热门模型当成产品", "用中文场景直接翻译成英文"],
        source: "Sensor Tower State of Mobile 2025、TechCrunch / Sensor Tower",
        sourceUrls: [sourceLinks.sensorTower, sourceLinks.techCrunchAiApps],
        verified: lastVerifiedDate
      },
      {
        title: "AI App 要有一个非 AI 的旧流程替代物",
        forWhom: "想验证 AI App 是否值得做的小团队。",
        conclusion: "如果用户不用 AI 也没有旧流程、预算或痛点，AI 只是噱头。",
        steps: ["写出用户现在用什么工具完成", "估算旧流程时间和成本", "定义 AI 后的节省幅度"],
        pitfalls: ["把聊天框当产品", "没有人工校验路径", "无法解释为什么要持续付费"],
        source: "经验判断，结合订阅与 AI App 留存报告",
        sourceUrls: [sourceLinks.revenueCat2026],
        verified: lastVerifiedDate
      },
      {
        title: "先找 200-500 名之间的上升竞品",
        forWhom: "没有预算买行业报告的 OPC。",
        conclusion: "头部产品告诉你天花板，中腰部新产品更能暴露可进入的缝隙。",
        steps: ["筛近期上升应用", "看截图、定价、评价和更新频率", "记录它没有服务好的细分用户"],
        pitfalls: ["只复制第一名", "忽视本地化页面", "没有验证自己能否触达同类用户"],
        source: "经验判断，需结合 App Store / Google Play / Product Hunt 实测",
        sourceUrls: ["../docs/research-evidence-register.html"],
        verified: lastVerifiedDate
      }
    ]
  },
  {
    id: "validation",
    title: "产品验证",
    eyebrow: "Validation",
    summary: "不急着写代码，先验证用户、任务、付费点和提示词资产。",
    tags: ["验证", "MVP", "提示词"],
    caseName: "专家提示词资产化",
    caseSummary: "把同事留下的提示词拆成输入、判断规则、输出标准和质检清单，才能被团队接手。",
    templateTitle: "提示词传承模板",
    template: "原提示词用途：\n客户输入字段：\n它隐含的判断规则：\n好输出的标准：\n失败输出的样子：\n人工复核步骤：\n可训练给新人的示例：",
    checklist: ["保留原提示词原文", "做 10 个真实客户样本回放", "拆出输入字段和输出评分表", "形成 SOP 而不只依赖某一句 prompt"],
    cards: [
      {
        title: "把提示词当业务流程，不当神秘咒语",
        forWhom: "需要接手前同事经验资产的团队。",
        conclusion: "真正有价值的不是提示词文本，而是它背后的客户诊断逻辑和质量判断。",
        steps: ["冻结原始版本", "逐段标注意图", "用历史客户样本跑输出", "把隐含经验写成评分表"],
        pitfalls: ["直接让新人复制粘贴", "没有样本回放", "只优化措辞不提炼业务判断"],
        source: "经验判断，适合作为内部 SOP 和客户交付流程",
        sourceUrls: ["../docs/facilitator-guide.html"],
        verified: lastVerifiedDate
      },
      {
        title: "MVP 只交付一个可验证结果",
        forWhom: "准备做第一版 App 或自动化工具的人。",
        conclusion: "第一版不要做平台，做一个输入清楚、输出可用、复核成本低的闭环。",
        steps: ["定义唯一输入", "定义唯一输出", "让客户判断输出是否能直接用", "记录所有人工修补点"],
        pitfalls: ["MVP 功能太多", "输出没有验收标准", "没有把人工服务过程产品化"],
        source: "经验判断，结合站内 7 天学习计划",
        sourceUrls: ["../docs/7-day-learning-plan.html"],
        verified: lastVerifiedDate
      },
      {
        title: "用失败样本训练产品边界",
        forWhom: "已经有提示词、模板或顾问流程的人。",
        conclusion: "好样本说明能做什么，失败样本说明产品边界和风险提示。",
        steps: ["收集输出失败案例", "标注失败原因", "写成用户输入限制", "加入复核与免责声明"],
        pitfalls: ["只展示成功案例", "没有拒答边界", "承诺收益或替代专业判断"],
        source: "经验判断，合规边界参考 Apple / Google 政策",
        sourceUrls: [sourceLinks.appleReview, sourceLinks.googleAiPolicy],
        verified: lastVerifiedDate
      }
    ]
  },
  {
    id: "cases",
    title: "AI App 案例",
    eyebrow: "Case Studies",
    summary: "学习竞品如何选择人群、结果、信任层和定价，不直接照搬功能。",
    tags: ["案例", "竞品", "品牌"],
    caseName: "Photoroom / Gamma / HeyGen",
    caseSummary: "成功案例往往绑定了商品图、表达成果或视频本地化等明确结果。",
    templateTitle: "竞品拆解模板",
    template: "竞品名称：\n服务人群：\n旧流程：\n交付结果：\n收费方式：\n我能迁移的原则：\n我不能照搬的部分：",
    checklist: ["拆 2 个头部案例", "拆 2 个中腰部案例", "记录定价与截图", "写出自己的迁移原则"],
    cards: [
      {
        title: "案例拆解看结果，不只看功能",
        forWhom: "容易被竞品功能清单带偏的学习者。",
        conclusion: "竞品真正值钱的是帮用户完成的结果，而不是界面上有多少 AI 按钮。",
        steps: ["找到首页承诺", "找到定价页", "看用户评价中的真实任务", "写出结果链路"],
        pitfalls: ["照抄功能", "忽视品牌信任层", "不看差评"],
        source: "站内案例学习册",
        sourceUrls: ["../docs/case-study-workbook.html"],
        verified: lastVerifiedDate
      },
      {
        title: "小团队适合学窄场景，不适合学大平台",
        forWhom: "正在从头部 AI App 找灵感的人。",
        conclusion: "可以学 Photoroom 的结果绑定，不能学它的全量平台能力。",
        steps: ["拆出最小场景", "删掉平台级功能", "保留可展示结果", "设计一个渠道实验"],
        pitfalls: ["模仿大厂首页", "一开始做多人协作", "忽略素材版权"],
        source: "站内品牌拆解手册",
        sourceUrls: ["../docs/brand-teardown-handbook.html"],
        verified: lastVerifiedDate
      },
      {
        title: "案例库要持续更新来源和限制",
        forWhom: "准备把网站长期维护成知识库的人。",
        conclusion: "案例不是一次性素材，每次政策、定价或产品页变化都可能影响结论。",
        steps: ["记录访问日期", "保存公开来源链接", "标注推断而非事实", "每季度复核重点案例"],
        pitfalls: ["把旧截图当现状", "用二手资料当权威", "不标注版权边界"],
        source: "站内研究证据登记表",
        sourceUrls: ["../docs/research-evidence-register.html"],
        verified: lastVerifiedDate
      }
    ]
  },
  {
    id: "compliance",
    title: "上架合规",
    eyebrow: "Store Compliance",
    summary: "把 App Review、Google Play 政策、付款和 EU DSA 当作产品需求。",
    tags: ["上架", "合规", "政策"],
    caseName: "订阅 App 上架前检查",
    caseSummary: "隐私政策、演示账号、IAP 说明和联系方式缺一项都可能拖慢审核。",
    templateTitle: "上架前检查模板",
    template: "平台：App Store / Google Play\n是否需要登录：\n演示账号：\n隐私政策 URL：\n数据披露：\nIAP/订阅说明：\nAI 生成内容风险：\nEU DSA trader 状态：",
    checklist: ["补齐元数据", "准备 demo account", "核对隐私政策", "核对付款路径", "写明 AI 内容边界"],
    cards: [
      {
        title: "上架材料本身就是产品体验",
        forWhom: "准备第一次提交 App 的开发者。",
        conclusion: "Apple 明确要求元数据准确、联系信息完整、App 可供完整审核。",
        steps: ["确认 Support URL", "准备演示账号或 demo 模式", "描述非显而易见功能", "确保后端可访问"],
        pitfalls: ["提交空页面", "IAP 审核不到", "隐私说明和实际 SDK 不一致"],
        source: "Apple App Review Guidelines",
        sourceUrls: [sourceLinks.appleReview],
        verified: lastVerifiedDate
      },
      {
        title: "生成式 AI App 需要内容安全路径",
        forWhom: "做文本、图片、声音、视频生成的团队。",
        conclusion: "Google Play 要求生成式 AI App 防止生成受限内容，并纳入用户反馈机制。",
        steps: ["列出可能生成的内容类型", "设置禁止内容", "提供反馈/举报入口", "记录模型和第三方服务"],
        pitfalls: ["不做内容限制", "生成真实人物欺诈内容", "没有解释 AI 输出责任边界"],
        source: "Google Play AI-Generated Content policy",
        sourceUrls: [sourceLinks.googleAiPolicy],
        verified: lastVerifiedDate
      },
      {
        title: "EU DSA 会影响开发者公开联系信息",
        forWhom: "计划在欧盟发行 App 的个人或公司。",
        conclusion: "Apple 要求分发到 EU 的 trader 提供并验证会展示的联系信息。",
        steps: ["判断 trader 状态", "准备地址、电话、邮箱", "在 App Store Connect 完成验证", "为个人开发者评估隐私影响"],
        pitfalls: ["以为非欧盟开发者不用管", "使用无法验证的联系方式", "不咨询法律顾问就做高风险判断"],
        source: "Apple EU DSA trader requirements",
        sourceUrls: [sourceLinks.appleDsa],
        verified: lastVerifiedDate
      }
    ]
  },
  {
    id: "privacy",
    title: "隐私与 AI 风险",
    eyebrow: "Trust & Risk",
    summary: "用户数据、第三方 SDK、模型调用和敏感权限都要提前设计。",
    tags: ["隐私", "AI 风险", "数据"],
    caseName: "AI 文档总结 App",
    caseSummary: "用户上传文件后，必须说明数据是否传出设备、谁处理、保留多久。",
    templateTitle: "数据流模板",
    template: "用户输入数据：\n是否离开设备：\n第三方服务：\n保留时间：\n删除方式：\n用户可见提示：\n隐私政策对应段落：",
    checklist: ["画出数据流", "核对 SDK 数据收集", "声明保留与删除", "为敏感权限提供替代路径"],
    cards: [
      {
        title: "Data Safety 不是文案，是全局事实",
        forWhom: "准备上 Google Play 的开发者。",
        conclusion: "Google 要求所有发布 App 完成 Data safety 表，即使不收集数据也要声明。",
        steps: ["检查权限和 SDK", "列出收集/分享数据", "核对隐私政策", "每次版本变化后更新"],
        pitfalls: ["只填自己服务器收集的数据", "忘记第三方 SDK", "隐私政策链接失效"],
        source: "Google Play Data safety",
        sourceUrls: [sourceLinks.googleDataSafety],
        verified: lastVerifiedDate
      },
      {
        title: "把第三方 AI 写进用户可理解的同意流程",
        forWhom: "调用外部模型处理用户数据的 AI App。",
        conclusion: "Apple 要求清楚披露个人数据是否分享给第三方 AI，并在需要时取得明确许可。",
        steps: ["标注模型供应商", "解释发送哪些数据", "提供用户确认", "给出删除/退出路径"],
        pitfalls: ["默认上传敏感文件", "用含糊的隐私文案", "把同意藏在条款里"],
        source: "Apple App Review Guidelines privacy section",
        sourceUrls: [sourceLinks.appleReview],
        verified: lastVerifiedDate
      },
      {
        title: "敏感领域不要让 AI 像专业人士一样承诺",
        forWhom: "做健康、心理、金融、法律相关 App 的团队。",
        conclusion: "高风险领域需要限制输出、提示非专业建议，并保留人工或专业资源路径。",
        steps: ["列出高风险输出", "设置拒答和转介", "加入免责声明", "审核营销文案"],
        pitfalls: ["承诺治疗或收益", "输出诊断结论", "让用户误以为可替代专业人士"],
        source: "Apple / Google 平台政策与经验判断",
        sourceUrls: [sourceLinks.appleReview, sourceLinks.googleAiPolicy],
        verified: lastVerifiedDate
      }
    ]
  },
  {
    id: "aso",
    title: "ASO 与本地化",
    eyebrow: "Discovery",
    summary: "本地化不是翻译，它包括关键词、截图、产品页实验和渠道上下文。",
    tags: ["ASO", "本地化", "增长"],
    caseName: "同一 App 的不同国家产品页",
    caseSummary: "美国用户、日韩用户和 MENA 用户可能需要不同截图密度、卖点和价格表达。",
    templateTitle: "本地化页面模板",
    template: "目标国家/语言：\n目标关键词：\n首屏截图卖点：\n本地信任信号：\n价格表达：\n要 A/B 测试的单一变量：",
    checklist: ["先选 1-2 个国家", "本地化关键词和截图", "只测试一个变量", "记录转化率和 1 日留存"],
    cards: [
      {
        title: "App Store 元数据本地化会影响搜索",
        forWhom: "准备做多语言产品页的人。",
        conclusion: "Apple 文档说明用户可用本地化关键词搜索 App，缺少匹配语言时会回退到最相关本地化。",
        steps: ["添加目标语言", "写本地化描述和关键词", "上传对应截图", "记录展示和下载变化"],
        pitfalls: ["只翻译 App 内文案", "截图仍是英文", "关键词直译不符合搜索习惯"],
        source: "Apple Localize app information",
        sourceUrls: [sourceLinks.appleLocalization],
        verified: lastVerifiedDate
      },
      {
        title: "自定义产品页适合按人群讲不同故事",
        forWhom: "有多个渠道或用户细分的 iOS App。",
        conclusion: "Apple 支持为不同受众发布额外产品页，用不同截图、推广文本和 App Preview 展示特定功能。",
        steps: ["定义一个渠道人群", "只突出一个使用场景", "绑定唯一 URL", "在 App Analytics 看转化"],
        pitfalls: ["每个页面都写一样", "关键词与页面意图不匹配", "没有对照默认页"],
        source: "Apple Custom Product Pages",
        sourceUrls: [sourceLinks.appleCustomPages],
        verified: lastVerifiedDate
      },
      {
        title: "Google Play 实验优先测图形资产",
        forWhom: "想优化安装转化率的 Android App。",
        conclusion: "Google 建议用 Store listing experiments 测文字和图形，最佳实践是一次测一个资产并至少跑一周。",
        steps: ["选图标、截图或短描述", "只改一个变量", "运行至少一周", "看安装与 1 日留存"],
        pitfalls: ["同时改太多变量", "数据量太小就下结论", "忽略地区差异"],
        source: "Google Play Store listing experiments",
        sourceUrls: [sourceLinks.googleExperiments],
        verified: lastVerifiedDate
      }
    ]
  },
  {
    id: "monetization",
    title: "订阅变现",
    eyebrow: "Subscription",
    summary: "订阅不是价格表，而是持续价值、透明条款和留存系统。",
    tags: ["订阅", "定价", "收入"],
    caseName: "年度订阅的第一周留存",
    caseSummary: "用户买年付后仍可能很快关闭自动续费，第一周价值证明很关键。",
    templateTitle: "订阅价值模板",
    template: "订阅承诺：\n持续更新/持续服务：\n免费体验边界：\n试用期长度：\n首小时 aha moment：\n退款/取消风险：",
    checklist: ["明确持续价值", "展示完整续费价格", "加入恢复购买", "追踪首小时价值达成"],
    cards: [
      {
        title: "订阅必须提供持续价值",
        forWhom: "准备上自动续订的 iOS App。",
        conclusion: "Apple 要求自动续订订阅提供 ongoing value，订阅期至少 7 天并可跨设备使用。",
        steps: ["写明持续服务", "设置订阅组", "显示完整续费价格", "提供恢复购买入口"],
        pitfalls: ["只解锁静态功能", "价格不清晰", "年付总价不突出"],
        source: "Apple subscriptions",
        sourceUrls: [sourceLinks.appleSubscriptions],
        verified: lastVerifiedDate
      },
      {
        title: "AI App 获客强，但留存要单独设计",
        forWhom: "用 AI 功能做订阅 App 的团队。",
        conclusion: "RevenueCat 2026 指出 AI App 有收入溢价，但也面临更快流失，不能只靠新鲜感。",
        steps: ["定义长期使用场景", "减少一次性生成后流失", "在首周强化成果", "做取消前挽回"],
        pitfalls: ["把试用收入当 PMF", "没有复购任务", "忽略模型成本"],
        source: "RevenueCat State of Subscription Apps 2026",
        sourceUrls: [sourceLinks.revenueCat2026],
        verified: lastVerifiedDate
      },
      {
        title: "Android 订阅流失有支付基础设施问题",
        forWhom: "Google Play 收入占比高的开发者。",
        conclusion: "RevenueCat 2026 提到 Google Play 取消中有相当比例来自账单失败，要优化宽限期和重试。",
        steps: ["启用 grace period", "设置 billing retry", "做续费失败提醒", "区分主动取消和支付失败"],
        pitfalls: ["把所有流失归咎产品", "没有 dunning 流程", "只看总取消率"],
        source: "RevenueCat 2026",
        sourceUrls: [sourceLinks.revenueCat2026],
        verified: lastVerifiedDate
      }
    ]
  },
  {
    id: "growth",
    title: "冷启动增长",
    eyebrow: "Go-to-market",
    summary: "小团队用真实经验、公开构建和低成本内容系统赢得第一批用户。",
    tags: ["冷启动", "SEO", "社群"],
    caseName: "Build in Public + 模板 SEO",
    caseSummary: "先把真实制作过程和免费模板公开，建立信任，再导向产品页。",
    templateTitle: "7 天冷启动模板",
    template: "目标用户社区：\n我能公开展示的真实过程：\n免费模板/工具：\n第一条内容标题：\n第一个转化动作：\n复盘指标：",
    checklist: ["选一个真实人群", "写 3 条真实经验内容", "做 1 个免费模板", "找 5 个用户访谈"],
    cards: [
      {
        title: "真实经验比泛泛榜单更有用",
        forWhom: "没有广告预算的独立开发者。",
        conclusion: "AI 内容泛滥后，用户更愿意相信真实使用场景和独立案例。",
        steps: ["写自己的使用场景", "展示失败和改进", "给出可复制模板", "把内容导向试用"],
        pitfalls: ["批量生成 Top 10 文章", "创始人完全隐身", "只做官网不做分发"],
        source: "经验判断，结合公开构建和冷启动案例",
        sourceUrls: ["../docs/public-content-pack.html"],
        verified: lastVerifiedDate
      },
      {
        title: "免费工具要服务主付费功能",
        forWhom: "想用 SEO 或模板引流的团队。",
        conclusion: "免费工具不是随便做，它要把用户带到同一个工作流里的付费结果。",
        steps: ["列主付费结果", "拆出一个免费前置任务", "让免费输出自然暴露付费需求", "埋转化入口"],
        pitfalls: ["免费工具和主产品无关", "吸引低意愿用户", "没有追踪转化"],
        source: "经验判断，结合站内公开内容包",
        sourceUrls: ["../docs/public-content-pack.html"],
        verified: lastVerifiedDate
      },
      {
        title: "贡献机制让知识库可持续",
        forWhom: "想让网站不只是个人资料库的人。",
        conclusion: "访客能贡献案例、纠错和政策更新，知识库才会持续变好。",
        steps: ["公开贡献规则", "提供来源格式", "把政策更新标注日期", "用 GitHub Issue/PR 承接反馈"],
        pitfalls: ["没有来源要求", "不区分事实和经验", "政策内容过期不标注"],
        source: "站内 CONTRIBUTING 与研究证据登记",
        sourceUrls: ["../CONTRIBUTING.html", "../docs/research-evidence-register.html"],
        verified: lastVerifiedDate
      }
    ]
  }
];

const webPages = [
  {
    category: "market",
    categoryLabel: "市场趋势",
    title: "Sensor Tower：State of Mobile 2025",
    source: "Sensor Tower",
    url: sourceLinks.sensorTower,
    whyRead: "用来确认移动 App 大盘仍有消费水位，不用它直接决定选题。",
    myRead: "我会先看用户时间和消费流向，再把机会收窄到一个具体人群的旧工作流。",
    useFor: "写市场背景、判断品类热度、给候选方向做第一轮排除。",
    dontMisread: "不要把大盘增长理解成任何 AI App 都值得做。",
    verified: lastVerifiedDate
  },
  {
    category: "market",
    categoryLabel: "市场趋势",
    title: "TechCrunch / Sensor Tower：AI App 拉动消费",
    source: "TechCrunch",
    url: sourceLinks.techCrunchAiApps,
    whyRead: "用媒体转述快速理解 AI App 对非游戏收入的拉动。",
    myRead: "AI 是流量入口，但产品不能停在新鲜感；要讲清楚用户持续为什么付费。",
    useFor: "给公开课或文章写趋势开场，提醒团队关注留存而不是只看下载。",
    dontMisread: "媒体文章是线索，不替代原始报告和自己对品类的验证。",
    verified: lastVerifiedDate
  },
  {
    category: "platform",
    categoryLabel: "上架合规",
    title: "Apple：App Review Guidelines",
    source: "Apple Developer",
    url: sourceLinks.appleReview,
    whyRead: "第一次做 iOS App 出海前必须读，审核失败往往不是代码问题，而是材料、隐私、付款和安全边界没准备好。",
    myRead: "我会把审核要求当产品需求，而不是提交前才补的文案。",
    useFor: "上架前检查 demo account、隐私政策、IAP 说明、审核备注和敏感功能。",
    dontMisread: "不要把它当法律意见；高风险领域仍要找专业顾问。",
    verified: lastVerifiedDate
  },
  {
    category: "platform",
    categoryLabel: "上架合规",
    title: "Google Play：AI-Generated Content policy",
    source: "Google Play Console Help",
    url: sourceLinks.googleAiPolicy,
    whyRead: "做文本、图片、音频、视频生成类 App 时，用它确认内容安全和反馈机制。",
    myRead: "AI 生成内容不是只接模型 API，还要有防滥用、举报、拒绝和人工复核路径。",
    useFor: "设计生成边界、用户举报入口、敏感内容提示和审核策略。",
    dontMisread: "不要以为小团队或个人开发者可以跳过内容治理。",
    verified: lastVerifiedDate
  },
  {
    category: "platform",
    categoryLabel: "上架合规",
    title: "Google Play：Data Safety",
    source: "Google Play Console Help",
    url: sourceLinks.googleDataSafety,
    whyRead: "用来核对 App 收集、分享、保留和删除哪些数据。",
    myRead: "Data Safety 不是填表，是把 SDK、模型服务、日志和用户文件流向讲清楚。",
    useFor: "做数据流图、隐私政策、第三方 SDK 清单和版本发布检查。",
    dontMisread: "不要只填自己服务器收集的数据，第三方 SDK 也算。",
    verified: lastVerifiedDate
  },
  {
    category: "platform",
    categoryLabel: "上架合规",
    title: "Apple：EU DSA trader requirements",
    source: "Apple Developer",
    url: sourceLinks.appleDsa,
    whyRead: "如果 App 面向欧盟分发，需要提前理解 trader 信息验证和展示。",
    myRead: "欧盟不是等有用户再补，个人开发者尤其要先评估公开联系方式和隐私影响。",
    useFor: "决定是否面向 EU 上架、准备地址电话邮箱、设置 App Store Connect 合规信息。",
    dontMisread: "不要把站内提醒当法律结论，复杂情况要咨询专业人士。",
    verified: lastVerifiedDate
  },
  {
    category: "growth",
    categoryLabel: "ASO 本地化",
    title: "Apple：Localize app information",
    source: "Apple Developer",
    url: sourceLinks.appleLocalization,
    whyRead: "用来理解 App Store 元数据、关键词和截图本地化怎么影响发现。",
    myRead: "本地化不是翻译 App 名，而是把当地用户会搜、会信、会付费的语言重写出来。",
    useFor: "做国家选择、关键词、截图文案、描述和发布前检查。",
    dontMisread: "不要用机器翻译直接覆盖所有国家，先选 1-2 个市场做深。",
    verified: lastVerifiedDate
  },
  {
    category: "growth",
    categoryLabel: "ASO 本地化",
    title: "Apple：Custom Product Pages",
    source: "Apple Developer",
    url: sourceLinks.appleCustomPages,
    whyRead: "用来给不同渠道、不同人群讲不同产品故事。",
    myRead: "同一个 App 可以有多个入口，但每个入口只能服务一个明确场景。",
    useFor: "为 YouTube、Reddit、SEO、广告和社群分别做产品页承接。",
    dontMisread: "不要每个页面都堆全量卖点，否则只是复制默认页。",
    verified: lastVerifiedDate
  },
  {
    category: "growth",
    categoryLabel: "ASO 本地化",
    title: "Google Play：Store listing experiments",
    source: "Google Play",
    url: sourceLinks.googleExperiments,
    whyRead: "用来验证图标、截图、短描述等商店素材对转化的影响。",
    myRead: "小团队做实验要克制，一次只测一个变量，别把所有文案都改了还想解释结果。",
    useFor: "设计截图 A/B、短描述测试、国家差异实验和安装转化复盘。",
    dontMisread: "样本量太小时不要急着宣布胜利。",
    verified: lastVerifiedDate
  },
  {
    category: "monetization",
    categoryLabel: "订阅变现",
    title: "Apple：Subscriptions",
    source: "Apple Developer",
    url: sourceLinks.appleSubscriptions,
    whyRead: "用来确认自动续订订阅的持续价值、展示、恢复购买和跨设备要求。",
    myRead: "订阅不是价格表，是你承诺持续交付价值的证据。",
    useFor: "设计试用期、订阅组、价格展示、恢复购买、取消和续费体验。",
    dontMisread: "不要用订阅包装一次性静态功能。",
    verified: lastVerifiedDate
  },
  {
    category: "monetization",
    categoryLabel: "订阅变现",
    title: "RevenueCat：Subscription Apps 2026",
    source: "RevenueCat",
    url: sourceLinks.revenueCat2026,
    whyRead: "用来理解硬付费墙、试用取消、AI App 留存和 Android billing leak。",
    myRead: "AI App 可以卖得快，但留不住就只是一次性热闹；首小时价值证明比漂亮功能更重要。",
    useFor: "设计 paywall、onboarding、试用长度、首小时 aha moment 和续费失败挽回。",
    dontMisread: "不要照搬硬付费墙，先看自己的品类、渠道和用户信任水平。",
    verified: lastVerifiedDate
  },
  {
    category: "monetization",
    categoryLabel: "订阅变现",
    title: "RevenueCat：Subscription Apps 2025",
    source: "RevenueCat",
    url: "https://www.revenuecat.com/state-of-subscription-apps-2025/",
    whyRead: "用作订阅基准的上一年背景，帮助判断 2026 数据是趋势还是短期波动。",
    myRead: "看报告不要只抄数字，要对比年份、品类和平台差异。",
    useFor: "做订阅模型复盘、年付风险判断和 iOS / Android 收入差异讨论。",
    dontMisread: "不要把跨品类平均值当成自己产品的目标线。",
    verified: lastVerifiedDate
  }
];

window.learningHubContent = {
  lastVerifiedDate,
  sourceLinks,
  pathSteps,
  caseTypes,
  cases,
  topics,
  webPages,
  toolkits: []
};
})();
