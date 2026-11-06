# 杰姆盖世保 · 个人作品集

**在线访问**：<https://jemgeshibao.gicp.fun>（花生壳 Drop 静态托管，国内直连）

> 一个偏「编辑部 / 科技感」的暗色个人作品集站点：React + Vite 构建，GSAP 驱动开场与滚动动效，作品集用 Canvas 2D 轮播承载，WebGL 背景可选接入。

面向 **CS 游戏内容 / AI 视频创作 / 短视频策划运营** 方向的创作者简历站，把「项目、数据、经历、作品链接」压在一个长滚动页面里，作品详情通过全屏面板打开，不跳站、不刷新。

> **这是合规开源版。** 仓库内不包含任何 React Bits 组件源码：`PatternWaves`、`MicroSlats`、`BorderGlow`、`StarBorder` 四个文件都是**同 props、同 DOM 结构的自研占位实现**，clone 下来即可运行，但背景与边框的正式视觉效果需要你按 [动效组件获取](#动效组件获取) 一节自行安装。原因见 [第三方资源与授权](#第三方资源与授权)。

<!-- 建议补一张 1440×900 的首页截图，放在 docs/preview.png 后取消下一行注释 -->
<!-- ![首页预览](docs/preview.png) -->

---

## 特性

- **电影感开场** — 000→100 计数、字标遮罩揭开、三块幕布错开上移，落幕后 Hero 标题接着进场，两段动效严格咬合（`Intro` 在 1.74s 派发 `intro:done`）
- **滚动叙事** — 大标题遮罩揭幕、位移压缩归位、卡片 stagger、封面裁切揭示与视差，全部走 GSAP + ScrollTrigger
- **全站背景层** — 固定在 `z-index: 0` 铺满视口，Hero 不透明且层级更高，因此首屏视频不被遮挡，往下滚才逐渐透出背景
- **作品集全屏面板** — `?work=<slug>` 深链驱动，Portal 到 `body`，背景独立成层并带压暗 veil
- **Prism Carousel** — Canvas 2D coverflow，静止去色、切换时「光谱扫色」逐张揭示，支持拖拽惯性、滚轮、键盘、自动播放（完全自研，不依赖第三方组件）
- **卡片交互** — 作品卡悬停边框提亮 + 跟随光斑；优势卡流光沿边框滑行
- **降级与无障碍** — 尊重 `prefers-reduced-motion`，无头 / 软渲染环境用真实时钟推进动画，不会「亮了但不动」
- **零后端** — 纯静态产物，一个 `dist/` 丢到任意静态托管即可

## 技术栈

| 分类 | 选型 |
| --- | --- |
| 框架 | React 18 + Vite 6（JS，非 TS） |
| 动效 | GSAP 3 + ScrollTrigger |
| WebGL（可选） | ogl —— 仅正式版背景组件需要；本仓库占位实现为纯 CSS，不依赖 ogl |
| 2D 渲染 | Canvas 2D（Hero 尘点柔光、`PrismCarousel`、能力卡插画） |
| 样式 | 原生 CSS（变量 + BEM 命名，无 Tailwind / CSS-in-JS） |
| 字体 | Google Fonts：Space Grotesk + IBM Plex Mono |
| 测试辅助 | 无单测 |

## 快速开始

要求 **Node.js ≥ 18**（推荐 20 LTS）。

```bash
# 安装依赖
npm install

# 本地开发，默认 http://localhost:5173
npm run dev

# 生产构建，产物在 dist/
npm run build

# 预览构建产物
npm run preview
```

无需后端、无需数据库、无需任何密钥即可完整运行。

## 目录结构

```
.
├── index.html                 # 入口 HTML，字体预连接与 Google Fonts 声明
├── vite.config.js             # Vite 配置（@ -> src 别名）
├── LICENSE                    # MIT（代码）+ 内容素材保留所有权利
├── public/
│   ├── avatar.jpg             # 头像
│   ├── shanghaimajor.mp4      # Hero 主视频（压缩版，7.2MB）
│   ├── hero.mp4               # 备用视频（编码不支持时回退）
│   ├── hero-poster.jpg        # 视频海报，首帧兜底
│   └── covers/                # 作品封面 + 作品集内视频封面
└── src/
    ├── data.js                # ★ 全站内容源：资料 / 数据 / 经历 / 项目 / 能力 / 导航
    ├── styles.css             # 全局样式、设计变量、各区块布局
    ├── App.jsx                # 页面骨架与滚动动效初始化
    ├── main.jsx               # React 挂载入口
    ├── anim/
    │   ├── motion.js          # gsap 实例、缓动常量、开场完成事件总线
    │   └── scroll.js          # ScrollTrigger 驱动的滚动动效集合
    ├── utils/
    │   └── dom.js             # 站内平滑滚动 / 回到顶部小工具
    └── components/
        ├── Intro.jsx          # 开场遮罩动画
        ├── Nav.jsx            # 顶部导航（滚动收缩、锚点高亮、移动端菜单）
        ├── Hero.jsx           # 首屏：视频、标题揭幕、尘点 / 柔光 Canvas
        ├── Marquee.jsx        # 关键词无限滚动条
        ├── About.jsx          # 02 个人经历
        ├── Projects.jsx       # 03 作品列表（点击打开面板 / 外链）
        ├── WorkGallery.jsx    # 作品集全屏面板（Portal）
        ├── PrismCarousel.jsx  # 作品集轮播（自研 Canvas 2D）
        ├── Strengths.jsx      # 04 个人优势
        ├── Contact.jsx        # 05 联系方式
        ├── SectionHead.jsx    # 区块标题组件（编号 / 英文名 / 遮罩动效）
        ├── ProjectVisual.jsx  # 无封面时的 SVG 场景插画
        ├── CapabilityVisual.jsx # 能力卡动态插画
        ├── PatternWaves.jsx   # 全站背景 —— 占位实现（可替换为正式组件）
        ├── MicroSlats.jsx     # 面板背景 —— 占位实现（可替换为正式组件）
        ├── BorderGlow.jsx     # 卡片边框辉光 —— 占位实现（可替换为正式组件）
        ├── StarBorder.jsx     # 卡片流光边框 —— 占位实现（可替换为正式组件）
        ├── WavesBackdrop.jsx  # 背景组件的全站封装层
        ├── GalleryBackdrop.jsx# 背景组件的面板封装层
        └── ScrollProgress.jsx # 顶部滚动进度条
```

## 内容维护

**改文案、加项目、换封面，只需要动 `src/data.js`**，组件里没有硬编码的业务文案。

| 导出 | 作用 |
| --- | --- |
| `profile` | 姓名、头衔、地点、电话、邮箱、GitHub、教育背景、自我介绍 |
| `stats` | 关于区四个数字（值 / 后缀 / 说明） |
| `timeline` | 经历时间线，`current: true` 会点亮呼吸点 |
| `projects` | 作品列表：封面、描述、标签、指标、外链或站内作品集 |
| `capabilities` | 优势卡：标题、描述、标签、插画类型、尺寸（`feature` 占两列） |
| `navItems` | 导航项与编号 |
| `glowColors` | 边框辉光的三色配置，作品卡共用 |

> 开源版里 `profile.phone` / `profile.email` 已是占位值（`13800000000` / `hello@example.com`），改成你自己的即可。

### 新增一个作品

```js
{
  id: '06',
  title: '项目名',
  en: 'PROJECT · EN NAME',
  category: 'GAME CONTENT / AI VIDEO',
  year: '2026',
  variant: 'arena',        // SVG 兜底插画：arena / drama / cast / beanbag
  span: 'wide',            // wide 占两列，narrow 占一列
  cover: '/covers/xxx.jpg',// 放进 public/covers/
  coverAlt: '封面描述',
  desc: '项目描述',
  metrics: ['80W+ 播放', '4000+ 涨粉'],
  tags: ['AI 视频', '分镜'],
  link: null,              // 外链；与 work 二选一
  work: 'my-project',      // 站内作品集 slug，访问 ?work=my-project 直接打开
  gallery: {
    roles: ['剧本拆解', '分镜提示词'],
    videos: [
      {
        title: '视频标题',
        hashtags: ['#话题'],
        platform: 'DOUYIN · 官方账号',
        cover: '/covers/gallery/xxx.jpg',
        url: 'https://...',
        // date / views 可选，不填就不显示
      },
    ],
  },
}
```

- `work` 存在 → 卡片箭头指向站内，点击打开全屏面板；`link` 存在 → 新标签打开外链；都没有 → 滚到「联系」区
- `gallery.videos` 为空数组时，面板显示「片单索取」空态，**不会生成任何假链接**
- 封面建议 3:4 竖版（1080×1440），`PrismCarousel` 按 `object-fit: cover` 裁切

## 动效组件获取

下面四个文件都是占位实现，视觉上「能用但不是最终效果」。想要原版观感，按下表去 [reactbits.dev](https://reactbits.dev) 下载 **JavaScript + CSS** 变体，直接覆盖同名文件即可——props 名称、CSS 变量、内部 DOM 结构都对齐了，`WavesBackdrop` / `GalleryBackdrop` / `Projects` / `Strengths` 一行都不用改。

| 组件 | 获取地址 | 覆盖文件 | 影响区域 |
| --- | --- | --- | --- |
| PatternWaves | <https://reactbits.dev/backgrounds/pattern-waves> | `src/components/PatternWaves.jsx` `.css` | 全站背景 |
| MicroSlats | <https://reactbits.dev/backgrounds/micro-slats> | `src/components/MicroSlats.jsx` `.css` | 作品集面板背景 |
| BorderGlow | <https://reactbits.dev/components/border-glow> | `src/components/BorderGlow.jsx` `.css` | 作品卡边框辉光 |
| StarBorder | <https://reactbits.dev/components/star-border> | `src/components/StarBorder.jsx` `.css` | 优势卡流光边框 |

安装正式版后记得 `npm install ogl`（两个 WebGL 背景组件依赖它；占位实现是纯 CSS，不需要）。

若使用 React Bits Pro 的私有 registry，复制 `.env.example` 为 `.env.local` 并填入密钥：

```bash
# .env.local（已在 .gitignore 中，请勿提交）
REACTBITS_LICENSE_KEY=your_key_here
```

`components.json` 里 `@reactbits-starter` / `@reactbits-pro` 通过 `${REACTBITS_LICENSE_KEY}` 注入 `Authorization` 头；没有密钥时 CLI 会返回 401，这是预期行为。

## 动效系统

三层职责，互不越界：

1. **`anim/motion.js`** — 全局 `gsap` 实例、缓动常量（`expo.out` / `expo.inOut` / `power3.out`）、`prefersReducedMotion()`、`shouldSkipIntro()`、`whenIntroDone()` 事件总线。所有动画共用一套缓动，保证「慢、稳、不弹」。
2. **`anim/scroll.js`** — 所有 ScrollTrigger 在这里注册，入场动画一律 `once: true`，只有封面视差用 `scrub`，避免长列表堆满逐帧回调。
3. **组件内部** — 只处理自身生命周期相关的动画（开场时间轴、轮播 tween），统一返回 `ctx.revert()` 清理，兼容 StrictMode 双挂载。

**跳开场的两个入口**：`?work=<slug>` 直达作品面板，或系统开启「减弱动态效果」——都走 `shouldSkipIntro()`，直接进入内容态。

**低帧率兼容**：软件渲染（SwiftShader）下 rAF 可能只有 4fps。周期性动画一律用**真实时钟**推进相位，而不是累加 `dt`，否则会出现「星星亮了但不动」的假死状态。

## 部署

纯静态站点，`npm run build` 后把 `dist/` 发布到任意静态托管即可：

| 平台 | 构建命令 | 输出目录 | 国内访问 |
| --- | --- | --- | --- |
| 花生壳 Drop（本站在用） | `npm run build` | `dist` 打 zip 拖拽上传 | ✅ 备案国内节点，微信直开 |
| Vercel | `npm run build` | `dist` | ❌ 默认域名国内不可达 |
| Netlify | `npm run build` | `dist` | ⚠️ 波动较大 |
| Cloudflare Pages | `npm run build` | `dist` | ⚠️ 尚可 |
| GitHub Pages / 对象存储 | 本地构建后上传 `dist/` | — | ⚠️ 较慢 / 需备案 |

站点没有前端路由，只有 `?work=<slug>` 查询参数，**不需要配置 SPA fallback rewrite**。

> 若部署在子路径（如 `https://user.github.io/repo/`），需在 `vite.config.js` 里设置 `base: '/repo/'`，否则 `public/` 下的资源会 404。

## 浏览器兼容

- 需要 Canvas 2D；接入正式版 WebGL 背景组件后才需要 WebGL（不可用时背景层静默缺失，功能不受影响）
- 占位组件用到 `color-mix()` 与 `mask-composite`：Chrome 111+ / Safari 16.2+ / Firefox 113+。更老的浏览器会丢失点阵颜色与描边裁切，不影响布局
- 移动端已做基础适配（断点 `1400` / `1120` / `720`：侧栏收窄、导航折叠为下拉菜单、边距与字号压缩），但站点以 PC 宽屏为主要场景，版心 1700px

## 第三方资源与授权

### 字体

| 字体 | 用途 | 授权 | 商用 |
| --- | --- | --- | --- |
| [Space Grotesk](https://github.com/floriankarsten/space-grotesk) | 正文 / 标题 | SIL Open Font License 1.1 | ✅ 免费商用，无需署名 |
| [IBM Plex Mono](https://github.com/IBM/plex) | 等宽小字 / 编号 | SIL OFL 1.1 + Apache-2.0 双授权 | ✅ 免费商用，无需署名 |

中文字体使用系统字体栈（`PingFang SC` → `Microsoft YaHei` → `Noto Sans CJK SC`），不打包、不分发字体文件。

### 为什么本仓库不含 React Bits 源码

[React Bits](https://reactbits.dev) 免费库采用 **MIT + Commons Clause**：可以用于任意个人 / 商业项目（含客户项目），但**不得单独售卖、再授权或二次分发组件本身**。

公开发布包含其源码的仓库属于再分发，因此本仓库改为：

- 删除四个组件的官方源码，替换为**自行编写的占位实现**（仅保留同名 props、同名 CSS 变量、同构 DOM，不含官方代码）
- 在 [动效组件获取](#动效组件获取) 中给出官方下载地址，由使用者自行获取

`PrismCarousel.jsx` 是按官方 props 接口自行实现的等效版本，不涉及上述限制。

## 改造成你自己的站点

1. **替换 `src/data.js`** — `profile`（姓名、头衔、地点、联系方式、GitHub）、`stats`、`timeline`、`projects`、`capabilities`，以及页面标题 `index.html` 的 `<title>` 与 `<meta name="description">`
2. **替换素材** — `public/avatar.jpg`、`public/covers/*`、Hero 视频与海报；封面建议 3:4，视频用 H.264 编码保证 Safari 兼容
3. **调整配色** — 全部设计变量在 `src/styles.css` 的 `:root`，主色 `--accent: #FFFFFF`
4. **删掉用不到的能力卡** — `capabilities` 数组长度变化后，`Strengths.jsx` 里的 `06 / SKILL SETS` 与每张卡的 `xx / 06` 计数需要同步改
5. **检查素材版权** — 本仓库**不包含任何作品视频文件**，`gallery.videos` 里只有指向官方发布页的外链（如抖音），站内没有播放器、也不做视频再分发。仓库里涉及他人版权物的只有 `public/covers/` 下的封面缩略图：沿用客户项目封面（`miqiang.webp` 与 `gallery/miqiang-0x.jpg`）请先确认你有权公开，不确定就换成自己的作品截图

## License

- **代码**：[MIT](./LICENSE)
- **内容素材**：保留所有权利。`public/covers/`、Hero 视频与海报、头像，以及 `src/data.js` 中的个人资料、项目描述与文案，均不随 MIT 授权，详见 [LICENSE](./LICENSE) 末尾的补充说明
- **第三方作品视频**：不在本仓库内，也未做任何形式的分发或转载。`src/data.js` 中仅保存指向官方发布页（抖音）的外链，点击后跳转至官方原片；仓库内只有用作索引缩略图的封面图

## 致谢

- [React Bits](https://reactbits.dev) — 背景与边框组件的设计来源（本仓库不含其源码）
- [GSAP](https://gsap.com) — 开场与滚动动效
- [Space Grotesk](https://github.com/floriankarsten/space-grotesk) / [IBM Plex](https://github.com/IBM/plex) — 字体
