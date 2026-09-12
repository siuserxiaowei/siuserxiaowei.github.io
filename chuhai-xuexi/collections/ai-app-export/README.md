# AI App 出海学习资料包

<!-- SIUSER-REPO-GUIDE:START -->
## 项目介绍 / Project Introduction

### 中文
AI App 出海学习资料包：面向独立开发者和小团队的出海案例、学习路径、评分表与静态站。

### English
AI app export learning hub with case studies, learning paths, scorecards, and a static study site.

## 使用方式 / Usage

### 中文
1. 优先打开在线入口或本地静态服务查看最终页面。
2. 内容型仓库通常从 `README.md`、`docs/`、`data/` 或 `content/` 开始阅读。
3. 更新资料后，重新生成或刷新静态页面，并检查链接、图片和文字是否正常。

### English
1. Start with the live link or a local static server to view the final page.
2. For content repositories, begin with `README.md`, `docs/`, `data/`, or `content/`.
3. After updating material, regenerate or refresh the static page and check links, images, and copy.

## 入口与元信息 / Entry Points & Metadata

- GitHub 仓库 / Repository: https://github.com/siuserxiaowei/ai-app-export-learning-hub
- Live / 在线入口：http://gptimage2.store/
- 默认分支 / Default branch: `main`
- 主要语言 / Primary language: `JavaScript`
- 可见性 / Visibility: `public`
- 仓库类型 / Repository type: `source`

## 本地运行 / Local Run

```bash
git clone https://github.com/siuserxiaowei/ai-app-export-learning-hub.git
cd ai-app-export-learning-hub
python3 -m http.server 8000
```

## 仓库结构 / Repository Map

| 路径 / Path | 中文说明 | English |
| --- | --- | --- |
| `README.md` | 项目入口说明，先读这里。 | Main project entry point and orientation. |
| `index.html` | 静态站首页或页面入口。 | Static-site homepage or entry page. |
| `docs` | 文档或 GitHub Pages 输出目录。 | Documentation or GitHub Pages output. |
| `data` | 数据、索引或结构化内容。 | Data, indexes, or structured content. |
| `scripts` | 构建、同步、生成或维护脚本。 | Build, sync, generation, or maintenance scripts. |
| `LICENSE` | 许可证文件。 | License file. |
| `site` | 本地站点构建输出或站点源文件。 | Local site output or site source files. |
| `.gitignore` | 项目文件或目录。 | Project file or directory. |
| `.nojekyll` | 项目文件或目录。 | Project file or directory. |
| `ads.txt.template` | 项目文件或目录。 | Project file or directory. |
| `ATTRIBUTION.html` | 项目文件或目录。 | Project file or directory. |
| `ATTRIBUTION.md` | 项目文件或目录。 | Project file or directory. |

## 维护备注 / Maintenance Notes

- 中文：当项目目标、在线入口、运行命令或目录结构变化时，同步更新本说明。
- English: Keep this guide updated when the project purpose, live link, run commands, or structure changes.
- 中文：修改代码、数据或生成页面后，优先运行相关构建、测试或校验命令。
- English: After changing code, data, or generated pages, run the relevant build, test, or validation command.

## 安全与隐私 / Safety & Privacy

- 中文：不要提交 API key、token、密码、cookie、私有链接或内部账号资料。
- English: Do not commit API keys, tokens, passwords, cookies, private URLs, or internal account data.
- 中文：公开 GitHub Pages 前，确认资料已脱敏并允许公开。
- English: Before publishing GitHub Pages output, confirm the material is redacted and cleared for public release.
<!-- SIUSER-REPO-GUIDE:END -->



这是一套面向 OPC（One-Person Company）、超级个体、独立开发者和小团队的 AI App 出海知识库与学习资料包。它把抖音视频观点、公开行业资料、竞品案例、产品验证方法和平台合规要求，整理成可以自学、带学、公开分享和静态站浏览的成套内容。

资料包的核心判断是：AI App 出海不是把中文产品翻译成英文，也不是做一个更小的通用 AI 工具。小团队更现实的机会，是找到具体人群、具体任务和具体商业结果，用 AI 把旧工作流压缩成一个可付费、可复用、可传播的小闭环。

## 适合人群

- 准备做 AI App / AI SaaS 出海的独立开发者。
- 想把 AI 能力产品化的产品经理、设计师、创作者和超级个体。
- 正在寻找海外小 B / prosumer 工具机会的小团队。
- 需要组织 AI App 出海主题分享、训练营或社群打卡的讲师和运营者。

## 学习路径

