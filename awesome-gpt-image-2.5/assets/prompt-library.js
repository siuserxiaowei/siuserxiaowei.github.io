/* Untrusted upstream text is rendered as text, never HTML or executable code. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!$('archive-form')) return;
  let indexPromise, selected, matches = [], shown = 48, sequence = 0;
  const shards = new Map();
  const labels = {'profile-avatar':'头像与人物','social-media-post':'社交媒体','infographic-edu-visual':'信息图与教学','youtube-thumbnail':'视频封面','comic-storyboard':'漫画与分镜','product-marketing':'产品营销','ecommerce-main-image':'电商主图','game-asset':'游戏资产','poster-flyer':'海报与传单','app-web-design':'界面设计','others':'其他用途'};
  const safeURL = value => {
    try { const u = new URL(value); return u.protocol === 'https:' && !u.username ? u.href : ''; }
    catch { return ''; }
  };
  const node = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const link = (text, url) => { const n = node('a', text); n.href = url; return n; };
  const getIndex = () => indexPromise ||= fetch('/awesome-gpt-image-2.5/data/prompt-library/index.json').then(r => {if (!r.ok) throw Error('索引加载失败'); return r.json();}).catch(e => { indexPromise = null; throw e; });
  async function getShard(name) {
    if (!/^records-\d{3}\.json$/.test(name)) throw Error('无效的提示词文件');
    if (!shards.has(name)) shards.set(name, (async () => {
      if ('DecompressionStream' in window) {
        const r = await fetch('/awesome-gpt-image-2.5/data/prompt-library/' + name + '.gz');
        if (!r.ok) throw Error('提示词加载失败，请重试');
        return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json();
      }
      const r = await fetch('https://raw.githubusercontent.com/siuserxiaowei/awesome-gpt-image-2.5/main/library/prompt-archive/' + name);
      if (!r.ok) throw Error('浏览器不支持压缩数据，备用来源也未能加载；请打开仓库原文');
      return r.json();
    })().catch(e => {shards.delete(name); throw e;}));
    return shards.get(name);
  }
  function draw() {
    const cards = matches.slice(0, shown).map(item => {
      const card = node('article', '', 'archive-card');
      const h = node('h2'); const a = link(item.title_zh || item.title, '/awesome-gpt-image-2.5/prompt-library/?id=' + encodeURIComponent(item.id));
      a.addEventListener('click', event => { event.preventDefault(); history.pushState({}, '', a.href); open(item.id); }); h.append(a);
      card.append(h, node('p', item.categories.map(c => labels[c] || c).join(' · ')), node('p', item.description), node('p', item.sources.join(' · ')));
      return card;
    });
    $('archive-results').replaceChildren(...cards);
    $('archive-count').textContent = `显示 ${Math.min(shown, matches.length)} / ${matches.length.toLocaleString()} 条匹配提示词`;
    $('archive-more').hidden = shown >= matches.length;
  }
  async function search() {
    const request = ++sequence;
    $('archive-count').textContent = '正在加载全库索引…';
    try {
      const all = await getIndex(); if (request !== sequence) return;
      const q = $('archive-query').value.trim().toLocaleLowerCase();
      const category = $('archive-category').value, source = $('archive-source').value, ref = $('archive-reference').value;
      matches = all.filter(x => (!q || `${x.title} ${x.title_zh} ${x.description} ${x.categories.map(c => labels[c])}`.toLocaleLowerCase().includes(q)) && (!category || x.categories.includes(category)) && (!source || x.sources.includes(source)) && (!ref || (ref === 'yes' ? x.reference_requirement === true : ref === 'no' ? x.reference_requirement === false : x.reference_requirement === null)));
      shown = 48; draw();
    } catch (e) { $('archive-count').textContent = e.message + '。仍可使用下方分页浏览来源。'; }
  }
  function setupVariables(prompt) {
    const pattern = /\{argument name=\\?"([^"\\]+)\\?" default=\\?"([^"\\]*)\\?"\}/g;
    const fields = [...prompt.matchAll(pattern)];
    const box = $('archive-variables'); box.replaceChildren();
    const inputs = new Map();
    for (const field of fields) {
      if (inputs.has(field[0])) continue;
      const label = node('label', field[1]); const input = node('input'); input.value = field[2]; label.append(input); box.append(label); inputs.set(field[0], input);
    }
    const apply = () => { let text = prompt; for (const [token, input] of inputs) text = text.split(token).join(input.value); $('archive-remix').value = text; };
    inputs.forEach(input => input.addEventListener('input', apply)); apply();
    if (!inputs.size) box.append(node('p', '这条没有结构化变量，可直接编辑下方副本。方括号占位符须根据上下文自行填写。'));
  }
  let openSequence = 0;
  async function open(id) {
    const request = ++openSequence;
    const detail = $('archive-detail'); detail.hidden = false; $('archive-feedback').textContent = '正在读取完整提示词…';
    $('archive-original').value = ''; $('archive-remix').value = ''; selected = null;
    try {
      const item = (await getIndex()).find(x => x.id === id); if (!item) throw Error('未找到这条提示词');
      const row = (await getShard(item.shard)).find(x => x.id === id); if (!row) throw Error('来源分片没有该条目');
      if (request !== openSequence) return; selected = row;
      $('archive-detail-title').textContent = row.title;
      $('archive-input-note').textContent = (row.reference_requirement === true ? '需要参考图。' : row.reference_requirement === false ? '上游标记：无需参考图。' : '上游未明确标记输入要求，请核对正文中的 reference / uploaded image。') + ' 收录状态：学习资料，未据此验证具体模型。';
      $('archive-original').value = row.prompt; setupVariables(row.prompt);
      const languages = row.translations || {};
      $('archive-language-label').hidden = !Object.keys(languages).length;
      $('archive-language').replaceChildren(...['original', ...Object.keys(languages)].map(language => {const option = node('option', language === 'original' ? '原词 / English' : language); option.value = language; return option;}));
      $('archive-language-note').replaceChildren();
      $('archive-sources').replaceChildren(...row.sources.map(s => {
        const p = node('p');
        p.append(link(s.repository, safeURL(s.upstream_url)), document.createTextNode(` · ${s.license} · 原作者：${s.author || '上游未逐条注明'} · `));
        const url = safeURL(s.source_url); if (url) p.append(link('原始来源', url));
        if (s.model_reported) p.append(document.createTextNode(' · ' + s.model_reported));
        return p;
      }));
      $('archive-existing').replaceChildren();
      if (row.existing_case_id) $('archive-existing').append(link('已有图鉴案例：' + row.existing_case_id, '/awesome-gpt-image-2.5/cases/' + encodeURIComponent(row.existing_case_id) + '/'));
      for (const run of item.project_runs || []) {
        if (/^\/cases\/own-\d+\/$/.test(run.url)) $('archive-existing').append(node('br'), link('本项目实际复跑：' + run.title, run.url));
      }
      $('archive-images').replaceChildren(); $('archive-preview').hidden = !row.images.length;
      $('archive-feedback').textContent = '已加载原词。上游示例图由外部来源提供，点击后加载。';
      detail.focus();
    } catch (e) { if (request === openSequence) $('archive-feedback').textContent = e.message; }
  }
  $('archive-preview').addEventListener('click', () => {
    if (!selected) return;
    $('archive-images').replaceChildren(...selected.images.slice(0, 8).map(value => {
      const url = safeURL(value); if (!url) return node('span');
      const figure = node('figure'); const img = node('img'); img.src = url; img.alt = selected.title + '：上游示例，非本项目结果'; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.width = 640; img.height = 640;
      img.addEventListener('error', () => { img.remove(); figure.append(node('p', '外部预览不可用，请查看图片来源。')); }, {once:true});
      figure.append(img, link('打开图片来源', url)); return figure;
    })); $('archive-preview').hidden = true;
  });
  async function copy(id) {
    const value = $(id).value; if (!value) return;
    try { await navigator.clipboard.writeText(value); $('archive-feedback').textContent = '已复制。'; }
    catch { $(id).focus(); $(id).select(); $('archive-feedback').textContent = '复制受浏览器限制；已选中文字，可按 Ctrl/Cmd+C。'; }
  }
  $('archive-copy').addEventListener('click', () => copy('archive-original'));
  $('archive-copy-remix').addEventListener('click', () => copy('archive-remix'));
  $('archive-reset').addEventListener('click', () => { if (selected) setupVariables($('archive-original').value); });
  $('archive-language').addEventListener('change', () => {
    if (!selected) return;
    const language = $('archive-language').value;
    const variant = (selected.translations || {})[language];
    const prompt = variant ? variant.prompt : selected.prompt;
    $('archive-original').value = prompt; setupVariables(prompt);
    $('archive-language-note').replaceChildren();
    if (variant) $('archive-language-note').append(document.createTextNode('这是上游提供的译本，未验证与原词效果等价。'), link('译本来源', safeURL(variant.upstream_url)));
  });
  $('archive-form').addEventListener('submit', e => {e.preventDefault(); search();});
  ['archive-category','archive-source','archive-reference'].forEach(id => $(id).addEventListener('change', search));
  $('archive-more').addEventListener('click', () => {shown += 48; draw();});
  const params = new URLSearchParams(location.search); $('archive-query').value = params.get('q') || '';
  if (params.has('q')) search(); if (params.has('id')) open(params.get('id'));
  window.addEventListener('popstate', () => {const id = new URLSearchParams(location.search).get('id'); if (id) open(id); else $('archive-detail').hidden = true;});
})();
