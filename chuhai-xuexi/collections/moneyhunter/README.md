# MoneyHunter Learning Hub

<!-- SIUSER-REPO-GUIDE:START -->
## 项目介绍 / Project Introduction

### 中文
MoneyHunter 学习库：把公开资料整理成可搜索、可筛选、可复盘的 GitHub Pages 学习站。

### English
MoneyHunter learning hub that turns public materials into a searchable, filterable GitHub Pages study site.

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

- GitHub 仓库 / Repository: https://github.com/siuserxiaowei/moneyhunter-learning-hub
- Live / 在线入口：https://siuserxiaowei.github.io/moneyhunter-learning-hub/
- 默认分支 / Default branch: `main`
- 主要语言 / Primary language: `Python`
- 可见性 / Visibility: `public`
- 仓库类型 / Repository type: `source`

## 本地运行 / Local Run

```bash
git clone https://github.com/siuserxiaowei/moneyhunter-learning-hub.git
cd moneyhunter-learning-hub
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
| `raw` | 项目文件或目录。 | Project file or directory. |
| `site` | 本地站点构建输出或站点源文件。 | Local site output or site source files. |
| `.gitignore` | 项目文件或目录。 | Project file or directory. |

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



MoneyHunter 全量公开交互学习库。这个仓库把 MoneyHunter 本地资料夹整理成 GitHub Pages 可访问的静态站，保留原始资料、附件和外链，同时提供搜索、筛选、目录树、链接库和学习拆解文档。

## 在线入口

- 交互学习首页：<https://siuserxiaowei.github.io/moneyhunter-learning-hub/>
- 站点页面：<https://siuserxiaowei.github.io/moneyhunter-learning-hub/site/index.html>
- 公开链接库：<https://siuserxiaowei.github.io/moneyhunter-learning-hub/site/links.html>

## 当前数据

- 公开文件数：152
- Markdown 文件数：149
- Markdown 总行数：22463
- 附件数：3
- URL 出现次数：3545
- 唯一 URL 数：2178
- 生成时间：`2026-06-03T03:58:47+00:00`

## 目录

- [`raw/`](raw/)：MoneyHunter 原始资料镜像，保留目录结构。
- [`raw/index.html`](raw/index.html)：GitHub Pages 可打开的原始资料目录页。
- [`site/`](site/)：交互静态站。
- [`docs/`](docs/)：学习化拆解文档。
- [`data/`](data/)：manifest 和链接索引 JSON。
- [`scripts/`](scripts/)：导入与校验脚本。

## 复跑导入

```bash
python3 scripts/import_moneyhunter.py
python3 scripts/verify_package.py
```

## 公开边界

本仓库用于学习、复盘和资料查阅。普通资料、附件、二维码/图片、社群入口和外链按要求公开；`.git/`、`.DS_Store` 和明确凭据型密钥不公开。
