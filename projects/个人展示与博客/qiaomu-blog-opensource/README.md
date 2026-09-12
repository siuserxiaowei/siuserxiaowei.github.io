# Qiaomu Blog Open Source

<!-- SIUSER-REPO-GUIDE:START -->
## 项目介绍 / Project Introduction

### 中文
Cloudflare 博客模板（fork）：基于 OpenNext、Next.js、D1 和 R2 的开源博客参考。

### English
Forked Cloudflare blog template based on OpenNext, Next.js, D1, and R2.

## 使用方式 / Usage

### 中文
1. 先克隆仓库并安装 Node 依赖。
2. 根据 `package.json` 中的 scripts 启动开发、构建或测试命令。
3. 如果有在线入口，先对照线上页面理解最终效果，再回到源码修改。

### English
1. Clone the repository and install the Node dependencies.
2. Use the scripts in `package.json` for development, build, or tests.
3. If a live link exists, review the deployed page first, then make source changes.

## 入口与元信息 / Entry Points & Metadata

- GitHub 仓库 / Repository: https://github.com/siuserxiaowei/qiaomu-blog-opensource
- 默认分支 / Default branch: `main`
- 主要语言 / Primary language: `TypeScript`
- 可见性 / Visibility: `public`
- 仓库类型 / Repository type: `fork`

## 本地运行 / Local Run

```bash
git clone https://github.com/siuserxiaowei/qiaomu-blog-opensource.git
cd qiaomu-blog-opensource
npm install
npm run dev
npm run start
npm run build
npm test
```

## 仓库结构 / Repository Map

| 路径 / Path | 中文说明 | English |
| --- | --- | --- |
| `README.md` | 项目入口说明，先读这里。 | Main project entry point and orientation. |
| `package.json` | Node/前端项目配置、依赖和脚本。 | Node/frontend dependencies and scripts. |
| `app` | 应用路由或主要页面目录。 | Application routes or main page directory. |
| `components` | 可复用 UI 或功能组件。 | Reusable UI or feature components. |
| `lib` | 共享工具、业务逻辑或集成代码。 | Shared utilities, business logic, or integrations. |
| `public` | 公开静态资源。 | Public static assets. |
| `docs` | 文档或 GitHub Pages 输出目录。 | Documentation or GitHub Pages output. |
| `scripts` | 构建、同步、生成或维护脚本。 | Build, sync, generation, or maintenance scripts. |
| `tests` | 测试用例与验证脚本。 | Tests and validation scripts. |
| `.github` | GitHub Actions 和协作自动化配置。 | GitHub Actions and collaboration automation. |
| `LICENSE` | 许可证文件。 | License file. |
| `db` | 项目文件或目录。 | Project file or directory. |

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



