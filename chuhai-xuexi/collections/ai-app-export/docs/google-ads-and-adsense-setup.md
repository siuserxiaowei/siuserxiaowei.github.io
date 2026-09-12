# Google Ads 与 AdSense 接入说明

本文用于把 `AI App Export Learning Hub` 接入 Google AdSense 展示广告和 Google Ads 买量推广。当前阶段只完成可接入结构，不写入假的 publisher ID、conversion ID 或 conversion label。

## 当前状态

| 项目 | 状态 |
| --- | --- |
| GitHub 仓库 | 已公开 |
| GitHub Pages | 已从 `main` 分支根目录发布 |
| 自有域名 | 计划使用 `https://gptimage2.store/` |
| AdSense publisher ID | 暂无 |
| Google Ads conversion ID | 暂无 |
| `ads.txt` | 暂不生成，仅保留 `ads.txt.template` |
| Auto ads script | 暂不插入 |
| Google Ads tracking | 已有 no-op 框架，默认关闭 |

## 1. 先完成域名和 Pages

GitHub Pages 站点应先绑定自有域名并能通过 HTTPS 访问：

```text
https://gptimage2.store/
```

DNS 记录建议：

```text
@    A      185.199.108.153
@    A      185.199.109.153
@    A      185.199.110.153
@    A      185.199.111.153
@    AAAA   2606:50c0:8000::153
@    AAAA   2606:50c0:8001::153
@    AAAA   2606:50c0:8002::153
@    AAAA   2606:50c0:8003::153
www  CNAME  siuserxiaowei.github.io
```

如果 DNS 面板里已有旧的 A 记录，例如 `34.216.117.25`、`54.149.79.189`，应删除后再添加 GitHub Pages 记录。

验证命令：

```bash
dig +short gptimage2.store A
dig +short gptimage2.store AAAA
dig +short www.gptimage2.store CNAME
curl -I -L https://gptimage2.store/
```

## 2. AdSense 展示广告流程

1. 注册或登录 Google AdSense。
2. 在 AdSense 中添加站点：

```text
https://gptimage2.store/
```

3. 按 AdSense 后台要求完成站点验证和审核。
4. 审核通过并拿到 `ca-pub-...` publisher ID 后，把根目录的 `ads.txt.template` 复制为 `ads.txt`。
5. 把 `pub-YOUR_PUBLISHER_ID` 替换为真实 publisher ID。
6. 访问并确认：

```text
https://gptimage2.store/ads.txt
```

7. AdSense 后台站点状态变为 Ready 后，再插入 Auto ads script。

不要在审核前写假 ID，也不要在页面上出现鼓励点击广告、把广告伪装成导航或承诺广告收益的文案。

## 3. Auto ads script 放置位置

审核通过后，在 `site/index.html` 的 `</head>` 前加入 AdSense 后台给出的脚本，形式通常类似：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" crossorigin="anonymous"></script>
```

只替换为 AdSense 后台给出的真实 ID。不要使用上面的占位 ID。

## 4. Google Ads 买量推广流程

1. 注册或登录 Google Ads。
2. 创建 Website conversion actions。
3. 初始只追踪低成本学习行为：

| 事件 | 页面动作 | `data-conversion` |
| --- | --- | --- |
| 开始学习 | 点击首页「开始学习」 | `startLearning` |
| 下载评分表 | 点击首页「下载评分表」或评分表资源 | `downloadScorecard` |
| 打开 GitHub | 点击页脚 GitHub 链接 | `openGithub` |
| 打开 OPC 剧本 | 点击 OPC 方向剧本资源 | `openOpcPlaybook` |

4. 复制 `site/google-ads-config.example.js` 为 `site/google-ads-config.js`。
5. 填入真实 `AW-...` conversion ID 和 conversion labels。
6. 将 `enabled` 改为 `true`。
7. 用 Google Tag Assistant 或 Google Ads 后台诊断确认事件触发。

## 5. 当前代码如何保持 no-op

当前 `site/google-ads-config.js` 默认关闭：

```js
enabled: false
```

`site/tracking.js` 会读取配置。只有 `enabled === true` 且配置里存在真实 `conversionId` 时，才会加载 Google tag。默认状态不会加载 Google tag，也不会发送转化事件。

## 6. 文档页广告化边界

当前 `docs/*.md` 已通过 `scripts/render_markdown_pages.py` 生成对应的 `docs/*.html` 渲染页。第一阶段仍优先只在 HTML 静态站首页接入广告和追踪；如果后续要在文档页放广告，应在生成模板里统一加入广告位和隐私提示。

如果后续希望文档页也展示广告，应新增 HTML 文档渲染层：

- 保留 Markdown 源文件。
- 新增 `site/docs.html` 或生成式 HTML wrapper。
- 广告脚本只放在 HTML 页面，不放进 Markdown 源文件。
