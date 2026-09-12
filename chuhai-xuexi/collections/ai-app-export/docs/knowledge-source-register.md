# App 出海知识库来源登记表

最后核查日期：2026-06-02

本文件用于维护首页知识库卡片、深度资料库和公开内容包的事实来源。原则是：市场数据、平台政策、订阅规则必须绑定权威来源；经验型建议可以保留，但必须明确标注为“经验判断”，不能写成平台规则、法律意见或收益承诺。

## 使用规则

- 每张知识卡至少绑定 1 个来源；没有外部来源时，标注为“经验判断”并指向站内方法文档。
- 政策类内容必须写核查日期；上线正式推广前重新打开 Apple / Google / RevenueCat 等来源复核。
- 不搬运报告全文，不复制未授权逐字稿，不用长篇原文替代教学化转述。
- 法律、财税、医疗、心理、金融等高风险领域只给产品与合规提示，不提供专业意见。
- 如果来源变更、链接失效或政策更新，优先修改知识卡的来源、核查日期和风险提示。

## 首页整理方式

首页现在把外部网页和站内方法拆成三层：

- 知识卡：8 个专题、48 张卡，把结论转成适合谁、核心结论、操作步骤、常见坑、来源和核查日期。
- 网页资料馆：24 个外部网页整理成为什么读、我怎么看、怎么用、别误读，保留原网页链接但不搬运原文。
- 提示词资产工具包：4 个可复制模板，把 SOP、输入表、输出质检和失败回放变成可执行流程。

这套整理方式保留个人风格：少堆概念，多做判断；少贴链接，多讲怎么用；每个政策和报告都要标核查日期。

站点内容通过 `site/content.js` 统一注册为 `window.learningHubContent`，再由扩展文件追加进阶知识卡、网页资料卡和提示词资产工具包。后续多人协作时优先按文件边界维护，避免多人同时改 `site/app.js`。

## 来源等级

| 等级 | 类型 | 用途 |
| --- | --- | --- |
| A | 平台官方文档、政策页、开发者文档 | 上架、隐私、订阅、AI 内容、DSA 等政策判断 |
| B | 行业报告、数据服务商、订阅基础设施报告 | 市场趋势、品类变化、订阅行为、收入差异 |
| C | 公开产品页、商店页面、竞品网站、创始人公开内容 | 案例拆解、品牌学习、定价观察 |
| D | 站内经验判断、用户访谈、交付复盘 | 方法建议、流程设计、提示词资产化 |

## 当前登记来源

