const progress = document.querySelector('#reading-progress');
const sections = [...document.querySelectorAll('[data-section]')];
const navLinks = [...document.querySelectorAll('[data-nav]')];
const toast = document.querySelector('#toast');

function updateScrollState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
  const marker = window.scrollY + 170;
  let current = '';
  sections.forEach((section) => { if (section.offsetTop <= marker) current = section.dataset.section; });
  navLinks.forEach((link) => link.classList.toggle('active', link.dataset.nav === current));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1700);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板');
  } catch (_) {
    showToast('复制失败，请手动选择');
  }
}

document.querySelector('#print-page').addEventListener('click', () => window.print());
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const funnelInputs = {
  reach: document.querySelector('#reach'),
  visit: document.querySelector('#visit'),
  activate: document.querySelector('#activate'),
  commit: document.querySelector('#commit'),
  return: document.querySelector('#return')
};

const advice = {
  visit: ['曝光 → 进入', '先检查内容是否讲清了具体场景、产品身份和下一步入口；不要先扩大曝光。'],
  activate: ['进入 → 激活', '旁观 5 位陌生用户首次体验：他们是否理解要做什么、输入是否过重、结果是否来得太慢？'],
  commit: ['分享/付费承诺', '先访谈已激活却没有分享或付费的人：结果不值得展示、时机不对，还是价值不足？'],
  return: ['合理周期复访', '区分“没有回来入口”和“没有回来理由”；先定义这个场景真正合理的复访周期。']
};

function safeRate(child, parent) {
  if (parent <= 0) return 0;
  return Math.max(0, (child / parent) * 100);
}

function updateFunnel() {
  const values = Object.fromEntries(Object.entries(funnelInputs).map(([key, input]) => [key, Math.max(0, Number(input.value) || 0)]));
  const rates = {
    visit: safeRate(values.visit, values.reach),
    activate: safeRate(values.activate, values.visit),
    commit: safeRate(values.commit, values.activate),
    return: safeRate(values.return, values.activate)
  };
  document.querySelector('#rate-visit').textContent = `${rates.visit.toFixed(1)}%`;
  document.querySelector('#rate-activate').textContent = `${rates.activate.toFixed(1)}%`;
  document.querySelector('#rate-commit').textContent = `${rates.commit.toFixed(1)}%`;
  document.querySelector('#rate-return').textContent = `${rates.return.toFixed(1)}%`;
  const weakest = Object.entries(rates).sort((a, b) => a[1] - b[1])[0][0];
  document.querySelector('#weakest-stage').textContent = advice[weakest][0];
  document.querySelector('#weakest-advice').textContent = advice[weakest][1];
}

Object.values(funnelInputs).forEach((input) => input.addEventListener('input', updateFunnel));
updateFunnel();

const playbooks = {
  network: [
    ['第一批去哪里找', '一个垂直活动 + 一个专业社区；优先目标用户浓度，不优先总流量。'],
    ['先验证什么', '同一细分圈层内能否连续完成有效匹配，双方是否回复。'],
    ['核心指标', '有效匹配率、回复率、第二次发布需求。'],
    ['暂时不要做', '跨人群扩张、泛 KOL 投放、只追注册数。']
  ],
  emotional: [
    ['第一批去哪里找', '正在发生具体人生事件的人：搬家、毕业、纪念日、照护长辈等场景。'],
    ['先验证什么', '用户是否愿意完成高输入任务，结果是否让他觉得“这就是我”。'],
    ['核心指标', '完整完成率、首次价值时间、结果保存/家人分享、30 天再记录。'],
    ['暂时不要做', '泛问卷、泛内容播放量、用次日留存评价低频需求。']
  ],
  trust: [
    ['第一批去哪里找', '创始人可直接服务的高意向名单、专业体验活动、可信转介绍。'],
    ['先验证什么', '用户看到真实价格和交付条件后是否继续；问题发生时能否被可靠解决。'],
    ['核心指标', '深度咨询率、试用到购买、售后响应、主动转介绍。'],
    ['暂时不要做', '福利大群、隐瞒价格、大规模承诺后再补交付能力。']
  ],
  utility: [
    ['第一批去哪里找', '旧办法高频发生的工作流现场；最好能旁观用户真实操作。'],
    ['先验证什么', '是否明显减少步骤/时间，用户是否在下一周期自然复用。'],
    ['核心指标', '首次价值时间、任务成功率、D1/D7 核心行为、旧方案替代率。'],
    ['暂时不要做', '功能大而全、非核心社交、在没有复用前追求分享裂变。']
  ]
};

const playbookNode = document.querySelector('#playbook');
document.querySelectorAll('[data-playbook]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-playbook]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    playbookNode.innerHTML = playbooks[button.dataset.playbook].map(([title, body]) => `<div><span>${title}</span><p>${body}</p></div>`).join('');
  });
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', () => {
    const node = document.querySelector(button.dataset.copy);
    copyText(node.innerText.trim());
  });
});

document.querySelectorAll('[data-copy-text]').forEach((button) => {
  button.addEventListener('click', () => copyText(button.dataset.copyText));
});

const taskInputs = [...document.querySelectorAll('[data-task]')];
const taskCount = document.querySelector('#task-count');
const taskBar = document.querySelector('#task-progress-bar');
function updateTasks() {
  const checked = taskInputs.filter((input) => input.checked).length;
  taskCount.textContent = `${checked} / ${taskInputs.length} 完成`;
  taskBar.style.width = `${(checked / taskInputs.length) * 100}%`;
  const state = Object.fromEntries(taskInputs.map((input) => [input.dataset.task, input.checked]));
  try { localStorage.setItem('workshop-course-plan-v2', JSON.stringify(state)); } catch (_) {}
}
try {
  const saved = JSON.parse(localStorage.getItem('workshop-course-plan-v2') || '{}');
  taskInputs.forEach((input) => { input.checked = Boolean(saved[input.dataset.task]); });
} catch (_) {}
taskInputs.forEach((input) => input.addEventListener('change', updateTasks));
updateTasks();

const planText = `微信小程序冷启动｜14 天最小证据计划

□ Day 1–2：写清一个用户、一个触发时刻、一种旧办法；找 3 个最近真实经历过的人。
□ Day 3–4：不用完整产品，手工为 3 人交付最终结果；记录输入、等待和异议。
□ Day 5–7：发布一篇场景招募帖；通过一个有成本的动作筛选 10 位目标用户。
□ Day 8–10：旁观 5 位陌生用户独立体验，定位 Aha 和第一次价值时间。
□ Day 11–12：把结果封装为可保存、可展示、带明确回流入口的传播物。
□ Day 13–14：只看激活、复访、主动推荐/付费和重复反馈，做 Go / Pivot / Stop 决策。

原则：投放用于复制已验证链路，不用于替代验证。`;
document.querySelector('#copy-plan').addEventListener('click', () => copyText(planText));

document.querySelectorAll('[data-quiz] button').forEach((button) => {
  button.addEventListener('click', () => {
    const article = button.closest('[data-quiz]');
    article.querySelectorAll('button').forEach((item) => item.classList.remove('selected', 'correct', 'wrong'));
    button.classList.add('selected', button.dataset.answer);
    article.classList.add('answered');
  });
});
