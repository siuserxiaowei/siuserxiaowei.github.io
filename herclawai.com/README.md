# HerClaw Product Intro

HerClaw 产品介绍静态页。页面内容来自飞书产品文档，视觉和动效参考 `https://cjy-2.vercel.app/` 的小龙虾弹起、投喂、跑马灯、厚描边和水族箱氛围。

## 打开方式

直接打开 `index.html`，或启动本地静态服务：

```bash
python3 -m http.server 4173 --directory herclaw-product-intro
```

然后访问 `http://localhost:4173/`。

## 主要文件

- `index.html`: 页面结构和产品文案
- `styles.css`: 视觉系统、响应式布局和动效
- `main.js`: 开场、滚动、投喂小龙虾、鼠标小龙虾轨迹、气泡/鱼群等交互
- `assets/herclaw-product.png`: HerClaw 盒子与弹簧小龙虾主视觉
- `qa/*.png`: 概念图与桌面、投喂、移动端验证截图

## QA

已验证：

- 桌面首屏 `1280x720`
- 移动首屏 `390x844`
- 投喂小龙虾交互
- 无控制台 error/warn
- 无横向溢出
