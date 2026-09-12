# QA Report

状态：通过追加验收。

验收日期：2026-06-02

## 验收范围

- Markdown 资料库
- 知识库首页、搜索和专题筛选
- 知识库来源登记表
- 提示词资产化流程
- 合规双语学习稿
- 原目标覆盖矩阵
- 品牌拆解手册
- OPC App 方向剧本
- 最终完成度审计
- 授权逐字稿处理流程
- 研究证据登记表
- 机会评分表 CSV
- 静态学习网站
- 开源协议、贡献规则和署名说明
- Google AdSense / Google Ads 接入准备
- 隐私说明和使用条款页面
- 交付索引和入口说明

## 2026-06-02 自主持续开发追加验收

- 首页已从资料包入口升级为可维护的知识库首页，保留学习路径，并新增统一搜索、标签筛选、8 个一级专题、核查日期、GitHub 贡献入口和深度资料库。
- `site/content.js` 已作为全局内容注册文件，统一暴露 `window.learningHubContent`；`site/app.js` 只负责渲染、筛选和搜索交互。
- 8 个一级专题保持为：市场与机会、产品验证、AI App 案例、上架合规、隐私与 AI 风险、ASO 与本地化、订阅变现、冷启动增长。
- 每个一级专题包含 3 张入门知识卡、3 张进阶知识卡、1 个模板、1 个案例和 1 组行动清单；总计 48 张知识卡。
- 每张知识卡包含适合谁、核心结论、操作步骤、常见坑、来源和最后核查日期。
- 已新增 `docs/knowledge-source-register.md`，记录来源等级、政策核查日期、订阅报告、提示词资产化流程和 HTTPS 上线修复项。
- 针对“前同事留下的提示词没人会用”的业务问题，首页新增提示词资产工具包，包含 SOP、客户输入表、提示词原件登记、输出质检表和失败样本回放流程。
- 已将失效的抖音短链从公开可点击外链改为历史来源说明，避免把短链作为长期公开来源。
- 已用系统 Chrome headless 验证桌面 1440px 和移动 390px 视口：9 个专题按钮、48 张知识卡、24 张网页资料卡、4 个提示词工具包、6 个网页筛选按钮，无控制台 warning/error，无横向溢出。
- 统一搜索已覆盖知识卡、网页资料、案例、模板和提示词工具包；桌面和移动视口中，“提示词”返回 12 条，“EU DSA”返回 8 条，“订阅”返回 12 条，“ASO”返回 11 条。
- 网页资料馆已扩展为 24 个外部网页，整理成为什么读、我怎么看、怎么用、别误读，并按市场趋势、上架合规、ASO 增长、订阅变现、公开案例筛选。
- 网页资料馆筛选已通过浏览器断言：上架合规返回 7 张，订阅变现返回 5 张，公开案例返回 2 张。
- 已新增 `sitemap.xml`、`robots.txt` 和 `llms.txt`；`site/index.html` 已补充 canonical、Open Graph、Twitter 卡片和 LearningResource 结构化数据。当前 canonical 使用 HTTP，待 HTTPS 修复后再切换。
- 核心外链短名单验证通过：GitHub、Sensor Tower、TechCrunch、Apple Review、Google Play AI policy、Google Data Safety、Apple localization、Apple custom product pages、Google store listing experiments、Apple subscriptions、RevenueCat 2026、RevenueCat 2025、Apple EU DSA、Apple App Privacy Details、Google User Data policy、Google Developer Policy、GSMA Mobile Economy、Photoroom customer stories、RevenueCat dub case 均返回 200 或可接受跳转。
- `http://gptimage2.store/site/index.html` 和 `http://gptimage2.store/` 返回 200；`https://gptimage2.store/` 仍返回 000，保留为正式推广前的 HTTPS 证书修复项。

## 2026-06-02 文档 HTML 渲染修复验收

- 已新增 `scripts/render_markdown_pages.py`，将根目录 5 个 Markdown 文件和 `docs/` 下 16 个 Markdown 文件生成对应 HTML 页面，并额外生成 `docs/index.html` 与 `LICENSE.html`。
- 首页、动态内容来源链接和 `llms.txt` 已从公开 `.md` 入口切换到 `.html` 入口，避免访客看到 raw Markdown。
- 文档页统一使用站点样式，包含文档导航、标题区、正文卡片、目录和页面信息；表格、代码块、链接和移动端长 URL 已做响应式处理。
- `sitemap.xml` 已收录生成后的文档 HTML 页面。
- `python3 scripts/verify_package.py` 已加入防回归检查：公开入口不得暴露 `.md` 链接；每个 Markdown 必须有对应 HTML；渲染页本地链接必须存在。
- 已用系统 Chrome 验证首页点击“学习指南”会进入 `docs/learning-guide.html`，并验证 `docs/index.html`、`docs/learning-guide.html`、`docs/case-study-workbook.html`、`docs/knowledge-source-register.html`、`README.html`、`LICENSE.html` 都是 HTML 渲染页，不是 Markdown 源码页。

## 完成项

