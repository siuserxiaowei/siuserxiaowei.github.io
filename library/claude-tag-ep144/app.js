(() => {
  const root = document.documentElement;
  const tabs = [...document.querySelectorAll('.view-tab')];
  const panels = [...document.querySelectorAll('.content-panel')];
  const toc = document.querySelector('#dynamic-toc');
  const search = document.querySelector('#content-search');
  const count = document.querySelector('#search-count');
  const empty = document.querySelector('#empty-search');
  const progress = document.querySelector('#progress-bar');
  let currentView = 'analysis';
  let headingObserver;

  const savedTheme = localStorage.getItem('claude-tag-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'night';

  document.querySelector('#theme-toggle').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'night' ? 'paper' : 'night';
    localStorage.setItem('claude-tag-theme', root.dataset.theme);
  });
  document.querySelector('#print-button').addEventListener('click', () => window.print());

  function activePanel() {
    return document.querySelector(`#panel-${currentView}`);
  }

  function clearMarks() {
    document.querySelectorAll('mark[data-search]').forEach((mark) => mark.replaceWith(document.createTextNode(mark.textContent)));
    activePanel().normalize();
  }

  function runSearch() {
    clearMarks();
    const query = search.value.trim();
    count.textContent = '';
    empty.hidden = true;
    if (!query) return;

    const walker = document.createTreeWalker(activePanel(), NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim() || node.parentElement.closest('script, style, mark')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    let matches = 0;
    const needle = query.toLocaleLowerCase('zh-CN');
    nodes.forEach((node) => {
      const source = node.nodeValue;
      const lower = source.toLocaleLowerCase('zh-CN');
      let cursor = 0;
      let index = lower.indexOf(needle, cursor);
      if (index < 0) return;
      const fragment = document.createDocumentFragment();
      while (index >= 0) {
        fragment.append(source.slice(cursor, index));
        const mark = document.createElement('mark');
        mark.dataset.search = 'true';
        mark.textContent = source.slice(index, index + query.length);
        fragment.append(mark);
        matches += 1;
        cursor = index + query.length;
        index = lower.indexOf(needle, cursor);
      }
      fragment.append(source.slice(cursor));
      node.replaceWith(fragment);
    });
    count.textContent = `${matches} 处`;
    empty.hidden = matches !== 0;
    document.querySelector('mark[data-search]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  let searchTimer;
  search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(runSearch, 180);
  });

  function buildToc() {
    toc.replaceChildren();
    headingObserver?.disconnect();
    const headings = [...activePanel().querySelectorAll('h2')];
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `${currentView}-section-${index + 1}`;
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.dataset.heading = heading.id;
      toc.append(link);
    });

    headingObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      toc.querySelectorAll('a').forEach((link) => link.classList.toggle('is-current', link.dataset.heading === visible.target.id));
    }, { rootMargin: '-15% 0px -70% 0px' });
    headings.forEach((heading) => headingObserver.observe(heading));
  }

  function switchView(view, updateHash = true) {
    if (!['analysis', 'transcript'].includes(view)) return;
    clearMarks();
    currentView = view;
    tabs.forEach((tab) => {
      const active = tab.dataset.view === view;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => {
      const active = panel.id === `panel-${view}`;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    search.value = '';
    count.textContent = '';
    empty.hidden = true;
    buildToc();
    if (updateHash) {
      history.replaceState(null, '', `#${view}`);
      window.scrollTo({ top: document.querySelector('.control-dock').offsetTop - 3, behavior: 'smooth' });
    }
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => switchView(tab.dataset.view)));
  const requestedView = location.hash.slice(1);
  switchView(['analysis', 'transcript'].includes(requestedView) ? requestedView : 'analysis', false);

  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  }
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();
})();
