# 研究证据登记表

维护日期：2026-06-02

用途：记录本资料包中关键研究判断所依赖的公开来源，方便讲课、发布、复查和后续更新。

## 使用说明

这不是“引用越多越权威”的装饰页。它用于回答三个问题：

1. 这个判断来自哪里？
2. 这个来源支撑的是市场规模、平台规则、竞品功能、增长案例，还是品牌观察？
3. 这个来源未来容易不会失效，应该多久复查一次？

## 证据等级

| 等级 | 类型 | 使用方式 |
| --- | --- | --- |
| A | 官方文档、平台官网、平台政策、公司公告 | 可作为事实基础，但仍要注意页面更新。 |
| B | 行业报告、数据平台报告、公开案例研究 | 可支持趋势判断，引用时保留报告年份和口径。 |
| C | 媒体报道、创始人访谈、社区帖子 | 可作为案例线索，不宜单独当作强事实结论。 |
| D | 本资料包原创分析 | 可用于教学和判断框架，但不要伪装成外部事实。 |

## 市场与订阅趋势

| 来源 | 等级 | 支撑的判断 | 使用位置 | 维护风险 |
| --- | --- | --- | --- | --- |
| Sensor Tower, State of AI Apps Market Overview 2025: https://sensortower.com/blog/state-of-ai-apps-market-overview-2025 | B | 生成式 AI App 市场需求真实存在，但收入和下载向头部集中。 | `docs/source-brief.md`、`docs/learning-guide.md` | 报告口径未来会更新；季度复查。 |
| Sensor Tower, State of Mobile AI Apps 2025: https://sensortower.com/blog/2025-state-of-mobile-ai-is-everywhere-on-mobile | B | AI 正在移动端扩散，但通用入口竞争强。 | `docs/source-brief.md` | 可能改版；季度复查。 |
| RevenueCat, State of Subscription Apps 2026 Social & Lifestyle: https://www.revenuecat.com/state-of-subscription-apps-2026-social-and-lifestyle/ | B | 订阅 App 供给增加，C 端订阅竞争更激烈。 | `docs/source-brief.md`、`docs/learning-guide.md` | 年度报告会更新；季度复查。 |
| RevenueCat, State of Subscription Apps 2026 Productivity: https://www.revenuecat.com/state-of-subscription-apps-2026-productivity/ | B | Productivity/Business 类工具更适合从工作流和 ROI 切入。 | `docs/source-brief.md`、`docs/learning-guide.md` | 年度报告会更新；季度复查。 |
| TechCrunch on RevenueCat 2026 AI app retention: https://techcrunch.com/2026/03/10/ai-powered-apps-can-make-money-but-struggle-with-long-term-retention-new-data-shows/ | C | AI App 早期变现强，但留存和流失是问题。 | `docs/source-brief.md` | 媒体报道可作为线索；复核 RevenueCat 原始数据。 |

## 平台政策与合规

| 来源 | 等级 | 支撑的判断 | 使用位置 | 维护风险 |
| --- | --- | --- | --- | --- |
| Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/ | A | iOS App 上架、订阅、隐私、内容边界需要提前设计。 | `docs/source-brief.md`、`docs/learning-guide.md` | 平台政策会变；发布前复查。 |
| Google Play AI-Generated Content policy: https://support.google.com/googleplay/android-developer/answer/14094294 | A | Google Play 对 AI 生成内容和用户举报/处置有政策要求。 | `docs/source-brief.md`、`docs/learning-guide.md` | 平台政策会变；发布前复查。 |
| Google Play Subscriptions policy: https://support.google.com/googleplay/android-developer/answer/9900533 | A | Android 订阅、取消、价格展示和合规需要单独确认。 | `docs/source-brief.md` | 平台政策会变；发布前复查。 |

## 竞品和品牌来源