[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/joeseesun/qiaomu-blog-opensource)
[![Use this template](https://img.shields.io/badge/GitHub-Use%20this%20template-111111?logo=github)](https://github.com/joeseesun/qiaomu-blog-opensource/generate)

如果你也想拥有一个真正属于自己的学习、写作、分享阵地，而不是把内容完全寄托在平台算法上，这个项目就是为此做的。

Qiaomu Blog Open Source 不是一个只会渲染 Markdown 的静态模板，而是一套完整的博客系统：前后台双编辑器、AI 写作辅助、AI 生图、主题系统、全文检索、API Token、外部发布生态都已经接好，目标就是让你更容易持续写下去。

- 在线示例：<https://blog.qiaomu.ai/>
- 介绍文章：<https://blog.qiaomu.ai/qiaomu-blog-opensource>
- 当前仓库：<https://github.com/joeseesun/qiaomu-blog-opensource>

## 为什么值得做成自己的站

- 自媒体账号可能被封，平台流量也可能波动，但自己的站点不会
- 写作系统应该足够轻，打开就能写，而不是被后台流程打断
- AI 最该服务的是摘要、标签、封面、slug、生图这些重复工作
- 博客不该只是展示页，还应该是你的长期知识资产

## 你会得到什么

- 前台、后台都能编辑，所见即所得，接近飞书 / Notion 的写作体验
- 四套首页主题，移动端友好，开箱即用
- Bubble Menu + Ask AI，选中文本就能改写、润色、扩写、翻译
- AI 自动处理摘要、标签、SEO slug、封面图
- AI 生图模型和模板配置、最近生成记录、插入和替换工作流
- 图片右键菜单：下载、设为封面、对齐、裁剪、参考生图
- 发布状态：公开、草稿、密码访问、链接访问
- 默认初始化配置：主题、导航、字体、AI 文本模型模板、AI 生图模型模板
- Cloudflare Workers + D1 + R2 部署，不需要自己维护服务器和 CDN

## 截图预览

### 四套首页主题

![四套首页主题](docs/screenshots/home-themes.webp)

### 编辑器与所见即所得写作

![编辑器总览](docs/screenshots/editor-overview.webp)

### Ask AI / Bubble Menu

![Ask AI](docs/screenshots/ask-ai.png)

### 后台设置与主题、代码、API Token 管理

![后台设置](docs/screenshots/admin-settings.webp)

### 多种发布状态

![发布状态](docs/screenshots/publish-states.png)

### AI 模型与生图配置

![图片模型配置](docs/screenshots/image-provider.png)

## 配套生态也一起开源了

这个仓库不只开源博客主站，也把外部发布工具一起放进来了。你可以把“写作入口”放在最顺手的地方，但最终都回到同一个博客后台。

- [`ecosystem/chrome-clipper`](ecosystem/chrome-clipper/README.md)：浏览器网页剪藏，直接进入博客草稿箱
- [`ecosystem/obsidian-publisher`](ecosystem/obsidian-publisher/README.md)：从 Obsidian 一键发布到博客
- [`ecosystem/qiaomu-blog-publish-skill`](ecosystem/qiaomu-blog-publish-skill/README.md)：通过 Claude Skill / 命令工作流直接发布
- [`ecosystem/README.md`](ecosystem/README.md)：生态工具总览

## 一键部署到 Cloudflare

直接点击上面的 `Deploy to Cloudflare` 按钮即可。

这个模板已经补好了适合 Deploy Button 的配置：

- Cloudflare 会读取仓库里的 Worker 配置
- 自动创建需要的 `D1` / `R2` 绑定
- 使用仓库里的自定义 deploy script
- 部署时自动应用数据库 schema 和模板默认配置

部署时建议准备这些值：

- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_PASSWORD`
- `ADMIN_TOKEN_SALT`
- `AI_CONFIG_ENCRYPTION_SECRET`
- `AI_API_KEY`（可选）

如果你更想手动掌控 Cloudflare 资源，也可以走 CLI：

```bash
npm install
cp .env.example .env.local
npx wrangler login
npm run cf:init -- --site-url=https://your-domain.com
npm run build
npm run deploy
```

## 本地开发

```bash
git clone https://github.com/joeseesun/qiaomu-blog-opensource.git
cd qiaomu-blog-opensource
npm install
cp .env.example .env.local
npm run dev
```

常用入口：

- 首页：`/`
- 后台：`/admin`
- 编辑器：`/editor`

如果你要在 Worker 运行时本地预览：

```bash
npm run preview
```

## 默认初始化内容

首次初始化后，模板会自动带上这些基础能力：

- 默认导航
- 默认主题与字体
- 默认分类
- AI 文本模型配置模板
- AI 生图模型配置模板
- 文章摘要、标签、slug、封面生成器
- 编辑器 Ask AI 预设动作

所有 API Key 都不会进入仓库，首次部署时通过 Cloudflare secret 或后台配置补齐。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- OpenNext for Cloudflare
- Cloudflare Workers
- Cloudflare D1
- Cloudflare R2
- Novel / Tiptap

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | Next.js 本地开发 |
| `npm run build` | 构建应用 |
| `npm run verify:quick` | 跑 lint、test、build |
| `npm run verify` | 跑完整验证链路 |
| `npm run cf:init` | 初始化 Cloudflare 资源和模板默认设置 |
| `npm run preview` | Worker 运行时预览 |
| `npm run deploy` | 部署到 Cloudflare Workers |

## 作者

- 向阳乔木
- GitHub：<https://github.com/joeseesun>
- X / Twitter：<https://x.com/vista8>
- Blog：<https://blog.qiaomu.ai/>
