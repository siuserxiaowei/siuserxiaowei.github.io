(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`ai-source`,label:`AI 专门源`,platforms:[`hf-daily-papers`,`arxiv-ai`,`hf-models`,`hf-datasets`,`hf-spaces`,`github-ai`,`hn-ai`,`x-ai-search`,`justone-weixin-ai`,`justone-xiaohongshu-ai`,`justone-douyin-ai`,`douyin-open-search`,`openai-news`,`deepmind-news`,`hf-blog`]},{id:`research`,label:`研究论文`,platforms:[`hf-daily-papers`,`arxiv-ai`]},{id:`open-source`,label:`开源生态`,platforms:[`hf-models`,`hf-datasets`,`hf-spaces`,`github-ai`,`hellogithub`]},{id:`official`,label:`官方发布`,platforms:[`openai-news`,`deepmind-news`,`hf-blog`]},{id:`social`,label:`社交舆论`,platforms:[`x-ai-search`,`justone-weixin-ai`,`justone-xiaohongshu-ai`,`justone-douyin-ai`,`douyin-open-search`,`weibo`,`zhihu`,`douyin`,`kuaishou`,`tieba`,`hupu`,`douban-group`]},{id:`video`,label:`视频社区`,platforms:[`justone-douyin-ai`,`douyin-open-search`,`bilibili`,`acfun`]},{id:`news`,label:`新闻资讯`,platforms:[`baidu`,`toutiao`,`thepaper`,`qq-news`,`sina-news`,`netease-news`]},{id:`tech`,label:`科技产品`,platforms:[`ithome`,`36kr`,`huxiu`,`ifanr`,`sspai`,`juejin`,`csdn`,`v2ex`,`hellogithub`]},{id:`culture`,label:`内容文化`,platforms:[`weread`,`zhihu-daily`,`douban-movie`,`netease-music`,`qq-music`]},{id:`games`,label:`游戏娱乐`,platforms:[`lol`,`genshin`,`honkai`,`starrail`]}],t={bilibili:{label:`哔哩哔哩`,accent:`#00a1d6`},acfun:{label:`A站`,accent:`#fd4c5d`},weibo:{label:`微博热搜`,accent:`#e6162d`},zhihu:{label:`知乎热榜`,accent:`#1772f6`},"zhihu-daily":{label:`知乎日报`,accent:`#2f80ed`},douyin:{label:`抖音`,accent:`#111111`},kuaishou:{label:`快手`,accent:`#ff6600`},"douban-movie":{label:`豆瓣电影`,accent:`#238a3b`},"douban-group":{label:`豆瓣小组`,accent:`#3ba55d`},tieba:{label:`百度贴吧`,accent:`#3385ff`},hupu:{label:`虎扑`,accent:`#c00000`},ngabbs:{label:`NGA论坛`,accent:`#8f6724`},v2ex:{label:`V2EX`,accent:`#4b5563`},"52pojie":{label:`吾爱破解`,accent:`#4677b8`},hostloc:{label:`全球主机交流`,accent:`#64748b`},coolapk:{label:`酷安`,accent:`#13c45d`},baidu:{label:`百度热搜`,accent:`#2932e1`},thepaper:{label:`澎湃新闻`,accent:`#2563eb`},toutiao:{label:`今日头条`,accent:`#d71920`},"qq-news":{label:`腾讯新闻`,accent:`#1479ff`},sina:{label:`新浪热搜`,accent:`#e90e24`},"sina-news":{label:`新浪新闻`,accent:`#e90e24`},"netease-news":{label:`网易新闻`,accent:`#d81e06`},huxiu:{label:`虎嗅`,accent:`#f2b705`},ifanr:{label:`爱范儿`,accent:`#111827`},sspai:{label:`少数派`,accent:`#d71920`},ithome:{label:`IT之家`,accent:`#cc0000`},"ithome-xijiayi":{label:`IT之家喜加一`,accent:`#f97316`},juejin:{label:`掘金`,accent:`#1e80ff`},jianshu:{label:`简书`,accent:`#ea6f5a`},guokr:{label:`果壳`,accent:`#50b347`},"36kr":{label:`36氪`,accent:`#0f172a`},"51cto":{label:`51CTO`,accent:`#2563eb`},csdn:{label:`CSDN`,accent:`#c92027`},nodeseek:{label:`NodeSeek`,accent:`#2563eb`},hellogithub:{label:`HelloGitHub`,accent:`#111827`},lol:{label:`英雄联盟`,accent:`#c89b3c`},genshin:{label:`原神`,accent:`#6d8fb3`},honkai:{label:`崩坏3`,accent:`#2b77d9`},starrail:{label:`星穹铁道`,accent:`#a855f7`},"netease-music":{label:`网易云音乐`,accent:`#d33a31`},"qq-music":{label:`QQ音乐`,accent:`#31c27c`},weread:{label:`微信读书`,accent:`#22c55e`},weatheralarm:{label:`天气预警`,accent:`#f97316`},earthquake:{label:`地震速报`,accent:`#ef4444`},history:{label:`历史上的今天`,accent:`#7c3aed`},"hf-daily-papers":{label:`HF 每日论文`,accent:`#f59e0b`},"arxiv-ai":{label:`arXiv AI`,accent:`#b31b1b`},"hf-models":{label:`HF 模型`,accent:`#ffcc4d`},"hf-datasets":{label:`HF 数据集`,accent:`#f97316`},"hf-spaces":{label:`HF Spaces`,accent:`#16a34a`},"github-ai":{label:`GitHub AI`,accent:`#24292f`},"hn-ai":{label:`HN AI`,accent:`#ff6600`},"x-ai-search":{label:`X / Twitter AI`,accent:`#111111`},"justone-weixin-ai":{label:`公众号 AI`,accent:`#07c160`},"justone-xiaohongshu-ai":{label:`小红书 AI`,accent:`#ff2442`},"justone-douyin-ai":{label:`抖音 AI 搜索`,accent:`#111111`},"douyin-open-search":{label:`抖音开放平台`,accent:`#fe2c55`},"openai-news":{label:`OpenAI 官方`,accent:`#10a37f`},"deepmind-news":{label:`DeepMind 官方`,accent:`#4285f4`},"hf-blog":{label:`HF Blog`,accent:`#ffcc4d`}};function n(e){if(e==null)return 0;let t=String(e).replace(/,/g,``).trim(),n=t.match(/[\d.]+/);if(!n)return 0;let r=Number(n[0]);return Number.isFinite(r)?t.includes(`亿`)?Math.round(r*1e8):t.includes(`万`)?Math.round(r*1e4):Math.round(r):0}function r(e,r,i){let a=t[r]||{label:r,accent:`#111827`},s=e&&typeof e.extra==`object`&&e.extra||{},c=e.cover||s.image||s.pic||s?.owner?.face||``;return{id:`${r}-${e.index||0}-${o(e.title||``)}`,platform:r,platformLabel:a.label,accent:a.accent,rank:Number(e.index||0),title:String(e.title||``).trim(),url:String(e.url||``),hotValue:String(e.hot_value||``),hotScore:n(e.hot_value),description:String(s.desc||s.description||``).trim(),matchedKeywords:Array.isArray(s.aiMatchedKeywords)?s.aiMatchedKeywords:[],sourceLabel:String(s.sourceLabel||``).trim(),cover:c,updateTime:i}}function i(e){let n=e.type,i=e.update_time||e.generatedAt||``,o=Array.isArray(e.list)?e.list:[];return{platform:n,platformLabel:t[n]?.label||n,sourceKind:e.source_kind||`unknown`,updateTime:i,aiFilterSummary:a(e.ai_filter_summary),items:o.map(e=>r(e,n,i)).filter(e=>e.title)}}function a(e){let t=e&&typeof e==`object`?e:{};return{matched:Number.isFinite(Number(t.matched))?Number(t.matched):null,total:Number.isFinite(Number(t.total))?Number(t.total):null,keywords:Array.isArray(t.keywords)?t.keywords.map(e=>String(e)).filter(Boolean):[]}}function o(e){return e.toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu,`-`).replace(/^-+|-+$/g,``).slice(0,80)}var s={snapshot:null,boards:[],selectedGroup:`all`,query:``,selectedPlatform:`all`},c=document.querySelector(`#app`),l=new Intl.NumberFormat(`zh-CN`);u();async function u(){try{let e=await fetch(`./data/snapshot.json`,{cache:`no-store`});if(!e.ok)throw Error(`snapshot ${e.status}`);s.snapshot=await e.json(),s.boards=(s.snapshot.boards||[]).map(i),d()}catch(e){c.innerHTML=`
      <main class="boot error">
        <p>热榜数据暂时不可用：${G(e.message)}</p>
      </main>
    `}}function d(){let t=p(),n=f(),r=F(s.snapshot.changeBrief,s.snapshot),i=P(s.snapshot),a=L(s.snapshot),o=z(s.boards),l=z(n);c.innerHTML=`
    <div class="shell">
      <aside class="sidebar" aria-label="证据池筛选">
        <div class="brand">
          <span class="mark" aria-hidden="true"></span>
          <div>
            <strong>AI讯息</strong>
            <small>Change Brief · 08:30</small>
          </div>
        </div>

        <label class="search">
          <span class="field-label">检索原始证据池</span>
          <input id="search-input" value="${G(s.query)}" placeholder="模型 / 公司 / 产品 / 技术" autocomplete="off" />
        </label>

        <section class="sidebar-block">
          <div class="sidebar-title">
            <span>分类</span>
            <small>${t.length} / ${s.boards.length} 平台</small>
          </div>
          <nav class="group-list" aria-label="分类筛选">
            ${S(`all`,`全部平台`)}
            ${e.map(e=>S(e.id,e.label)).join(``)}
          </nav>
        </section>

        <section class="sidebar-block side-summary" aria-label="当前数据概览">
          <div>
            <span>原始信号</span>
            <strong>${H(r.funnel.signals)}</strong>
          </div>
          <div>
            <span>变化候选</span>
            <strong>${H(r.funnel.events)}</strong>
          </div>
          <div>
            <span>今日回执</span>
            <strong>${H(r.funnel.receipts)}</strong>
          </div>
        </section>
      </aside>

      <main class="workspace">
        <section class="top-strip" aria-label="工作台概览">
          <div class="top-copy">
            <p class="eyebrow">更新于 ${W(s.snapshot.generatedAt)}</p>
            <h1>今天真的变了什么？</h1>
            <p class="hero-deck">每天 08:30，只把相较上一期真正发生变化、且有一手证据的 AI 事件递到你面前。</p>
            <div class="scope-line">
              <span class="filter-provenance">${G(r.decision)} · ${G(r.decisionLabel)}</span>
              <span>最多 3 条</span>
              <span>一手 / 原始来源优先</span>
              <span>${r.comparedWith?`对比 ${G(W(r.comparedWith))}`:`正在建立首个基线`}</span>
            </div>
          </div>
          <div class="stats" aria-label="变化漏斗">
            ${w(`信号`,r.funnel.signals,`原始输入`)}
            ${w(`候选`,r.funnel.events,`相较上期有变化`)}
            ${w(`核验`,r.funnel.verified,`一手 / 原始证据`)}
            ${w(`回执`,r.funnel.receipts,`今日实际发送`)}
          </div>
        </section>

        <section class="focus-grid change-focus" aria-label="今日 AI 变化回执">
          <article class="panel change-panel">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Today’s change receipts</p>
                <h2>${G(r.decisionLabel)}</h2>
              </div>
              <button class="ghost copy-action" id="copy-brief" type="button" data-default-label="复制回执">复制回执</button>
            </div>
            <p class="panel-note">${G(r.promise)}</p>
            <div class="receipt-list">
              ${r.receipts.length?r.receipts.map(g).join(``):x(r.decision===`HOLD`?`有信号，先不打扰`:`今天是静默日`,r.decision===`HOLD`?`变化候选尚未获得足够的一手或原始证据，系统会继续等待，而不是把传闻包装成日报。`:`与上一期相比，没有经过核验的实质变化。没有变化，也是一种明确结果。`)}
            </div>
          </article>

          ${_(r)}
        </section>

        <section class="board-tools" aria-label="证据来源筛选">
          <div>
            <p class="eyebrow">Evidence pool</p>
            <h2>查看原始证据，不参与跨源热度排名</h2>
            <p class="board-note">当前显示 ${H(l)} / ${H(o)} 条 · ${G(i.mode)} · ${H(a.aiSourceBoards)} 个 AI 专门源</p>
          </div>
          <div class="platform-tabs" role="list" aria-label="平台切换">
            ${C(`all`,`全部`,z(t))}
            ${t.map(e=>C(e.platform,e.platformLabel,e.items.length)).join(``)}
          </div>
        </section>

        <section class="boards" aria-live="polite">
          ${n.length?n.map(v).join(``):b(`没有匹配的 AI 热点`,`换个 AI 公司、模型、产品或技术关键词，或切回全部平台查看当前快照。`)}
        </section>
      </main>
    </div>
  `,h(r)}function f(){let e=m(),t=M(s.query);return s.boards.filter(t=>!e||e.has(t.platform)).filter(e=>s.selectedPlatform===`all`||e.platform===s.selectedPlatform).map(e=>({...e,items:e.items.filter(e=>j(e,t))})).filter(e=>e.items.length)}function p(){let e=m();return s.boards.filter(t=>!e||e.has(t.platform))}function m(){let t=e.find(e=>e.id===s.selectedGroup);return t?new Set(t.platforms):null}function h(e){document.querySelector(`#search-input`)?.addEventListener(`input`,e=>{s.query=e.target.value,d()}),document.querySelectorAll(`[data-group]`).forEach(e=>{e.addEventListener(`click`,()=>{s.selectedGroup=e.dataset.group,s.selectedPlatform=`all`,d()})}),document.querySelectorAll(`[data-platform]`).forEach(e=>{e.addEventListener(`click`,()=>{s.selectedPlatform=e.dataset.platform,d()})}),document.querySelectorAll(`[data-reset-filters]`).forEach(e=>{e.addEventListener(`click`,()=>{s.selectedGroup=`all`,s.selectedPlatform=`all`,s.query=``,d()})}),document.querySelector(`#copy-brief`)?.addEventListener(`click`,t=>T(k(e),t.currentTarget)),document.querySelectorAll(`img[data-fallback]`).forEach(e=>{e.addEventListener(`error`,()=>e.remove())})}function g(e,t){let n=e.evidence.find(e=>e.firstParty)||e.evidence[0]||{};return`
    <article class="receipt-card status-${G(e.status.toLowerCase())}">
      <div class="receipt-rail">
        <span class="receipt-number">${V(t+1)}</span>
        <span class="status-badge">${G(e.status)}</span>
      </div>
      <div class="receipt-copy">
        ${A(n.url,e.title,`receipt-title`)}
        <p>${G(e.summary)}</p>
        <strong>${G(e.whyItMatters)}</strong>
        <div class="evidence-links" aria-label="核验证据">
          ${e.evidence.slice(0,4).map(e=>`<a href="${G(e.url)}" target="_blank" rel="noopener"><span>${G(e.tier===`official`?`一手`:e.tier===`primary`?`原始`:`社区`)}</span>${G(e.label)}</a>`).join(``)}
        </div>
      </div>
    </article>
  `}function _(e){let t=e.unverified.slice(0,3);return`
    <aside class="panel decision-panel decision-${G(e.decision.toLowerCase())}">
      <p class="eyebrow">Delivery gate</p>
      <div class="decision-mark">${G(e.decision)}</div>
      <h2>${G(e.decisionLabel)}</h2>
      <ol class="method-list">
        <li><span>01</span><p>与上一期快照比差异，不重复播报旧闻。</p></li>
        <li><span>02</span><p>同一事件跨来源合并，优先回到一手或原始证据。</p></li>
        <li><span>03</span><p>最多发送 3 条；只有传闻就 HOLD，没有变化就静默。</p></li>
      </ol>
      ${t.length?`<div class="pending-box"><strong>等待核验 · ${H(e.unverified.length)}</strong>${t.map(e=>`<p><span>UNVERIFIED</span>${G(e.title)}</p>`).join(``)}</div>`:``}
      <a class="feed-link" href="./data/change-brief.xml" target="_blank" rel="noopener">订阅 RSS 变化回执 →</a>
      <small class="method-foot">排序只看变化类型与证据等级；不比较跨平台热度、Stars 或榜单名次。</small>
    </aside>
  `}function v(e){let n=t[e.platform]?.accent||`#1f2933`,r=R(e);return`
    <article class="board-card" style="--accent:${G(n)}">
      <header>
        <div>
          <p class="eyebrow">${G(e.updateTime||`实时`)}</p>
          <h3>${G(e.platformLabel)}</h3>
        </div>
        <span>${G(r)}</span>
      </header>
      <ol class="topic-list">
        ${e.items.slice(0,12).map(y).join(``)}
      </ol>
    </article>
  `}function y(e){let t=e.description||`该 AI 条目没有提供描述，当前保留原始标题、排名、热度和来源链接。`,n=e.cover?`<img class="topic-cover" src="${G(U(e.cover))}" alt="" loading="lazy" data-fallback />`:``,r=e.sourceLabel||e.platformLabel;return`
    <li class="topic-row">
      <details>
        <summary>
          <span class="mini-rank">${V(e.rank)}</span>
          <span class="topic-main">
            <span class="topic">${G(e.title)}</span>
            <span class="topic-flags">${G(r)} · ${e.description?`有描述`:`无描述`} · ${e.hotValue?`热度 ${G(e.hotValue)}`:`热度未提供`}</span>
          </span>
          <span class="heat">${e.hotValue?G(e.hotValue):`无热度`}</span>
          <span class="detail-cue" aria-hidden="true">详情</span>
        </summary>
        <div class="detail-body">
          ${n}
          <div class="detail-copy">
            <p>${G(t)}</p>
            <dl class="detail-metrics">
              <div><dt>平台</dt><dd>${G(e.platformLabel)}</dd></div>
              <div><dt>来源</dt><dd>${G(r)}</dd></div>
              <div><dt>排名</dt><dd>${V(e.rank)}</dd></div>
              <div><dt>热度</dt><dd>${e.hotValue?G(e.hotValue):`未提供`}</dd></div>
              <div><dt>AI 命中</dt><dd>${e.matchedKeywords?.length?G(e.matchedKeywords.slice(0,3).join(` / `)):`AI`}</dd></div>
            </dl>
            ${A(e.url,`打开原链接`,`detail-link`)}
          </div>
        </div>
      </details>
    </li>
  `}function b(e,t){return`
    <div class="empty-state" role="status">
      <strong>${G(e)}</strong>
      <p>${G(t)}</p>
      ${B()?`<button class="ghost" type="button" data-reset-filters>清除筛选</button>`:``}
    </div>
  `}function x(e,t){return`
    <div class="empty-state quiet-empty" role="status">
      <strong>${G(e)}</strong>
      <p>${G(t)}</p>
    </div>
  `}function S(e,t){let n=z(N(e));return`
    <button type="button" data-group="${G(e)}" class="${s.selectedGroup===e?`active`:``}">
      <span>${G(t)}</span>
      <small>${H(n)}</small>
    </button>
  `}function C(e,t,n){return`
    <button type="button" data-platform="${G(e)}" class="${s.selectedPlatform===e?`active`:``}" role="listitem">
      <span>${G(t)}</span>
      <small>${H(n)}</small>
    </button>
  `}function w(e,t,n){return`
    <div class="stat-card">
      <span>${G(e)}</span>
      <strong>${H(t)}</strong>
      <small>${G(n)}</small>
    </div>
  `}async function T(e,t){O(t,e.trim()?await E(e):!1)}async function E(e){if(navigator.clipboard&&window.isSecureContext)try{return await navigator.clipboard.writeText(e),!0}catch{return D(e)}return D(e)}function D(e){let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.inset=`0 auto auto 0`,t.style.opacity=`0`,document.body.append(t),t.select();try{return document.execCommand(`copy`)}catch{return!1}finally{t.remove()}}function O(e,t){if(!e)return;let n=e.dataset.defaultLabel||e.textContent;e.textContent=t?`已复制`:`复制失败`,e.classList.toggle(`copied`,t),e.classList.toggle(`copy-failed`,!t),window.clearTimeout(e.copyTimer),e.copyTimer=window.setTimeout(()=>{e.textContent=n,e.classList.remove(`copied`,`copy-failed`)},1400)}function k(e){let t=[`AI讯息｜今天真的变了什么`,`决策：${e.decision} · ${e.decisionLabel}`];return e.receipts.length||t.push(e.decision===`HOLD`?`有变化信号，但一手证据不足，暂不发送。`:`相较上一期没有值得打扰你的实质变化。`),e.receipts.forEach((e,n)=>{let r=e.evidence.find(e=>e.firstParty)||e.evidence[0];t.push(`${n+1}. [${e.status}] ${e.title}`),t.push(`   ${e.whyItMatters}`),r?.url&&t.push(`   证据：${r.url}`)}),t.push(`只报变化，不做跨平台热度混排；每天最多 3 条。`),t.join(`
`)}function A(e,t,n){return e?`<a class="${n}" href="${G(e)}" target="_blank" rel="noopener">${G(t)}</a>`:`<span class="${n} is-disabled">暂无链接</span>`}function j(e,t){return t?[e.title,e.description,e.platformLabel,e.hotValue].some(e=>M(e).includes(t)):!0}function M(e){return String(e||``).trim().toLowerCase()}function N(t){let n=e.find(e=>e.id===t);if(!n)return s.boards;let r=new Set(n.platforms);return s.boards.filter(e=>r.has(e.platform))}function P(e){let t=e?.filter||{},n=t.mode?I(t.mode):`AI-only keyword filter`,r=Array.isArray(t.keywords)?t.keywords.length:0;return{mode:n,keywordLabel:r?`${H(r)} 个关键词`:`关键词不可用`}}function F(e,t){let n=e&&typeof e==`object`?e:{},r=n.funnel&&typeof n.funnel==`object`?n.funnel:{},i=[`SEND`,`HOLD`,`QUIET_DAY`].includes(n.decision)?n.decision:`HOLD`;return{generatedAt:n.generatedAt||t?.generatedAt||``,comparedWith:n.comparedWith||null,decision:i,decisionLabel:n.decisionLabel||(i===`SEND`?`发送变化回执`:i===`QUIET_DAY`?`静默日：没有值得打扰你的变化`:`暂缓：等待一手证据`),promise:n.promise||`只推送经一手或原始来源核验、且相较上一期发生实质变化的 AI 事件；最多 3 条。`,funnel:{signals:Number(r.signals||t?.itemCount||0),events:Number(r.events||0),verified:Number(r.verified||0),receipts:Number(r.receipts||0)},receipts:Array.isArray(n.receipts)?n.receipts:[],unverified:Array.isArray(n.unverified)?n.unverified:[]}}function I(e){let t=String(e||``).trim();return t===`ai-keyword-match`?`AI-only 关键词过滤`:t?`${t.replace(/[-_]+/g,` `)} 过滤`:`AI-only 关键词过滤`}function L(e){let t=e?.sourceStats||{},n=(t.byKind||{})[`ai-source`]||{};return{totalBoards:Number(t.totalBoards||s.boards.length||0),aiSourceBoards:Number(n.boards||0),aiSourceItems:Number(n.items||0)}}function R(e){let t=e.aiFilterSummary||{},n=Number(t.matched),r=Number(t.total);return Number.isFinite(n)&&Number.isFinite(r)&&r>0?`AI ${H(n)} / ${H(r)}`:`${H(e.items.length)} 条`}function z(e){return e.reduce((e,t)=>e+t.items.length,0)}function B(){return s.selectedGroup!==`all`||s.selectedPlatform!==`all`||s.query.trim()}function V(e){let t=Number(e);return Number.isFinite(t)&&t>0?String(t).padStart(2,`0`):`--`}function H(e){return l.format(Number(e)||0)}function U(e){let t=String(e||``);return/^(https?:)?\/\//.test(t)||t.startsWith(`data:`)?t:`./data/${t.replace(/^\/+/,``)}`}function W(e){return new Intl.DateTimeFormat(`zh-CN`,{month:`long`,day:`numeric`,hour:`2-digit`,minute:`2-digit`}).format(new Date(e))}function G(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}