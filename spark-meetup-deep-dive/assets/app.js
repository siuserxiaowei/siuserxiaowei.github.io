(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const progress = document.querySelector('.reading-progress span');
  const article = document.querySelector('#report');
  const toc = document.querySelector('#toc');

  const storedTheme = localStorage.getItem('spark-theme');
  if (storedTheme) root.dataset.theme = storedTheme;
  themeButton.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('spark-theme', next);
    themeButton.setAttribute('aria-pressed', String(next === 'dark'));
  });

  const headings = [...article.querySelectorAll('h2')];
  const used = new Set();
  headings.forEach((heading, index) => {
    let id = heading.id || `section-${index + 1}`;
    while (used.has(id)) id += '-section';
    used.add(id);
    heading.id = id;
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(id)}`;
    link.textContent = heading.textContent.replace(/^\S+、/, '');
    toc.appendChild(link);
  });

  const tocLinks = [...toc.querySelectorAll('a')];
  const setActive = id => tocLinks.forEach(link => link.classList.toggle('active', decodeURIComponent(link.hash.slice(1)) === id));
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-15% 0px -72% 0px', threshold: 0 });
  headings.forEach(heading => observer.observe(heading));
  if (headings[0]) setActive(headings[0].id);

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, window.scrollY / max * 100) : 0}%`;
  };
  updateProgress();
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);

  const wechatButton = document.querySelector('.wechat-copy');
  if (wechatButton) {
    const status = document.querySelector('#wechat-copy-status');
    let statusTimer;
    const copyWechat = async value => {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value);
          return true;
        } catch {
          // Continue with the selection-based fallback below.
        }
      }
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand('copy');
      input.remove();
      return copied;
    };
    wechatButton.addEventListener('click', async () => {
      const labelCopied = wechatButton.dataset.copiedLabel || '已复制';
      const labelCopy = status.textContent;
      if (await copyWechat(wechatButton.dataset.wechat)) {
        wechatButton.classList.add('copied');
        status.textContent = labelCopied;
        clearTimeout(statusTimer);
        statusTimer = setTimeout(() => {
          wechatButton.classList.remove('copied');
          status.textContent = labelCopy;
        }, 2200);
      } else {
        status.textContent = `${wechatButton.dataset.idLabel || '微信号：'}${wechatButton.dataset.wechat}`;
      }
    });
  }
})();
