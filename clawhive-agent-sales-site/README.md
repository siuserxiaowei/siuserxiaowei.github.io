# 企业级 AI Agent 竞品销售话术库

<!-- SIUSER-REPO-GUIDE:START -->
## 项目介绍 / Project Introduction

### 中文
Clawhive Agent 销售站：面向企业自动化与 AI Agent 服务的产品展示和转化页面。

### English
Clawhive Agent sales site for presenting business automation and AI agent services.

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

- GitHub 仓库 / Repository: https://github.com/siuserxiaowei/clawhive-agent-sales-site
- Live / 在线入口：https://siuserxiaowei.github.io/clawhive-agent-sales-site/
- 默认分支 / Default branch: `main`
- 主要语言 / Primary language: `JavaScript`
- 可见性 / Visibility: `public`
- 仓库类型 / Repository type: `source`

## 本地运行 / Local Run

```bash
git clone https://github.com/siuserxiaowei/clawhive-agent-sales-site.git
cd clawhive-agent-sales-site
python3 -m http.server 8000
```

## 仓库结构 / Repository Map

| 路径 / Path | 中文说明 | English |
| --- | --- | --- |
| `README.md` | 项目入口说明，先读这里。 | Main project entry point and orientation. |
| `index.html` | 静态站首页或页面入口。 | Static-site homepage or entry page. |
| `assets` | 图片、样式、数据等资源。 | Images, styles, data, and other assets. |
| `docs` | 文档或 GitHub Pages 输出目录。 | Documentation or GitHub Pages output. |
| `.nojekyll` | 项目文件或目录。 | Project file or directory. |
| `app.js` | 项目文件或目录。 | Project file or directory. |
| `data.js` | 项目文件或目录。 | Project file or directory. |
| `styles.css` | 项目文件或目录。 | Project file or directory. |

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



<!-- SIUSER-SEO-INTRO:START -->

## 项目介绍 / Project Introduction

**中文介绍**：Clawhive Agent 销售展示站，用网页讲清楚 AI Agent 服务、自动化价值和业务落地场景。

**English**: A sales website for Clawhive Agent services, explaining AI agent value, automation benefits, and business use cases.

**SEO 关键词 / SEO Keywords**: AI agent, sales site, business automation, landing page, Agent 服务

<!-- SIUSER-SEO-INTRO:END -->

这是一个可直接部署到 GitHub Pages 的静态交互网页，用于给销售/商务人员快速讲清楚“帝王蟹 ClawHive 与各家企业级 AI Agent 产品差在哪”。

## 文件结构

```text
.
├── index.html              # 页面主体
├── styles.css              # 页面样式
├── data.js                 # 竞品话术数据
├── app.js                  # 搜索、筛选、复制、对比逻辑
├── assets/market-map.svg   # 市场地图
├── docs/竞品话术清单.md      # Markdown 版话术备份
└── .nojekyll               # GitHub Pages 静态部署标记
```

## GitHub Pages 部署

1. 将本目录内所有文件放到 GitHub 仓库根目录，或放到仓库的 `docs/` 目录。
2. 在 GitHub 仓库进入 `Settings → Pages`。
3. `Source` 选择 `Deploy from a branch`。
4. 分支选择 `main`，目录选择 `/root`；如果放在 `docs/`，目录选择 `/docs`。
5. 保存后等待 Pages 生成公开访问地址。

## 内容说明

- 页面内容基于用户提供的《销售战斗卡》《竞品科普报告·修订版》《OpenClaw 生态深度分析报告》整理。
- 以“销售话术版”为目标，不写成技术白皮书。
- 每个竞品卡片均包含：一句话定位、三个核心优势、三个主要限制、对比帝王蟹 ClawHive 的差异化切入点。
- 修订版报告明确删除的未经验证硬数据未作为页面核心证据使用。

<!-- SIUSER-CONTACT:START -->

## 联系我 / Contact

想交流 AI 工具、内容自动化、SEO、私域增长或项目合作，可以扫码加我微信。

For collaboration on AI tools, content automation, SEO, private-domain growth, or product experiments, scan the WeChat QR code below.

<img src="https://raw.githubusercontent.com/siuserxiaowei/siuserxiaowei/main/assets/contact/wechat-qrcode.jpg" width="180" alt="WeChat QR code / 微信二维码" />

**关键词 / Keywords**: AI agent, sales site, business automation, landing page, AI tools, AI automation, GitHub Pages, SEO

<!-- SIUSER-CONTACT:END -->
