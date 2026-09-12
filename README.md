# 个人主页与博客

个人 GitHub 首页、作品站与博客。

本业务集中管理 **4** 个项目或资料集合。子项目是完整文件目录，不使用子模块。

## 项目入口

| 用途分类 | 项目 | 做什么 | 入口 / 状态 |
|---|---|---|---|
| 个人展示与博客 | [siuserxiaowei](projects/%E4%B8%AA%E4%BA%BA%E5%B1%95%E7%A4%BA%E4%B8%8E%E5%8D%9A%E5%AE%A2/siuserxiaowei/) | GitHub 个人主页 README，介绍工作方向，并链接项目目录、作品集与联系入口。 | 公开；未归档；本轮已查文件与说明，未运行功能验收 |
| 个人展示与博客 | [siuserxiaowei.github.io](PRIMARY-README.md) | 个人项目与资料总入口：浏览代码项目、按主题阅读会议资料，并查看作品展示。 | 公开；未归档；本轮已查文件与说明，未运行功能验收 |
| 个人展示与博客 | [blog](projects/%E4%B8%AA%E4%BA%BA%E5%B1%95%E7%A4%BA%E4%B8%8E%E5%8D%9A%E5%AE%A2/blog/) | 记录 AI 工具、自动化和独立产品开发过程的博客工程；根 README 仍使用框架模板。 | 公开；未归档；本轮已查文件与说明，未运行功能验收 |
| 个人展示与博客 | [qiaomu-blog-opensource](projects/%E4%B8%AA%E4%BA%BA%E5%B1%95%E7%A4%BA%E4%B8%8E%E5%8D%9A%E5%AE%A2/qiaomu-blog-opensource/) | Cloudflare 博客模板（fork）：基于 OpenNext、Next.js、D1 和 R2 的开源博客参考。 | 公开；未归档；上游参考/贡献副本；未重新运行上游项目 |

## 使用方式

- 根目录保留主要项目的运行结构；其他项目进入上表对应目录后，按各自 README 安装和启动。
- 各项目的依赖、许可证、署名和原工作流分别保留，不将不同项目当成一个应用运行。
- 原分支、标签和拉取请求引用保存在 `source-history/<原仓库>/...` 标签中。
- `MIGRATION.json` 记录每个项目的原提交与新位置。
- 子目录里的 GitHub Actions 不会自动运行；需按新项目路径配置工作流和密钥。原有线上部署并不等于迁移后已重新验收。
