"use strict";

const {
  lastVerifiedDate,
  pathSteps,
  caseTypes,
  cases,
  topics,
  webPages,
  toolkits
} = window.learningHubContent;

const pathButtons = document.querySelectorAll(".path-step");
const pathNumber = document.querySelector("#pathNumber");
const pathMeta = document.querySelector("#pathMeta");
const pathTitle = document.querySelector("#pathTitle");
const pathBody = document.querySelector("#pathBody");
const pathLink = document.querySelector("#pathLink");
const caseGrid = document.querySelector("#caseGrid");
const caseCount = document.querySelector("#caseCount");
const filterButtons = document.querySelectorAll(".filter-button");
const copyButtons = document.querySelectorAll(".copy-button");
const topicRail = document.querySelector("#topicRail");
const knowledgeGrid = document.querySelector("#knowledgeGrid");
const knowledgeCount = document.querySelector("#knowledgeCount");
const knowledgeSearch = document.querySelector("#knowledgeSearch");
const tagFilters = document.querySelector("#tagFilters");
const topicDetail = document.querySelector("#topicDetail");
const statTopics = document.querySelector("#statTopics");
const statCards = document.querySelector("#statCards");
const statVerified = document.querySelector("#statVerified");
const heroVerified = document.querySelector("#heroVerified");
const statWebPages = document.querySelector("#statWebPages");
const webLibraryGrid = document.querySelector("#webLibraryGrid");
const webLibraryCount = document.querySelector("#webLibraryCount");
const sourceFilterButtons = document.querySelectorAll(".source-filter");
const globalSearchResults = document.querySelector("#globalSearchResults");
const globalSearchCount = document.querySelector("#globalSearchCount");
const toolkitGrid = document.querySelector("#toolkitGrid");
const toolkitCount = document.querySelector("#toolkitCount");

let activeTopic = "all";
let activeTag = "all";
let searchText = "";
let activeSourceCategory = "all";

function setPressed(buttons, activeButton) {
  buttons.forEach(button => {
    const isActive = button === activeButton;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updatePath(stepIndex) {
  const step = pathSteps[stepIndex] || pathSteps[0];
  pathNumber.textContent = step.number;
  pathMeta.textContent = step.meta;
  pathTitle.textContent = step.title;
  pathBody.textContent = step.body;
  pathLink.href = step.href;
}

function makeCaseCard(item) {
  const card = document.createElement("article");
  card.className = "case-card";

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = caseTypes[item.type] || item.type;

  const title = document.createElement("h3");
  title.textContent = item.name;

  const lesson = document.createElement("p");
  const lessonStrong = document.createElement("strong");
  lessonStrong.textContent = "学习：";
  lesson.append(lessonStrong, item.lesson);

  const avoid = document.createElement("p");
  const avoidStrong = document.createElement("strong");
  avoidStrong.textContent = "避开：";
  avoid.append(avoidStrong, item.avoid);

  card.append(tag, title, lesson, avoid);
  return card;
}

function renderCases(type = "all") {
  if (!caseGrid || !caseCount) return;
  const visibleCases = type === "all" ? cases : cases.filter(item => item.type === type);
  caseGrid.replaceChildren(...visibleCases.map(makeCaseCard));
  caseCount.textContent = `显示 ${visibleCases.length} 个案例`;
}

function makeTopicButton(topic) {
  const button = document.createElement("button");
  button.className = "topic-tab";
  button.type = "button";
  button.dataset.topic = topic.id;
  button.setAttribute("aria-pressed", "false");

  const title = document.createElement("strong");
  title.textContent = topic.title;
  const count = document.createElement("span");
  count.textContent = `${topic.cards.length} 张卡`;
  button.append(title, count);

  button.addEventListener("click", () => {
    activeTopic = topic.id;
    setPressed(document.querySelectorAll(".topic-tab"), button);
    renderKnowledge();
  });
  return button;
}

function makeTagButton(tag) {
  const button = document.createElement("button");
  button.className = "tag-filter";
  button.type = "button";
  button.dataset.tag = tag;
  button.setAttribute("aria-pressed", tag === "all" ? "true" : "false");
  button.textContent = tag === "all" ? "全部标签" : tag;
  if (tag === "all") button.classList.add("is-active");
  button.addEventListener("click", () => {
    activeTag = tag;
    setPressed(document.querySelectorAll(".tag-filter"), button);
    renderKnowledge();
  });
  return button;
}

function getKnowledgeItems() {
  return topics.flatMap(topic => topic.cards.map(card => ({ topic, card })));
}

function matchesSearch(item) {
  const haystack = [
    item.topic.title,
    item.topic.summary,
    item.topic.tags.join(" "),
    item.card.title,
    item.card.forWhom,
    item.card.conclusion,
    item.card.steps.join(" "),
    item.card.pitfalls.join(" "),
    item.topic.caseName,
    item.topic.caseSummary,
    item.card.source
  ].join(" ").toLowerCase();
  return haystack.includes(searchText.toLowerCase());
}

function matchesFilters(item) {
  const topicMatch = activeTopic === "all" || item.topic.id === activeTopic;
  const tagMatch = activeTag === "all" || item.topic.tags.includes(activeTag);
  return topicMatch && tagMatch && matchesSearch(item);
}

function textMatches(parts, query) {
  return parts.join(" ").toLowerCase().includes(query.toLowerCase());
}

function makeList(items) {
  const list = document.createElement("ul");
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  });
  return list;
}

function makeSourceLinks(urls) {
  const wrapper = document.createElement("div");
  wrapper.className = "source-links";
  urls.forEach((url, index) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = url.startsWith("http") ? "_blank" : "";
    link.rel = url.startsWith("http") ? "noreferrer" : "";
    link.textContent = `来源 ${index + 1}`;
    wrapper.append(link);
  });
  return wrapper;
}

