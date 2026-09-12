# Fireworks × Benny Chen：开源、Token 与定制模型

一份面向“没有听过原节目的人”的中文深度学习页：把 45 分钟访谈整理为可搜索逐字稿、章节时间轴、核心论证链、术语解释与行动清单。

- 在线阅读：<https://siuserxiaowei.github.io/fireworks-benny-chen-deep-dive/>
- [完整 ASR 原始逐字稿](data/transcript-raw.md)
- [独立深度分析](data/deep-dive.md)
- [事实核查来源与限制](data/sources.json)

## 内容边界

- 逐字稿来自用户提供的音频，经自动语音识别得到 1,008 个连续分段。原始文件保持 ASR 原样；网页展示层只修正高置信专名。
- 官方 Show Notes 只用于章节时间和交叉核对；逐字稿没有逐句时间码，项目不会用估算值冒充真实时间戳。
- 页面明确区分嘉宾观点、编辑归纳与外部补充事实。
- 节目中常用“开源模型”这一行业口语；页面在需要精确时会注明“开放权重”。
- 本项目不分发原始音频。节目版权归原作者与发布方所有。

## 资料入口

- [小宇宙节目官方页](https://www.xiaoyuzhoufm.com/episode/6a80b9d136641f136d88c76b)
- [Fireworks Series D 公告](https://fireworks.ai/blog/series-d-announcement)
- [Harvey × Fireworks：开放模型法律任务研究](https://fireworks.ai/blog/open-source-agents-frontier-advisors)
- [Fireworks on Microsoft Foundry](https://fireworks.ai/blog/fireworks-on-microsoft-foundry)

## 本地预览

这是一个无构建步骤的静态站点。为使逐字稿数据正常加载，请通过本地 HTTP 服务预览：

```bash
python3 -m http.server 4173
```

然后打开 `http://localhost:4173/`。

## 文件说明

- `index.html`：学习页主体
- `styles.css`：响应式视觉与打印样式
- `script.js`：目录、搜索、折叠、复制链接等交互
- `data/transcript-raw.md`：完整、未静默改写的 ASR 原稿
- `data/deep-dive.md`：九章分析、关键洞见、未回答问题与立场校准
- `data/sources.json`：外部一手来源及逐条 caveat

## 声明

这是非官方学习整理，不代表主持人、嘉宾、Fireworks AI 或节目发布方。自动转写可能存在错字；引用原话时请回到原节目复核。
