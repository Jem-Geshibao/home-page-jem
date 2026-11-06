// BorderGlow 的 mesh 三色：冷白 / 雾蓝灰，沿用站点白色主色。
// 作品卡与作品集里的视频卡共用，避免两处各调各的色。
export const glowColors = ['#F2F7FA', '#A7BAC6', '#5B6D79']

export const profile = {
  name: '杰姆盖世保',
  latin: 'JEM GESHIBAO',
  roles: ['CS 游戏博主', 'AI 视频创作者', '短视频内容策划与运营'],
  location: '深圳 · 中国',
  // 开源版已脱敏：电话与邮箱是占位内容，请替换成你自己的。
  phone: '13800000000',
  email: 'hello@example.com',
  github: 'https://github.com/Jem-Geshibao',
  education: '武汉职业技术大学 · 计算机应用技术',
  educationPeriod: '2022.09 — 2025.06',
  intro:
    '计算机应用技术专业背景，把「游戏内容」和「AI 生成」放进同一条工作流里。从剧本拆解、分镜提示词、多平台视频生成，到剪辑包装、账号运营与数据复盘，能独立跑完一支片子的全流程。熟悉 Codex、WorkBuddy、TRAE 等 Agent 的部署与 Skill 开发，也懂玩家真正在看什么。',
  introSub:
    '曾为《迷你枪战精英》官方账号制作短视频及 AI 视频内容，参与生态号从 0 到 1 起号；现以自由职业形式承接游戏类商业合作与视频剪辑订单。',
}

export const stats = [
  { value: '30W', suffix: '+', label: '平台累计获赞', note: 'TOTAL LIKES' },
  { value: '80W', suffix: '+', label: '单条视频最高播放', note: 'TOP SINGLE VIEW' },
  { value: '1.5W', suffix: '', label: '快手账号粉丝', note: 'KUAISHOU' },
  { value: '4000', suffix: '+', label: '生态号累计涨粉', note: '3 ACCOUNTS' },
]

export const timeline = [
  {
    period: 'NOW',
    title: '自由职业者',
    sub: '游戏内容制作 / 视频剪辑 / 电脑装机维修',
    desc: '承接游戏类商业合作与剪辑订单，独立完成素材整理、剪辑制作与后期包装并交付成片。',
    current: true,
  },
  {
    period: '2025.03 — 07',
    title: '云南尚顶娱乐有限公司',
    sub: '短视频剪辑运营 · 实习',
    desc: '负责宣传短视频策划、拍摄、剪辑与数据分析；用抖音后台监测播放与互动，协助账号月活增长 10%。',
  },
  {
    period: '2022 — 2025',
    title: '校融媒体中心 / 启明工作室',
    sub: '干事 · 成员',
    desc: '运营抖音、快手、公众号、视频号，策划剪辑 50+ 条 Vlog，累计获赞 10 万+；参与 Spring Boot + Vue 项目开发。',
  },
]

