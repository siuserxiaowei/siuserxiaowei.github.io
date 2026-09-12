"use strict";

(function appendAdvancedCards() {
  const content = window.learningHubContent;
  if (!content) return;

  const { lastVerifiedDate, sourceLinks, topics } = content;
  if (!lastVerifiedDate || !sourceLinks || !Array.isArray(topics)) return;

  const topicById = new Map(topics.map(topic => [topic.id, topic]));
  const verified = lastVerifiedDate;

  const advancedCards = {
    market: [
      {
        title: "先用付费动作判断市场，不用热词判断市场",
        forWhom: "正在从 AI、效率、健康、内容等大词里找方向的 OPC。",
        conclusion: "用户已经在买模板、课程、插件、人工服务或竞品订阅，才说明问题有预算；只有搜索量和讨论热度不够。",
        steps: ["找 5 个目标国家的付费替代品", "记录价格、购买入口和用户评价", "把需求改写成一个可交付结果", "只保留能在两周内验证的细分场景"],
        pitfalls: ["把趋势报告当作立项依据", "只看下载量不看收入", "忽略用户原本付费给谁"],
        source: "经验判断，结合移动应用市场与订阅应用公开报告",
        sourceUrls: [sourceLinks.sensorTower, sourceLinks.revenueCat2026],
        verified
      },
      {
        title: "小团队优先选低信任门槛任务",
        forWhom: "没有品牌、没有合规团队、也没有客服团队的独立开发者。",
        conclusion: "越接近医疗、法律、金融决策，信任和责任成本越高；早期更适合做可撤销、可预览、可人工复核的任务。",
        steps: ["给候选方向打信任门槛分", "确认输出失败是否会造成严重损失", "保留人工确认步骤", "把高风险承诺从营销文案里删掉"],
        pitfalls: ["用 AI 直接给诊断或投资建议", "把免责声明当万能保护", "低估审核、客服和投诉成本"],
        source: "经验判断，政策边界参考 Apple 与 Google Play",
        sourceUrls: [sourceLinks.appleReview, sourceLinks.googleAiPolicy],
        verified
      },
      {
        title: "用国家选择缩小竞争，而不是只做英文版",
        forWhom: "准备默认先做美国市场的 App 小团队。",
        conclusion: "英文市场购买力强但竞争也强；如果你能理解某个语言区的工作流和渠道，区域切入可能更快。",
        steps: ["列出 3 个你能理解的国家或语言区", "查同类 App 的本地化质量", "看差评里是否出现语言、价格、文化问题", "先做一个国家的产品页和截图实验"],
        pitfalls: ["只翻译界面不改卖点", "不了解当地支付和隐私预期", "一次性铺太多语言"],
        source: "Apple 本地化文档与 Google Play 商店实验文档",
        sourceUrls: [sourceLinks.appleLocalization, sourceLinks.googleExperiments],
        verified
      }
    ],
    validation: [
      {
        title: "验证付费前先验证用户是否愿意交出材料",
        forWhom: "做文档、图片、简历、合同、健康记录等输入型 AI App 的团队。",
        conclusion: "如果用户不愿上传真实材料，模型效果再好也难以形成产品闭环；早期要先验证数据交付意愿。",
        steps: ["用表单收集最小必要输入", "解释数据会怎样处理", "让 5 个目标用户提交真实或脱敏材料", "记录他们最担心的点"],
        pitfalls: ["只用虚构样本测试", "没有说明数据去向", "把用户拒绝上传误判为功能不够强"],
        source: "经验判断，隐私披露边界参考平台政策",
        sourceUrls: [sourceLinks.appleReview, sourceLinks.googleDataSafety],
        verified
      },
      {
        title: "用手工交付测 MVP，不要急着做完整 App",
        forWhom: "还没确定需求强度的独立开发者。",
        conclusion: "先用人工、表单、脚本和现成模型完成 10 次交付，能更快发现用户真正要验收的结果。",
        steps: ["写一个落地页或说明帖", "收集输入并人工处理", "交付可用结果", "询问是否愿意为下一次付费"],
        pitfalls: ["第一周就做登录、积分和后台", "没有记录人工修补步骤", "只问喜不喜欢不问是否继续用"],
        source: "经验判断，适合早期产品验证流程",
        sourceUrls: [sourceLinks.revenueCat2026],
        verified
      },
      {
        title: "把留存问题提前放进验证题",
        forWhom: "准备做订阅制 AI App 的小团队。",
        conclusion: "一次性生成类产品容易首单后流失；验证时就要问用户下周、下月为什么还会回来。",
        steps: ["定义重复使用触发器", "让用户描述下一次使用场景", "设计首周连续价值", "区分一次性需求和持续需求"],
        pitfalls: ["把试用转化当作长期 PMF", "只做生成不做管理和复用", "没有衡量首周价值达成"],
        source: "RevenueCat 订阅应用趋势报告",
        sourceUrls: [sourceLinks.revenueCat2026],
        verified
      }
    ],
    cases: [
      {
        title: "拆竞品先写它替用户省掉哪一步",
        forWhom: "看了很多 AI App 但不知道如何迁移的人。",
        conclusion: "可迁移的不是功能，而是它把用户原流程里的哪一步压缩、自动化或标准化了。",
        steps: ["画出竞品服务前的旧流程", "标出最耗时或最贵的一步", "看 App 如何把这一步变短", "把同样原则迁移到你的细分人群"],
        pitfalls: ["只抄 UI 和按钮", "忽略竞品的渠道优势", "没有写出自己的用户差异"],
        source: "案例拆解方法，结合公开产品页与用户评价",
        sourceUrls: [sourceLinks.sensorTower, sourceLinks.techCrunchAiApps],
        verified
      },
      {
        title: "头部案例学原则，中腰部案例学入口",
        forWhom: "容易被明星产品规模吓住的小团队。",
        conclusion: "头部产品证明需求上限，中腰部产品更能告诉你小团队可以从哪个入口切进去。",
        steps: ["选 2 个头部产品看品类天花板", "选 3 个新近上升产品看入口", "记录它们最窄的首屏承诺", "避开平台级能力"],
        pitfalls: ["直接挑战头部通用场景", "忽略小产品的分发路径", "把融资规模当作产品能力"],
        source: "经验判断，需用公开榜单、商店页和评价交叉验证",
        sourceUrls: [sourceLinks.sensorTower],
        verified
      },
      {
        title: "案例结论必须写明不能照搬的部分",
        forWhom: "要把竞品分析变成团队决策资料的人。",
        conclusion: "每个案例都要同时写可迁移原则和不可复制条件，否则容易把别人的资源误当成自己的机会。",
        steps: ["列竞品资源条件", "标注你没有的渠道、数据或品牌", "保留可迁移的工作流原则", "把风险写进方向评分表"],
        pitfalls: ["只写成功原因", "没有区分事实和推断", "忽略版权、数据和合规限制"],
        source: "经验判断，政策类限制参考 Apple / Google Play",
        sourceUrls: [sourceLinks.appleReview, sourceLinks.googleAiPolicy],
        verified
      }
    ],
    compliance: [
      {
        title: "把审核问题提前写进需求清单",
        forWhom: "第一次做 App Store 或 Google Play 上架的小团队。",
        conclusion: "登录、订阅、AI 输出、隐私、演示账号和联系方式都不是发布前补文案，而是产品需求。",
        steps: ["为审核准备 demo 路径", "列出所有付费入口", "核对隐私政策和数据表", "写清 AI 输出限制"],
        pitfalls: ["审核员无法进入核心功能", "订阅价格说明不完整", "隐私披露和实际 SDK 不一致"],
        source: "Apple App Review Guidelines、Google Play 政策",
        sourceUrls: [sourceLinks.appleReview, sourceLinks.googleAiPolicy, sourceLinks.googleDataSafety],
        verified
      },
      {
        title: "AI 生成内容要有举报和处理机制",
        forWhom: "做图片、文本、语音、视频生成的 App 开发者。",
        conclusion: "生成式 AI 不只要提示词安全，还要给用户可见的反馈、举报或纠错入口，方便处理有害输出。",
        steps: ["列出禁止生成类型", "在结果页提供反馈入口", "记录处理流程", "对高风险内容设置阻断或人工复核"],
        pitfalls: ["只依赖模型默认安全策略", "没有用户反馈入口", "允许生成欺诈、仇恨或违法内容"],
        source: "Google Play AI-Generated Content policy",
        sourceUrls: [sourceLinks.googleAiPolicy],
        verified
      },
      {
        title: "EU 发行前先处理 trader 信息",
        forWhom: "计划在欧盟 App Store 上架的个人开发者和小公司。",
        conclusion: "如果被认定为 trader，Apple 会要求提供并验证公开联系信息；个人开发者要提前评估隐私影响。",
        steps: ["确认是否向 EU 分发", "判断 trader / non-trader 状态", "准备可验证联系方式", "必要时咨询专业法律意见"],
        pitfalls: ["临近发布才发现信息要公开", "使用无法验证的邮箱或地址", "把平台说明当作完整法律建议"],
        source: "Apple EU Digital Services Act trader requirements",
        sourceUrls: [sourceLinks.appleDsa],
        verified
      }
    ],
    privacy: [
      {
        title: "先画数据流，再写隐私政策",
        forWhom: "调用第三方模型、分析 SDK 或云存储的小团队。",
        conclusion: "隐私政策不能凭感觉写，必须从用户输入、设备、服务器、第三方服务和保存周期反推。",
        steps: ["列出用户输入数据", "标注是否离开设备", "列第三方 SDK 和模型服务", "写明保存、删除和退出方式"],
        pitfalls: ["漏掉崩溃分析和广告 SDK", "不说明第三方处理", "版本更新后不更新披露"],
        source: "Google Play Data safety 与 Apple 隐私相关审核要求",
        sourceUrls: [sourceLinks.googleDataSafety, sourceLinks.appleReview],
        verified
      },
      {
        title: "敏感输入默认最小化",
        forWhom: "处理简历、合同、健康、财务、儿童或身份信息的 App。",
        conclusion: "越敏感的数据越要少收、短存、可删除，并尽量给用户脱敏或本地处理选项。",
        steps: ["删除非必要字段", "允许用户脱敏上传", "限制保存时间", "在界面上说明风险和用途"],
        pitfalls: ["为了以后可能有用而全量收集", "默认保存原始文件", "让用户误以为没有第三方处理"],
        source: "经验判断，隐私披露边界参考平台政策",
        sourceUrls: [sourceLinks.appleReview, sourceLinks.googleDataSafety],
        verified
      },
      {
        title: "不要让免责声明承担产品安全职责",
        forWhom: "做 AI 建议、分析、评估、生成类功能的开发者。",
        conclusion: "免责声明只能补充说明，不能替代拒答、复核、限制场景和用户反馈机制。",
        steps: ["列出高风险问题", "设置拒答或降级输出", "把复核提醒放在结果旁", "提供纠错和删除路径"],
        pitfalls: ["只在条款里写一句不负责", "输出看起来像专业结论", "没有纠错或申诉入口"],
        source: "Apple / Google Play 平台政策与经验判断",
        sourceUrls: [sourceLinks.appleReview, sourceLinks.googleAiPolicy],
        verified
      }
    ],
    aso: [
      {
        title: "本地化先改首屏截图，不要只改描述",
        forWhom: "已经准备进入第二语言市场的独立开发者。",
        conclusion: "用户先看截图和短卖点，截图语言、示例内容和价格语境不本地化，会削弱转化。",
        steps: ["选一个目标国家", "替换截图里的真实用例", "调整首屏卖点顺序", "用实验验证安装转化"],
        pitfalls: ["机器翻译所有文案", "截图仍展示英文输入", "不同国家共用同一套卖点"],
        source: "Apple 本地化文档与 Google Play 商店实验",
        sourceUrls: [sourceLinks.appleLocalization, sourceLinks.googleExperiments],
        verified
      },
      {
        title: "关键词要从用户任务里来",
        forWhom: "做 ASO 但没有成熟投放预算的小团队。",
        conclusion: "早期关键词不要只追大词，要把用户任务、对象和结果组合成更窄的搜索词。",
        steps: ["列用户要完成的任务", "补上对象和场景词", "看竞品标题与评价用词", "每次只测试一组关键词"],
        pitfalls: ["堆砌热门词", "关键词和截图承诺不一致", "没有记录版本和效果"],
        source: "Apple App 信息本地化与商店实验相关文档",
        sourceUrls: [sourceLinks.appleLocalization, sourceLinks.googleExperiments],
        verified
      },
      {
        title: "自定义产品页要绑定渠道意图",
        forWhom: "有社媒、SEO、广告或社群入口的 iOS App。",
        conclusion: "不同渠道用户的问题不同，自定义产品页应该承接该渠道的具体意图，而不是复制默认页。",
        steps: ["为一个渠道写一句用户意图", "只展示相关功能截图", "用独立链接投放或分发", "对比默认页转化"],
        pitfalls: ["所有渠道用同一页", "页面卖点和内容入口不一致", "没有看 App Analytics 数据"],
        source: "Apple Custom Product Pages",
        sourceUrls: [sourceLinks.appleCustomPages],
        verified
      }
    ],
    monetization: [
      {
        title: "定价先按结果价值，不按模型成本",
        forWhom: "用 API 成本来倒推订阅价格的 AI App 团队。",
        conclusion: "用户不为 token 付费，而为节省时间、提升结果或减少人工成本付费；成本只决定底线。",
        steps: ["写出用户省下的时间或人工费", "确认竞品和替代服务价格", "设计免费边界", "用月付和年付测试意愿"],
        pitfalls: ["只把 API 成本加价出售", "免费额度过大导致亏损", "没有解释持续价值"],
        source: "RevenueCat 订阅应用趋势报告与经验判断",
        sourceUrls: [sourceLinks.revenueCat2026],
        verified
      },
      {
        title: "试用期要证明一个完整结果",
        forWhom: "准备设置免费试用或首月优惠的订阅 App。",
        conclusion: "试用期不是让用户随便逛，而是让他在最短时间内完成一次可感知成果。",
        steps: ["定义试用期必须达成的成果", "把新手流程压到一个任务", "在结果页提示下次使用场景", "跟踪试用后首周留存"],
        pitfalls: ["试用期只展示功能菜单", "没有首小时 aha moment", "年付优惠早于价值证明"],
        source: "RevenueCat 订阅应用趋势报告",
        sourceUrls: [sourceLinks.revenueCat2026],
        verified
      },
      {
        title: "订阅页文案要经得起审核和退款质疑",
        forWhom: "做自动续订、用量包或高级功能解锁的小团队。",
        conclusion: "价格、周期、续订、取消和包含内容必须清楚；模糊营销会带来审核、差评和退款风险。",
        steps: ["明确显示周期和总价", "列出订阅包含内容", "提供恢复购买", "避免暗示永久收益或专业保证"],
        pitfalls: ["按钮只写立即解锁", "隐藏续订条件", "把 AI 输出包装成确定结果"],
        source: "Apple subscriptions 与 App Review Guidelines",
        sourceUrls: [sourceLinks.appleSubscriptions, sourceLinks.appleReview],
        verified
      }
    ],
    growth: [
      {
        title: "冷启动内容要贴近一个真实任务",
        forWhom: "准备用小红书、X、Reddit、SEO 或社群启动的独立开发者。",
        conclusion: "泛泛讲 AI 趋势很难转化，展示一个具体任务从痛点到结果的过程更容易带来试用。",
        steps: ["选一个目标用户任务", "展示原流程的麻烦", "给出你的处理结果", "把 CTA 指向模板、试用或等候名单"],
        pitfalls: ["只发产品发布公告", "内容没有可复制步骤", "没有承接转化的页面"],
        source: "经验判断，适合低预算增长实验",
        sourceUrls: [sourceLinks.sensorTower],
        verified
      },
      {
        title: "把用户差评变成内容选题",
        forWhom: "不知道写什么增长内容的小团队。",
        conclusion: "竞品差评里常有用户真实语言，适合转成问题解释、替代方案和产品改进内容。",
        steps: ["收集 30 条竞品差评", "按任务和抱怨分类", "写 5 个解决方案标题", "把内容链接到对应功能"],
        pitfalls: ["攻击竞品品牌", "捏造评价", "只写吐槽不提供解决路径"],
        source: "经验判断，需基于公开商店评价并避免搬运大段原文",
        sourceUrls: [sourceLinks.appleReview],
        verified
      },
      {
        title: "第一批用户要能反馈，不只是能下载",
        forWhom: "刚发布 MVP、还没有稳定留存数据的团队。",
        conclusion: "早期增长目标不是最大下载量，而是找到能告诉你哪里不好用、为什么愿意付费的人。",
        steps: ["在产品里放反馈入口", "给早期用户明确提问", "记录使用前后的任务变化", "每周把反馈转成产品决策"],
        pitfalls: ["只追安装数", "没有联系用户的方式", "把沉默用户当满意用户"],
        source: "经验判断，结合订阅留存与产品验证实践",
        sourceUrls: [sourceLinks.revenueCat2026],
        verified
      }
    ]
  };

  Object.entries(advancedCards).forEach(([topicId, cards]) => {
    const topic = topicById.get(topicId);
    if (!topic || !Array.isArray(topic.cards)) return;
    topic.cards.push(...cards);
  });
})();
