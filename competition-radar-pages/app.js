const DATA_URL = './data/competitions.json';
const PAGE_SIZE = 40;
const FAVORITES_KEY = 'signal-radar:favorites';
const TIER_WEIGHT = { S: 4, A: 3, B: 2, C: 1 };

const state = {
  items: [],
  filtered: [],
  visible: PAGE_SIZE,
  selectedId: null,
  query: '',
  status: 'all',
  category: 'all',
  platform: 'all',
  region: 'all',
  mode: 'all',
  sort: 'deadline',
  favoritesOnly: false,
  favorites: new Set(readFavorites()),
};

const elements = {
  syncStatus: document.querySelector('#sync-status'),
  metricTotal: document.querySelector('#metric-total'),
  metricActive: document.querySelector('#metric-active'),
  metricUrgent: document.querySelector('#metric-urgent'),
  metricPlatforms: document.querySelector('#metric-platforms'),
  platformCoverage: document.querySelector('#platform-coverage'),
  platformCoverageSummary: document.querySelector('#platform-coverage-summary'),
  platformCoverageList: document.querySelector('#platform-coverage-list'),
  newSignalList: document.querySelector('#new-signal-list'),
  search: document.querySelector('#search-input'),
  status: document.querySelector('#status-filter'),
  category: document.querySelector('#category-filter'),
  platform: document.querySelector('#platform-filter'),
  region: document.querySelector('#region-filter'),
  mode: document.querySelector('#mode-filter'),
  sort: document.querySelector('#sort-filter'),
  favoritesOnly: document.querySelector('#favorites-only'),
  reset: document.querySelector('#reset-filters'),
  resultCount: document.querySelector('#result-count'),
  list: document.querySelector('#competition-list'),
  detail: document.querySelector('#detail-panel'),
  empty: document.querySelector('#empty-state'),
  loadMore: document.querySelector('#load-more'),
  template: document.querySelector('#competition-card-template'),
};

boot();

async function boot() {
  hydrateFiltersFromUrl();
  bindEvents();

  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    state.items = payload.items.map(enrichItem);
    elements.syncStatus.textContent = `${payload.asOfDate || payload.updatedAt} / ${payload.count} 条机会`;
    populateCategories();
    populatePlatforms(payload.researchCoverage || []);
    renderMetrics(payload);
    renderPlatformCoverage(payload.researchCoverage || []);
    renderNewSignals();
    applyFilters();

    const requestedId = decodeURIComponent(location.hash.slice(1));
    if (requestedId && state.items.some((item) => item.id === requestedId)) {
      selectCompetition(requestedId, { scroll: false, updateHash: false });
    }
  } catch (error) {
    elements.syncStatus.textContent = 'data link interrupted';
    elements.list.innerHTML = `
      <div class="empty-state">
        <span>数据错误</span>
        <h3>赛事快照加载失败</h3>
        <p>${escapeHtml(error.message)}</p>
        <p>请先运行 <code>npm run build</code>，再通过 <code>npm run dev</code> 打开页面。</p>
      </div>`;
  }
}

function enrichItem(item) {
  const deadline = normalizeDate(item.deadlineDate || item.primaryDeadline?.date);
  const status = getStatus(deadline, item.researchStatus);
  const searchText = [
    item.name,
    item.fullName,
    item.originalName,
    item.originalFullName,
    item.organization,
    item.category,
    item.location,
    item.description,
    item.audience,
    item.researchPlatformName,
    ...(item.researchPlatformNames || []),
    ...(item.sourceCategories || []),
    ...(item.rewards || []),
  ].join(' ').toLocaleLowerCase('zh-CN');

  return { ...item, _deadline: deadline, _status: status, _searchText: searchText };
}

function normalizeDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const date = new Date(`${value}T23:59:59`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getStatus(deadline, researchStatus) {
  if (!deadline && researchStatus === 'open') return { kind: 'active', days: null, label: '开放中 · 截止待确认' };
  if (!deadline && researchStatus === 'upcoming') return { kind: 'active', days: null, label: '即将开放 · 日期待确认' };
  if (!deadline) return { kind: 'unknown', days: null, label: '日期待确认' };
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const days = Math.round((deadlineDay - today) / 86_400_000);
  if (days < 0) return { kind: 'expired', days, label: `已截止 ${Math.abs(days)} 天` };
  if (days === 0) return { kind: 'urgent', days, label: '今天截止' };
  if (days <= 14) return { kind: 'urgent', days, label: `${days} 天后截止` };
  return { kind: 'active', days, label: `${days} 天后截止` };
}

function populateCategories() {
  const categories = [...new Set(state.items.map((item) => item.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));
  for (const category of categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    elements.category.append(option);
  }
  elements.category.value = state.category;
}

function populatePlatforms(coverage) {
  for (const platform of coverage) {
    const option = document.createElement('option');
    option.value = platform.id;
    option.textContent = platformDisplayName(platform.name);
    elements.platform.append(option);
  }
  elements.platform.value = state.platform;
}

function renderMetrics(payload) {
  const active = state.items.filter((item) => ['active', 'urgent'].includes(item._status.kind)).length;
  const urgent = state.items.filter((item) => item._status.kind === 'urgent').length;
  elements.metricTotal.textContent = state.items.length.toLocaleString('zh-CN');
  elements.metricActive.textContent = active.toLocaleString('zh-CN');
  elements.metricUrgent.textContent = urgent.toLocaleString('zh-CN');
  elements.metricPlatforms.textContent = Number(payload.researchPlatforms || 0).toLocaleString('zh-CN');
}

function renderPlatformCoverage(coverage) {
  if (!coverage.length) return;
  const complete = coverage.filter((platform) => platform.completeListingClaim).length;
  const actionable = coverage.reduce((sum, platform) => sum + Number(platform.actionableFound || 0), 0);
  elements.platformCoverage.hidden = false;
  elements.platformCoverageSummary.textContent = `${complete}/${coverage.length} 个平台完成全列表遍历 · ${actionable} 条可行动记录（去重前）`;
  elements.platformCoverageList.replaceChildren();

  coverage.forEach((platform, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'platform-chip';
    button.dataset.complete = String(Boolean(platform.completeListingClaim));
    button.setAttribute('aria-label', `筛选 ${platform.name}`);
    button.innerHTML = `
      <span>${String(index + 1).padStart(2, '0')}</span>
      <strong>${escapeHtml(platformDisplayName(platform.name))}</strong>
      <small>${Number(platform.actionableFound || 0)} 条 · ${Number(platform.canonicalRecordCount ?? platform.actionableFound ?? 0)} 张去重卡片</small>`;
    button.addEventListener('click', () => {
      state.platform = platform.id;
      elements.platform.value = platform.id;
      state.visible = PAGE_SIZE;
      applyFilters();
      document.querySelector('#results-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    elements.platformCoverageList.append(button);
  });
}

function renderNewSignals() {
  const fresh = state.items
    .filter((item) => item.discoveredAt)
    .sort(compareDeadlines)
    .slice(0, 5);
  elements.newSignalList.replaceChildren();

  fresh.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'signal-card';
    button.type = 'button';
    button.dataset.id = item.id;
    button.innerHTML = `
      <span class="signal-no">新发现 / ${String(index + 1).padStart(2, '0')}</span>
      <span>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.organization)}</p>
      </span>
      <span class="signal-deadline">
        <span>${escapeHtml(item.category || '未分类')}</span>
        <strong>${escapeHtml(item._status.label)}</strong>
      </span>`;
    button.addEventListener('click', () => {
      resetFilters({ render: false });
      state.query = item.name;
      elements.search.value = item.name;
      applyFilters();
      selectCompetition(item.id, { scroll: true });
    });
    elements.newSignalList.append(button);
  });
}

function applyFilters() {
  const query = state.query.trim().toLocaleLowerCase('zh-CN');
  state.filtered = state.items.filter((item) => {
    if (query && !item._searchText.includes(query)) return false;
    if (state.category !== 'all' && item.category !== state.category) return false;
    if (state.platform !== 'all' && !getPlatformIds(item).includes(state.platform)) return false;
    if (state.region !== 'all' && item.participation?.region !== state.region) return false;
    if (state.mode !== 'all' && item.participation?.mode !== state.mode) return false;
    if (state.favoritesOnly && !state.favorites.has(item.id)) return false;
    if (state.status === 'active' && !['active', 'urgent'].includes(item._status.kind)) return false;
    if (state.status !== 'all' && state.status !== 'active' && item._status.kind !== state.status) return false;
    return true;
  });

  state.filtered.sort((a, b) => {
    if (state.sort === 'match') return (b.match || 0) - (a.match || 0) || compareDeadlines(a, b);
    if (state.sort === 'tier') return (TIER_WEIGHT[b.tier] || 0) - (TIER_WEIGHT[a.tier] || 0) || compareDeadlines(a, b);
    if (state.sort === 'newest') return String(b.discoveredAt || b.correctedAt || '').localeCompare(String(a.discoveredAt || a.correctedAt || '')) || compareDeadlines(a, b);
    return compareParticipationPreference(a, b) || compareDeadlines(a, b);
  });

  state.visible = Math.min(Math.max(state.visible, PAGE_SIZE), Math.max(state.filtered.length, PAGE_SIZE));
  syncUrl();
  renderList();
}

function getPlatformIds(item) {
  return [...new Set([...(item.researchPlatformIds || []), item.researchPlatformId].filter(Boolean))];
}

function compareDeadlines(a, b) {
  const aExpired = a._status.kind === 'expired';
  const bExpired = b._status.kind === 'expired';
  if (aExpired !== bExpired) return aExpired ? 1 : -1;
  const aTime = a._deadline?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const bTime = b._deadline?.getTime() ?? Number.MAX_SAFE_INTEGER;
  if (aExpired && bExpired) return bTime - aTime;
  return aTime - bTime || (b.match || 0) - (a.match || 0);
}

function compareParticipationPreference(a, b) {
  return participationPreferenceRank(a) - participationPreferenceRank(b);
}

function participationPreferenceRank(item) {
  const { region, mode } = item.participation || {};
  if (region === 'domestic' && mode === 'online') return 0;
  if (region === 'domestic') return 1;
  if (region === 'international' && mode === 'online') return 2;
  return 3;
}

function renderList() {
  elements.list.replaceChildren();
  const visible = state.filtered.slice(0, state.visible);
  elements.resultCount.textContent = `${state.filtered.length.toLocaleString('zh-CN')} 条匹配`;
  elements.empty.hidden = state.filtered.length !== 0;
  elements.loadMore.hidden = state.filtered.length <= state.visible;

  visible.forEach((item, index) => {
    const fragment = elements.template.content.cloneNode(true);
    const card = fragment.querySelector('.competition-card');
    const main = fragment.querySelector('.card-main');
    const favorite = fragment.querySelector('.favorite-button');
    fragment.querySelector('.card-index').textContent = String(index + 1).padStart(2, '0');
    fragment.querySelector('.card-title').textContent = item.name;
    fragment.querySelector('.card-org').textContent = `${localizedOrganization(item.organization)} · ${localizedLocation(item.location)}`;
    fragment.querySelector('.card-deadline').textContent = item._status.label;
    fragment.querySelector('.card-score').textContent = `${item.tier || '—'} / 适配 ${Number(item.match || 0).toFixed(1)}`;
    fragment.querySelector('.card-flags').append(...buildFlags(item));

    card.dataset.id = item.id;
    card.dataset.region = item.participation?.region || 'unknown';
    card.dataset.mode = item.participation?.mode || 'unknown';
    card.classList.toggle('is-selected', state.selectedId === item.id);
    main.setAttribute('aria-label', `查看 ${item.name} 详情`);
    main.addEventListener('click', () => selectCompetition(item.id, { scroll: false }));
    updateFavoriteButton(favorite, item.id);
    favorite.addEventListener('click', () => toggleFavorite(item.id));
    elements.list.append(fragment);
  });
}

function buildFlags(item) {
  const values = [];
  if (item.discoveredAt) values.push(['新发现', 'is-new']);
  if (item.correctedAt) values.push(['已更新', 'is-new']);
  values.push([item.category || '未分类', '']);
  values.push([item.participation?.regionLabel || '地区待确认', 'is-location']);
  values.push([item.participation?.modeLabel || '形式待确认', 'is-mode']);
  if (item._status.kind === 'urgent') values.push(['即将截止', 'is-urgent']);
  if (item._status.kind === 'expired') values.push(['已截止', 'is-expired']);
  values.push(...verificationFlags(item));

  return values.map(([label, className]) => {
    const flag = document.createElement('span');
    flag.className = `flag ${className}`.trim();
    flag.textContent = label;
    return flag;
  });
}

function selectCompetition(id, { scroll = false, updateHash = true } = {}) {
  const item = state.items.find((candidate) => candidate.id === id);
  if (!item) return;
  state.selectedId = id;
  renderList();
  renderDetail(item);

  if (updateHash) history.replaceState(null, '', `${location.pathname}${location.search}#${encodeURIComponent(id)}`);
  if (scroll && window.innerWidth <= 840) elements.detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDetail(item) {
  const rewards = listMarkup(item.rewards, '奖励信息待主办方补充');
  const timeline = listMarkup(
    (item.timeline || []).map((entry) => formatTimelineEntry(entry, item)),
    '时间轴待确认',
  );
  const sources = (item.sources || [])
    .filter((source) => safeUrl(source.url))
    .map((source) => `<li><a href="${escapeAttribute(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceLabel(source))}</a>${source.date ? ` · ${escapeHtml(source.date)}` : ''}</li>`)
    .join('') || '<li>暂无公开来源</li>';
  const actionUrl = safeUrl(item.actionUrl) ? item.actionUrl : item.sources?.find((source) => safeUrl(source.url))?.url;
  const primaryLabel = item.primaryDeadline?.label || '关键截止';
  const verificationStatus = verificationStatusLabel(item.verification?.status);
  const verificationNotes = item.verification?.notes || '请在报名或提交前打开官方来源再次确认。';
  const extraFlags = verificationFlags(item)
    .map(([label, className]) => `<span class="flag ${className}">${escapeHtml(label)}</span>`)
    .join('');
  const flags = [
    item.discoveredAt ? '<span class="flag is-new">新发现</span>' : '',
    item.correctedAt ? '<span class="flag is-new">已更新</span>' : '',
    `<span class="flag">${escapeHtml(item.category || '未分类')}</span>`,
    `<span class="flag is-location">${escapeHtml(item.participation?.regionLabel || '地区待确认')}</span>`,
    `<span class="flag is-mode">${escapeHtml(item.participation?.modeLabel || '形式待确认')}</span>`,
    item._status.kind === 'urgent' ? '<span class="flag is-urgent">即将截止</span>' : '',
    extraFlags,
  ].join('');

  elements.detail.innerHTML = `
    <div class="detail-content">
      <header class="detail-head">
        <div class="detail-kicker">${flags}</div>
        <h3>${escapeHtml(item.name)}</h3>
        <p class="detail-org">${escapeHtml(localizedOrganization(item.organization))} · ${escapeHtml(localizedLocation(item.location))}</p>
      </header>
      <div class="detail-deadline">
        <div>
          <span>${escapeHtml(primaryLabel)}</span>
          <strong>${escapeHtml(item.deadlineDate || '日期待确认')}</strong>
        </div>
        <small>${escapeHtml(item._status.label)}</small>
      </div>
      <div class="detail-body">
        <p class="detail-description">${escapeHtml(item.description || '赛事简介待补充。')}</p>
        <div class="detail-grid">
          <div><span>赛事等级</span><strong>${escapeHtml(item.tier || '—')}</strong></div>
          <div><span>项目适配</span><strong>${Number(item.match || 0).toFixed(1)} / 10</strong></div>
          <div><span>适用人群</span><strong>${escapeHtml(item.audience || '资格待核')}</strong></div>
          <div><span>核验状态</span><strong>${escapeHtml(verificationStatus)} · ${escapeHtml(item.verification?.checkedAt || '未标注')}</strong></div>
        </div>
        <section class="detail-section verification-block">
          <h4>核验说明</h4>
          <p>${escapeHtml(verificationNotes)}</p>
        </section>
        <section class="detail-section">
          <h4>奖励</h4>
          <ul>${rewards}</ul>
        </section>
        <section class="detail-section">
          <h4>关键节点</h4>
          <ul>${timeline}</ul>
        </section>
        <section class="detail-section source-list">
          <h4>一手来源</h4>
          <ul>${sources}</ul>
        </section>
        <div class="detail-actions">
          ${actionUrl ? `<a class="primary-link" href="${escapeAttribute(actionUrl)}" target="_blank" rel="noopener noreferrer">打开官方入口 ↗</a>` : '<span class="primary-link">入口待确认</span>'}
          <button class="secondary-action" type="button" data-favorite-id="${escapeAttribute(item.id)}">${state.favorites.has(item.id) ? '★ 已收藏' : '☆ 收藏'}</button>
        </div>
      </div>
    </div>`;

  elements.detail.querySelector('[data-favorite-id]')?.addEventListener('click', () => {
    toggleFavorite(item.id);
    renderDetail(item);
  });
}

function verificationFlags(item) {
  const status = String(item.verification?.status || '').toLocaleLowerCase('en');
  const context = `${item.audience || ''} ${item.verification?.notes || ''}`.toLocaleLowerCase('en');
  const flags = [];
  if (/conflict/.test(status)) flags.push(['信息冲突', 'is-warning']);
  else if (status && status !== 'verified') flags.push(['部分核验', 'is-warning']);
  if (/仅限|入围|已报名|existing participant|already[- ]registered|finalist|not open to new|restricted/.test(context)) {
    flags.push(['资格受限', 'is-restricted']);
  }
  return flags;
}

function verificationStatusLabel(status) {
  const value = String(status || '').toLocaleLowerCase('en');
  if (!value) return '状态未标注';
  if (/conflict/.test(value)) return '存在字段冲突';
  if (value === 'verified') return '已核验';
  if (/partial/.test(value)) return '部分核验';
  if (/unknown/.test(value)) return '已核验 · 含未知字段';
  return value.replaceAll('_', ' ');
}

function sourceLabel(source) {
  const kind = String(source?.sourceKind || '').toLocaleLowerCase('en');
  if (/api/.test(kind)) return '官方数据接口';
  if (/rules?/.test(kind)) return '官方规则';
  if (/listing|directory|catalog|search|feed/.test(kind)) return '官方赛事列表';
  if (/detail|official/.test(kind)) return '官方赛事页面';
  const title = String(source?.title || '').trim();
  if (/\p{Script=Han}/u.test(title)) return title;
  return '官方来源';
}

function platformDisplayName(name) {
  const exact = {
    'Kaggle Competitions': 'Kaggle 赛事',
    'DrivenData Competitions': 'DrivenData 赛事',
    'Zindi Competitions': 'Zindi 赛事',
    'AIcrowd Challenges': 'AIcrowd 挑战赛',
    'DoraHacks Hackathons': 'DoraHacks 黑客松',
    'lablab.ai Hackathons': 'lablab.ai 黑客松',
    'Hackster.io Contests': 'Hackster.io 赛事',
    'HackerEarth Challenges': 'HackerEarth 挑战赛',
    'Devfolio Hackathons': 'Devfolio 黑客松',
    'Unstop Competitions': 'Unstop 赛事',
    'HeroX Challenges': 'HeroX 挑战赛',
  };
  return exact[name] || name;
}

function localizedLocation(value) {
  const text = String(value || '').trim();
  if (!text) return '地点待确认';
  if (/^Online$/i.test(text)) return '线上';
  if (/^Virtual$/i.test(text)) return '线上';
  if (/^Hybrid$/i.test(text)) return '线上与线下混合';
  return text;
}

function localizedOrganization(value) {
  const text = String(value || '').trim();
  if (!text || /^(?:unknown\b|nill$)/i.test(text)) return '主办方待确认';
  return text;
}

function formatTimelineEntry(entry, item) {
  const rawDate = entry.date || '';
  const isPlaceholder = item.deadlineDate == null && /^(?:20(?:3\d|9\d)|21\d\d)(?:-|$)/.test(rawDate);
  const dateLabel = isPlaceholder
    ? `长期开放（平台占位日期 ${rawDate}，不作为真实截止）`
    : rawDate || '日期待定';
  return `${dateLabel} · ${entry.event || '关键节点'}`;
}

function listMarkup(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return `<li>${escapeHtml(fallback)}</li>`;
  return items.slice(0, 8).map((item) => `<li>${escapeHtml(String(item))}</li>`).join('');
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...state.favorites]));
  applyFilters();
  if (state.selectedId) {
    const selected = state.items.find((item) => item.id === state.selectedId);
    if (selected) renderDetail(selected);
  }
}

function updateFavoriteButton(button, id) {
  const active = state.favorites.has(id);
  button.classList.toggle('is-on', active);
  button.textContent = active ? '★' : '☆';
  button.setAttribute('aria-label', active ? '取消收藏' : '收藏赛事');
  button.setAttribute('aria-pressed', String(active));
}

function readFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function bindEvents() {
  let searchTimer;
  elements.search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = elements.search.value;
      state.visible = PAGE_SIZE;
      applyFilters();
    }, 120);
  });
  elements.status.addEventListener('change', () => {
    state.status = elements.status.value;
    state.visible = PAGE_SIZE;
    applyFilters();
  });
  elements.category.addEventListener('change', () => {
    state.category = elements.category.value;
    state.visible = PAGE_SIZE;
    applyFilters();
  });
  elements.platform.addEventListener('change', () => {
    state.platform = elements.platform.value;
    state.visible = PAGE_SIZE;
    applyFilters();
  });
  elements.region.addEventListener('change', () => {
    state.region = elements.region.value;
    state.visible = PAGE_SIZE;
    applyFilters();
  });
  elements.mode.addEventListener('change', () => {
    state.mode = elements.mode.value;
    state.visible = PAGE_SIZE;
    applyFilters();
  });
  elements.sort.addEventListener('change', () => {
    state.sort = elements.sort.value;
    state.visible = PAGE_SIZE;
    applyFilters();
  });
  elements.favoritesOnly.addEventListener('change', () => {
    state.favoritesOnly = elements.favoritesOnly.checked;
    state.visible = PAGE_SIZE;
    applyFilters();
  });
  elements.reset.addEventListener('click', () => resetFilters());
  elements.empty.querySelector('[data-reset]').addEventListener('click', () => resetFilters());
  elements.loadMore.addEventListener('click', () => {
    state.visible += PAGE_SIZE;
    renderList();
  });
  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) selectCompetition(id, { scroll: false, updateHash: false });
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      elements.search.focus();
    }
  });
}

