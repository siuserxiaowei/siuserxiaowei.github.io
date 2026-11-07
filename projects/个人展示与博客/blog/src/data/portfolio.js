// Public portfolio, checked against the linked work on 2026-11-07.
// Keep claims tied to these public examples; do not infer partnerships or total reach.
export const profile = {
  name: 'siuser小伟',
  role: '中文 AI 实操创作者 · Agent 工作流构建者',
  description: '我是小伟，关注 AI 工具、办公自动化和内容创作。我把亲手跑通的流程写成中文教程，做成工具与动画，记录效果、限制和踩坑，也在探索出海产品与小团队 AI 实践。',
  email: 'hi@siuserxiaowei.com',
  updated: '2026-11-07',
  accounts: [
    { label: 'X / 日常分享', handle: '@_HIT_SZ_', href: 'https://x.com/_HIT_SZ_' },
    { label: 'GitHub / 代码与 Skills', handle: 'siuserxiaowei', href: 'https://github.com/siuserxiaowei' },
    { label: 'B 站 / 视频演示', handle: 'siuser小伟', href: 'https://space.bilibili.com/315989217' },
  ],
};

export const portfolioProjects = [
  {
    id: 'grokguide', title: 'Grok Bot 中文教程', titleEn: 'Grok Bot Field Guide',
    category: '中文教程', status: '公开教程', year: '2026',
    summary: '15 章中文指南，从上手、日常实操到故障排查，附 Routine 指令生成器。',
    contribution: '维护中文教程站与配方库，整理操作步骤和排错经验，保留参考来源。',
    tags: ['中文教程', 'Agent', 'Routine'],
    href: 'https://grokguide.si/', linkLabel: '阅读教程',
    source: 'https://github.com/siuserxiaowei/grokbot-recipes',
    detail: '15 章教程 · 实操与排错', featured: true,
  },
  {
    id: 'taku-guide', title: 'Taku 从上手到交付', titleEn: 'Taku, From Try to Ship',
    category: '产品实测', status: '公开手册与案例', year: '2026',
    summary: '做一个桌面选题整理器，再把 AI 新词雷达变成公开网页。22 章手册记录完整操作。',
    contribution: '亲手体验产品，制作应用与网页，整理 30 张实机截图、验收过程和新手排错方法。',
    tags: ['产品实测', '图文手册', '网页应用'],
    href: 'https://siuserxiaowei.github.io/taku-guide/', linkLabel: '阅读手册',
    article: 'https://x.com/_HIT_SZ_/status/2118274169125142810',
    detail: '22 章手册 · 30 张实机截图', featured: true,
  },
  {
    id: 'cross-platform-top50', title: '跨平台 Top 50 研究 Skill', titleEn: 'Research, With Sources',
    category: 'Agent Skill', status: '公开代码与样例', year: '2026',
    summary: '围绕一个主题收集公开材料，核验来源、去重并输出可追溯的研究结果。',
    contribution: '设计并维护研究流程、证据规则、评分与交付脚本，公开研究样例。',
    tags: ['Agent Skill', '研究工作流', '来源核验'],
    href: 'https://github.com/siuserxiaowei/cross-platform-top50', linkLabel: '查看代码与样例',
    detail: '主题检索 → 来源核验 → 研究结果', featured: true,
  },
  {
    id: 'knowledge-film', title: '用代码做知识动画', titleEn: 'Knowledge in Motion',
    category: '内容创作', status: '已有成片与教程', year: '2026',
    summary: '用代码、旁白和生活意象讲清知识点，做出两条动画，再整理成可复用的制作流程。',
    contribution: '与 AI 协作完成分镜、React / SVG 动画、配音和声画对齐；保留学习改编与上游参考说明。',
    tags: ['Remotion', '知识动画', '语音合成'],
    href: 'https://x.com/_HIT_SZ_/status/2118152851348472138', linkLabel: '看成片与制作过程',
    detail: '128 秒学习改编 · 57 秒换题实践', featured: true,
  },
  {
    id: 'xiaowei-covers', title: '小伟封面 Skill', titleEn: 'Covers With Character',
    category: '视觉工作流', status: '公开代码与图库', year: '2026',
    summary: '从文章与人物素材出发，为视频、图文和社交分享生成适合各个比例的封面。',
    contribution: '定义内容与人物规则，与 AI 协作实现工作流、模板和校验机制，并记录参考来源。',
    tags: ['封面设计', 'Agent Skill', '多尺寸'],
    href: 'https://github.com/siuserxiaowei/generate-xiaowei-covers', linkLabel: '查看 Skill',
    gallery: 'https://github.com/siuserxiaowei/generate-xiaowei-covers/blob/main/docs/gallery.md',
    detail: '公开 Skill · 多比例成品图库', featured: false,
  },
  {
    id: 'ai-term-radar', title: 'AI 新词雷达', titleEn: 'AI Term Radar',
    category: '网页工具', status: '公开体验页', year: '2026',
    summary: '聚合公开平台的 AI 新名称与热度信号，用来源链接和筛选理由辅助选题。',
    contribution: '先用 Codex 制作研究脚本，再用 Taku 将精简版本变成可分享网页。',
    tags: ['选题研究', '公开数据', 'Taku Site'],
    href: 'https://ai-term-radar.taku.site/', linkLabel: '打开体验页',
    article: 'https://x.com/_HIT_SZ_/status/2118274169125142810',
    detail: '公开体验版 · 实时来源可用性会变化', featured: false,
  },
  {
    id: 'herclaw', title: 'HerClaw 龙虾盒子', titleEn: 'HerClaw, Work Comes Back',
    category: '团队参赛项目', status: '赛道铜奖', year: '2026',
    summary: '探索从飞书交办、独立主机执行到办公文件回传的工作流，让任务有可检查的交付。',
    contribution: '参与团队项目并作为参赛代表；项目获“超级龙虾”挑战赛智能办公助手赛道铜奖。',
    tags: ['办公 Agent', '团队项目', '比赛实践'],
    href: 'https://www.aicompetition-pz.com/topic_detail/33', linkLabel: '查看官方获奖记录',
    detail: '智能办公助手赛道 · 决赛第 5 名', featured: false,
  },
];

export const recognition = {
  title: '智能办公助手赛道铜奖',
  project: 'HerClaw 龙虾盒子',
  event: '第五届琶洲算法大赛「超级龙虾」挑战赛',
  result: '智能办公助手赛道 · 决赛第 5 名',
  contribution: '团队项目 · 本人为官方名单所列参赛代表',
  href: 'https://www.aicompetition-pz.com/topic_detail/33',
};

export const tutorials = [
  { title: 'Taku：做出一个桌面工具和公开网页', category: '产品实测 · 图文', description: '从第一次打开产品，到验收、费用观察与网页交付。', href: 'https://x.com/_HIT_SZ_/status/2118274169125142810' },
  { title: '用代码制作两条知识动画', category: '制作复盘 · 成片', description: '分镜、配音、时间轴与换题复用，包含实际踩坑。', href: 'https://x.com/_HIT_SZ_/status/2118152851348472138' },
  { title: '60 秒学会创建 Skill', category: 'B 站 · 1 分钟', description: '用每周周报举例，把重复流程变成可复用的说明。', href: 'https://www.bilibili.com/video/BV1hxhU6BE1o' },
  { title: '教师教案生成 PPT：全流程解析', category: 'B 站 · 2 分钟', description: '把题目和解析做成课件，再核对原题与答案。', href: 'https://www.bilibili.com/video/BV1WrhU6tEXw' },
];
