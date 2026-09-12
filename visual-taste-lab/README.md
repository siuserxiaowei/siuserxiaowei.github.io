# Visual Taste Lab

<!-- SIUSER-REPO-GUIDE:START -->
## 项目介绍 / Project Introduction

### 中文
视觉品味训练实验室：用 AI 先做视觉身份审计，再生成更少模板味的页面方案。

### English
Visual taste lab that audits brand identity before generating less template-like AI-built pages.

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

- GitHub 仓库 / Repository: https://github.com/siuserxiaowei/visual-taste-lab
- Live / 在线入口：https://siuserxiaowei.github.io/visual-taste-lab/
- 默认分支 / Default branch: `main`
- 主要语言 / Primary language: `HTML`
- 可见性 / Visibility: `public`
- 仓库类型 / Repository type: `source`
- Topics / 主题：`ai-web-design`, `claude-code`, `codex`, `design-system`, `ui-ux`

## 本地运行 / Local Run

```bash
git clone https://github.com/siuserxiaowei/visual-taste-lab.git
cd visual-taste-lab
python3 -m http.server 8000
```

## 仓库结构 / Repository Map

| 路径 / Path | 中文说明 | English |
| --- | --- | --- |
| `README.md` | 项目入口说明，先读这里。 | Main project entry point and orientation. |
| `index.html` | 静态站首页或页面入口。 | Static-site homepage or entry page. |
| `assets` | 图片、样式、数据等资源。 | Images, styles, data, and other assets. |
| `examples` | 示例输入、用法或 fixture。 | Examples, usage samples, or fixtures. |
| `LICENSE` | 许可证文件。 | License file. |
| `visual-taste-lab` | 项目文件或目录。 | Project file or directory. |

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



Open-source design-language workflow for Codex, Claude Code, and other coding agents that need to make frontend UI decisions with clearer taste, evidence, and verification.

<!-- SIUSER-SEO-INTRO:START -->

## 项目介绍 / Project Introduction

**中文介绍**：视觉品味训练实验室，帮助 AI 编程工具先做审美判断，再生成更像真实产品的 UI 页面。

**English**: A visual taste lab that helps AI coding tools reason about aesthetics before generating more product-grade UI pages.

**SEO 关键词 / SEO Keywords**: UI design, UX design, AI design, Codex, Claude Code, 视觉设计

<!-- SIUSER-SEO-INTRO:END -->

让 AI 先学会视觉身份，再开始写页面。  
Make AI understand visual identity before it starts writing webpages.

