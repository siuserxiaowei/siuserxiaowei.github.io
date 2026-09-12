"use strict";

(function appendExtraWebPages() {
  const content = window.learningHubContent || {};
  const { lastVerifiedDate, sourceLinks = {}, webPages } = content;

  if (!Array.isArray(webPages)) return;

  const links = {
    appleTransparency2024:
      sourceLinks.appleTransparency2024 ||
      "https://www.apple.com/legal/more-resources/docs/2024-App-Store-Transparency-Report.pdf",
    gsmaMobileEconomy2025:
      sourceLinks.gsmaMobileEconomy2025 ||
      "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/wp-content/uploads/2025/02/030325-The-Mobile-Economy-2025.pdf",
    applePrivacyDetails:
      sourceLinks.applePrivacyDetails ||
      "https://developer.apple.com/app-store/app-privacy-details/",
    googleUserDataPolicy:
      sourceLinks.googleUserDataPolicy ||
      "https://support.google.com/googleplay/android-developer/answer/10144311?hl=en",
    googleDeveloperPolicy:
      sourceLinks.googleDeveloperPolicy ||
      "https://play.google.com/about/developer-content-policy/",
    appleProductPageOptimization:
      sourceLinks.appleProductPageOptimization ||
      "https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/run-a-test/",
    googlePromotionalContent:
      sourceLinks.googlePromotionalContent ||
      "https://support.google.com/googleplay/android-developer/answer/12929029?hl=en",
    googleAcquisitionReports:
      sourceLinks.googleAcquisitionReports ||
      "https://support.google.com/googleplay/android-developer/answer/9859173?hl=en",
    googlePriceExperiments:
      sourceLinks.googlePriceExperiments ||
      "https://support.google.com/googleplay/android-developer/answer/13343030?hl=en",
    appleSubscriptionOffers:
      sourceLinks.appleSubscriptionOffers ||
      "https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-promotional-offers-for-auto-renewable-subscriptions/",
    photoroomCustomerStories:
      sourceLinks.photoroomCustomerStories ||
      "https://www.photoroom.com/customer-stories",
    revenueCatDubCase:
      sourceLinks.revenueCatDubCase ||
      "https://www.revenuecat.com/customers/dub-app"
  };

  webPages.push(
    {
      category: "market",
      categoryLabel: "市场趋势",
      title: "Apple：2024 App Store Transparency Report",
      source: "Apple",
      url: links.appleTransparency2024,
      whyRead: "用官方透明度报告理解 App Store 的审核、下架、欺诈拦截和账号治理强度。",
      myRead: "它提醒小团队别只把出海看成分发红利，平台质量门槛本身就是市场结构的一部分。",
      useFor: "评估上架风险、写平台生态背景、判断某类灰色增长手段是否值得碰。",
      dontMisread: "不要把平台拦截数据理解成自己的 App 一定会被拒；关键是提前把材料和边界做清楚。",
      verified: lastVerifiedDate
    },
    {
      category: "market",
      categoryLabel: "市场趋势",
      title: "GSMA：The Mobile Economy 2025",
      source: "GSMA",
      url: links.gsmaMobileEconomy2025,
      whyRead: "用移动行业报告理解智能机、连接、区域差异和数字经济底层趋势。",
      myRead: "它不直接告诉你做哪个 App，但能帮你判断哪些市场的移动基础设施和用户土壤更成熟。",
      useFor: "做国家优先级、移动生态背景、区域机会判断和长期趋势假设。",
      dontMisread: "不要把通信行业增长等同于 App 商业成功，应用层还要验证具体需求和支付意愿。",
      verified: lastVerifiedDate
    },
    {
      category: "platform",
      categoryLabel: "平台政策",
      title: "Apple：App privacy details on the App Store",
      source: "Apple Developer",
      url: links.applePrivacyDetails,
      whyRead: "用来确认隐私标签需要披露哪些数据类型、用途和第三方共享情况。",
      myRead: "隐私标签不是发布前的填空题，而是倒逼你把埋点、SDK、模型调用和文件处理理清楚。",
      useFor: "做数据清单、隐私政策核对、App Store Connect 提交材料和 SDK 审查。",
      dontMisread: "不要以为没有自建后端就没有数据收集；第三方分析、广告和支付 SDK 也要纳入。",
      verified: lastVerifiedDate
    },
    {
      category: "platform",
      categoryLabel: "平台政策",
      title: "Google Play：User Data policy",
      source: "Google Play",
      url: links.googleUserDataPolicy,
      whyRead: "用来判断个人和敏感用户数据的收集、使用、披露、权限和删除要求。",
      myRead: "对 AI 工具尤其重要，因为用户上传的图片、音频、文档常常比表面功能更敏感。",
      useFor: "设计权限申请、数据删除入口、隐私文案、第三方服务评估和审核前自查。",
      dontMisread: "不要把用户同意当万能豁免；目的限定、最小化收集和安全处理仍然要成立。",
      verified: lastVerifiedDate
    },
    {
      category: "platform",
      categoryLabel: "平台政策",
      title: "Google Play：Developer Program Policies",
      source: "Google Play",
      url: links.googleDeveloperPolicy,
      whyRead: "用总政策页快速定位受限内容、欺骗行为、恶意软件、隐私和变现相关规则。",
      myRead: "它适合当作产品需求清单使用：功能、文案、素材和运营动作都可能触发政策问题。",
      useFor: "新方向立项、上架前检查、敏感功能边界判断和被拒后定位政策条款。",
      dontMisread: "不要只搜单个关键词；很多拒审原因来自多个政策交叉，而不是某一条孤立规则。",
      verified: lastVerifiedDate
    },
    {
      category: "growth",
      categoryLabel: "增长实验",
      title: "Apple：Product Page Optimization tests",
      source: "Apple Developer",
      url: links.appleProductPageOptimization,
      whyRead: "用来理解 App Store 原生 A/B 测试的素材范围、审核前置和结果读取方式。",
      myRead: "PPO 的价值不是炫技，而是让截图、预览和价值主张从争论变成小样本证据。",
      useFor: "测试截图顺序、App 预览、图标变化、首屏卖点和本地化素材。",
      dontMisread: "不要在流量太小时过度解释结果，也不要一次改太多变量。",
      verified: lastVerifiedDate
    },
    {
      category: "growth",
      categoryLabel: "增长实验",
      title: "Google Play：Promotional content",
      source: "Google Play Console Help",
      url: links.googlePromotionalContent,
      whyRead: "用来理解应用内活动、优惠和关键时刻如何进入 Google Play 的曝光位。",
      myRead: "它适合有明确更新节奏的产品，不适合空造活动；平台想展示的是用户此刻值得回来的理由。",
      useFor: "设计版本更新、限时优惠、季节活动、深链承接和活动素材规范。",
      dontMisread: "不要把 promotional content 当免费广告位；内容质量、资格和素材规范仍然决定效果。",
      verified: lastVerifiedDate
    },
    {
      category: "growth",
      categoryLabel: "增长实验",
      title: "Google Play：Acquisition reports",
      source: "Google Play Console Help",
      url: links.googleAcquisitionReports,
      whyRead: "用来读懂 Play Console 的获取来源、商店访问、安装和留存指标。",
      myRead: "增长复盘先统一口径，否则团队会把搜索、浏览、直接链接和活动曝光混在一起讲故事。",
      useFor: "拆渠道贡献、看商店页转化、复盘 ASO 调整和判断首日留存质量。",
      dontMisread: "不要只看安装数；来源、转化和留存一起看，才知道增长是不是健康。",
      verified: lastVerifiedDate
    },
    {
      category: "monetization",
      categoryLabel: "变现实验",
      title: "Google Play：Price experiments",
      source: "Google Play Console Help",
      url: links.googlePriceExperiments,
      whyRead: "用来理解 Google Play 对应用内商品价格实验的设置、指标和限制。",
      myRead: "价格不是拍脑袋，也不是越低越好；实验要围绕 ARPPU、转化和长期留存一起判断。",
      useFor: "测试国家差异价格、一次性商品价格、促销策略和付费用户收入变化。",
      dontMisread: "不要把短期 ARPPU 提升等同于长期收入变好，尤其要留意样本量和后续留存。",
      verified: lastVerifiedDate
    },
    {
      category: "monetization",
      categoryLabel: "变现实验",
      title: "Apple：Promotional offers for auto-renewable subscriptions",
      source: "Apple Developer",
      url: links.appleSubscriptionOffers,
      whyRead: "用来确认订阅促销优惠的资格、配置和用户体验边界。",
      myRead: "促销不是补救一切的折扣按钮，它更适合挽回、升级或重新激活明确人群。",
      useFor: "设计 win-back、老用户优惠、渠道定向优惠和订阅生命周期实验。",
      dontMisread: "不要用优惠掩盖产品价值不足；折扣带来的用户也可能更脆弱。",
      verified: lastVerifiedDate
    },
    {
      category: "cases",
      categoryLabel: "公开案例",
      title: "Photoroom：Customer Stories",
      source: "Photoroom",
      url: links.photoroomCustomerStories,
      whyRead: "用官方客户故事看 AI 图片工具如何绑定电商上架、广告素材和品牌视觉结果。",
      myRead: "最值得学的不是抠图能力，而是把能力嵌进卖货、批量生产和团队协作的业务场景。",
      useFor: "拆 AI 图像产品的目标用户、结果指标、案例叙事和 B2B / SMB 分层。",
      dontMisread: "不要只复制功能清单；Photoroom 的优势来自场景聚焦、素材质量和客户证明。",
      verified: lastVerifiedDate
    },
    {
      category: "cases",
      categoryLabel: "公开案例",
      title: "RevenueCat：dub Case Study",
      source: "RevenueCat",
      url: links.revenueCatDubCase,
      whyRead: "用公开案例看订阅产品如何通过价格实验、生命周期运营和流失挽回提升收入质量。",
      myRead: "它说明订阅增长不只是 paywall 转化，后面还有续费、取消、重激活和用户信任。",
      useFor: "设计订阅实验路线、生命周期消息、留存复盘和收入指标看板。",
      dontMisread: "不要把供应商案例当普适承诺；先确认你的产品频率、价值证明和用户规模是否匹配。",
      verified: lastVerifiedDate
    }
  );
})();
