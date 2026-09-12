# Spark 上海独立开发者分享会深度拆解

面向未到场者的完整学习包，基于用户提供的 00:00–01:29:22 自动转写，并用公开一手来源校正实体、数字口径与方法边界。

在线阅读：[https://siuserxiaowei.github.io/spark-meetup-deep-dive/](https://siuserxiaowei.github.io/spark-meetup-deep-dive/)（[English version](https://siuserxiaowei.github.io/spark-meetup-deep-dive/en/)）

## 阅读入口

- [完整深度报告](REPORT.md)：结论、人物纠错、会议地图、主题拆解、道法术器势、50 问与行动方案。英文版为 [REPORT.en.md](REPORT.en.md)。
- [全程逐时间戳拆解](modules/timeline.md)：覆盖 89 分钟、17 组 Q&A 与转写噪声。
- [实体与数字核验](modules/entity_factcheck.md)：人名、产品名、活动信息、收入口径与未决项。
- [外部研究与反证](modules/strategy_research.md)：方法有效性、反例和适用边界。
- [道法术器势专章](modules/dao-fa-shu-qi-shi.md)：将个体经验改造成执行系统。
- [研究账本](research/)：查询、来源、证据卡、研究路由和缺口。

## 本地预览与页面构建

```bash
./scripts/build-site.sh
python3 -m http.server 4173
```

静态页面由 `REPORT.md` 构建为 `index.html`（中文版），由 `REPORT.en.md` 构建为 `en/index.html`（英文版），推送到 `main` 后由 GitHub Actions 发布到 GitHub Pages。

研究日期：2026-08-09（Asia/Shanghai）。公开网页与收入数字均按访问日快照处理；创始人页面收入不等于审计数据。