1. 先读 [学习指南](docs/learning-guide.md)，建立出海、本地化、OPC、AI 工作流和验证框架。
2. 再读 [案例学习册](docs/case-study-workbook.md)，用 10 个竞品案例理解什么该学、什么不该照搬。
3. 用 [品牌拆解手册](docs/brand-teardown-handbook.md) 学会判断海外 AI App 的命名、首页、信任层、定价和传播钩子。
4. 读 [OPC App 方向剧本](docs/opc-app-playbook.md)，把研究结论转成 10 个可验证方向。
5. 打开 [机会评分表](data/opportunity-scorecard.csv)，给自己的候选方向打分，筛掉泛 AI 工具和高风险赛道。
6. 按 [7 天学习计划](docs/7-day-learning-plan.md) 完成自学、社群打卡或小组共创。
7. 对外发布时使用 [公开内容包](docs/public-content-pack.md)，带课或带社群时配合 [讲师与社群带学指南](docs/facilitator-guide.md)。
8. 需要核对来源、视频摘要和研究依据时，阅读 [源摘要](docs/source-brief.md)。
9. 需要解释“为什么没有完整逐字稿/逐句译文”或做英文学习表达时，阅读 [合规双语学习稿](docs/bilingual-study-note.md) 和 [原目标覆盖矩阵](docs/goal-coverage-matrix.md)。
10. 需要做最终验收或交接时，阅读 [最终完成度审计](docs/final-completion-audit.md)。
11. 如果要开源引用、接 Google AdSense 或用 Google Ads 小预算推广，阅读 [Google Ads 与 AdSense 接入说明](docs/google-ads-and-adsense-setup.md) 和 [Google Ads 小预算推广计划](docs/google-ads-campaign-plan.md)。
12. 需要复查市场报告、政策和竞品来源时，阅读 [研究证据登记表](docs/research-evidence-register.md) 和 [知识库来源登记表](docs/knowledge-source-register.md)。
13. 如果后续提供授权文本，按 [授权逐字稿处理流程](docs/authorized-transcript-workflow.md) 生成私有逐字稿、翻译稿和公开版学习材料。

## 资料目录

| 文件 | 用途 |
| --- | --- |
| [DELIVERY_INDEX.md](DELIVERY_INDEX.md) | 交付物总索引，说明每个文件的用途、发布建议和学习顺序。 |
| [docs/source-brief.md](docs/source-brief.md) | 源摘要和研究底稿，保留视频元信息、合规短摘录、分段转述、英文摘要和参考来源。 |
| [docs/bilingual-study-note.md](docs/bilingual-study-note.md) | 合规双语学习稿，用中文转述、英文学习译稿和术语表替代完整逐字稿/逐句译文。 |
| [docs/goal-coverage-matrix.md](docs/goal-coverage-matrix.md) | 原目标覆盖矩阵，说明哪些目标已完成、哪些采用合规替代、哪些不能声称完整完成。 |
| [docs/final-completion-audit.md](docs/final-completion-audit.md) | 最终完成度审计，列出线上证据、逐项目标判断、验证命令和不能声明完成的部分。 |
| [docs/research-evidence-register.md](docs/research-evidence-register.md) | 研究证据登记表，集中维护市场报告、平台政策、竞品/品牌和上线证据。 |
| [docs/knowledge-source-register.md](docs/knowledge-source-register.md) | 知识库来源登记表，维护 8 个专题、48 张知识卡、24 个网页整理、平台政策、订阅报告、提示词资产化和 HTTPS 上线修复项。 |
| [docs/authorized-transcript-workflow.md](docs/authorized-transcript-workflow.md) | 授权逐字稿处理流程，说明授权文本到位后如何生成私有逐字稿、译文和公开学习材料。 |
| [docs/google-ads-and-adsense-setup.md](docs/google-ads-and-adsense-setup.md) | Google AdSense 展示广告、Google Ads 转化追踪和域名接入说明。 |
| [docs/google-ads-campaign-plan.md](docs/google-ads-campaign-plan.md) | Google Ads 小预算投放计划、关键词、广告文案和转化目标。 |
| [docs/learning-guide.md](docs/learning-guide.md) | 主学习文档，讲清小团队做 AI App 出海的判断框架。 |
| [docs/case-study-workbook.md](docs/case-study-workbook.md) | 10 个竞品案例学习册，适合课堂练习和产品迁移。 |
| [docs/brand-teardown-handbook.md](docs/brand-teardown-handbook.md) | 品牌拆解手册，训练学习者看懂命名、首页、信任层、定价和传播钩子。 |
| [docs/opc-app-playbook.md](docs/opc-app-playbook.md) | OPC App 方向剧本，把 10 个候选方向拆成用户、旧流程、MVP、渠道实验和淘汰标准。 |
| [data/opportunity-scorecard.csv](data/opportunity-scorecard.csv) | 机会评分表，用于比较和筛选产品方向。 |
| [docs/7-day-learning-plan.md](docs/7-day-learning-plan.md) | 7 天自学、打卡或训练营安排。 |
| [docs/public-content-pack.md](docs/public-content-pack.md) | 可发布长文、30 分钟公开课讲稿和 10 张卡片文案。 |
| [docs/facilitator-guide.md](docs/facilitator-guide.md) | 讲师和社群运营使用说明。 |
| [site/index.html](site/index.html) | 静态知识库首页，提供 8 个专题、48 张知识卡、24 张网页资料卡、统一搜索、提示词资产工具包和深度资料库。 |
| [site/content.js](site/content.js) | 全局内容注册文件，统一暴露 `window.learningHubContent`。 |
| [site/content-advanced-cards.js](site/content-advanced-cards.js) | 24 张进阶知识卡扩展文件。 |
| [site/content-web-extra.js](site/content-web-extra.js) | 12 张新增网页资料卡扩展文件。 |
| [site/content-toolkits.js](site/content-toolkits.js) | 提示词资产 SOP、客户输入表、输出质检表和失败样本回放流程。 |
| [sitemap.xml](sitemap.xml) | 搜索引擎站点地图，当前使用 HTTP canonical，待 HTTPS 修复后切换。 |
| [robots.txt](robots.txt) | 搜索引擎抓取声明。 |
| [llms.txt](llms.txt) | 给 AI 检索工具的项目摘要和入口索引。 |
| [site/privacy.html](site/privacy.html) | 隐私说明页面，适合 AdSense / Google Ads 审核前准备。 |
| [site/terms.html](site/terms.html) | 使用条款页面，说明学习用途、广告边界和免责声明。 |
| [QA_REPORT.md](QA_REPORT.md) | 验收范围、版权边界和基础检查记录。 |
| [LICENSE](LICENSE) | CC BY 4.0 开源协议说明。 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 贡献规则、来源引用和版权边界。 |
| [ATTRIBUTION.md](ATTRIBUTION.md) | 署名方式、第三方内容边界和广告边界。 |

