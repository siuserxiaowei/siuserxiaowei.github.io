(() => {
  const content = document.querySelector("#article-content");
  const toc = document.querySelector("#table-of-contents");
  const progressBar = document.querySelector("#reading-progress-bar");
  const progressLabel = document.querySelector("#reading-percent");
  const backToTop = document.querySelector("#back-to-top");
  const searchToggle = document.querySelector("#search-toggle");
  const searchDrawer = document.querySelector("#search-drawer");
  const searchClose = document.querySelector("#search-close");
  const searchInput = document.querySelector("#article-search");
  const searchStatus = document.querySelector("#search-status");
  const printButton = document.querySelector("#print-page");

  if (!content) return;

  const slugify = (value, index) => {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/[\s/]+/g, "-")
      .replace(/[^\p{Letter}\p{Number}\-]+/gu, "")
      .replace(/^-+|-+$/g, "");
    return slug || `section-${index + 1}`;
  };

  const headings = Array.from(content.querySelectorAll("h2, h3"));
  const usedIds = new Set();
  headings.forEach((heading, index) => {
    let id = heading.id || slugify(heading.textContent, index);
    const base = id;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    heading.id = id;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = heading.textContent.replace(/^\d+(?:\.\d+)?\.?\s*/, "");
    link.className = heading.tagName === "H3" ? "toc-h3" : "toc-h2";
    toc?.appendChild(link);
  });

  const labelTypes = new Map([
    ["会中明确", "direct"], ["主持总结", "direct"],
    ["外部核验", "checked"], ["技术纠错", "checked"],
    ["整理者归纳", "inference"], ["个人判断", "inference"],
    ["会中口述·未独立核验", "caution"], ["个人猜测", "caution"], ["待核名", "caution"],
  ]);

  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue?.includes("[")) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest("pre, code, script, style")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const labelNodes = [];
  while (walker.nextNode()) labelNodes.push(walker.currentNode);
  labelNodes.forEach((node) => {
    const pattern = /\[(会中明确|主持总结|外部核验|技术纠错|整理者归纳|个人判断|会中口述·未独立核验|个人猜测|待核名)\]/g;
    if (!pattern.test(node.nodeValue)) return;
    pattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const match of node.nodeValue.matchAll(pattern)) {
      fragment.append(node.nodeValue.slice(cursor, match.index));
      const badge = document.createElement("span");
      badge.className = `evidence-label ${labelTypes.get(match[1])}`;
      badge.textContent = match[1];
      fragment.append(badge);
      cursor = match.index + match[0].length;
    }
    fragment.append(node.nodeValue.slice(cursor));
    node.replaceWith(fragment);
  });

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    const percent = scrollable > 0 ? Math.min(100, Math.max(0, (scrollY / scrollable) * 100)) : 0;
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressLabel) progressLabel.textContent = `${Math.round(percent)}%`;
    backToTop?.classList.toggle("visible", scrollY > innerHeight * 0.65);
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if ("IntersectionObserver" in window) {
    const links = new Map(Array.from(toc?.querySelectorAll("a") || []).map((link) => [link.hash.slice(1), link]));
    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting ? entry.boundingClientRect.top : Infinity));
      const active = [...visible.entries()].filter(([, top]) => Number.isFinite(top)).sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0]?.[0];
      if (!active) return;
      links.forEach((link, id) => link.classList.toggle("active", id === active));
    }, { rootMargin: "-16% 0px -72% 0px", threshold: [0, 1] });
    headings.forEach((heading) => observer.observe(heading));
  }

  const clearMarks = () => {
    content.querySelectorAll("mark.search-hit").forEach((mark) => mark.replaceWith(document.createTextNode(mark.textContent)));
    content.normalize();
  };

  let searchTimer;
  const runSearch = () => {
    clearMarks();
    const query = searchInput?.value.trim();
    if (!query) {
      if (searchStatus) searchStatus.textContent = "输入关键词开始检索";
      return;
    }
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    const searchWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!regex.test(node.nodeValue || "")) return NodeFilter.FILTER_REJECT;
        regex.lastIndex = 0;
        if (node.parentElement?.closest("pre, code, script, style, mark")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (searchWalker.nextNode()) nodes.push(searchWalker.currentNode);
    let count = 0;
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      for (const match of node.nodeValue.matchAll(regex)) {
        fragment.append(node.nodeValue.slice(cursor, match.index));
        const mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = match[0];
        fragment.append(mark);
        cursor = match.index + match[0].length;
        count += 1;
      }
      fragment.append(node.nodeValue.slice(cursor));
      node.replaceWith(fragment);
    });
    const first = content.querySelector("mark.search-hit");
    first?.classList.add("current");
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (searchStatus) searchStatus.textContent = count ? `找到 ${count} 处` : "没有匹配内容";
  };

  searchToggle?.addEventListener("click", () => {
    searchDrawer.hidden = false;
    searchInput?.focus();
  });
  searchClose?.addEventListener("click", () => {
    searchDrawer.hidden = true;
    if (searchInput) searchInput.value = "";
    clearMarks();
    if (searchStatus) searchStatus.textContent = "输入关键词开始检索";
  });
  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(runSearch, 220);
  });
  backToTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  printButton?.addEventListener("click", () => print());
})();