[Public Preview / 在线预览](https://siuserxiaowei.github.io/visual-taste-lab/) · [Skill File / Skill 文件](visual-taste-lab/SKILL.md) · [Examples / 示例](examples/)

## What It Is / 它是什么

Visual Taste Lab is a UI/UX design-language skill for Codex, Claude Code, and similar coding agents. It helps an agent pause before implementation, read the visual identity, classify the page type, and turn taste into reusable design rules.

Visual Taste Lab 是一个面向 Codex、Claude Code 等编程 Agent 的 UI/UX 审美 Skill。它让 Agent 在动手改页面前，先理解视觉身份、判断页面类型，并把“审美要求”转成可复用的设计语言。

It is not a template, theme pack, or one-line prompt like “make it premium.” The output should be a design direction the agent can apply across typography, color, spacing, surfaces, buttons, cards, forms, tables, imagery, and motion.

它不是网页模板、主题包，也不是一句“做得高级一点”的提示词。它希望产出的，是一套能落到字体、颜色、间距、界面表面、按钮、卡片、表单、表格、图片和动效里的视觉规则。

## OSS Maintainer Workflows / 开源维护场景

Visual Taste Lab is maintained as an open-source workflow for people building with AI coding agents. It is designed to make frontend review, issue triage, documentation, and example validation easier to repeat across projects.

Visual Taste Lab 作为开源工作流维护，面向正在使用 AI 编程 Agent 构建页面、产品和工具的开发者。它希望把前端评审、问题分诊、文档改进和示例验证变成可复用、可检查的维护流程。

Good uses for Codex or similar agents include:

- triaging visual-quality issues into actionable design-language fixes;
- reviewing pull requests for typography, spacing, color, layout, and mobile overflow regressions;
- validating examples and prompts against the project standards;
- drafting release notes, checklist updates, and README improvements from merged changes;
- keeping public examples honest by avoiding invented customer claims, metrics, or screenshots.

适合用 Codex 或类似 Agent 辅助的维护任务包括：

- 把视觉质量问题分诊成可执行的设计语言修复项；
- 在 PR 中检查字体、间距、颜色、布局和移动端溢出回归；
- 按项目标准验证示例和 prompt；
- 根据合并改动生成 release notes、检查清单和 README 改进；
- 确保公开示例不虚构客户、指标或截图。

## Why / 为什么

AI-generated webpages often fail visually because the agent starts drawing screens before it understands the brand system. Visual Taste Lab makes the first step explicit:

AI 生成页面经常“不坏，但很模板化”，原因通常不是代码能力不足，而是 Agent 太早开始画页面。Visual Taste Lab 把第一步拆清楚：

- What visual cues already exist in the logo, wordmark, product, or references?
- Which colors are primary, secondary, accent, neutral, and semantic?
- Is the project a company site, product landing page, transactional utility, content site, dashboard, portfolio, or something else?
- What should a visitor understand and trust within five seconds?
- What should this interface definitely not look like?

- Logo、字标、产品或参考图里已经有哪些视觉线索？
- 主色、辅色、强调色、中性色和语义色分别是什么角色？
- 项目到底是公司官网、产品落地页、交易工具、内容站、后台、作品集，还是其他类型？
- 访客进入页面 5 秒内应该理解什么、相信什么？
- 这个界面最不应该像什么？

## Install / 安装

Clone or download this repository, then copy the skill folder into your local Skills directory.

克隆或下载本仓库，然后把 skill 文件夹复制到本地 Skills 目录。

For Codex:

```bash
cp -R visual-taste-lab ~/.codex/skills/
```

For Claude Code-style local Skills, if your environment supports it:

```bash
cp -R visual-taste-lab ~/.claude/skills/
```

Then invoke it in a task with `$visual-taste-lab`.

安装后，在对话里通过 `$visual-taste-lab` 调用。

## Usage / 使用方式

Use it when you want the agent to improve visual quality without drifting into a generic template.

当你希望 Agent 提升界面质感，但又不想套用通用模板时，可以这样调用：

```text
/goal Use $visual-taste-lab to improve this project visually.

Do not redesign immediately. First run a VI audit, classify the site type,
distill a design language, and only then update the relevant pages/components.

Constraints:
- Do not invent customers, case studies, or metrics.
- Do not delete unrelated files.
- Keep mobile layouts free of horizontal overflow.
- Run build or tests when applicable.
- Summarize changes and recommended next steps.
```

More copyable prompts are available in [examples/goal-prompts.md](examples/goal-prompts.md).

更多可复制 prompt 见 [examples/goal-prompts.md](examples/goal-prompts.md)。

## Workflow / 工作流

1. **Collect references / 收集参考**

   Use screenshots, URLs, brand names, existing pages, or the current codebase.

2. **Run a VI audit / 进行 VI 审计**

   Identify logo cues, color roles, typography, imagery style, and component geometry.

3. **Classify the project / 判断项目类型**

   Separate company sites, product pages, utilities, content sites, dashboards, portfolios, and other page types.

4. **Distill a design language / 提炼设计语言**

   Define color roles, type scale, spacing, radius, surfaces, cards, buttons, tables, CTAs, imagery, motion, and anti-patterns.

5. **Implement system-first / 先落系统，再改页面**

   Update shared tokens and components before polishing isolated sections.

6. **Verify / 验证**

   Build or test the project, check desktop and mobile layouts, and keep claims honest.

## Examples / 示例

- [Goal prompts / 目标 prompt](examples/goal-prompts.md): 6 copyable prompts for common UI improvement tasks.
- [Design language sample / 设计语言样例](examples/design-language-sample.md): a fictional output showing the kind of direction the skill can produce.

## Repository Structure / 仓库结构

```text
visual-taste-lab/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── archetypes.md
    └── design-language-template.md
```

- `SKILL.md`: core workflow, design standards, anti-patterns, and output contract.
- `references/archetypes.md`: visual archetypes for different site types.
- `references/design-language-template.md`: template for the design-language output.
- `agents/openai.yaml`: display metadata for the skill UI.

- `SKILL.md`：核心工作流、设计标准、反模式和输出要求。
- `references/archetypes.md`：不同站点类型对应的视觉原型。
- `references/design-language-template.md`：设计语言输出模板。
- `agents/openai.yaml`：Skill 在界面中的展示信息。

## Privacy / 隐私

This repository uses fictional examples and generic scenarios. It should not contain private project materials, confidential screenshots, customer data, internal metrics, or non-public strategy notes.

本仓库只使用虚构示例和通用场景，不应包含私有项目素材、保密截图、客户数据、内部指标或未公开策略记录。

When using the skill on your own work, remove sensitive information before sharing screenshots, URLs, documents, or code with an AI agent.

实际项目中使用时，请先清理敏感信息，再把截图、URL、文档或代码交给 AI Agent 分析。

## Links / 链接

- Public preview / 在线预览: [siuserxiaowei.github.io/visual-taste-lab](https://siuserxiaowei.github.io/visual-taste-lab/)
- Skill entry / Skill 入口: [visual-taste-lab/SKILL.md](visual-taste-lab/SKILL.md)
- Archetypes / 视觉原型: [visual-taste-lab/references/archetypes.md](visual-taste-lab/references/archetypes.md)
- Design language template / 设计语言模板: [visual-taste-lab/references/design-language-template.md](visual-taste-lab/references/design-language-template.md)

## License / 许可证

MIT. See [LICENSE](LICENSE).

<!-- SIUSER-CONTACT:START -->

## 联系我 / Contact

想交流 AI 工具、内容自动化、SEO、私域增长或项目合作，可以扫码加我微信。

For collaboration on AI tools, content automation, SEO, private-domain growth, or product experiments, scan the WeChat QR code below.

<img src="https://raw.githubusercontent.com/siuserxiaowei/siuserxiaowei/main/assets/contact/wechat-qrcode.jpg" width="180" alt="WeChat QR code / 微信二维码" />

**关键词 / Keywords**: UI design, UX design, AI design, Codex, AI tools, AI automation, GitHub Pages, SEO

<!-- SIUSER-CONTACT:END -->