function makeKnowledgeCard(item) {
  const article = document.createElement("article");
  article.className = "knowledge-card";
  article.dataset.topic = item.topic.id;
  article.dataset.tags = item.topic.tags.join(",");

  const top = document.createElement("div");
  top.className = "knowledge-card-top";
  const topicTag = document.createElement("span");
  topicTag.className = "tag";
  topicTag.textContent = item.topic.title;
  const verified = document.createElement("span");
  verified.className = "verified";
  verified.textContent = `核查 ${item.card.verified}`;
  top.append(topicTag, verified);

  const title = document.createElement("h3");
  title.textContent = item.card.title;

  const audience = document.createElement("p");
  audience.innerHTML = `<strong>适合谁：</strong>${item.card.forWhom}`;

  const conclusion = document.createElement("p");
  conclusion.innerHTML = `<strong>核心结论：</strong>${item.card.conclusion}`;

  const stepsTitle = document.createElement("h4");
  stepsTitle.textContent = "操作步骤";

  const pitfallsTitle = document.createElement("h4");
  pitfallsTitle.textContent = "常见坑";

  const source = document.createElement("p");
  source.className = "source-note";
  source.innerHTML = `<strong>来源：</strong>${item.card.source}`;

  article.append(
    top,
    title,
    audience,
    conclusion,
    stepsTitle,
    makeList(item.card.steps),
    pitfallsTitle,
    makeList(item.card.pitfalls),
    source,
    makeSourceLinks(item.card.sourceUrls)
  );

  return article;
}

function renderTopicDetail(topic) {
  if (!topicDetail) return;
  const selected = topic || topics[0];
  const checklist = makeList(selected.checklist);

  const title = document.createElement("h3");
  title.textContent = selected.title;

  const summary = document.createElement("p");
  summary.textContent = selected.summary;

  const meta = document.createElement("div");
  meta.className = "topic-meta";
  selected.tags.forEach(tag => {
    const pill = document.createElement("span");
    pill.textContent = tag;
    meta.append(pill);
  });

  const caseBox = document.createElement("div");
  caseBox.className = "topic-box";
  caseBox.innerHTML = `<strong>案例：</strong>${selected.caseName}<br>${selected.caseSummary}`;

  const template = document.createElement("pre");
  template.id = `template-${selected.id}`;
  template.textContent = selected.template;

  const copy = document.createElement("button");
  copy.className = "button ghost copy-button dynamic-copy";
  copy.type = "button";
  copy.dataset.copyTarget = template.id;
  copy.textContent = `复制${selected.templateTitle}`;
  copy.addEventListener("click", handleCopyClick);

  const checklistTitle = document.createElement("h4");
  checklistTitle.textContent = "行动清单";

  topicDetail.replaceChildren(title, summary, meta, caseBox, checklistTitle, checklist, template, copy);
}

function renderKnowledge() {
  if (!knowledgeGrid || !knowledgeCount) return;
  const items = getKnowledgeItems().filter(matchesFilters);
  knowledgeGrid.replaceChildren(...items.map(makeKnowledgeCard));
  knowledgeCount.textContent = `当前显示 ${items.length} / ${getKnowledgeItems().length} 张知识卡`;

  const selectedTopic = activeTopic === "all" ? topics[0] : topics.find(topic => topic.id === activeTopic);
  renderTopicDetail(selectedTopic);
}

