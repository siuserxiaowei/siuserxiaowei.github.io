# 出海学习

<!-- SIUSER-REPO-GUIDE:START -->
## 项目介绍 / Project Introduction

### 中文
出海学习库：镜像金山文档团队空间并生成互动学习页、飞书同步和资料索引。

### English
Overseas expansion learning hub mirroring KDocs materials into interactive pages, Feishu sync, and indexed resources.

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

- GitHub 仓库 / Repository: https://github.com/siuserxiaowei/chuhai-xuexi
- Live / 在线入口：https://siuserxiaowei.github.io/chuhai-xuexi/
- 默认分支 / Default branch: `main`
- 主要语言 / Primary language: `HTML`
- 可见性 / Visibility: `public`
- 仓库类型 / Repository type: `source`

## 本地运行 / Local Run

```bash
git clone https://github.com/siuserxiaowei/chuhai-xuexi.git
cd chuhai-xuexi
python3 -m http.server 8000
```

## 仓库结构 / Repository Map

| 路径 / Path | 中文说明 | English |
| --- | --- | --- |
| `README.md` | 项目入口说明，先读这里。 | Main project entry point and orientation. |
| `index.html` | 静态站首页或页面入口。 | Static-site homepage or entry page. |
| `assets` | 图片、样式、数据等资源。 | Images, styles, data, and other assets. |
| `data` | 数据、索引或结构化内容。 | Data, indexes, or structured content. |
| `content` | 内容源文件或报告正文。 | Source content or report body. |
| `scripts` | 构建、同步、生成或维护脚本。 | Build, sync, generation, or maintenance scripts. |
| `feishu_pages` | 项目文件或目录。 | Project file or directory. |
| `learn` | 项目文件或目录。 | Project file or directory. |
| `reports` | 项目文件或目录。 | Project file or directory. |
| `.gitignore` | 项目文件或目录。 | Project file or directory. |
| `.nojekyll` | 项目文件或目录。 | Project file or directory. |
| `unsupported.md` | 项目文件或目录。 | Project file or directory. |

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



金山文档团队空间镜像归档、互动学习页与飞书知识库同步项目。

## 在线结构

- `index.html`：总入口、搜索与文档索引。
- `learn/<slug>/index.html`：每篇文档的翻页式互动学习页。
- `content/<slug>.md`：从金山文档读取后的 Markdown/结构化正文。
- `archive/`：可下载且低于 GitHub 单文件限制的原始文件。
- `data/manifest.json`：金山、飞书、GitHub Pages 链接映射。
- `reports/dao-fa-shu-qi-shi.md`：全局「道、法、术、器、势」分析。

## 本地生成

```bash
export PATH="$HOME/.local/bin:$PATH"
python3 scripts/kdocs_crawl.py --drive 2524825563 --drive 2581401869
python3 scripts/generate_site.py --base-url "https://siuserxiaowei.github.io/chuhai-xuexi"
python3 scripts/feishu_sync.py --base-url "https://siuserxiaowei.github.io/chuhai-xuexi"
```

## 注意

仓库是公开仓库。执行迁移前请确认金山文档内容允许公开发布。

## 专题资料统一维护入口

[collections/](collections/README.md) 已收纳相关独立资料仓库的完整文件与来源记录。后续更新在这里完成，停止为同主题的单份资料重复建仓库；原网站入口在迁移清单中保留。
