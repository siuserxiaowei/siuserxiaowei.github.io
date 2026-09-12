(function () {
  'use strict';

  var PAGE_SIZE = 36;
  var SEARCH_INDEX_URL = '/awesome-gpt-image-2.5/assets/search-index.json';
  var SEARCH_PARAMS = ['q', 'category', 'model'];
  var shareInputSequence = 0;

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function normalizeText(value) {
    var text = String(value === undefined || value === null ? '' : value);
    if (typeof text.normalize === 'function') {
      text = text.normalize('NFKC');
    }
    text = text.toLocaleLowerCase();
    if (typeof text.normalize === 'function') {
      text = text.normalize('NFD');
    }
    text = text.replace(/[\u0300-\u036f]/g, '');
    return text.replace(/\s+/g, ' ').trim();
  }

  function safeUrl(value) {
    var raw = String(value === undefined || value === null ? '' : value).trim();
    if (!raw || raw.charAt(0) === '#' || raw.indexOf('//') === 0) {
      return '';
    }

    try {
      var parsed = new URL(raw, document.baseURI);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return '';
      }
      if (parsed.username || parsed.password) {
        return '';
      }
      if (parsed.protocol === 'http:' && parsed.origin !== window.location.origin) {
        return '';
      }
      return parsed.href;
    } catch (error) {
      return '';
    }
  }

  function getCaseId() {
    var body = document.body;
    var explicit = body ? (body.getAttribute('data-case-id') || '') : '';
    if (explicit) {
      return explicit;
    }
    var match = window.location.pathname.match(/\/cases\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function dispatchCustomEvent(name, detail) {
    if (typeof window.CustomEvent !== 'function') {
      return;
    }
    document.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: detail || {}
    }));
  }

  function ensureStatusElement(parent, id, className) {
    var status = id ? document.getElementById(id) : null;
    if (status) {
      if (!status.getAttribute('role')) {
        status.setAttribute('role', 'status');
      }
      if (!status.getAttribute('aria-live')) {
        status.setAttribute('aria-live', 'polite');
      }
      return status;
    }

    status = createElement('span', className || 'sr-only');
    if (id) {
      status.id = id;
    }
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    parent.appendChild(status);
    return status;
  }

  function getPromptStatus(pre) {
    var status = document.getElementById('copy-status');
    if (status) {
      if (!status.getAttribute('role')) {
        status.setAttribute('role', 'status');
      }
      if (!status.getAttribute('aria-live')) {
        status.setAttribute('aria-live', 'polite');
      }
      return status;
    }
    return ensureStatusElement(pre.parentNode || document.body, 'copy-status', 'sr-only');
  }

  function clipboardWrite(text) {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      return Promise.reject(new Error('Clipboard API unavailable'));
    }
    try {
      return Promise.resolve(navigator.clipboard.writeText(text));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function selectText(element) {
    if (!element || !document.createRange || !window.getSelection) {
      return false;
    }
    try {
      var range = document.createRange();
      range.selectNodeContents(element);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      if (typeof element.focus === 'function') {
        element.focus();
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  function promptCopyFallback(pre, status) {
    var selected = selectText(pre);
    if (selected) {
      status.textContent = document.documentElement.lang === 'en' ? 'Automatic copy is unavailable. The full prompt is selected; use your system copy command.' : '自动复制不可用。完整提示词已选中，请使用系统的复制操作完成复制。';
    } else {
      status.textContent = document.documentElement.lang === 'en' ? 'Automatic copy is unavailable. Focus the prompt, select all text and use your system copy command.' : '自动复制不可用。请聚焦完整提示词，选择全部内容后使用系统的复制操作。';
    }
    status.setAttribute('role', 'alert');
    status.setAttribute('aria-live', 'assertive');
  }

  function initPromptCopy() {
    var pre = document.getElementById('prompt-text');
    var buttons = document.querySelectorAll('[data-copy-prompt]');
    if (!pre || !buttons.length) {
      return;
    }

    if (!pre.hasAttribute('tabindex')) {
      pre.setAttribute('tabindex', '0');
    }

    var status = getPromptStatus(pre);
    var copyOperation = 0;
    Array.prototype.forEach.call(buttons, function (button) {
      button.setAttribute('aria-describedby', status.id);
      button.addEventListener('click', function (event) {
        event.preventDefault();
        var operation = ++copyOperation;
        var prompt = pre.textContent || '';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.textContent = document.documentElement.lang === 'en' ? 'Copying prompt…' : '正在复制提示词…';

        clipboardWrite(prompt).then(function () {
          if (operation !== copyOperation) return;
          status.textContent = document.documentElement.lang === 'en' ? 'Prompt copied.' : '提示词已复制。';
          dispatchCustomEvent('copy_prompt', {
            caseId: getCaseId(),
            success: true
          });
        }).catch(function () {
          if (operation !== copyOperation) return;
          promptCopyFallback(pre, status);
          dispatchCustomEvent('copy_prompt', {
            caseId: getCaseId(),
            success: false
          });
        });
      });
    });
  }

  function getCanonicalUrl(preferredUrl) {
    var preferred = safeUrl(preferredUrl);
    if (preferred) {
      return preferred;
    }
    var canonical = document.querySelector('link[rel="canonical"]');
    var canonicalUrl = canonical ? safeUrl(canonical.href || canonical.getAttribute('href')) : '';
    if (canonicalUrl) {
      return canonicalUrl;
    }

    try {
      var current = new URL(window.location.href);
      current.search = '';
      current.hash = '';
      return current.href;
    } catch (error) {
      return '';
    }
  }

  function getShareStatus(button) {
    var describedBy = button.getAttribute('aria-describedby');
    if (describedBy) {
      var describedStatus = document.getElementById(describedBy);
      if (describedStatus) {
        return ensureStatusElement(describedStatus.parentNode || button.parentNode, describedStatus.id);
      }
    }

    var nearest = button.parentNode && button.parentNode.querySelector('[data-share-status], #share-status');
    if (nearest) {
      if (!nearest.getAttribute('role')) {
        nearest.setAttribute('role', 'status');
      }
      if (!nearest.getAttribute('aria-live')) {
        nearest.setAttribute('aria-live', 'polite');
      }
      return nearest;
    }

    var status = ensureStatusElement(button.parentNode || document.body, 'share-status', 'sr-only');
    button.setAttribute('aria-describedby', status.id);
    return status;
  }

  function removeShareFallback(button) {
    var parent = button.parentNode;
    if (!parent) {
      return;
    }
    var fallback = parent.querySelector('.share-fallback');
    if (fallback) {
      fallback.parentNode.removeChild(fallback);
    }
  }

  function shareCopyFallback(button, status, canonicalUrl) {
    var parent = button.parentNode || document.body;
    var fallback = parent.querySelector('.share-fallback');
    if (fallback) {
      fallback.parentNode.removeChild(fallback);
    }

    fallback = createElement('div', 'share-fallback');
    var label = createElement('label', 'sr-only', '页面规范链接');
    var input = createElement('input', 'share-fallback-input');
    shareInputSequence += 1;
    input.id = 'share-url-input-' + shareInputSequence;
    input.type = 'url';
    input.readOnly = true;
    input.value = canonicalUrl;
    input.setAttribute('aria-label', '页面规范链接');
    fallback.appendChild(label);
    fallback.appendChild(input);
    parent.insertBefore(fallback, button.nextSibling);
    label.htmlFor = input.id;

    var selected = false;
    try {
      input.focus();
      input.select();
      selected = true;
    } catch (error) {
      selected = false;
    }

    if (selected) {
      status.textContent = '自动复制不可用。页面地址已选中，请使用系统的复制操作完成复制。';
    } else {
      status.textContent = '自动复制不可用。请从页面地址输入框中手动选择并复制。';
    }
    status.setAttribute('role', 'alert');
    status.setAttribute('aria-live', 'assertive');
  }

  function initShare() {
    var buttons = document.querySelectorAll('[data-share]');
    if (!buttons.length) {
      return;
    }

    Array.prototype.forEach.call(buttons, function (button) {
      var canonicalUrl = getCanonicalUrl(button.getAttribute('data-share-url'));
      var status = getShareStatus(button);
      var shareOperation = 0;
      button.addEventListener('click', function (event) {
        event.preventDefault();
        var operation = ++shareOperation;
        if (!canonicalUrl) {
          status.textContent = '暂时无法确定页面规范链接，请从浏览器地址栏手动复制。';
          status.setAttribute('role', 'alert');
          status.setAttribute('aria-live', 'assertive');
          return;
        }

        removeShareFallback(button);
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.textContent = '正在复制页面链接…';
        clipboardWrite(canonicalUrl).then(function () {
          if (operation !== shareOperation) return;
          status.textContent = '页面链接已复制。';
        }).catch(function () {
          if (operation !== shareOperation) return;
          shareCopyFallback(button, status, canonicalUrl);
        });
      });
    });
  }

  function isGithubUrl(url) {
    return /(^|\.)github\.com$/i.test(url.hostname);
  }

  function isSourceLink(anchor) {
    if (anchor.hasAttribute('data-source-link') ||
        anchor.hasAttribute('data-author-link') ||
        anchor.hasAttribute('data-upstream-link') ||
        anchor.hasAttribute('data-outbound-source')) {
      return true;
    }
    return Boolean(anchor.closest && anchor.closest(
      '[data-author-source], [data-source-links], .author-source, .source-links, .case-source'
    ));
  }

  function initOutboundEvents() {
    document.addEventListener('click', function (event) {
      var target = event.target;
      var anchor = target && target.closest ? target.closest('a[href]') : null;
      if (!anchor) {
        return;
      }

      var href = safeUrl(anchor.getAttribute('href'));
      if (!href) {
        return;
      }

      var url;
      try {
        url = new URL(href, document.baseURI);
      } catch (error) {
        return;
      }

      if (isGithubUrl(url) || anchor.hasAttribute('data-github-link')) {
        dispatchCustomEvent('github_click', {
          href: url.href,
          caseId: getCaseId()
        });
      }

      if (isSourceLink(anchor)) {
        dispatchCustomEvent('outbound_source', {
          href: url.href,
          caseId: getCaseId()
        });
      }
    });
  }

  function removeForcedExternalTargets() {
    var links = document.querySelectorAll('a[target="_blank"]');
    Array.prototype.forEach.call(links, function (anchor) {
      var href = anchor.getAttribute('href');
      if (!href) {
        return;
      }
      try {
        var url = new URL(href, document.baseURI);
        if ((url.protocol === 'https:' || url.protocol === 'http:') &&
            url.origin !== window.location.origin) {
          anchor.removeAttribute('target');
        }
      } catch (error) {
        // Keep malformed links unchanged for the static page's own validation.
      }
    });
  }

  function readSearchState() {
    var params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      category: params.get('category') || '',
      model: params.get('model') || ''
    };
  }

  function writeSearchState(state, historyMode) {
    var url = new URL(window.location.href);
    SEARCH_PARAMS.forEach(function (name) {
      url.searchParams.delete(name);
    });

    if (String(state.q || '').trim()) {
      url.searchParams.set('q', String(state.q).trim());
    }
    if (String(state.category || '').trim()) {
      url.searchParams.set('category', String(state.category).trim());
    }
    if (String(state.model || '').trim()) {
      url.searchParams.set('model', String(state.model).trim());
    }

    var next = url.pathname + url.search + url.hash;
    var current = window.location.pathname + window.location.search + window.location.hash;
    if (next === current) {
      return;
    }
    if (historyMode === 'push' && window.history && window.history.pushState) {
      window.history.pushState({}, '', next);
    } else if (window.history && window.history.replaceState) {
      window.history.replaceState({}, '', next);
    }
  }

  function normalizeIndex(payload) {
    var rawItems;
    if (Array.isArray(payload)) {
      rawItems = payload;
    } else if (payload && Array.isArray(payload.items)) {
      rawItems = payload.items;
    } else {
      throw new Error('Invalid search index payload');
    }
    return rawItems.map(function (raw) {
      if (!raw || typeof raw !== 'object') {
        return null;
      }

      var itemUrl = safeUrl(raw.url);
      if (!itemUrl) {
        return null;
      }

      var rawImage = raw.image && typeof raw.image === 'object' ? raw.image : {};
      var imageUrl = safeUrl(rawImage.thumb || rawImage.preview || rawImage.url);
      return {
        id: String(raw.id || ''),
        title: String(raw.title || '未命名案例'),
        author: String(raw.author || '上游未提供署名'),
        categorySlug: String(raw.category_slug || ''),
        categoryTitle: String(raw.category_title || raw.category_slug || '未分类'),
        model: String(raw.model || '上游未注明'),
        kind: String(raw.kind || ''),
        url: itemUrl,
        image: imageUrl ? {
          url: imageUrl,
          alt: String(rawImage.alt || raw.title || '案例配图'),
          width: Number(rawImage.width) || 0,
          height: Number(rawImage.height) || 0
        } : null
      };
    }).filter(function (item) {
      return Boolean(item);
    });
  }

  function optionExists(select, value) {
    var normalized = normalizeText(value);
    return Array.prototype.some.call(select.options, function (option) {
      return normalizeText(option.value) === normalized;
    });
  }

  function setSelectValue(select, value) {
    select.value = value;
    if (!value || select.value === value) {
      return;
    }
    var normalized = normalizeText(value);
    var matchingOption = Array.prototype.find.call(select.options, function (option) {
      return normalizeText(option.value) === normalized || normalizeText(option.textContent) === normalized;
    });
    if (matchingOption) {
      select.value = matchingOption.value;
    }
  }

  function ensureFilterOptions(categoryFilter, modelFilter, items) {
    var categories = Object.create(null);
    var models = Object.create(null);
    items.forEach(function (item) {
      var categoryKey = item.categorySlug || item.categoryTitle;
      if (categoryKey && !categories[normalizeText(categoryKey)]) {
        categories[normalizeText(categoryKey)] = {
          value: categoryKey,
          label: item.categoryTitle || categoryKey
        };
      }
      if (item.model && !models[normalizeText(item.model)]) {
        models[normalizeText(item.model)] = item.model;
      }
    });

    Object.keys(categories).sort().forEach(function (key) {
      var category = categories[key];
      if (!optionExists(categoryFilter, category.value)) {
        categoryFilter.appendChild(createElement('option', '', category.label));
        categoryFilter.lastElementChild.value = category.value;
      }
    });
    Object.keys(models).sort().forEach(function (key) {
      var model = models[key];
      if (!optionExists(modelFilter, model)) {
        modelFilter.appendChild(createElement('option', '', model));
        modelFilter.lastElementChild.value = model;
      }
    });
  }

  function makeCaseCard(item) {
    var article = createElement('article', 'case-card');
    var link = createElement('a', 'case-card-link');
    link.href = item.url;

    var imageWrapper = createElement('div', 'case-image');
    if (item.image && item.image.url) {
      var image = createElement('img');
      image.src = item.image.url;
      image.alt = item.image.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      if (item.image.width > 0) {
        image.width = item.image.width;
      }
      if (item.image.height > 0) {
        image.height = item.image.height;
      }
      imageWrapper.appendChild(image);
    } else {
      imageWrapper.appendChild(createElement('span', 'case-image-placeholder', '暂无配图'));
    }

    var body = createElement('div', 'case-body');
    var title = createElement('h2', 'case-title', item.title);
    var meta = createElement('p', 'case-meta');
    var author = item.author || '上游未提供署名';
    var category = item.categoryTitle || item.categorySlug || '未分类';
    meta.textContent = author + ' · ' + category;
    body.appendChild(title);
    body.appendChild(meta);

    link.appendChild(imageWrapper);
    link.appendChild(body);
    article.appendChild(link);
    return article;
  }

  function getExploreMessage(results) {
    return results.querySelector('.search-empty, .search-error');
  }

  function clearExploreMessage(results) {
    var message = getExploreMessage(results);
    if (message) {
      message.parentNode.removeChild(message);
    }
    var empty = document.getElementById('results-empty');
    var error = document.getElementById('results-error');
    if (empty) {
      empty.hidden = true;
    }
    if (error) {
      error.hidden = true;
    }
  }

  function showEmpty(results) {
    clearExploreMessage(results);
    var staticMessage = document.getElementById('results-empty');
    if (staticMessage) {
      staticMessage.textContent = '没有找到匹配的案例。请尝试其他搜索词或筛选条件。';
      staticMessage.setAttribute('role', 'status');
      staticMessage.setAttribute('aria-live', 'polite');
      staticMessage.hidden = false;
      return;
    }
    var message = createElement('p', 'search-empty', '没有找到匹配的案例。请尝试其他搜索词或筛选条件。');
    message.setAttribute('role', 'status');
    results.insertBefore(message, results.firstChild);
  }

  function showIndexError(results, retry) {
    clearExploreMessage(results);
    var staticMessage = document.getElementById('results-error');
    if (staticMessage) {
      staticMessage.textContent = '探索索引暂时无法加载，现有页面内容仍可浏览。';
      staticMessage.setAttribute('role', 'alert');
      staticMessage.setAttribute('aria-live', 'assertive');
      var staticRetry = createElement('button', 'search-retry', '重试加载');
      staticRetry.type = 'button';
      staticRetry.addEventListener('click', retry);
      staticMessage.appendChild(document.createTextNode(' '));
      staticMessage.appendChild(staticRetry);
      staticMessage.hidden = false;
      return;
    }
    var message = createElement('div', 'search-error');
    message.setAttribute('role', 'alert');
    message.appendChild(createElement('p', '', '探索索引暂时无法加载，现有页面内容仍可浏览。'));
    var retryButton = createElement('button', 'search-retry', '重试加载');
    retryButton.type = 'button';
    retryButton.addEventListener('click', retry);
    message.appendChild(retryButton);
    results.insertBefore(message, results.firstChild);
  }

  function initExplore() {
    var searchInput = document.getElementById('search-input');
    var categoryFilter = document.getElementById('category-filter');
    var modelFilter = document.getElementById('model-filter');
    var results = document.getElementById('results');
    var resultsCount = document.getElementById('results-count');
    var loadMore = document.getElementById('load-more');
    if (!searchInput || !categoryFilter || !modelFilter || !results || !resultsCount || !loadMore) {
      return;
    }

    var grid = results.querySelector('.case-grid');
    if (!grid && results.classList.contains('case-grid')) {
      grid = results;
    }
    if (!grid) {
      grid = createElement('div', 'case-grid');
      results.appendChild(grid);
    }

    resultsCount.setAttribute('role', 'status');
    resultsCount.setAttribute('aria-live', 'polite');
    loadMore.hidden = true;

    var form = searchInput.closest ? searchInput.closest('form') : null;
    var items = [];
    var indexLoaded = false;
    var visibleCount = PAGE_SIZE;
    var inputTimer = null;
    var requestNumber = 0;

    function setControls(state) {
      searchInput.value = state.q;
      setSelectValue(categoryFilter, state.category);
      setSelectValue(modelFilter, state.model);
    }

    function itemMatches(item, state) {
      var query = normalizeText(state.q);
      if (query) {
        var fields = normalizeText([
          item.title,
          item.author,
          item.categorySlug,
          item.categorySlug.replace(/[-_]+/g, ' '),
          item.categoryTitle
        ].join(' '));
        var terms = query.split(' ');
        if (!terms.every(function (term) { return fields.indexOf(term) !== -1; })) {
          return false;
        }
      }

      var category = normalizeText(state.category);
      if (category && normalizeText(item.categorySlug) !== category && normalizeText(item.categoryTitle) !== category) {
        return false;
      }

      var model = normalizeText(state.model);
      if (model && normalizeText(item.model) !== model) {
        return false;
      }
      return true;
    }

    function render(state) {
      var filtered = items.filter(function (item) { return itemMatches(item, state); });
      var visibleItems = filtered.slice(0, visibleCount);
      var fragment = document.createDocumentFragment();
      visibleItems.forEach(function (item) {
        fragment.appendChild(makeCaseCard(item));
      });
      clearExploreMessage(results);
      grid.replaceChildren(fragment);

      if (!filtered.length) {
        showEmpty(results);
      }

      resultsCount.textContent = filtered.length
        ? ('显示 ' + visibleItems.length + ' / ' + filtered.length + ' 个案例')
        : '没有匹配的案例';
      loadMore.hidden = visibleItems.length >= filtered.length || !filtered.length;
      loadMore.disabled = loadMore.hidden;
    }

    function applyUrlState(resetVisible) {
      var state = readSearchState();
      setControls(state);
      if (resetVisible) {
        visibleCount = PAGE_SIZE;
      }
      if (indexLoaded) {
        render(state);
      }
    }

    function commitControls(historyMode, resetVisible) {
      writeSearchState({
        q: searchInput.value,
        category: categoryFilter.value,
        model: modelFilter.value
      }, historyMode);
      applyUrlState(resetVisible);
    }

    function loadIndex() {
      var thisRequest = ++requestNumber;
      results.setAttribute('aria-busy', 'true');
      resultsCount.textContent = '正在加载探索索引…';
      clearExploreMessage(results);

      if (typeof window.fetch !== 'function') {
        results.setAttribute('aria-busy', 'false');
        loadMore.hidden = true;
        resultsCount.textContent = '探索索引加载失败';
        showIndexError(results, loadIndex);
        return Promise.resolve();
      }

      return window.fetch(SEARCH_INDEX_URL, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('Search index request failed: ' + response.status);
        }
        return response.json();
      }).then(function (payload) {
        if (thisRequest !== requestNumber) {
          return;
        }
        items = normalizeIndex(payload);
        indexLoaded = true;
        ensureFilterOptions(categoryFilter, modelFilter, items);
        results.setAttribute('aria-busy', 'false');
        applyUrlState(true);
      }).catch(function () {
        if (thisRequest !== requestNumber) {
          return;
        }
        results.setAttribute('aria-busy', 'false');
        loadMore.hidden = true;
        resultsCount.textContent = '探索索引加载失败';
        showIndexError(results, loadIndex);
      });
    }

    loadMore.addEventListener('click', function () {
      visibleCount += PAGE_SIZE;
      render(readSearchState());
    });

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (inputTimer) {
          window.clearTimeout(inputTimer);
          inputTimer = null;
        }
        commitControls('push', true);
      });
      form.addEventListener('reset', function () {
        window.setTimeout(function () {
          commitControls('push', true);
        }, 0);
      });
    }

    searchInput.addEventListener('input', function () {
      if (inputTimer) {
        window.clearTimeout(inputTimer);
      }
      inputTimer = window.setTimeout(function () {
        commitControls('replace', true);
      }, 180);
    });
    categoryFilter.addEventListener('change', function () {
      commitControls('push', true);
    });
    modelFilter.addEventListener('change', function () {
      commitControls('push', true);
    });
    window.addEventListener('popstate', function () {
      if (inputTimer) {
        window.clearTimeout(inputTimer);
        inputTimer = null;
      }
      applyUrlState(true);
    });

    setControls(readSearchState());
    loadIndex();
  }

  function init() {
    initExplore();
    initPromptCopy();
    initShare();
    removeForcedExternalTargets();
    initOutboundEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