- 已将 `main` 合并到 `agent/qa-polish`，合并方式为 fast-forward。
- Required files 共 27 项全部存在：入口说明、交付索引、QA 报告、13 份核心 docs、CSV、静态站文件、内容注册文件和 SEO 文件。
- 新增 `docs/bilingual-study-note.md`，用中文学习稿、英文学习译稿、术语表和课堂练习替代不可交付的完整逐字稿/逐句译文。
- 新增 `docs/goal-coverage-matrix.md`，逐项说明原始目标、当前交付证据、完成状态和版权限制。
- 新增 `docs/brand-teardown-handbook.md`，独立拆解 AI App 出海品牌的命名、首页、信任层、定价、传播钩子和 10 个品牌样本。
- 新增 `docs/final-completion-audit.md`，逐项审计原始目标、当前证据、线上链接、验证命令和不能声明完成的版权受限部分。
- 新增 `docs/authorized-transcript-workflow.md`，说明授权文本到位后如何在 `private/` 目录处理完整逐字稿、译文和学习注释。
- 新增 `docs/research-evidence-register.md`，登记市场报告、平台政策、竞品/品牌页面、媒体案例和上线证据。
- 新增 `docs/opc-app-playbook.md`，将 10 个候选方向拆成用户、旧流程、MVP、渠道实验、7 天验证和淘汰标准。
- `data/opportunity-scorecard.csv` 可由 Python `csv.DictReader` 正常解析，含 10 行机会记录和必需字段。
- `site/index.html` 的本地 `href`/`src` 目标均存在，站内锚点均能解析到页面内 `id`。
- Markdown 本地链接可解析到目标文件。
- 内容风险搜索未发现完整逐字稿、完整逐句翻译、明显误听词或不适合对外交付的内部备忘录语气。
- 修复了两类引用链接：Lovart 旧路径返回 404，MyFitnessPal/Cal AI 收购引用改为 GlobeNewswire 原始发布页。
- 修复了 `README.md` 中静态站打开命令的过期 worktree 绝对路径，改为包内相对路径。
- 6 个 agent worktree 已合并回 `main` 并回收；分支记录保留，便于后续追溯。
- 追加更新了 RevenueCat 2026、Lovart、Photoroom、Gamma、HeyGen、ElevenLabs 等参考链接。
- 新增 `LICENSE`，采用 CC BY 4.0，并在 `README.md`、`DELIVERY_INDEX.md` 和静态站页脚加入开源引用入口。
- 新增 `CONTRIBUTING.md` 和 `ATTRIBUTION.md`，说明贡献规则、署名方式、第三方内容边界和广告边界。
- 新增 `CNAME`，自有域名目标为 `gptimage2.store`。
- 新增 `ads.txt.template`，只保留 AdSense publisher ID 占位模板；未生成含假 ID 的 `ads.txt`。
- 新增 `docs/google-ads-and-adsense-setup.md` 和 `docs/google-ads-campaign-plan.md`，分别覆盖接入步骤和小预算投放计划。
- 新增 `site/privacy.html` 和 `site/terms.html`，并在静态站页脚加入 Privacy、Terms、GitHub、License。
- 新增 `site/google-ads-config.js`、`site/google-ads-config.example.js` 和 `site/tracking.js`，当前默认关闭 Google tag；首页关键 CTA 已添加 `data-conversion`。

## 版权边界

- 不输出完整视频逐字稿。
- 不输出完整逐句翻译。
- 仅使用短摘录、分段转述、英文摘要、教学化分析和公开来源引用。
- 对外发布时不将资料包包装成原作者授权课程、官方译文或源视频复刻稿。
- 广告展示不代表项目作者推荐广告产品。
- 当前未写入真实或伪造的 AdSense / Google Ads ID；拿到真实 ID 且审核通过后再启用。

## 验证命令