export const projects = [
  {
    id: '01',
    title: '《迷你枪战精英》官方代运营',
    en: 'MINI MILITIA · OFFICIAL CONTENT OPS',
    category: 'GAME CONTENT / AI VIDEO',
    year: '2025',
    variant: 'arena',
    span: 'wide',
    cover: '/covers/miqiang.webp',
    coverPosition: '50% 50%',
    coverAlt: '《迷你枪战精英》全民萌攻赛官方主视觉',
    desc: '为官方账号制作短视频与 AI 视频：用 Agent 调用短剧 / 漫剧 Skill 生成剧本拆解与分镜提示词，整理人物场景资产，在多平台完成视频生成与镜头迭代，并参与 3 个生态号起号与直播运营。',
    metrics: ['80W+ 最高播放', '1000+ 直播场观', '4000+ 累计涨粉'],
    tags: ['AI 视频', '剧本 / 分镜', '生态号运营', '直播'],
    link: null,
    // 站内作品集：?work=mini-militia 打开全屏面板，不占用锚点、可直接分享。
    // videos 为空 = 面板显示「片单索取」空态，不会生成假链接。
    // 每条格式：{ title, hashtags, platform, cover, filter, url }；date / views 未提供就不显示。
    // 注意：抖音分享口令末尾的「10/29 / 02/21 ...」是口令标记，不一定是发布日期，故未当作 date 录入。
    work: 'mini-militia',
    gallery: {
      roles: ['剧本拆解', '分镜提示词', 'AI 视频生成与镜头迭代', '生态号起号与直播运营'],
      videos: [
        {
          title: '这么可爱的萨满，你想养一只吗？',
          hashtags: ['#迷你枪战精英', '#迷枪全民萌攻赛'],
          platform: 'DOUYIN · 官方账号',
          cover: '/covers/gallery/miqiang-01.jpg',
          filter: 'saturate(.78) brightness(.78) contrast(1.04)',
          url: 'https://v.douyin.com/BvE4qeDpMgk/',
        },
        {
          title: '帝皇降临！铠甲勇士系列礼包王者归来！',
          hashtags: ['#迷你枪战精英', '#铠甲勇士', '#迷枪暑期大作'],
          platform: 'DOUYIN · 官方账号',
          cover: '/covers/gallery/miqiang-02.jpg',
          filter: 'saturate(.76) brightness(.72) contrast(1.05)',
          url: 'https://v.douyin.com/1aBt5ru7ick/',
        },
        {
          title: '第一集 光头强的摸金发财梦！',
          hashtags: ['#迷你枪战精英', '#迷枪暑期大作战', '#熊出没', '#迷枪龙之遗迹'],
          platform: 'DOUYIN · 官方账号',
          cover: '/covers/gallery/miqiang-03.jpg',
          filter: 'saturate(.80) brightness(.76) contrast(1.03)',
          url: 'https://v.douyin.com/mirap_V8eUc/',
        },
        {
          title: '队长千万撤离结算的正确打开方式',
          hashtags: ['#迷你枪战精英', '#迷枪暑期大作战', '#迷枪龙之遗迹'],
          platform: 'DOUYIN · 官方账号',
          cover: '/covers/gallery/miqiang-04.jpg',
          filter: 'saturate(.80) brightness(.78) contrast(1.03)',
          url: 'https://v.douyin.com/bfHOaC1Bmb0/',
        },
        {
          title: '一滴一滴刺痛我的心~ 当队长迷境夺金千万撤离~',
          hashtags: ['#迷你枪战精英', '#迷枪龙之遗迹', '#迷枪暑期大作战', '#梦的翅膀受了伤'],
          platform: 'DOUYIN · 官方账号',
          cover: '/covers/gallery/miqiang-05.jpg',
          filter: 'saturate(.78) brightness(.74) contrast(1.04)',
          url: 'https://v.douyin.com/JLZn4VUqQQ4/',
        },
      ],
      note: '以上 5 条作品已在《迷你枪战精英》官方抖音账号发布，点击卡片跳转官方原片。',
    },
  },
  {
    id: '02',
    title: 'AI_Drama_Skill',
    en: 'AI SHORT DRAMA WORKFLOW',
    category: 'OPEN SOURCE / AGENT SKILL',
    year: '2025',
    variant: 'drama',
    span: 'narrow',
    cover: '/covers/ai-drama-skill.jpg',
    coverPosition: '50% 32%',
    coverAlt: 'AI_Drama_Skill 古风短剧人像视觉',
    desc: '独立制作的模块化中文 Skill 工作流，覆盖创意开发、剧本分析改编、角色 / 场景 / 道具资产设计、分镜规划与视频拉片，强调视觉连续性与质量检查。',
    metrics: ['GitHub 开源'],
    tags: ['Skill 开发', '分镜规划', '视觉连续性'],
    link: 'https://github.com/Jem-Geshibao/AI_Drama_Skill.git',
  },
  {
    id: '03',
    title: 'cs-cast-subtitle',
    en: 'CS CAST BILINGUAL SUBTITLE',
    category: 'OPEN SOURCE / CS2',
    year: '2025',
    variant: 'cast',
    span: 'narrow',
    cover: '/covers/cs2.jpg',
    coverPosition: '50% 50%',
    coverAlt: 'CS2 干员阵容官方宣传图',
    desc: 'CS:GO / CS2 职业解说英中对照 SRT 字幕工作流与 Python 脚本：分段语音转写、漏段检测补录、赛事术语校正、字幕生成与质量校验，可部署至 WorkBuddy、Claude Code。',
    metrics: ['双语字幕', '术语校正'],
    tags: ['CS2', 'ASR', 'Python'],
    link: 'https://github.com/Jem-Geshibao/cs-cast-subtitle.git',
  },
  {
    id: '04',
    title: 'Beanbag-download',
    en: 'NO-WATERMARK IMAGE DOWNLOADER',
    category: 'TOOL / CHROMIUM EXTENSION',
    year: '2025',
    variant: 'beanbag',
    span: 'wide',
    cover: '/covers/doubao.jpg',
    coverPosition: '50% 22%',
    coverAlt: '豆包图片下载助手视觉',
    desc: '基于 Chromium 扩展机制与 JSZip 开发的豆包图片下载助手：自动检测 AI 生成图片并提取无水印原图地址，支持单张下载、批量选择与 ZIP 打包。把重复劳动交给他自己写的工具。',
    metrics: ['单张 / 批量', 'ZIP 打包'],
    tags: ['浏览器扩展', 'JSZip', '效率工具'],
    link: 'https://github.com/Jem-Geshibao/Beanbag-download.git',
  },
]