| 主题 | 关键结论用途 | 来源 | 等级 | 核查日期 |
| --- | --- | --- | --- | --- |
| 市场与机会 | 移动应用消费、非游戏 App、AI App 增长背景 | [Sensor Tower State of Mobile 2025](https://sensortower.com/state-of-mobile-2025) | B | 2026-06-02 |
| 市场与机会 | AI App 带动消费、非游戏收入变化的新闻转述 | [TechCrunch / Sensor Tower](https://techcrunch.com/2026/01/21/consumers-spent-more-on-mobile-apps-than-games-in-2025-driven-by-ai-app-adoption/) | B | 2026-06-02 |
| 上架合规 | 元数据、审核账号、付款、隐私、用户生成内容等 App Store 审核要求 | [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) | A | 2026-06-02 |
| 上架合规 | 生成式 AI App 内容安全、反馈机制和受限内容 | [Google Play AI-Generated Content policy](https://support.google.com/googleplay/android-developer/answer/14094294?hl=en) | A | 2026-06-02 |
| 隐私与 AI 风险 | Google Play Data safety 表、数据收集和分享披露 | [Google Play Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) | A | 2026-06-02 |
| 上架合规 | 欧盟 DSA trader 联系信息验证与展示 | [Apple EU DSA trader requirements](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements) | A | 2026-06-02 |
| 上架合规 | App Store 审核、下架、欺诈拦截和平台治理背景 | [Apple 2024 App Store Transparency Report](https://www.apple.com/legal/more-resources/docs/2024-App-Store-Transparency-Report.pdf) | A | 2026-06-02 |
| 隐私与 AI 风险 | App Store 隐私标签和数据披露口径 | [Apple App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/) | A | 2026-06-02 |
| 隐私与 AI 风险 | Google Play 用户数据政策和敏感数据边界 | [Google Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en) | A | 2026-06-02 |
| 上架合规 | Google Play 内容政策总入口，用于校验 AI、UGC、误导性声明等边界 | [Google Play Developer Policy Center](https://play.google.com/about/developer-content-policy/) | A | 2026-06-02 |
| ASO 与本地化 | App Store 元数据本地化、关键词和回退规则 | [Apple Localize app information](https://developer.apple.com/help/app-store-connect/manage-app-information/localize-app-information/) | A | 2026-06-02 |
| ASO 与本地化 | iOS 自定义产品页按人群和渠道展示不同素材 | [Apple Custom Product Pages](https://developer.apple.com/app-store/custom-product-pages/) | A | 2026-06-02 |
| ASO 与本地化 | iOS 产品页优化测试和素材实验 | [Apple Product Page Optimization](https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/run-a-test/) | A | 2026-06-02 |
| ASO 与本地化 | Google Play 商店页面实验和素材测试 | [Google Play Store Listing Experiments](https://play.google.com/console/about/store-listing-experiments/) | A | 2026-06-02 |
| ASO 与本地化 | Google Play promotional content 活动和商店曝光规则 | [Google Play Promotional content](https://support.google.com/googleplay/android-developer/answer/12929029?hl=en) | A | 2026-06-02 |
| ASO 与本地化 | Google Play acquisition reports 渠道归因和表现复盘 | [Google Play Acquisition reports](https://support.google.com/googleplay/android-developer/answer/9859173?hl=en) | A | 2026-06-02 |
| 订阅变现 | 自动续订订阅、持续价值、恢复购买和展示要求 | [Apple Subscriptions](https://developer.apple.com/app-store/subscriptions/) | A | 2026-06-02 |
| 订阅变现 | App Store 订阅促销 offer、续费和挽回相关设置 | [Apple Promotional Offers](https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-promotional-offers-for-auto-renewable-subscriptions/) | A | 2026-06-02 |
| 订阅变现 | Google Play subscription price experiments 与地区定价测试 | [Google Play price experiments](https://support.google.com/googleplay/android-developer/answer/13343030?hl=en) | A | 2026-06-02 |
| 订阅变现 | AI App 订阅趋势、收入溢价、留存和流失风险 | [RevenueCat State of Subscription Apps 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026/) | B | 2026-06-02 |
| 订阅变现 | 订阅应用基准、转化与流失背景资料 | [RevenueCat State of Subscription Apps 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/) | B | 2026-06-02 |
| 订阅变现 | 订阅产品生命周期运营、价格实验和流失挽回案例 | [RevenueCat dub case study](https://www.revenuecat.com/customers/dub-app) | C | 2026-06-02 |
| 市场与机会 | 移动连接、区域差异和数字经济基础设施背景 | [GSMA The Mobile Economy 2025](https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/wp-content/uploads/2025/02/030325-The-Mobile-Economy-2025.pdf) | B | 2026-06-02 |
| 竞品案例 | 10 个 AI App 案例、品牌拆解与迁移练习 | [案例学习册](case-study-workbook.md)、[品牌拆解手册](brand-teardown-handbook.md) | C / D | 2026-06-02 |
| 竞品案例 | AI 图片工具如何服务电商素材、团队协作和批量生产 | [Photoroom Customer Stories](https://www.photoroom.com/customer-stories) | C | 2026-06-02 |
| 冷启动增长 | 公开构建、模板 SEO、社群内容和贡献机制 | [公开内容包](public-content-pack.md)、[CONTRIBUTING](../CONTRIBUTING.md) | D | 2026-06-02 |

## 提示词资产化登记

适用场景：关键业务提示词由单个同事掌握，团队需要在尊重原作者劳动和情感记忆的前提下继续服务客户。

首页已把这部分产品化为 4 个可复制工具包：提示词资产 SOP、客户输入表、输出质检表和失败样本回放流程。建议把提示词作为业务资产登记，而不是只把原文发给新人：

1. 原件保护：保存原提示词、版本、适用客户类型、历史输入和历史输出，不直接覆盖改写。
2. 样本回放：选 10 个真实或脱敏客户样本，用原提示词跑一遍，记录好输出和坏输出。
3. 隐性判断提取：逐段标注它在判断什么，包括客户目标、产品问题、风险边界、优化优先级。
4. 质量评分表：把“好结果”写成可检查标准，例如清晰度、可执行性、风险提示、是否贴合客户业务。
5. SOP 化：形成输入表单、提示词版本、人工复核步骤、失败处理规则和交付模板。
6. 版本维护：每次修改提示词都记录原因、修改人、影响样本和回归测试结果。

这部分属于内部流程与经验判断，不是平台政策。涉及客户数据时，应先脱敏并遵守客户授权、隐私政策和内部保密要求。

## 上线修复项

- 当前 GitHub Pages 自定义域名为 `gptimage2.store`；正式推广前需要确认 Pages 绑定域名、DNS 记录和 Enforce HTTPS 状态。
- 目前 HTTP 可访问，但 HTTPS 证书与域名不匹配的问题应作为发布阻断项处理。
- 当前 `sitemap.xml`、`robots.txt`、`llms.txt`、canonical、Open Graph 和结构化数据已使用 HTTP 入口；HTTPS 修复后应统一切换为 HTTPS。
- 修复后再在 README、公开内容和广告配置中使用 HTTPS 链接推广。

## 维护节奏

- 平台政策：每次发版前核查，至少每月核查一次。
- 市场与订阅报告：每季度核查一次，遇到新版报告立即更新。
- 竞品案例：每季度抽查重点案例的截图、定价、产品页和隐私政策。
- 站内经验判断：每次客户交付后复盘一次，保留成功样本和失败样本。
