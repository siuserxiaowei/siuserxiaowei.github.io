(() => {
  const data = window.BATTLE_DATA;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const state = { selectedId: 'clawhive', query: '', category: 'all' };
  const elevator = data.elevator || '';

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }
  function highlight(text) {
    const q = state.query.trim();
    const safe = escapeHtml(text);
    if (!q) return safe;
    const tokens = q.split(/\s+/).filter(Boolean).slice(0, 4);
    let result = safe;
    for (const token of tokens) {
      const t = escapeHtml(token).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (t) result = result.replace(new RegExp(t, 'ig'), m => `<mark>${m}</mark>`);
    }
    return result;
  }
  function textBlob(p) {
    return [p.name,p.vendor,p.category,p.tag,p.audience,p.deployment,p.im,p.model,p.dataDomain,p.positioning,p.angle,p.trigger,p.sales,
      ...p.advantages.flatMap(x=>[x.k,x.v]), ...p.limits.flatMap(x=>[x.k,x.v])].join(' ');
  }
  function filteredProducts() {
    return data.products.filter(p => {
      const okCategory = state.category === 'all' || p.category === state.category;
      const q = state.query.trim().toLowerCase();
      const okQuery = !q || textBlob(p).toLowerCase().includes(q);
      return okCategory && okQuery;
    });
  }
  function salesText(p) {
    const adv = p.advantages.map(x => `${x.k} — ${x.v}`).join('\n');
    const lim = p.limits.map(x => `${x.k} — ${x.v}`).join('\n');
    return `${p.name}\n一句话定位 — ${p.positioning}\n\n三个核心优势\n${adv}\n\n三个主要限制\n${lim}\n\n跟帝王蟹 ClawHive 对比切入点 — ${p.angle}`;
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch (err) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    const toast = $('#toast');
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 1400);
  }

  function renderPitch() {
    const el = $('#pitchBlock');
    if (el) el.textContent = elevator;
  }
  function renderNumbers() {
    const grid = $('#numbersGrid');
    if (!grid || !data.numbers) return;
    grid.innerHTML = data.numbers.map(item => `
      <article class="number-card">
        <div class="number-big">${escapeHtml(item.n)}</div>
        <div class="number-label">${escapeHtml(item.label)}</div>
        <p class="number-fact">${escapeHtml(item.v)}</p>
        <p class="number-use"><strong>用法</strong>${escapeHtml(item.u)}</p>
      </article>
    `).join('');
  }
  function renderLineage() {
    const grid = $('#lineageGrid');
    if (!grid || !data.lineage) return;
    const left = data.lineage.openclaw, right = data.lineage.clawhive;
    grid.innerHTML = [
      { ...left, side: 'left' },
      { ...right, side: 'right' }
    ].map(card => `
      <article class="lineage-card lineage-${card.side}">
        <div class="lineage-head"><span class="lineage-icon">${escapeHtml(card.icon)}</span>
          <div><h3>${escapeHtml(card.title)}</h3><p class="lineage-sub">${escapeHtml(card.subtitle)}</p></div></div>
        <p class="lineage-row"><strong>起源</strong>${escapeHtml(card.story)}</p>
        <p class="lineage-row"><strong>真本事</strong>${escapeHtml(card.ability)}</p>
        <p class="lineage-row"><strong>${card.side === 'left' ? '企业级缺陷' : '解决方式'}</strong>${escapeHtml(card.limit)}</p>
      </article>
    `).join('');
  }
  function renderIncidents() {
    const grid = $('#incidentGrid');
    if (!grid || !data.incidents) return;
    grid.innerHTML = data.incidents.map(it => `
      <article class="incident-card">
        <div class="incident-icon">${escapeHtml(it.icon)}</div>
        <h3>${escapeHtml(it.title)}</h3>
        <p class="incident-body">${escapeHtml(it.body)}</p>
        <p class="incident-imp"><strong>对销售的意义</strong>${escapeHtml(it.implication)}</p>
      </article>
    `).join('');
  }
  function renderPersona() {
    const wrap = $('#personaList');
    if (!wrap || !data.personaTree) return;
    wrap.innerHTML = data.personaTree.map((q, idx) => `
      <article class="persona-card">
        <div class="persona-q"><span class="persona-num">问题 ${idx + 1}</span><h3>${escapeHtml(q.q)}</h3></div>
        <ul class="persona-branches">
          ${q.branches.map(b => `
            <li class="${b.highlight ? 'is-highlight' : ''}">
              <span class="branch-label">${escapeHtml(b.label)}</span>
              <span class="branch-arrow">→</span>
              <span class="branch-advice">${escapeHtml(b.advice)}</span>
            </li>
          `).join('')}
        </ul>
      </article>
    `).join('');
  }
  function renderDecision() {
    const grid = $('#decisionGrid');
    if (!grid || !data.decisionGuide) return;
    grid.innerHTML = data.decisionGuide.map(d => `
      <article class="decision-card">
        <div class="decision-tag">${escapeHtml(d.scenario)}</div>
        <p class="decision-need"><strong>核心需求</strong>${escapeHtml(d.need)}</p>
        <p class="decision-pick"><strong>推荐</strong><span class="pick-text">${escapeHtml(d.pick)}</span></p>
        <p class="decision-why">${escapeHtml(d.why)}</p>
      </article>
    `).join('');
  }
  function renderFactsTable() {
    const t = $('#factsTable');
    if (!t || !data.factSheet) return;
    t.innerHTML = `<thead><tr><th>事实</th><th>数据</th><th>出处</th></tr></thead>` +
      `<tbody>${data.factSheet.map(f => `<tr><td>${escapeHtml(f.k)}</td><td>${escapeHtml(f.v)}</td><td>${escapeHtml(f.src)}</td></tr>`).join('')}</tbody>`;
  }

  function renderFacts() {
    $('#factGrid').innerHTML = data.facts.map(f => `
      <div class="fact-card"><div class="n">${escapeHtml(f.n)}</div><div class="v">${escapeHtml(f.v)}</div><div class="u">${escapeHtml(f.u)}</div></div>
    `).join('');
  }
  function renderCategories() {
    const cats = [...new Set(data.products.map(p => p.category))];
    $('#categoryFilter').innerHTML = '<option value="all">全部</option>' + cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  }
  function renderList() {
    const products = filteredProducts();
    const list = $('#productList');
    if (!products.length) { list.innerHTML = '<div class="empty">没有匹配结果。换个关键词试试。</div>'; return; }
    if (!products.some(p => p.id === state.selectedId)) state.selectedId = products[0].id;
    list.innerHTML = products.map(p => `
      <button class="product-button ${p.id === state.selectedId ? 'is-active' : ''}" type="button" data-id="${escapeHtml(p.id)}">
        <span class="product-icon">${escapeHtml(p.icon)}</span>
        <span><span class="product-name">${highlight(p.name)}</span><span class="product-meta">${highlight(p.category)} · ${highlight(p.tag)}</span></span>
      </button>
    `).join('');
    $$('.product-button', list).forEach(btn => btn.addEventListener('click', () => {
      state.selectedId = btn.dataset.id; renderList(); renderCard();
    }));
  }
  function renderCard() {
    const p = data.products.find(x => x.id === state.selectedId) || data.products[0];
    $('#battleCard').innerHTML = `
      <div class="battle-top">
        <div>
          <p class="eyebrow">${escapeHtml(p.vendor)} · ${escapeHtml(p.tag)}</p>
          <h3>${escapeHtml(p.icon)} ${highlight(p.name)}</h3>
          <div class="badges"><span class="badge dark">${escapeHtml(p.category)}</span><span class="badge">${escapeHtml(p.audience)}</span></div>
        </div>
        <button class="btn small copy-card" type="button" data-copy-card="${escapeHtml(p.id)}">复制本卡话术</button>
      </div>
      <div class="positioning">一句话定位 — ${highlight(p.positioning)}</div>
      <div class="detail-grid">
        <section class="detail-block"><h4>三个核心优势</h4><ul class="kv-list">
          ${p.advantages.map(x => `<li><strong>${highlight(x.k)}</strong><span>${highlight(x.v)}</span></li>`).join('')}
        </ul></section>
        <section class="detail-block"><h4>三个主要限制</h4><ul class="kv-list">
          ${p.limits.map(x => `<li><strong>${highlight(x.k)}</strong><span>${highlight(x.v)}</span></li>`).join('')}
        </ul></section>
      </div>
      <div class="angle">
        <section class="angle-card"><h4>跟帝王蟹 ClawHive 对比切入点</h4><p>${highlight(p.angle)}</p></section>
        <section class="angle-card warn"><h4>客户触发场景</h4><p>${highlight(p.trigger)}</p></section>
      </div>
      <table class="meta-table"><tbody>
        <tr><th>部署</th><td>${highlight(p.deployment)}</td></tr>
        <tr><th>IM 适配</th><td>${highlight(p.im)}</td></tr>
        <tr><th>模型策略</th><td>${highlight(p.model)}</td></tr>
        <tr><th>数据边界</th><td>${highlight(p.dataDomain)}</td></tr>
        <tr><th>销售短句</th><td>${highlight(p.sales)}</td></tr>
      </tbody></table>
    `;
    $('[data-copy-card]').addEventListener('click', () => copy(salesText(p)));
  }
  function renderMatrix() {
    const heads = ['维度', '网易 ClawHive', '腾讯 WorkBuddy / QClaw', '字节 ArkClaw', '智谱 AutoClaw'];
    $('#compareTable').innerHTML = `<thead><tr>${heads.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>` +
      `<tbody>${data.compareRows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  }
  function renderMaturity() {
    $('#maturityGrid').innerHTML = data.maturity.map(m => `
      <article class="maturity-card"><div class="level">${escapeHtml(m.level)}</div>
      <p><strong>特征</strong>${escapeHtml(m.feature)}</p><p><strong>风险</strong>${escapeHtml(m.risk)}</p><p><strong>帝王蟹切入</strong>${escapeHtml(m.pitch)}</p></article>
    `).join('');
  }
  function renderObjections() {
    $('#objectionList').innerHTML = data.objections.map((o, idx) => `
      <details class="objection" ${idx < 2 ? 'open' : ''}><summary>${escapeHtml(o.q)}</summary><p>${escapeHtml(o.a)}</p></details>
    `).join('');
  }
  function bind() {
    $('#searchInput').addEventListener('input', e => { state.query = e.target.value; renderList(); renderCard(); });
    $('#categoryFilter').addEventListener('change', e => { state.category = e.target.value; renderList(); renderCard(); });
    const btnElev = $('#copyElevator');
    if (btnElev) btnElev.addEventListener('click', () => copy(elevator));
    const btnElev2 = $('#copyElevatorBlock');
    if (btnElev2) btnElev2.addEventListener('click', () => copy(elevator));
    $('#copyAllObjections').addEventListener('click', () => copy(data.objections.map(o => `Q：${o.q}\nA：${o.a}`).join('\n\n')));
    $('#toggleMap').addEventListener('click', () => $('#mapWrap').classList.toggle('is-collapsed'));
    const btnFacts = $('#copyFactSheet');
    if (btnFacts) btnFacts.addEventListener('click', () => {
      const text = data.factSheet.map(f => `${f.k}：${f.v}（出处：${f.src}）`).join('\n');
      copy(text);
    });
  }

  renderPitch(); renderNumbers(); renderFacts(); renderCategories();
  renderLineage(); renderIncidents(); renderPersona(); renderDecision(); renderFactsTable();
  renderList(); renderCard(); renderMatrix(); renderMaturity(); renderObjections();
  bind();
})();