function makeWebPageCard(page) {
  const article = document.createElement("article");
  article.className = "web-card";
  article.dataset.category = page.category;

  const top = document.createElement("div");
  top.className = "web-card-top";
  const category = document.createElement("span");
  category.className = "tag";
  category.textContent = page.categoryLabel;
  const verified = document.createElement("span");
  verified.className = "verified";
  verified.textContent = `核查 ${page.verified}`;
  top.append(category, verified);

  const title = document.createElement("h3");
  title.textContent = page.title;

  const source = document.createElement("p");
  source.className = "source-note";
  source.innerHTML = `<strong>来源：</strong>${page.source}`;

  const why = document.createElement("p");
  why.innerHTML = `<strong>为什么读：</strong>${page.whyRead}`;

  const myRead = document.createElement("p");
  myRead.className = "my-read";
  myRead.innerHTML = `<strong>我怎么看：</strong>${page.myRead}`;

  const useFor = document.createElement("p");
  useFor.innerHTML = `<strong>怎么用：</strong>${page.useFor}`;

  const dontMisread = document.createElement("p");
  dontMisread.innerHTML = `<strong>别误读：</strong>${page.dontMisread}`;

  const link = document.createElement("a");
  link.className = "text-link web-link";
  link.href = page.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "打开原网页";

  article.append(top, title, source, why, myRead, useFor, dontMisread, link);
  return article;
}

function renderWebLibrary() {
  if (!webLibraryGrid || !webLibraryCount) return;
  const pages = activeSourceCategory === "all"
    ? webPages
    : webPages.filter(page => page.category === activeSourceCategory);
  webLibraryGrid.replaceChildren(...pages.map(makeWebPageCard));
  webLibraryCount.textContent = `当前显示 ${pages.length} / ${webPages.length} 个网页整理`;
}

function getUnifiedSearchItems() {
  const knowledgeItems = getKnowledgeItems().map(item => ({
    type: "知识卡",
    title: item.card.title,
    body: item.card.conclusion,
    href: "#knowledge",
    terms: [
      item.topic.title,
      item.topic.summary,
      item.topic.tags.join(" "),
      item.topic.caseName,
      item.topic.caseSummary,
      item.card.title,
      item.card.forWhom,
      item.card.conclusion,
      item.card.steps.join(" "),
      item.card.pitfalls.join(" "),
      item.card.source
    ]
  }));

  const webItems = webPages.map(page => ({
    type: "网页资料",
    title: page.title,
    body: page.myRead,
    href: "#web-library",
    terms: [
      page.categoryLabel,
      page.title,
      page.source,
      page.whyRead,
      page.myRead,
      page.useFor,
      page.dontMisread
    ]
  }));

  const caseItems = cases.map(item => ({
    type: "案例",
    title: item.name,
    body: item.lesson,
    href: "#cases",
    terms: [item.name, caseTypes[item.type] || item.type, item.lesson, item.avoid]
  }));

  const templateItems = topics.map(topic => ({
    type: "模板",
    title: topic.templateTitle,
    body: topic.summary,
    href: "#knowledge",
    terms: [topic.title, topic.templateTitle, topic.template, topic.checklist.join(" ")]
  }));

  const toolkitItems = toolkits.map(toolkit => ({
    type: "提示词工具",
    title: toolkit.title,
    body: toolkit.summary,
    href: "#prompt-system",
    terms: [toolkit.title, toolkit.summary, toolkit.template, toolkit.checks.join(" ")]
  }));

  return [...knowledgeItems, ...webItems, ...caseItems, ...templateItems, ...toolkitItems];
}

function makeSearchResult(item) {
  const article = document.createElement("article");
  article.className = "search-result";

  const type = document.createElement("span");
  type.className = "result-type";
  type.textContent = item.type;

  const title = document.createElement("h3");
  title.textContent = item.title;

  const body = document.createElement("p");
  body.textContent = item.body;

  const link = document.createElement("a");
  link.className = "text-link";
  link.href = item.href;
  link.textContent = "跳到对应模块";

  article.append(type, title, body, link);
  return article;
}

