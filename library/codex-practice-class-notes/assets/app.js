(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const all = (s) => [...document.querySelectorAll(s)];
  const chapters = all('.chapter');
  const toc = $('#toc');
  const menu = $('#menu');
  const closeMenu = () => { toc.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => {
    const opened = toc.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(opened));
  });
  all('#toc nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (toc.classList.contains('open') && !toc.contains(e.target) && !menu.contains(e.target)) closeMenu();
  });
  let scheduled = false;
  const updateReading = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    $('.reading-line').style.width = `${total > 0 ? Math.min(100, scrollY / total * 100) : 0}%`;
    let active = chapters[0].id;
    chapters.forEach(s => { if (s.getBoundingClientRect().top <= 180) active = s.id; });
    all('#toc nav a').forEach(a => {
      const isActive = a.hash === `#${active}`;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    scheduled = false;
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateReading); } }, {passive:true});
  addEventListener('resize', updateReading);
  updateReading();

  const checks = all('[data-check]');
  const key = 'xiaowei-codex-class-checks-v1';
  try {
    const values = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(values)) checks.forEach(c => { c.checked = values.includes(c.dataset.check); });
  } catch (_) { /* Reading remains available when local storage is disabled. */ }
  const updateChecks = () => {
    const ids = checks.filter(c => c.checked).map(c => c.dataset.check);
    all('.check-count').forEach(e => { e.textContent = ids.length; });
    $('.check-track i').style.width = `${ids.length / checks.length * 100}%`;
    try { localStorage.setItem(key, JSON.stringify(ids)); } catch (_) {}
  };
  checks.forEach(c => c.addEventListener('change', updateChecks));
  $('#reset-checks').addEventListener('click', () => { checks.forEach(c => { c.checked = false; }); updateChecks(); });
  updateChecks();

  let toastTimer;
  const toast = (message) => {
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2500);
  };
  all('.copy').forEach(button => button.addEventListener('click', async () => {
    const code = button.nextElementSibling.querySelector('code');
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = '已复制';
      toast('模板已复制，可以粘贴到你的任务中。');
      setTimeout(() => { button.textContent = '复制模板'; }, 2200);
    } catch (_) {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
      toast('已选中模板，请手动复制。');
    }
  }));

  const picker = JSON.parse($('#picker-data').textContent);
  $('#task-select').addEventListener('change', (e) => {
    const data = picker[Number(e.target.value)];
    $('#task-advice h3').textContent = data[1];
    $('#task-advice p').textContent = data[2];
  });

  const dialog = $('#search-dialog');
  const input = $('#search-input');
  const results = $('#search-results');
  const searchIndex = chapters.map(s => ({id:s.id, title:s.querySelector('h2').textContent, text:s.textContent.replace(/\s+/g, ' ')}));
  $('#search-open').addEventListener('click', () => { closeMenu(); dialog.showModal(); input.focus(); });
  dialog.addEventListener('click', e => {
    if (e.target === dialog) {
      const b = dialog.getBoundingClientRect();
      if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dialog.close();
    }
  });
  document.addEventListener('keydown', e => {
    const editing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if (e.key === '/' && !editing && !dialog.open) { e.preventDefault(); dialog.showModal(); input.focus(); }
    if (e.key === 'Escape') closeMenu();
  });
  input.addEventListener('input', () => {
    const q = input.value.trim().toLocaleLowerCase();
    results.replaceChildren();
    if (!q) { $('#search-status').textContent = '输入关键词，定位到对应章节。'; return; }
    const matches = searchIndex.filter(s => s.text.toLocaleLowerCase().includes(q));
    $('#search-status').textContent = matches.length ? `找到 ${matches.length} 个相关章节` : '没有找到相关内容，试试更短的关键词。';
    matches.forEach(s => {
      const link = document.createElement('a');
      link.href = `#${s.id}`;
      link.append(document.createTextNode(s.title));
      const excerpt = document.createElement('small');
      const pos = s.text.toLocaleLowerCase().indexOf(q);
      const start = Math.max(0, pos - 25), end = Math.min(s.text.length, pos + q.length + 62);
      excerpt.append(document.createTextNode((start ? '…' : '') + s.text.slice(start, pos)));
      const mark = document.createElement('mark'); mark.textContent = s.text.slice(pos, pos + q.length); excerpt.append(mark);
      excerpt.append(document.createTextNode(s.text.slice(pos + q.length, end) + (end < s.text.length ? '…' : '')));
      link.append(excerpt);
      link.addEventListener('click', () => { dialog.close(); const h = $(`#heading-${s.id}`); h.setAttribute('tabindex', '-1'); setTimeout(() => h.focus({preventScroll:true}), 0); });
      results.append(link);
    });
  });
  $('#print').addEventListener('click', () => window.print());
  let closedDetails = [];
  addEventListener('beforeprint', () => { closedDetails = all('.quiz details:not([open])'); closedDetails.forEach(d => { d.open = true; }); });
  addEventListener('afterprint', () => { closedDetails.forEach(d => { d.open = false; }); });
})();