function resetFilters({ render = true } = {}) {
  state.query = '';
  state.status = 'all';
  state.category = 'all';
  state.platform = 'all';
  state.region = 'all';
  state.mode = 'all';
  state.sort = 'deadline';
  state.favoritesOnly = false;
  state.visible = PAGE_SIZE;
  elements.search.value = '';
  elements.status.value = 'all';
  elements.category.value = 'all';
  elements.platform.value = 'all';
  elements.region.value = 'all';
  elements.mode.value = 'all';
  elements.sort.value = 'deadline';
  elements.favoritesOnly.checked = false;
  if (render) applyFilters();
}

function hydrateFiltersFromUrl() {
  const params = new URLSearchParams(location.search);
  state.query = params.get('q') || '';
  state.status = params.get('status') || 'all';
  state.category = params.get('category') || 'all';
  state.platform = params.get('platform') || 'all';
  state.region = params.get('region') || 'all';
  state.mode = params.get('mode') || 'all';
  state.sort = params.get('sort') || 'deadline';
  state.favoritesOnly = params.get('favorites') === '1';
  elements.search.value = state.query;
  elements.status.value = state.status;
  elements.sort.value = state.sort;
  elements.platform.value = state.platform;
  elements.region.value = state.region;
  elements.mode.value = state.mode;
  elements.favoritesOnly.checked = state.favoritesOnly;
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.status !== 'all') params.set('status', state.status);
  if (state.category !== 'all') params.set('category', state.category);
  if (state.platform !== 'all') params.set('platform', state.platform);
  if (state.region !== 'all') params.set('region', state.region);
  if (state.mode !== 'all') params.set('mode', state.mode);
  if (state.sort !== 'deadline') params.set('sort', state.sort);
  if (state.favoritesOnly) params.set('favorites', '1');
  const query = params.toString();
  const url = `${location.pathname}${query ? `?${query}` : ''}${location.hash}`;
  history.replaceState(null, '', url);
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}