## 开源协议

除非特别说明，本项目文档、表格和静态站内容采用 [CC BY 4.0](LICENSE)。你可以复制、传播和改编，包括商用，但需要保留适当署名、协议链接和改动说明。

推荐引用格式：

```text
AI App Export Learning Hub, by siuserxiaowei, licensed under CC BY 4.0.
Project: http://gptimage2.store/site/index.html
Repository: https://github.com/siuserxiaowei/ai-app-export-learning-hub
```

贡献内容前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，尤其是不要提交未授权完整逐字稿、完整逐句翻译或大段第三方付费资料。

## 版权边界

本资料包不提供原视频全文转写，也不提供逐句译文。资料中只保留必要的合规短摘录、分段转述、英文摘要、教学化分析和公开来源引用。对外发布时，建议引用资料包观点和公开来源，不要把源视频内容包装成原作者授权课程或官方翻译稿。

## 广告和隐私说明

项目已为后续 Google AdSense 展示广告和 Google Ads 买量推广预留结构：

- `ads.txt.template`：拿到真实 AdSense publisher ID 后再复制成根目录 `ads.txt`。
- `site/google-ads-config.js`：当前默认关闭，不加载 Google tag。
- `site/tracking.js`：只有配置启用且存在真实 conversion ID 时才发送转化事件。
- `site/privacy.html` 和 `site/terms.html`：用于说明隐私、广告、学习用途和免责声明。

当前不会写入假的 `ca-pub-...`、`AW-...` 或 conversion label。

## 打开静态站

这是纯静态站，不需要启动开发服务器。直接在浏览器打开：

```bash
open site/index.html
```

公开访客阅读深度资料时，请使用生成后的 HTML 页面，例如 `docs/learning-guide.html`、`docs/case-study-workbook.html`、`README.html`。仓库中的 `*.md` 文件保留给编辑和协作使用，发布站点的按钮和资料入口不再直接指向 raw Markdown。

线上页面：

http://gptimage2.store/site/index.html

自有域名 HTTPS 当前仍待 DNS / 证书修复，正式推广前不要把 `https://gptimage2.store/` 作为主入口。

GitHub Pages 备用地址：

https://siuserxiaowei.github.io/ai-app-export-learning-hub/