| 产品/品牌 | 来源 | 等级 | 支撑的判断 | 使用位置 | 维护风险 |
| --- | --- | --- | --- | --- | --- |
| Cal AI | Official site: https://calai.me/ | A | Cal AI 的品牌定位围绕 calorie tracking 和拍照记录。 | `docs/brand-teardown-handbook.md` | 官网可能改版。 |
| Cal AI | App Store page: https://apps.apple.com/us/app/cal-ai-food-calorie-tracker/id6480417616 | A | 移动端定位、用户场景和 App Store 展示。 | `docs/brand-teardown-handbook.md` | 商店页面会随版本更新。 |
| Cal AI | Superwall case study: https://superwall.com/case-studies/cal-ai | B | Paywall 实验和订阅增长案例。 | `docs/source-brief.md`、`docs/learning-guide.md` | 案例页可能改版。 |
| Cal AI | TechCrunch profile: https://techcrunch.com/2025/03/16/photo-calorie-app-cal-ai-downloaded-over-a-million-times-was-built-by-two-teenagers/ | C | 下载量、团队背景和媒体叙事线索。 | `docs/source-brief.md`、`docs/learning-guide.md` | 媒体数据需保留“报道称”口径。 |
| Cal AI | MyFitnessPal acquisition announcement: https://www.globenewswire.com/news-release/2026/03/02/3247439/0/en/myfitnesspal-acquires-cal-ai-expanding-on-its-position-as-the-leading-player-in-digital-nutrition-tracking.html | A | MyFitnessPal 收购 Cal AI 的公开公司公告。 | `docs/source-brief.md` | 公司公告稳定，但标题大小写 URL 可能变化。 |
| Photoroom | API page: https://www.photoroom.com/api | A | Photoroom 面向电商和批量商品视觉工作流。 | `docs/source-brief.md`、`docs/brand-teardown-handbook.md` | 官网可能改版。 |
| Photoroom | API docs: https://docs.photoroom.com/ | A | API、批处理和接入场景。 | `docs/brand-teardown-handbook.md` | 文档会随 API 更新。 |
| Gamma | API help center: https://help.gamma.app/en/articles/11962420-does-gamma-have-an-api | A | Gamma 从 presentation 扩展到可程序化表达物生成。 | `docs/source-brief.md`、`docs/brand-teardown-handbook.md` | Help center 文章可能更新。 |
| HeyGen | Enterprise page: https://www.heygen.com/enterprise | A | HeyGen 从头像生成走向企业视频工作流。 | `docs/source-brief.md`、`docs/learning-guide.md` | 官网可能重定向。 |
| HeyGen | Video translator: https://www.heygen.com/translate/ | A | 视频翻译、配音、字幕和多语言传播场景。 | `docs/brand-teardown-handbook.md` | 产品页可能改版。 |
| Lovart | Public launch: https://www.lovart.ai/actions/news/lovart-design-agent-public-launch-chatcanvas | A | Lovart 的 Design Agent 和 ChatCanvas 定位。 | `docs/source-brief.md`、`docs/learning-guide.md`、`docs/brand-teardown-handbook.md` | 浏览器可读；脚本请求可能返回异常，需人工复查。 |
| Captions | Plans: https://www.captions.ai/plans | A | Captions 的视频创作和订阅模块线索。 | `docs/source-brief.md`、`docs/brand-teardown-handbook.md` | 定价页会变。 |
| Captions | Subscription help: https://help.captions.ai/docs/subscriptions | A | 订阅结构和产品模块线索。 | `docs/brand-teardown-handbook.md` | Help docs 可能改版。 |
| ElevenLabs | Text to Speech API: https://elevenlabs.io/text-to-speech-api/ | A | 语音基础设施、API 和开发者接入定位。 | `docs/source-brief.md`、`docs/brand-teardown-handbook.md` | URL 可能 308 跳转；跟随跳转即可。 |
| PDF.ai | Pricing: https://pdf.ai/pricing | A | PDF 对话类工具的订阅/产品包装线索。 | `docs/source-brief.md`、`docs/brand-teardown-handbook.md` | 定价页会变。 |

## 独立开发者和分发案例

| 来源 | 等级 | 支撑的判断 | 使用位置 | 维护风险 |
| --- | --- | --- | --- | --- |
| Indie Hackers on Photo AI revenue milestone: https://www.indiehackers.com/post/tech/pieter-levels-just-passed-100-000-a-month-in-revenue-with-photoai-NToMGI3ZjwSBOfTywZnG | C | Photo AI / Interior AI 的 solo founder、公开构建和分发资产线索。 | `docs/source-brief.md`、`docs/brand-teardown-handbook.md` | 社区帖不宜作为强事实，只作案例线索。 |

## 原始视频来源

| 来源 | 等级 | 支撑的判断 | 使用位置 | 维护风险 |
| --- | --- | --- | --- | --- |
| Douyin short link: 原始短链曾记录为 v.douyin.com/1tHsuHuW8fg，2026-06-02 复查时已不可作为稳定公开来源。 | C | 原始视频入口和研究主题来源。 | `docs/source-brief.md` | 短链可能失效；不依赖其长期可访问性。 |

## 项目上线证据

| 来源 | 等级 | 支撑的判断 | 使用位置 | 维护风险 |
| --- | --- | --- | --- | --- |
| GitHub repository: https://github.com/siuserxiaowei/ai-app-export-learning-hub | A | 公开资料包仓库。 | `docs/final-completion-audit.md` | 仓库若改名需更新。 |
| GitHub Pages: https://siuserxiaowei.github.io/ai-app-export-learning-hub/ | A | 在线学习站入口。 | `README.md`、`docs/final-completion-audit.md` | Pages 若关闭或仓库改名需更新。 |

## 维护流程

每月做一次轻量维护：

```text
1. 打开 docs/research-evidence-register.md。
2. 检查 A 级来源是否仍可访问。
3. 对 B/C 级来源确认报告年份、媒体口径和是否有更新。
4. 如果来源失效，在对应文档里替换链接，并在 QA_REPORT.md 记录。
5. 运行 python3 scripts/verify_package.py。
6. 推送到 GitHub，并确认 GitHub Pages 状态为 built。
```

## 引用原则

1. 外部数字只说“报告显示”或“报道称”，不要写成无条件事实。
2. 竞品页面只支持“其官网如何定位自己”，不等于证明其商业结果。
3. 媒体报道和社区帖只作线索，尽量用官方公告或平台数据交叉验证。
4. 对外发布时优先引用 A/B 级来源，C 级来源要保留不确定性。
5. 不用任何来源来支撑“稳赚”“必爆”“无风险”这类结论。
