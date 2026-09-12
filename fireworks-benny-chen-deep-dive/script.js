(() => {
  "use strict";

  document.documentElement.classList.add("no-js");
  document.documentElement.classList.remove("js");

  const select = (selector, scope = document) => scope.querySelector(selector);
  const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const transcriptSource = "data/transcript-raw.md";

  const transcriptChapters = Object.freeze([
    {
      id: "00",
      segmentStart: 1,
      segmentEnd: 25,
      audioStart: "00:00",
      audioEnd: "01:23",
      title: "片头预告：垂类 Agent、蒸馏与 Cowork",
      description:
        "正式采访前的高密度预览：垂直场景定制、蒸馏的可持续性，以及 Cowork 带来的新一轮 Token 增长。",
    },
    {
      id: "01",
      segmentStart: 26,
      segmentEnd: 153,
      audioStart: "01:23",
      audioEnd: "07:00",
      title: "开源 × 闭源：追赶、蒸馏与用户心智",
      description:
        "从开源软件的历史类比出发，讨论开源模型的追赶速度、蒸馏是否可持续，以及闭源厂商的用户心智优势。",
    },
    {
      id: "02",
      segmentStart: 154,
      segmentEnd: 231,
      audioStart: "07:00",
      audioEnd: "10:18",
      title: "SOTA 模型的收入账与垂类智能",
      description:
        "拆解 SOTA 模型 ARR 与真实收入之间的口径，同时解释为什么垂类任务的模型智能不能只看通用榜单。",
    },
    {
      id: "03",
      segmentStart: 232,
      segmentEnd: 421,
      audioStart: "10:18",
      audioEnd: "18:50",
      title: "Token 流向：真实采用如何分化",
      description:
        "用 Fireworks 的调用观察模型采用：不同厂商、地区与场景里的 Token 正在流向哪里，以及价格与质量如何共同影响选择。",
    },
    {
      id: "04",
      segmentStart: 422,
      segmentEnd: 595,
      audioStart: "18:50",
      audioEnd: "27:00",
      title: "Rebase、信任与 Eval：企业如何换模型",
      description:
        "应用怎样持续 Rebase 到新模型，企业为什么需要建立信任，以及 Eval 如何成为采购、切换和交付的共同语言。",
    },
    {
      id: "05",
      segmentStart: 596,
      segmentEnd: 751,
      audioStart: "27:00",
      audioEnd: "33:50",
      title: "推理系统：Harness、效率与硬件适配",
      description:
        "把模型放回完整系统：推理优化、Agent Harness、软硬件协同，以及推理工作负载对芯片和基础设施的要求。",
    },
    {
      id: "06",
      segmentStart: 752,
      segmentEnd: 820,
      audioStart: "33:50",
      audioEnd: "36:20",
      title: "定制模型：RL 与持续 Rebase",
      description:
        "定制并非一次微调：何时采用 RL，怎样围绕稳定 Eval 持续 Rebase，以及服务团队如何缩短更新周期。",
    },
    {
      id: "07",
      segmentStart: 821,
      segmentEnd: 916,
      audioStart: "36:20",
      audioEnd: "41:16",
      title: "Fireworks 的位置：CSP、人才与 RSI",
      description:
        "Fireworks 在云厂商与 New Cloud 之间的定位：CSP 合作、人才密度、开发者全生命周期，以及 RSI 能否理解客户需求。",
    },
    {
      id: "08",
      segmentStart: 917,
      segmentEnd: 1008,
      audioStart: "41:16",
      audioEnd: "45:05",
      title: "算力边界：容量挑战与 CapEx",
      description:
        "未来一两年的核心约束仍是 Compute：供给、融资与 CapEx 回收如何影响行业，以及开源追赶为什么可能利好基础设施提供者。",
    },
  ]);

  const speakerNames = Object.freeze({
    1: "Benny Chen",
    2: "主持人曹卿云",
  });

  const segmentSpeakerOverrides = Object.freeze({
    1005: 1,
    1006: 2,
    1007: 2,
    1008: 1,
  });

  const segmentDisplayCorrections = new Map([
    [4, [[/依法/gu, "eval"]]],
    [20, [[/evo/giu, "eval"]]],
    [131, [[/Nimbus/gu, "Nemotron"]]],
    [136, [[/尼莫厂/gu, "Nemotron"]]],
    [204, [[/Docsumo/gu, "Doximity"]]],
    [205, [[/Doconomy/gu, "Doximity"]]],
    [210, [[/海蒂/gu, "Heidi"]]],
    [211, [[/海蒂/gu, "Heidi"]]],
    [272, [[/video jam/giu, "video gen"]]],
    [283, [[/Firework Nexus/gu, "Fireworks Nexus"]]],
    [302, [[/multimodel/giu, "multimodal"]]],
    [320, [[/Open Router/gu, "OpenRouter"]]],
    [338, [[/\bOPS\b/gu, "Opus"]]],
    [371, [[/KimimGLMMiniMax/gu, "Kimi、GLM、MiniMax"]]],
    [382, [[/Nimochong/gu, "Nemotron"]]],
    [384, [[/\bLama\b/gu, "Llama"]]],
    [
      401,
      [
        [/CrowdCo的AR/gu, "Claude Code 的 ARR"],
        [/Codex AR/gu, "Codex 的 ARR"],
        [/close source model AR/giu, "closed-source model 的 ARR"],
      ],
    ],
    [415, [[/Sonata/gu, "Sonnet"]]],
    [442, [[/医保/gu, "eval"]]],
    [467, [[/Even up/gu, "EvenUp"]]],
    [476, [[/\baig\b/giu, "AGI"]]],
    [525, [[/gold market capability/giu, "go-to-market capability"]]],
    [551, [[/\bAR\b/gu, "ARR"]]],
    [567, [[/依法/gu, "eval"]]],
    [572, [[/eva/giu, "eval"]]],
    [575, [[/evol/giu, "eval"]]],
    [577, [[/evol/giu, "eval"]]],
    [579, [[/evol/giu, "eval"]]],
    [584, [[/evo/giu, "eval"]]],
    [587, [[/Sequel呃Engine/gu, "SQL engine"]]],
    [588, [[/Eva/gu, "Eval"]]],
    [589, [[/Eva/gu, "Eval"]]],
    [594, [[/医疗/gu, "eval"]]],
    [624, [[/one p/giu, "1P"]]],
    [625, [[/非类拍/gu, "非 1P"]]],
    [639, [[/索塔/gu, "SOTA"]]],
    [655, [[/欧普斯/gu, "Opus"]]],
    [690, [[/多卡式portall/giu, "Dwarkesh Patel"]]],
    [766, [[/Harry/gu, "Harvey"]]],
    [811, [[/\brebate\b/giu, "rebase"]]],
    [812, [[/医保/gu, "eval"]]],
    [814, [[/医保/gu, "eval"]]],
    [817, [[/医保/gu, "eval"]]],
    [818, [[/\brebate\b/giu, "rebase"]]],
    [837, [[/发沃克斯/gu, "Fireworks"]]],
    [864, [[/New Cloud/gu, "Neocloud"]]],
    [896, [[/\bMLops\b/gu, "MLOps"]]],
    [901, [[/New Cloud/gu, "Neocloud"]]],
    [913, [[/\brsi\b/gu, "RSI"]]],
    [914, [[/\brsi\b/gu, "RSI"]]],
    [964, [[/三三年/gu, "三年"]]],
  ]);

  const state = {
    activeSectionId: "brief",
    scrollFrame: 0,
    menuLastFocus: null,
    toastTimer: 0,
    searchTimer: 0,
    searchActive: false,
    copyTimers: new WeakMap(),
  };

  const elements = {
    progress: select("#reading-progress"),
    progressBar: select("[data-progress-bar]"),
    siteMark: select(".site-mark"),
    menuToggle: select("[data-menu-toggle]"),
    mobileToc: select("[data-mobile-toc]"),
    mobileTocPanel: select(".mobile-toc__panel"),
    currentSection: select("[data-current-section]"),
    transcriptRoot: select("[data-transcript-root]"),
    transcriptSearch: select("[data-transcript-search]"),
    searchStatus: select("[data-search-status]"),
    noResults: select("[data-no-results]"),
    toast: select("[data-toast]"),
    actionList: select("[data-action-list]"),
    actionStatus: select("[data-action-status]"),
  };

  function showToast(message) {
    if (!elements.toast) return;

    window.clearTimeout(state.toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");

    state.toastTimer = window.setTimeout(() => {
      elements.toast.classList.remove("is-visible");
    }, reducedMotion.matches ? 1400 : 2200);
  }

  function setInert(element, shouldBeInert) {
    if (!element) return;

    if (shouldBeInert) {
      element.setAttribute("inert", "");
    } else {
      element.removeAttribute("inert");
    }
  }

  function openMenu() {
    if (!elements.mobileToc || !elements.menuToggle || !elements.mobileTocPanel) return;

    state.menuLastFocus = document.activeElement;
    elements.mobileToc.setAttribute("aria-hidden", "false");
    elements.menuToggle.setAttribute("aria-expanded", "true");
    setInert(elements.mobileTocPanel, false);
    document.body.classList.add("menu-open");

    window.requestAnimationFrame(() => {
      const firstLink = select("a", elements.mobileTocPanel);
      (firstLink || elements.mobileTocPanel).focus({ preventScroll: true });
    });
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!elements.mobileToc || !elements.menuToggle || !elements.mobileTocPanel) return;

    elements.mobileToc.setAttribute("aria-hidden", "true");
    elements.menuToggle.setAttribute("aria-expanded", "false");
    setInert(elements.mobileTocPanel, true);
    document.body.classList.remove("menu-open");

    if (restoreFocus && state.menuLastFocus instanceof HTMLElement) {
      state.menuLastFocus.focus({ preventScroll: true });
    }
  }

  function isVisible(element) {
    if (!(element instanceof HTMLElement) || element.hidden || !element.getClientRects().length) {
      return false;
    }

    const styles = window.getComputedStyle(element);
    return styles.display !== "none" && styles.visibility !== "hidden";
  }

  function focusVisibleMenuControl() {
    window.requestAnimationFrame(() => {
      const target = isVisible(elements.menuToggle) ? elements.menuToggle : elements.siteMark;
      if (isVisible(target)) target.focus({ preventScroll: true });
    });
  }

  function trapMenuFocus(event) {
    if (
      event.key !== "Tab" ||
      !elements.mobileToc ||
      elements.mobileToc.getAttribute("aria-hidden") !== "false" ||
      !elements.mobileTocPanel
    ) {
      return;
    }

    const focusable = selectAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      elements.mobileTocPanel,
    ).filter((item) => !item.hasAttribute("hidden"));

    if (!focusable.length) {
      event.preventDefault();
      elements.mobileTocPanel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function setupMobileMenu() {
    if (!elements.menuToggle || !elements.mobileToc || !elements.mobileTocPanel) return;

    setInert(elements.mobileTocPanel, true);
    elements.menuToggle.addEventListener("click", () => {
      const isOpen = elements.menuToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    selectAll("[data-menu-close]", elements.mobileToc).forEach((button) => {
      button.addEventListener("click", () => closeMenu());
    });

    selectAll("a[href^='#']", elements.mobileToc).forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && elements.mobileToc.getAttribute("aria-hidden") === "false") {
        event.preventDefault();
        closeMenu();
        return;
      }

      trapMenuFocus(event);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980 && elements.mobileToc.getAttribute("aria-hidden") === "false") {
        closeMenu({ restoreFocus: false });
        focusVisibleMenuControl();
      }
    });
  }

  function getDocumentProgress() {
    const root = document.documentElement;
    const scrollable = Math.max(1, root.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, window.scrollY / scrollable));
  }

  function updateProgress() {
    const progress = getDocumentProgress();
    const percentage = Math.round(progress * 100);

    if (elements.progressBar) {
      elements.progressBar.style.transform = `scaleX(${progress})`;
    }

    if (elements.progress) {
      elements.progress.setAttribute("aria-valuenow", String(percentage));
    }
  }

  function getSectionIndex(id) {
    const desktopLink = select(`.chapter-nav a[href="#${id}"]`);
    return desktopLink ? select("span", desktopLink)?.textContent.trim() || "" : "";
  }

  function setActiveSection(id) {
    if (!id || id === state.activeSectionId) return;

    state.activeSectionId = id;
    selectAll("[data-section-link]").forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const section = document.getElementById(id);
    if (elements.currentSection && section) {
      const index = getSectionIndex(id);
      const title = section.dataset.sectionTitle || select("h2, h1", section)?.textContent.trim() || id;
      elements.currentSection.textContent = `${index}${index ? " / " : ""}${title}`;
    }
  }

  function updateActiveSection() {
    const sections = selectAll("section[data-section-title]");
    if (!sections.length) return;

    const marker = window.scrollY + Math.min(window.innerHeight * 0.38, 360);
    let current = sections[0];

    sections.forEach((section) => {
      if (section.offsetTop <= marker) current = section;
    });

    setActiveSection(current.id);
  }

  function handleScroll() {
    if (state.scrollFrame) return;

    state.scrollFrame = window.requestAnimationFrame(() => {
      updateProgress();
      updateActiveSection();
      state.scrollFrame = 0;
    });
  }

  function setupReadingNavigation() {
    const initialSection = window.location.hash.slice(1);
    const initialTarget = initialSection ? document.getElementById(initialSection) : null;
    const validInitial = initialTarget?.matches("section[data-section-title]");

    state.activeSectionId = "";
    setActiveSection(validInitial ? initialSection : "brief");
    updateProgress();
    updateActiveSection();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    selectAll("[data-section-link]").forEach((link) => {
      link.addEventListener("click", () => {
        const targetId = link.getAttribute("href")?.slice(1);
        if (targetId) setActiveSection(targetId);
      });
    });
  }

  function createTextElement(tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof value === "string") element.textContent = value;
    return element;
  }

  function formatSegmentRange(start, end) {
    return start === end ? `s${start}` : `s${start}—s${end}`;
  }

  function correctTranscriptDisplay(value, segmentNumber) {
    let corrected = value;

    const scopedCorrections = segmentDisplayCorrections.get(segmentNumber) || [];
    scopedCorrections.forEach(([pattern, replacement]) => {
      corrected = corrected.replace(pattern, replacement);
    });
    return corrected;
  }

  function parseTranscriptMarkdown(markdown) {
    const segments = [];
    let currentSpeaker = null;

    markdown.split(/\r?\n/u).forEach((line) => {
      const speakerMatch = line.match(/^\*\*Speaker\s+([12])\b/u);
      if (speakerMatch) {
        currentSpeaker = Number(speakerMatch[1]);
        return;
      }

      const segmentMatch = line.match(/^\[s(\d+)\]\s*(.*)$/u);
      if (!segmentMatch) return;
      if (!currentSpeaker) throw new Error(`分段 s${segmentMatch[1]} 缺少说话人标签`);

      const segmentNumber = Number(segmentMatch[1]);
      segments.push({
        number: segmentNumber,
        speaker: segmentSpeakerOverrides[segmentNumber] || currentSpeaker,
        sourceSpeaker: currentSpeaker,
        text: segmentMatch[2].trim(),
      });
    });

    const expectedCount = transcriptChapters.at(-1).segmentEnd;
    if (segments.length !== expectedCount) {
      throw new Error(`逐字稿应有 ${expectedCount} 段，实际解析到 ${segments.length} 段`);
    }

    segments.forEach((segment, index) => {
      const expectedNumber = index + 1;
      if (segment.number !== expectedNumber) {
        throw new Error(`逐字稿分段不连续：预期 s${expectedNumber}，实际为 s${segment.number}`);
      }
      if (!speakerNames[segment.speaker]) {
        throw new Error(`s${segment.number} 的说话人标签无法识别`);
      }
    });

    return segments;
  }

  function mergeSpeakerTurns(segments) {
    return segments.reduce((turns, segment) => {
      const previous = turns.at(-1);
      if (
        previous &&
        previous.speaker === segment.speaker &&
        previous.segmentEnd + 1 === segment.number
      ) {
        previous.segmentEnd = segment.number;
        previous.parts.push(correctTranscriptDisplay(segment.text, segment.number));
        return turns;
      }

      turns.push({
        speaker: segment.speaker,
        segmentStart: segment.number,
        segmentEnd: segment.number,
        parts: [correctTranscriptDisplay(segment.text, segment.number)],
      });
      return turns;
    }, []);
  }

  function createTranscriptNotice() {
    const notice = createTextElement("p", "chapter-note");
    notice.setAttribute("role", "note");
    notice.append(
      "阅读说明：说话人通常按 ASR 标签映射为 Benny Chen 与主持人曹卿云，未经声纹核验。原稿 s1005—s1008 被归在同一标签且存在混说，本页按复核结果拆为 Benny、主持人、主持人、Benny。正文保留口语，只在显示层按具体 segment 校正高置信专名与术语，",
    );

    const sourceLink = createTextElement("a", "", "原始 Markdown 保持不变");
    sourceLink.href = transcriptSource;
    notice.append(sourceLink, "。");
    return notice;
  }

  function createTranscriptChapter(chapter, allSegments, chapterIndex) {
    const chapterSegments = allSegments.slice(chapter.segmentStart - 1, chapter.segmentEnd);
    const turns = mergeSpeakerTurns(chapterSegments);
    const details = document.createElement("details");
    details.id = `transcript-${chapter.id}`;
    details.dataset.transcriptChapter = "";
    details.dataset.chapterId = chapter.id;
    details.dataset.segmentStart = String(chapter.segmentStart);
    details.dataset.segmentEnd = String(chapter.segmentEnd);
    details.dataset.start = chapter.audioStart;
    details.dataset.end = chapter.audioEnd;
    details.open = chapterIndex === 0;

    const summary = document.createElement("summary");
    const range = createTextElement(
      "span",
      "transcript-summary__time",
      formatSegmentRange(chapter.segmentStart, chapter.segmentEnd),
    );
    range.title = `约 ${chapter.audioStart}—${chapter.audioEnd}；此处显示的是源 segment 范围，不是逐句时间码`;
    const title = createTextElement("span", "transcript-summary__title", chapter.title);
    const count = createTextElement(
      "span",
      "transcript-summary__count",
      `${turns.length} 轮发言 · ${chapterSegments.length} 段`,
    );
    const toggle = createTextElement("span", "transcript-summary__toggle");
    toggle.setAttribute("aria-hidden", "true");
    summary.append(range, title, count, toggle);

    const body = createTextElement("div", "transcript-chapter__body");
    const description = createTextElement("p", "chapter-note", chapter.description);
    description.setAttribute("role", "note");
    body.append(description);

    turns.forEach((turn) => {
      const speaker = speakerNames[turn.speaker];
      const utterance = createTextElement("div", "utterance");
      utterance.dataset.utterance = "";
      utterance.dataset.speaker = speaker;
      utterance.dataset.segmentStart = String(turn.segmentStart);
      utterance.dataset.segmentEnd = String(turn.segmentEnd);

      const metadata = createTextElement("div", "utterance__meta");
      const segmentRange = createTextElement(
        "span",
        "utterance__segments",
        formatSegmentRange(turn.segmentStart, turn.segmentEnd),
      );
      segmentRange.setAttribute(
        "aria-label",
        `原始分段 ${formatSegmentRange(turn.segmentStart, turn.segmentEnd)}`,
      );
      metadata.append(segmentRange, createTextElement("span", "", speaker));

      const text = createTextElement("p", "", turn.parts.join(""));
      text.dataset.transcriptText = "";
      utterance.append(metadata, text);
      body.append(utterance);
    });

    details.append(summary, body);
    return details;
  }

  function renderTranscript(segments) {
    if (!elements.transcriptRoot) return;

    const content = document.createDocumentFragment();
    content.append(createTranscriptNotice());
    transcriptChapters.forEach((chapter, index) => {
      content.append(createTranscriptChapter(chapter, segments, index));
    });

    elements.transcriptRoot.replaceChildren(content);
    elements.transcriptRoot.dataset.loadState = "loaded";

    const transcriptIntro = select(".transcript-section .section-heading--split > p");
    if (transcriptIntro) {
      transcriptIntro.textContent =
        "按章节展开并搜索关键词；每轮发言保留说话人和源 segment 范围，不为缺失的逐句时间码造数。";
    }

    const status = select("[data-transcript-status]");
    if (status) status.textContent = "ASR 原始稿 · 1,008 段";
  }

  function renderTranscriptFallback(error) {
    if (!elements.transcriptRoot) return;

    const fallback = createTextElement("p", "chapter-note");
    fallback.setAttribute("role", "alert");
    fallback.append("逐字稿自动加载失败。你仍可");
    const link = createTextElement("a", "", "打开原始 Markdown");
    link.href = transcriptSource;
    fallback.append(link, " 阅读完整内容。");

    elements.transcriptRoot.replaceChildren(fallback);
    elements.transcriptRoot.dataset.loadState = "error";
    if (elements.transcriptSearch) elements.transcriptSearch.disabled = true;
    if (elements.searchStatus) elements.searchStatus.textContent = "逐字稿加载失败";
    console.error("Transcript loading failed", error);
  }

  async function loadTranscript() {
    if (!elements.transcriptRoot) return false;

    elements.transcriptRoot.setAttribute("aria-busy", "true");
    try {
      const response = await window.fetch(transcriptSource, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const markdown = await response.text();
      renderTranscript(parseTranscriptMarkdown(markdown));
      return true;
    } catch (error) {
      renderTranscriptFallback(error);
      return false;
    } finally {
      elements.transcriptRoot.removeAttribute("aria-busy");
    }
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function restoreText(element) {
    if (!element || typeof element.dataset.searchOriginal === "undefined") return;
    element.textContent = element.dataset.searchOriginal;
  }

  function countAndHighlight(element, query) {
    if (!element) return 0;

    if (typeof element.dataset.searchOriginal === "undefined") {
      element.dataset.searchOriginal = element.textContent || "";
    }

    const original = element.dataset.searchOriginal;
    element.replaceChildren();

    if (!query) {
      element.textContent = original;
      return 0;
    }

    let expression;
    try {
      expression = new RegExp(escapeRegExp(query), "giu");
    } catch (_error) {
      element.textContent = original;
      return 0;
    }

    let cursor = 0;
    let hits = 0;
    let match = expression.exec(original);

    while (match) {
      if (match.index > cursor) {
        element.append(document.createTextNode(original.slice(cursor, match.index)));
      }

      const marker = document.createElement("mark");
      marker.className = "search-hit";
      marker.textContent = match[0];
      element.append(marker);

      cursor = match.index + match[0].length;
      hits += 1;
      match = expression.exec(original);
    }

    if (cursor < original.length) {
      element.append(document.createTextNode(original.slice(cursor)));
    }

    if (hits === 0) element.textContent = original;
    return hits;
  }

  function rememberChapterState(chapters) {
    if (state.searchActive) return;

    chapters.forEach((chapter) => {
      chapter.dataset.openBeforeSearch = chapter.open ? "true" : "false";
    });
  }

  function restoreChapterState(chapters) {
    chapters.forEach((chapter) => {
      chapter.removeAttribute("data-search-hidden");
      if (typeof chapter.dataset.openBeforeSearch !== "undefined") {
        chapter.open = chapter.dataset.openBeforeSearch === "true";
        delete chapter.dataset.openBeforeSearch;
      }
    });
  }

  function updateTranscriptSearch(rawQuery = "") {
    if (!elements.transcriptRoot) return;

    const query = rawQuery.trim();
    const chapters = selectAll("[data-transcript-chapter]", elements.transcriptRoot);
    const searchableNodes = selectAll(
      "[data-transcript-text], .transcript-summary__title, .utterance__meta span",
      elements.transcriptRoot,
    );

    if (!query) {
      searchableNodes.forEach(restoreText);
      restoreChapterState(chapters);
      state.searchActive = false;

      if (elements.searchStatus) {
        elements.searchStatus.textContent = `共 ${chapters.length} 个章节`;
      }
      if (elements.noResults) elements.noResults.hidden = true;
      return;
    }

    rememberChapterState(chapters);
    state.searchActive = true;
    let totalHits = 0;
    let matchedChapters = 0;

    chapters.forEach((chapter) => {
      const nodes = selectAll(
        "[data-transcript-text], .transcript-summary__title, .utterance__meta span",
        chapter,
      );
      let chapterHits = 0;

      nodes.forEach((node) => {
        chapterHits += countAndHighlight(node, query);
      });

      const matched = chapterHits > 0;
      chapter.dataset.searchHidden = matched ? "false" : "true";
      chapter.open = matched;

      if (matched) matchedChapters += 1;
      totalHits += chapterHits;
    });

    if (elements.searchStatus) {
      elements.searchStatus.textContent = totalHits
        ? `找到 ${totalHits} 处命中 · ${matchedChapters} 个章节`
        : `未找到“${query}”`;
    }
    if (elements.noResults) elements.noResults.hidden = totalHits > 0;
  }

  function clearTranscriptSearch({ focus = true } = {}) {
    if (!elements.transcriptSearch) return;

    elements.transcriptSearch.value = "";
    updateTranscriptSearch("");
    if (focus) elements.transcriptSearch.focus();
  }

  function setupTranscriptSearch() {
    if (!elements.transcriptSearch || !elements.transcriptRoot) return;

    if (elements.transcriptRoot.dataset.loadState === "error") {
      if (elements.searchStatus) elements.searchStatus.textContent = "逐字稿加载失败";
      return;
    }

    const chapterCount = selectAll("[data-transcript-chapter]", elements.transcriptRoot).length;
    if (elements.searchStatus) elements.searchStatus.textContent = `共 ${chapterCount} 个章节`;

    elements.transcriptSearch.addEventListener("input", () => {
      window.clearTimeout(state.searchTimer);
      state.searchTimer = window.setTimeout(() => {
        updateTranscriptSearch(elements.transcriptSearch.value);
      }, 80);
    });

    select("[data-clear-search]")?.addEventListener("click", () => clearTranscriptSearch());

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (
        event.key === "/" &&
        !isTyping &&
        elements.mobileToc?.getAttribute("aria-hidden") !== "false" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        elements.transcriptSearch.focus();
        elements.transcriptSearch.select();
      }

      if (event.key === "Escape" && document.activeElement === elements.transcriptSearch && elements.transcriptSearch.value) {
        event.preventDefault();
        clearTranscriptSearch();
      }
    });
  }

  function setAllTranscriptChapters(open) {
    if (!elements.transcriptRoot) return;

    const visibleChapters = selectAll("[data-transcript-chapter]", elements.transcriptRoot).filter(
      (chapter) => chapter.dataset.searchHidden !== "true",
    );
    visibleChapters.forEach((chapter) => {
      chapter.open = open;
    });
    showToast(`${open ? "已展开" : "已折叠"} ${visibleChapters.length} 个章节`);
  }

  function getTranscriptChapterAtReadingLine() {
    if (!elements.transcriptRoot || state.activeSectionId !== "transcript") return null;

    const chapters = selectAll("[data-transcript-chapter]", elements.transcriptRoot).filter(
      (chapter) => chapter.dataset.searchHidden !== "true",
    );
    const readingLine = Math.min(window.innerHeight * 0.5, 420);
    let current = chapters[0] || null;

    chapters.forEach((chapter) => {
      if (chapter.getBoundingClientRect().top <= readingLine) current = chapter;
    });
    return current;
  }

  async function writeClipboard(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const temporary = document.createElement("textarea");
    temporary.value = value;
    temporary.setAttribute("readonly", "");
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.append(temporary);
    temporary.select();

    const copied = document.execCommand("copy");
    temporary.remove();
    if (!copied) throw new Error("Copy command failed");
  }

  async function copyCurrentSection(button) {
    const chapter = getTranscriptChapterAtReadingLine();
    const targetId = chapter?.id || state.activeSectionId || "brief";
    const url = new URL(window.location.href);
    url.hash = targetId;
    const label = select("span", button);
    const original = button.dataset.copyDefaultLabel || label?.textContent || "复制本节链接";
    button.dataset.copyDefaultLabel = original;

    const oldTimer = state.copyTimers.get(button);
    if (oldTimer) {
      window.clearTimeout(oldTimer);
      state.copyTimers.delete(button);
    }

    try {
      await writeClipboard(url.toString());

      if (label) label.textContent = chapter ? "已复制本章链接" : "链接已复制";
      showToast(chapter ? "当前逐字稿章节链接已复制" : "当前章节链接已复制");

      const pendingTimer = state.copyTimers.get(button);
      if (pendingTimer) window.clearTimeout(pendingTimer);
      const timer = window.setTimeout(() => {
        if (label) label.textContent = original;
        state.copyTimers.delete(button);
      }, 1800);
      state.copyTimers.set(button, timer);
    } catch (_error) {
      if (label) label.textContent = original;
      showToast("复制失败，请复制浏览器地址栏链接");
    }
  }

  function setupTranscriptActions() {
    select("[data-expand-all]")?.addEventListener("click", () => setAllTranscriptChapters(true));
    select("[data-collapse-all]")?.addEventListener("click", () => setAllTranscriptChapters(false));
    selectAll("[data-copy-section]").forEach((button) => {
      const label = select("span", button);
      button.dataset.copyDefaultLabel = label?.textContent || "复制本节链接";
      button.addEventListener("click", () => copyCurrentSection(button));
    });
  }

  const actionStorageKey = "fireworks-benny-action-checklist-v1";

  function readStoredActions() {
    try {
      const value = window.localStorage.getItem(actionStorageKey);
      const parsed = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function storeActions(ids) {
    try {
      window.localStorage.setItem(actionStorageKey, JSON.stringify(ids));
    } catch (_error) {
      // The checklist remains usable when storage is unavailable.
    }
  }

  function updateActionStatus({ persist = true } = {}) {
    if (!elements.actionList || !elements.actionStatus) return;

    const inputs = selectAll("input[type='checkbox'][data-action-id]", elements.actionList);
    const completed = inputs.filter((input) => input.checked);
    elements.actionStatus.textContent = `${completed.length} / ${inputs.length} 已完成`;

    if (persist) {
      storeActions(completed.map((input) => input.dataset.actionId));
    }
  }

  function setupActionChecklist() {
    if (!elements.actionList) return;

    const stored = new Set(readStoredActions());
    selectAll("input[type='checkbox'][data-action-id]", elements.actionList).forEach((input) => {
      input.checked = stored.has(input.dataset.actionId);
      input.addEventListener("change", () => updateActionStatus());
    });
    updateActionStatus({ persist: false });
  }

  function setupDetailsHashOpening() {
    const scrollToTarget = (target, smooth) => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      if (!smooth || reducedMotion.matches) root.style.scrollBehavior = "auto";
      target.scrollIntoView({
        block: "start",
        behavior: smooth && !reducedMotion.matches ? "smooth" : "auto",
      });
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousBehavior;
      });
    };

    const openHashTarget = ({ ensureScroll = false } = {}) => {
      const targetId = window.location.hash.slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      const details = target.matches("details") ? target : target.closest("details");
      if (details instanceof HTMLDetailsElement) {
        if (details.dataset.searchHidden === "true") clearTranscriptSearch({ focus: false });
        details.open = true;
      }

      if (ensureScroll) {
        window.requestAnimationFrame(() => {
          scrollToTarget(target, false);
        });
      }
    };

    const initialTarget = window.location.hash.slice(1);
    openHashTarget({ ensureScroll: initialTarget.startsWith("transcript-") });
    window.addEventListener("hashchange", () => openHashTarget({ ensureScroll: true }));
  }

  async function initialize() {
    setupMobileMenu();
    setupReadingNavigation();
    setupActionChecklist();
    await loadTranscript();
    setupTranscriptSearch();
    setupTranscriptActions();
    setupDetailsHashOpening();

    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");
  }

  function start() {
    initialize().catch((error) => {
      console.error("Page initialization failed", error);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
