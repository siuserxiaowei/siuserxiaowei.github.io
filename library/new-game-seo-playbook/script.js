const progressBar = document.querySelector("#progressBar");
const tocToggle = document.querySelector("#tocToggle");
const mobileToc = document.querySelector("#mobileToc");

const templates = {
  discovery: `游戏 / 词：
发现渠道：SteamDB / YouTube / 其他
发现时间：
事件节点：宣发 / 上线 / 更新
目标地区：
第一眼需求：
原始链接：`,
  page: `目标查询：
玩家此刻要完成：
首屏立即给出：
比现有结果多提供：
证据 / 更新时间：
下一相关任务：
不该出现的填充内容：`,
  review: `收录页 / 提交页：
曝光最高查询：
增长页 / 下滑页：
意外的新需求：
最强正反馈：
最强反证：
决策：加码 / 改向 / 停止
下次检查日：`,
};

if (!(window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.webdriver)) {
  document.documentElement.classList.add("motion-ready");
}

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

tocToggle?.addEventListener("click", () => {
  const isOpen = tocToggle.getAttribute("aria-expanded") === "true";
  tocToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileToc.hidden = isOpen;
});

mobileToc?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    mobileToc.hidden = true;
    tocToggle.setAttribute("aria-expanded", "false");
  }
});

const reveals = document.querySelectorAll(".reveal");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  reveals.forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px" });
  reveals.forEach((element) => observer.observe(element));
}

const ranges = [...document.querySelectorAll('.score-item input[type="range"]')];
const scoreValue = document.querySelector("#scoreValue");
const scoreMeter = document.querySelector("#scoreMeter");
const scoreVerdict = document.querySelector("#scoreVerdict");
const scoreAdvice = document.querySelector("#scoreAdvice");

function updateScore() {
  const total = ranges.reduce((sum, range) => sum + Number(range.value), 0);
  ranges.forEach((range) => { range.nextElementSibling.value = range.value; });
  scoreValue.textContent = total;
  scoreMeter.style.width = `${(total / 30) * 100}%`;

  if (total >= 22) {
    scoreVerdict.textContent = "Go：限时上线";
    scoreAdvice.textContent = "证据足以支持一次小成本实验。设定预算、7/14/28 天检查点和明确停止条件。";
  } else if (total >= 15) {
    scoreVerdict.textContent = "先补证据";
    scoreAdvice.textContent = "暂时不要因热度直接买域名。先强化最低分项，再做一轮 Go / No-go。";
  } else {
    scoreVerdict.textContent = "No-go：换候选";
    scoreAdvice.textContent = "当前短板太多。保留记录，换一个候选通常比勉强开发更省时间。";
  }
}

ranges.forEach((range) => range.addEventListener("input", updateScore));
updateScore();

document.querySelector("#printCard")?.addEventListener("click", () => window.print());

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(templates[button.dataset.template]);
      button.textContent = "已复制 ✓";
    } catch {
      button.textContent = "复制失败，请手动选择";
    }
    window.setTimeout(() => { button.textContent = original; }, 1800);
  });
});

const qaSearch = document.querySelector("#qaSearch");
const qaFilters = [...document.querySelectorAll(".qa-filter")];
const qaItems = [...document.querySelectorAll(".qa-item")];
const qaGroups = [...document.querySelectorAll(".qa-group")];
const qaCount = document.querySelector("#qaCount");
const qaEmpty = document.querySelector("#qaEmpty");
let activeQaFilter = "all";

function updateQa() {
  const query = qaSearch?.value.trim().toLocaleLowerCase("zh-CN") || "";
  let visibleCount = 0;

  qaItems.forEach((item) => {
    const matchesFilter = activeQaFilter === "all" || item.dataset.cat === activeQaFilter;
    const matchesSearch = !query || item.textContent.toLocaleLowerCase("zh-CN").includes(query);
    item.hidden = !(matchesFilter && matchesSearch);
    if (!item.hidden) visibleCount += 1;
  });

  qaGroups.forEach((group) => {
    group.hidden = ![...group.querySelectorAll(".qa-item")].some((item) => !item.hidden);
  });

  if (qaCount) qaCount.textContent = `当前显示 ${visibleCount} / ${qaItems.length} 条有效答疑`;
  if (qaEmpty) qaEmpty.hidden = visibleCount !== 0;
}

qaSearch?.addEventListener("input", updateQa);
qaFilters.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    activeQaFilter = button.dataset.filter;
    qaFilters.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    updateQa();
  });
});
updateQa();