export const capabilities = [
  {
    id: '01',
    key: 'AI VIDEO',
    title: 'AI 视频创作',
    desc: '用 Agent 辅助完成剧本拆解、分镜提示词与制作规范；熟悉小云雀、RunningHub、LibTV、ShotLab、NexAI、Pavo 等平台，可独立完成视频生成与镜头迭代。',
    tags: ['剧本拆解', '分镜提示词', '多平台生成'],
    visual: 'frames',
    size: 'feature',
  },
  {
    id: '02',
    key: 'POST',
    title: '后期剪辑与合成',
    desc: '熟练使用剪映，具备 AE 合成、字幕、音效、特效及视频包装能力。',
    tags: ['剪映', 'AE', '视频包装'],
    visual: 'timeline',
    size: 'normal',
  },
  {
    id: '03',
    key: 'AGENT',
    title: 'Agent × Skill 工程化',
    desc: '熟悉 Codex、WorkBuddy、TRAE 等 Agent 配置与部署，能开发、安装、调用自定义 Skill。',
    tags: ['Codex', 'WorkBuddy', 'TRAE'],
    visual: 'nodes',
    size: 'normal',
  },
  {
    id: '04',
    key: 'OPERATION',
    title: '内容策划与运营',
    desc: '短视频策划、热点追踪、账号数据分析与多平台内容适配，覆盖从选题到复盘的完整链路。',
    tags: ['选题', '数据复盘', '多平台适配'],
    visual: 'rings',
    size: 'normal',
  },
  {
    id: '05',
    key: 'GAME',
    title: '游戏内容理解',
    desc: '深耕 CS:GO / CS2 赛事语境与玩家社区，懂解说术语、懂高光节奏，更懂什么值得被剪出来。',
    tags: ['CS2', '赛事解说', '社区语境'],
    visual: 'crosshair',
    size: 'normal',
  },
  {
    id: '06',
    key: 'GROWTH',
    title: '数据驱动增长',
    desc: '用抖音后台监测播放量、互动率与转化表现，结合用户画像与 SEO 思路优化选题，把「感觉」变成可复用的方法。',
    tags: ['播放 / 互动', '用户画像', 'SEO'],
    visual: 'growth',
    size: 'feature',
  },
]

export const navItems = [
  { id: 'home', label: '首页', index: '01' },
  { id: 'about', label: '关于', index: '02' },
  { id: 'work', label: '作品', index: '03' },
  { id: 'capabilities', label: '优势', index: '04' },
  { id: 'contact', label: '联系', index: '05' },
]