```bash
git fetch
git merge main
python3 scripts/verify_package.py
python3 - <<'PY'
from pathlib import Path
required = [
    'README.md', 'DELIVERY_INDEX.md', 'QA_REPORT.md',
    'docs/source-brief.md', 'docs/learning-guide.md', 'docs/public-content-pack.md',
    'docs/bilingual-study-note.md', 'docs/goal-coverage-matrix.md',
    'docs/final-completion-audit.md',
    'docs/authorized-transcript-workflow.md',
    'docs/research-evidence-register.md',
    'docs/opc-app-playbook.md',
    'docs/brand-teardown-handbook.md',
    'docs/case-study-workbook.md', 'docs/7-day-learning-plan.md', 'docs/facilitator-guide.md',
    'data/opportunity-scorecard.csv',
    'site/index.html', 'site/styles.css', 'site/app.js', 'site/content.js',
    'site/content-advanced-cards.js', 'site/content-web-extra.js', 'site/content-toolkits.js',
    'sitemap.xml', 'robots.txt', 'llms.txt',
]
missing = [path for path in required if not Path(path).exists()]
print('required files checked:', len(required))
print('missing:', missing or 'none')
PY
python3 - <<'PY'
import csv
from pathlib import Path
with Path('data/opportunity-scorecard.csv').open(newline='', encoding='utf-8') as handle:
    rows = list(csv.DictReader(handle))
print('rows:', len(rows))
print('columns:', ', '.join(rows[0].keys()))
PY
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
root = Path.cwd()
site = root / 'site'
html = (site / 'index.html').read_text(encoding='utf-8')
class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for attr in ('href', 'src'):
            if attrs.get(attr):
                self.links.append((tag, attr, attrs[attr]))
parser = Parser()
parser.feed(html)
missing = []
fragment_missing = []
file_link_count = 0
fragment_count = 0
for tag, attr, raw in parser.links:
    parsed = urlparse(raw)
    url = raw.split('#', 1)[0].split('?', 1)[0]
    if parsed.fragment and not parsed.scheme:
        fragment_count += 1
        if parsed.fragment not in parser.ids:
            fragment_missing.append(raw)
    if not url or parsed.scheme or url.startswith('//') or url.startswith('mailto:') or url.startswith('tel:'):
        continue
    file_link_count += 1
    target = (site / unquote(url)).resolve()
    if not target.exists():
        missing.append(raw)
print('site local href/src checked:', file_link_count)
print('site fragment links checked:', fragment_count)
print('missing local targets:', missing or 'none')
print('missing fragments:', fragment_missing or 'none')
PY
python3 - <<'PY'
from pathlib import Path
from urllib.parse import urlparse, unquote
import re
root = Path.cwd()
missing = []
count = 0
for path in sorted(root.glob('*.md')) + sorted((root / 'docs').glob('*.md')):
    text = path.read_text(encoding='utf-8')
    for match in re.finditer(r'\[[^\]]+\]\(([^)]+)\)', text):
        raw = match.group(1).strip()
        url = raw.split('#', 1)[0].split('?', 1)[0]
        parsed = urlparse(url)
        if not url or parsed.scheme or url.startswith('//') or url.startswith('mailto:'):
            continue
        count += 1
        target = (path.parent / unquote(url)).resolve()
        if not target.exists():
            missing.append((path, raw))
print('markdown local links checked:', count)
print('missing markdown links:', missing or 'none')
PY
rg -n "逐字|逐句|全文|完整.*(翻译|译文|转写|字幕|逐字稿)|transcript|translation|原文|字幕|内部|备忘|memo|confidential|not for" README.md DELIVERY_INDEX.md QA_REPORT.md docs site data
rg -n "^[0-9]{1,2}:[0-9]{2}|^[0-9]{2}:[0-9]{2}|\[[0-9]{1,2}:[0-9]{2}\]|Speaker|主持人|采访者|受访者|雷子：|雷子:" docs README.md DELIVERY_INDEX.md QA_REPORT.md site
git worktree list
python3 scripts/verify_package.py
gh api repos/siuserxiaowei/ai-app-export-learning-hub/pages
dig +short gptimage2.store A
dig +short gptimage2.store AAAA
dig +short www.gptimage2.store CNAME
curl -I -L https://gptimage2.store/
```

## 验证结果

- `python3 scripts/verify_package.py` 输出：`OK: learning hub package verification passed`。
- Required files 检查输出：27 项，missing 为 `none`。
- CSV 检查输出：10 行，字段包括 `opportunity`、`target_user`、`job_to_be_done`、`opportunity_score` 等。
- 静态站本地链接检查：20 个本地 `href`/`src` 均存在；8 个站内锚点均存在。
- Markdown 本地链接检查：31 个本地链接均存在。
- 核心外部来源轻量检查：RevenueCat 2026、Sensor Tower、GlobeNewswire、Photoroom、Gamma、HeyGen 均返回 200；ElevenLabs 返回 308 跳转；Lovart 页面经浏览器/web 打开可读，但普通脚本请求返回 404，记录为站点请求方式差异。
- 内容风险搜索只命中版权边界说明、正常时间轴摘要、字幕/翻译作为产品功能描述，以及“内部”作为交接/团队场景描述；验证脚本内维护的已知误听词列表未命中交付内容。
- `git worktree list` 仅保留主仓库工作区，临时 agent worktree 已清理。
- 开源与广告准备检查通过：`LICENSE`、`CONTRIBUTING.md`、`ATTRIBUTION.md`、`CNAME`、`ads.txt.template`、Privacy、Terms 和 Google Ads no-op 追踪文件均存在。
- `site/google-ads-config.js` 默认 `enabled: false`，不会加载 Google tag。
- 首页 `data-conversion` 覆盖开始学习、下载评分表、打开 GitHub 和打开 OPC 剧本。

## 遗留限制

- 外部网页链接已做轻量存活检查并修复发现的问题，但第三方站点未来仍可能改版、跳转、限流或失效。
- 本次 QA 未重新下载、重转写或逐字复核原始视频；验收基于仓库内已交付内容和公开引用链接。
- 市场数据、收入数字和政策条款只做引用链接可访问性与资料边界检查，未展开二次事实审计。
- `gptimage2.store` 的 DNS 记录需要在域名注册商面板切换到 GitHub Pages；DNS 生效前自有域名无法稳定访问。
- AdSense 和 Google Ads 账号、付款、审核、publisher ID、conversion ID 需要用户登录 Google 后完成；本项目只准备可接入结构。