function renderUnifiedSearch() {
  if (!globalSearchResults || !globalSearchCount) return;
  if (!searchText) {
    globalSearchResults.replaceChildren();
    globalSearchCount.textContent = "输入关键词后，同时检索知识卡、网页资料、案例和提示词工具包。";
    return;
  }

  const results = getUnifiedSearchItems()
    .filter(item => textMatches(item.terms, searchText))
    .slice(0, 12);

  globalSearchResults.replaceChildren(...results.map(makeSearchResult));
  globalSearchCount.textContent = `找到 ${results.length} 个结果：知识卡、网页资料、案例、模板和提示词工具包一起搜。`;
}

function makeToolkitCard(toolkit) {
  const article = document.createElement("article");
  article.className = "toolkit-card";

  const top = document.createElement("div");
  top.className = "knowledge-card-top";
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = "提示词资产";
  const verified = document.createElement("span");
  verified.className = "verified";
  verified.textContent = `核查 ${toolkit.verified}`;
  top.append(tag, verified);

  const title = document.createElement("h3");
  title.textContent = toolkit.title;

  const summary = document.createElement("p");
  summary.textContent = toolkit.summary;

  const checksTitle = document.createElement("h4");
  checksTitle.textContent = "质检项";

  const template = document.createElement("pre");
  template.id = `toolkit-${toolkit.id}`;
  template.textContent = toolkit.template;

  const copy = document.createElement("button");
  copy.className = "button ghost copy-button dynamic-copy";
  copy.type = "button";
  copy.dataset.copyTarget = template.id;
  copy.textContent = "复制工具模板";
  copy.addEventListener("click", handleCopyClick);

  article.append(top, title, summary, checksTitle, makeList(toolkit.checks), template, copy);
  return article;
}

function renderToolkits() {
  if (!toolkitGrid || !toolkitCount) return;
  toolkitGrid.replaceChildren(...toolkits.map(makeToolkitCard));
  toolkitCount.textContent = `当前显示 ${toolkits.length} 个工具模板`;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.top = "-999px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

async function handleCopyClick(event) {
  const button = event.currentTarget;
  const target = document.querySelector(`#${button.dataset.copyTarget}`);
  if (!target) return;

  const defaultLabel = button.textContent;
  try {
    await copyText(target.textContent.trim());
    button.textContent = "已复制";
  } catch (error) {
    button.textContent = "复制失败";
  }

  window.setTimeout(() => {
    button.textContent = defaultLabel;
  }, 1600);
}

function initKnowledgeBase() {
  if (statTopics) statTopics.textContent = String(topics.length);
  if (statCards) statCards.textContent = String(getKnowledgeItems().length);
  if (statWebPages) statWebPages.textContent = String(webPages.length);
  if (statVerified) statVerified.textContent = lastVerifiedDate;
  if (heroVerified) heroVerified.textContent = `最后核查：${lastVerifiedDate}`;

  if (topicRail) {
    const allButton = document.createElement("button");
    allButton.className = "topic-tab is-active";
    allButton.type = "button";
    allButton.dataset.topic = "all";
    allButton.setAttribute("aria-pressed", "true");
    allButton.innerHTML = `<strong>全部专题</strong><span>${getKnowledgeItems().length} 张卡</span>`;
    allButton.addEventListener("click", () => {
      activeTopic = "all";
      setPressed(document.querySelectorAll(".topic-tab"), allButton);
      renderKnowledge();
    });
    topicRail.replaceChildren(allButton, ...topics.map(makeTopicButton));
  }

  if (tagFilters) {
    const tags = ["all", ...Array.from(new Set(topics.flatMap(topic => topic.tags)))];
    tagFilters.replaceChildren(...tags.map(makeTagButton));
  }

  if (knowledgeSearch) {
    knowledgeSearch.addEventListener("input", event => {
      searchText = event.target.value.trim();
      renderKnowledge();
      renderUnifiedSearch();
    });
  }

  renderKnowledge();
  renderUnifiedSearch();
}

pathButtons.forEach(button => {
  button.addEventListener("click", () => {
    const stepIndex = Number(button.dataset.step || 0);
    setPressed(pathButtons, button);
    updatePath(stepIndex);
  });
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    setPressed(filterButtons, button);
    renderCases(button.dataset.filter || "all");
  });
});

copyButtons.forEach(button => {
  button.addEventListener("click", handleCopyClick);
});

sourceFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeSourceCategory = button.dataset.sourceCategory || "all";
    setPressed(sourceFilterButtons, button);
    renderWebLibrary();
  });
});

renderCases();
initKnowledgeBase();
renderWebLibrary();
renderToolkits();
