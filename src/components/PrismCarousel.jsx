import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './PrismCarousel.css'

/**
 * Prism Carousel — 带「光谱扫色」的 coverflow 轮播（自研等效实现）。
 *
 * 设计目标：props 与 React Bits Pro 的 `prism-carousel-tw` 完全对齐，
 * 将来拿到许可证后可以直接整文件替换官方组件，调用方（WorkGallery）不用改。
 * 官方没有、本站额外补的两个可选 props：
 *   renderCaption(item, index) -> ReactNode  自定义字幕区（保留编号/话题/平台）
 *   item.filter                              CSS filter 字符串，逐图调色
 *
 * 渲染走 Canvas 2D（不占用 WebGL 上下文），因此可以和页面上的
 * PatternWaves / MicroSlats 背景共存。
 */

/** 把数值限制在 [a, b] 区间内。 */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
/** 数字补零到两位，用于 "01 / 05" 这类序号。 */
const pad = (n) => String(n).padStart(2, '0')
/** 取模并保证结果非负（负数取模在 JS 里是负数，这里统一到 [0, m)）。 */
const mod = (n, m) => ((n % m) + m) % m

/** 在 ctx 上画一个圆角矩形路径（只构图不留痕，调用方自行 fill / clip / stroke）。 */
function roundRect(ctx, x, y, w, h, r) {

  const rr = clamp(r, 0, Math.min(w, h) / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
  ctx.lineTo(x + rr, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
  ctx.lineTo(x, y + rr)
  ctx.quadraticCurveTo(x, y, x + rr, y)
  ctx.closePath()
}

/** 计算「object-fit: cover」的源矩形：按目标宽高比裁掉多余部分，返回 [sx, sy, sw, sh]。 */
function coverRect(img, w, h) {
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const target = w / h
  const ratio = iw / ih
  if (ratio > target) {
    const sh = ih
    const sw = ih * target
    return [(iw - sw) / 2, 0, sw, sh]
  }
  const sw = iw
  const sh = iw / target
  return [0, (ih - sh) / 2, sw, sh]
}

const DEFAULT_FILTER = 'saturate(.8) brightness(.8) contrast(1.04)'
// coverflow 布局常量：相邻卡宽度比例、远处卡的逐级缩小系数。
const NEIGHBOR_W = 0.68
const FAR_W = 0.86
const FAR_H = 0.84

const PrismCarousel = forwardRef(function PrismCarousel(props, forwardedRef) {
  const {
    items = [],
    startIndex = 0,
    aspect = 1.5,
    size = 0.62,
    neighborScale = 0.66,
    gap = 14,
    radius = 18,
    saturation = 0,
    dim = 0.2,
    sweep = 1,
    sweepDuration = 1.1,
    dispersion = 1,
    autoplay = true,
    interval = 4.5,
    loop = true,
    captions = true,
    controls = true,
    draggable = true,
    wheel = true,
    pauseOnHover = true,
    backgroundColor = 'transparent',
    paused = false,
    dpr = 2,
    ariaLabel = '图片轮播，使用左右方向键或拖拽切换，回车打开当前作品',
    onIndexChange,
    onSelect,
    renderCaption,
    className = '',
    style,
  } = props

  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const layerRef = useRef(null)
  const imagesRef = useRef([])
  const metricsRef = useRef({ w: 1, h: 1, dpr: 1 })
  const hitsRef = useRef([])
  const rafRef = useRef(0)
  const reducedRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(startIndex)

  const stateRef = useRef({
    position: startIndex,
    target: startIndex,
    active: startIndex,
    // 动画一律以 performance.now() 的真实时钟推进：无头/低帧率下累加 dt
    // 会被 clamp 拖慢，扫色与 coverflow 位移都会像卡住一样。
    animFrom: startIndex,
    animTo: startIndex,
    animStart: 0,
    sweepStart: 0,
    nextAutoAt: 0,
    sweep: 0,
    dragging: false,
    dragEnabled: true,
    dragStartX: 0,
    dragStartPos: 0,
    lastPointerX: 0,
    lastPointerT: 0,
    dragV: 0,
    moved: 0,
    hovered: false,
    hoverIndex: -1,
    velocity: 0,
    dirty: true,
  })

  // Latest props are read by the long-lived rAF loop without re-subscribing.
  const cfgRef = useRef(null)
  cfgRef.current = {
    items, aspect, size, neighborScale, gap, radius, saturation, dim, sweep,
    sweepDuration, dispersion, autoplay, interval, loop, captions, controls,
    draggable, wheel, pauseOnHover, paused, dpr, onIndexChange, onSelect,
  }

  /** 提交当前激活索引（取模到合法范围），同步 React 状态并通知外部回调。 */
  const commitIndex = useCallback((idx, n) => {
    if (!n) return
    const next = mod(idx, n)
    const s = stateRef.current
    if (next === s.active) return
    s.active = next
    setActiveIndex(next)
    cfgRef.current.onIndexChange?.(next)
  }, [])

  // 用真实时钟（performance.now）起一段补间：同时重置扫色进度与自动播放计时。
  // 放到 ref 上是为了让长驻 rAF 循环始终拿到最新的函数，不重复订阅。
  const tweenRef = useRef(null)
  tweenRef.current = (to, now = performance.now()) => {
    const s = stateRef.current
    s.target = to
    s.animFrom = s.position
    s.animTo = to
    s.animStart = now
    s.sweepStart = now
    s.nextAutoAt = now + Math.max(600, cfgRef.current.interval * 1000)
    s.dirty = true
    commitIndex(Math.round(to), cfgRef.current.items.length)
  }

  /** 相对移动 delta 张（键盘左右键、上一张/下一张按钮都走这里）。 */
  const go = useCallback((delta) => {
    const c = cfgRef.current
    const n = c.items.length
    if (!n || !delta) return
    let t = stateRef.current.target + delta
    if (!c.loop) t = clamp(t, 0, n - 1)
    if (t === stateRef.current.target) return
    tweenRef.current(t)
  }, [])

  /**
   * 跳到指定索引。loop 模式下会走「最短路径」：
   * 比如 5 张图从 0 直接到 4，会往回跨 1 张，而不是顺时针绕 4 张。
   */
  const goTo = useCallback((index) => {
    const c = cfgRef.current
    const n = c.items.length
    if (!n) return
    const s = stateRef.current
    let t = index
    if (c.loop) {
      const base = Math.round(s.target)
      const current = mod(base, n)
      let diff = mod(index, n) - current
      if (diff > n / 2) diff -= n
      if (diff < -n / 2) diff += n
      t = base + diff
    } else {
      t = clamp(index, 0, n - 1)
    }
    if (t === s.target) return
    tweenRef.current(t)
  }, [])

  useImperativeHandle(forwardedRef, () => ({ next: () => go(1), previous: () => go(-1), goTo }), [go, goTo])

  // Preload artwork. All covers are same-origin so no CORS taint on the canvas.
  useEffect(() => {
    const list = items.map((item) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => { stateRef.current.dirty = true }
      img.onerror = () => { stateRef.current.dirty = true }
      img.src = item.src
      return img
    })
    imagesRef.current = list
    stateRef.current.dirty = true
    return () => { list.forEach((img) => { img.onload = null; img.onerror = null }) }
  }, [items])

  useEffect(() => {
    reducedRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  /** 命中测试：返回落在鼠标坐标下的卡片（hits 已按「离中心由近到远」排序，优先取最近的一张）。 */
  const pickHit = useCallback((x, y) => {
    const hits = hitsRef.current
    for (let i = 0; i < hits.length; i++) {
      const h = hits[i]
      if (x >= h.x - h.w / 2 && x <= h.x + h.w / 2 && y >= h.y - h.h / 2 && y <= h.y + h.h / 2) return h
    }
    return null
  }, [])

  /**
   * 打开当前作品：优先交给外部 onSelect；
   * 没传回调就按 item.href 新开标签页（官方原片链接）。
   */
  const select = useCallback((index) => {
    const c = cfgRef.current
    const item = c.items[index]
    if (!item) return
    if (c.onSelect) { c.onSelect(item, index); return }
    if (item.href) window.open(item.href, '_blank', 'noopener,noreferrer')
  }, [])

  /**
   * 单帧绘制入口：把当前 position/sweep 状态画成一屏 coverflow。
   * 逐张卡片按「离中心距离 d」算横向槽位、尺寸、明暗与扫色进度；
   * 远的先画、近的后画，保证中间那张压在最上层。
   */
  const render = useCallback(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const c = cfgRef.current
    const s = stateRef.current
    const n = c.items.length
    const { w: W, h: H, dpr: DPR } = metricsRef.current
    const reduced = reducedRef.current

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    ctx.clearRect(0, 0, W, H)
    hitsRef.current = []
    if (!n || W < 2 || H < 2) return

    const captionH = c.captions ? 118 : 0
    const controlsH = c.controls ? 58 : 0
    const stageH = Math.max(180, H - captionH - controlsH - 14)
    const stageCY = stageH / 2 + 6

    let ch = stageH * c.size
    let cw = ch * c.aspect
    if (cw > W * 0.66) { cw = W * 0.66; ch = cw / c.aspect }

    // 每张卡的横向中心位置：slots[k] 是「离中心 k 格」那张卡的中心偏移，
    // 格子之间按固定间距递推，避免逐帧测量造成抖动。
    const slots = [0]
    let edge = cw / 2
    for (let k = 1; k <= 4; k++) {
      const wk = cw * NEIGHBOR_W * Math.pow(FAR_W, k - 1)
      const xk = edge + c.gap + wk / 2
      slots[k] = xk
      edge = xk + wk / 2
    }
    /** 把「带小数的距离」映射成横向坐标：整数格之间线性插值，超出 4 格后按 0.28 倍宽度继续外推。 */
    const slotX = (d) => {
      const k = Math.floor(d)
      if (k >= 4) return slots[4] + (d - 4) * cw * 0.28
      const f = d - k
      return slots[k] + (slots[k + 1] - slots[k]) * f
    }
    /** 按距离算卡片尺寸：0~1 格之间过渡到相邻尺寸，之后按远景色系数逐级衰减。 */
    const dims = (d) => {
      const near = Math.min(d, 1)
      const far = Math.max(0, d - 1)
      return {
        w: cw * (1 - (1 - NEIGHBOR_W) * near) * Math.pow(FAR_W, far),
        h: ch * (1 - (1 - c.neighborScale) * near) * Math.pow(FAR_H, far),
      }
    }
    const entries = []
    const half = n / 2
    for (let i = 0; i < n; i++) {
      let d = i - s.position
      if (c.loop) {
        while (d > half) d -= n
        while (d < -half) d += n
      }
      const abs = Math.abs(d)
      if (abs > 2.75) continue
      entries.push({ i, d, abs })
    }
    // 远的先画、近的后画（画家算法），保证中间那张不会被邻居盖住。
    entries.sort((a, b) => b.abs - a.abs)

    const activeMod = mod(Math.round(s.target), n)
    const sweeping = c.sweep > 0 && !reduced && s.sweep < 1
    const speed = clamp(s.velocity, 0, 1)
    const disp = reduced ? 0 : c.dispersion * speed

    for (const e of entries) {
      const img = imagesRef.current[e.i]
      const item = c.items[e.i]
      const { w, h } = dims(e.abs)
      if (w < 2 || h < 2) continue
      const x = W / 2 + Math.sign(e.d) * slotX(e.abs)
      const y = stageCY
      const isActive = e.i === activeMod && e.abs < 0.75
      const isHover = s.hoverIndex === e.i && !isActive
      const darken = 1 - c.dim * Math.min(e.abs / 1.5, 1)
      const baseFilter = item.filter || DEFAULT_FILTER
      const greyFilter = `grayscale(1) ${baseFilter} brightness(${darken.toFixed(3)})`
      const colorFilter = `${baseFilter} brightness(${darken.toFixed(3)})`
      const reveal = isActive ? (reduced ? 1 : s.sweep) : 1
      const colorAmount = isActive ? 1 : clamp(c.saturation + (isHover ? 0.38 : 0), 0, 1)

      hitsRef.current.push({ i: e.i, d: e.d, x, y, w, h })

      ctx.save()
      ctx.translate(x, y)
      if (e.abs > 0.02) {
        // A slight shear gives the row its coverflow perspective.
        ctx.transform(1, 0, -Math.sign(e.d) * 0.055 * Math.min(e.abs, 1), 1, 0, 0)
      }
      const r = c.radius * (h / ch)
      roundRect(ctx, -w / 2, -h / 2, w, h, r)
      ctx.clip()

      if (!img || !img.complete || !img.naturalWidth) {
        ctx.fillStyle = '#12161A'
        ctx.fillRect(-w / 2, -h / 2, w, h)
      } else {
        const src = coverRect(img, w, h)
        // 1) 先铺一层灰度底：所有卡片默认去色，只有「已揭示」的才恢复彩色。
        ctx.filter = greyFilter
        ctx.drawImage(img, ...src, -w / 2, -h / 2, w, h)
        ctx.filter = 'none'

        // 2) 位移中的色散：左右各偏移一点、用 screen 混合，做出棱镜边缘的错觉。
        if (disp > 0.02) {
          const shift = disp * 9
          ctx.save()
          ctx.globalCompositeOperation = 'screen'
          ctx.globalAlpha = clamp(disp * 0.16, 0, 0.2)
          ctx.filter = 'sepia(1) hue-rotate(165deg) saturate(4)'
          ctx.drawImage(img, ...src, -w / 2 - shift, -h / 2, w, h)
          ctx.filter = 'sepia(1) hue-rotate(285deg) saturate(4)'
          ctx.drawImage(img, ...src, -w / 2 + shift, -h / 2, w, h)
          ctx.restore()
          ctx.filter = 'none'
        }

        // 3) 彩色层：画在离屏 canvas 上，再用「左实右虚」的渐变做蒙版，
        //    配合 reveal 进度实现从左往右逐渐上色。
        if (colorAmount > 0.01) {
          const layer = layerRef.current || (layerRef.current = document.createElement('canvas'))
          const lw = Math.max(1, Math.ceil(w * DPR))
          const lh = Math.max(1, Math.ceil(h * DPR))
          layer.width = lw
          layer.height = lh
          const lctx = layer.getContext('2d')
          lctx.setTransform(DPR, 0, 0, DPR, 0, 0)
          lctx.filter = colorFilter
          lctx.drawImage(img, ...src, 0, 0, w, h)
          lctx.filter = 'none'
          if (reveal < 0.999) {
            lctx.globalCompositeOperation = 'destination-in'
            const g = lctx.createLinearGradient(0, 0, w, 0)
            const a = clamp(reveal - 0.055, 0, 1)
            const b = clamp(reveal + 0.055, 0, 1)
            g.addColorStop(0, 'rgba(0,0,0,1)')
            g.addColorStop(a, 'rgba(0,0,0,1)')
            g.addColorStop(b, 'rgba(0,0,0,0)')
            g.addColorStop(1, 'rgba(0,0,0,0)')
            lctx.fillStyle = g
            lctx.fillRect(0, 0, w, h)
            lctx.globalCompositeOperation = 'source-over'
          }
          ctx.globalAlpha = colorAmount
          ctx.drawImage(layer, 0, 0, lw, lh, -w / 2, -h / 2, w, h)
          ctx.globalAlpha = 1
        }

        // 4) 扫色前沿的光谱带：贴着 reveal 边缘的一小段棱镜色，
        //    带宽刻意收窄，否则已经上色的区域会被整片染成彩虹。
        if (sweeping && isActive && reveal < 0.999) {
          const bx = -w / 2 + w * reveal
          const bandW = w * 0.18
          const g = ctx.createLinearGradient(bx - bandW, 0, bx + bandW * 0.28, 0)
          g.addColorStop(0, 'rgba(80,190,255,0)')
          g.addColorStop(0.28, 'rgba(80,190,255,.62)')
          g.addColorStop(0.5, 'rgba(170,140,255,.6)')
          g.addColorStop(0.72, 'rgba(255,186,140,.52)')
          g.addColorStop(0.88, 'rgba(255,255,255,.42)')
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.save()
          ctx.globalCompositeOperation = 'screen'
          ctx.fillStyle = g
          ctx.fillRect(bx - bandW, -h / 2, bandW * 1.28, h)
          // 前沿再补一道极细的白色高光，暗色封面上才看得出「扫」到哪了。
          const edgeG = ctx.createLinearGradient(bx - 3, 0, bx + 5, 0)
          edgeG.addColorStop(0, 'rgba(255,255,255,0)')
          edgeG.addColorStop(0.5, 'rgba(255,255,255,.5)')
          edgeG.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = edgeG
          ctx.fillRect(bx - 3, -h / 2, 8, h)
          ctx.restore()
        }
      }

      // 激活卡描一圈冷白细边（带轻微外发光），呼应全站的 BorderGlow 语言。
      if (isActive) {
        ctx.save()
        ctx.strokeStyle = 'rgba(255,255,255,.34)'
        ctx.lineWidth = 1
        ctx.shadowColor = 'rgba(210,230,255,.28)'
        ctx.shadowBlur = 22
        roundRect(ctx, -w / 2, -h / 2, w, h, r)
        ctx.stroke()
        ctx.restore()

        // 播放按钮：点击画面即打开官方原片，这里只做可点击的视觉提示。
        const pr = 27
        ctx.beginPath()
        ctx.arc(0, 0, pr, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(8,10,12,.42)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,.82)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-3.5, -8)
        ctx.lineTo(10, 0)
        ctx.lineTo(-3.5, 8)
        ctx.closePath()
        ctx.fillStyle = '#fff'
        ctx.fill()
      }
      ctx.restore()
    }
    hitsRef.current.sort((a, b) => Math.abs(a.d) - Math.abs(b.d))
  }, [])

  // 常驻的单一动画循环：没有状态变化就跳过绘制，空闲时几乎不耗能。
  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return undefined
    const s = stateRef.current

    const resize = () => {
      // clientWidth/Height 不受面板入场动画 scale(.99) 影响；getBoundingClientRect
      // 会把动画中的缩放算进去，导致 canvas 位图比 CSS 尺寸小、画面发虚。
      const ratio = Math.min(window.devicePixelRatio || 1, cfgRef.current.dpr)
      const W = Math.max(1, root.clientWidth)
      const H = Math.max(1, root.clientHeight)
      const DPR = Math.max(1, ratio)
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      metricsRef.current = { w: W, h: H, dpr: DPR }
      s.dirty = true
    }

    const frame = (now) => {
      rafRef.current = requestAnimationFrame(frame)
      if (document.hidden) return
      const c = cfgRef.current
      const reduced = reducedRef.current
      if (!s.sweepStart) s.sweepStart = now
      if (!s.nextAutoAt) s.nextAutoAt = now + Math.max(600, c.interval * 1000)

      // 位移补间：固定 560ms 的墙钟时长，低帧率下也是「同样时间走完」，不会变慢。
      if (!s.dragging) {
        const t = reduced ? 1 : clamp((now - s.animStart) / 560, 0, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        const next = t >= 1 ? s.animTo : s.animFrom + (s.animTo - s.animFrom) * eased
        if (Math.abs(next - s.position) > 0.0002) { s.position = next; s.dirty = true }
        const nv = t < 1 ? (1 - t) * 0.9 : 0
        if (Math.abs(nv - s.velocity) > 0.015) s.dirty = true
        s.velocity = nv
      }

      // 扫色同样走真实时钟，切换后 sweepDuration 秒内扫完一遍。
      const sp = reduced ? 1 : clamp((now - s.sweepStart) / Math.max(150, c.sweepDuration * 1000), 0, 1)
      if (sp !== s.sweep) { s.sweep = sp; s.dirty = true }

      const hold = s.dragging || (c.pauseOnHover && s.hovered)
      if (hold) s.nextAutoAt = now + 400
      else if (c.autoplay && !c.paused && !reduced && now >= s.nextAutoAt) go(1)

      if (s.dirty) { s.dirty = false; render() }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(root)
    resize()
    rafRef.current = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [go, render])

  // 指针交互：拖拽带惯性、悬停给邻居补一点色、单击打开当前作品。
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const s = stateRef.current

    /** 把事件坐标换算成相对组件左上角的局部坐标。 */
    const local = (e) => {
      const r = root.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    /** 按下：记录起点与时间，准备拖拽（点在按钮/链接上时不拦截，保证链接可点）。 */
    const onDown = (e) => {
      if (e.target instanceof Element && e.target.closest('a, button')) return
      if (e.button !== undefined && e.button !== 0) return
      const p = local(e)
      s.dragging = true
      s.dragEnabled = cfgRef.current.draggable
      s.dragStartX = p.x
      s.dragStartPos = s.position
      s.lastPointerX = p.x
      s.lastPointerT = performance.now()
      s.dragV = 0
      s.moved = 0
      if (s.dragging) {
        try { root.setPointerCapture(e.pointerId) } catch { /* not fatal */ }
      }
    }
    /** 移动：拖拽时按「每格 19% 宽度」换算成位移，同时记录拖动速度用于抬手惯性；未拖拽时做悬停命中。 */
    const onMove = (e) => {
      const p = local(e)
      s.hovered = true
      if (s.dragging && s.dragEnabled) {
        const unit = Math.max(90, metricsRef.current.w * 0.19)
        const delta = p.x - s.dragStartX
        s.moved = Math.max(s.moved, Math.abs(delta))
        const now = performance.now()
        const dt = Math.max(8, now - s.lastPointerT)
        s.dragV = (p.x - s.lastPointerX) / dt
        s.lastPointerX = p.x
        s.lastPointerT = now
        let next = s.dragStartPos - delta / unit
        if (!cfgRef.current.loop) next = clamp(next, 0, cfgRef.current.items.length - 1)
        s.position = next
        s.velocity = 0.7
        s.dirty = true
      } else {
        const hit = pickHit(p.x, p.y)
        const nextHover = hit ? hit.i : -1
        if (nextHover !== s.hoverIndex) { s.hoverIndex = nextHover; s.dirty = true }
      }
    }
    /**
     * 抬手：位移小于 6px 视为点击（当前卡→打开，邻居卡→切过去）；
     * 否则按最后的拖动速度外推一格，再把最近整数格吸附到位。
     */
    const onUp = (e) => {
      const wasDragging = s.dragging
      s.dragging = false
      try { root.releasePointerCapture(e.pointerId) } catch { /* not fatal */ }
      if (!wasDragging) return
      const p = local(e)
      if (s.moved < 6) {
        const hit = pickHit(p.x, p.y)
        if (hit) {
          if (Math.abs(hit.d) < 0.5) select(hit.i)
          else goTo(hit.i)
        }
        s.velocity = 0
      } else {
        let target = Math.round(s.position - s.dragV * 0.16)
        if (!cfgRef.current.loop) target = clamp(target, 0, cfgRef.current.items.length - 1)
        tweenRef.current(target)
      }
      s.dirty = true
    }
    /** 移出组件：清掉悬停态（避免离开后邻居一直带色）。 */
    const onLeave = () => {
      s.hovered = false
      if (s.hoverIndex !== -1) { s.hoverIndex = -1; s.dirty = true }
    }
    /** 滚轮翻页：320ms 节流，并且只在 wheel=true 时接管（本站面板里设为 false，不抢外层滚动）。 */
    const onWheel = (e) => {
      if (!cfgRef.current.wheel) return
      e.preventDefault()
      const now = performance.now()
      if (now - (onWheel.last || 0) < 320) return
      onWheel.last = now
      go(Math.sign(e.deltaY || e.deltaX) > 0 ? 1 : -1)
    }
    /** 键盘：左右键翻页、回车/空格打开当前作品（组件带 tabIndex，可键盘聚焦）。 */
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(stateRef.current.active) }
    }

    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerup', onUp)
    root.addEventListener('pointercancel', onUp)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerup', onUp)
      root.removeEventListener('pointercancel', onUp)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('keydown', onKey)
    }
  }, [go, goTo, pickHit, select])

  const active = items[activeIndex] || null
  const count = items.length

  // 结构：canvas 只负责画，字幕与翻页按钮是真实 DOM（可选中、可聚焦、可读屏）。
  return (
    <div
      ref={rootRef}
      className={`prism-carousel ${className}`.trim()}
      style={{ ...style, '--pc-bg': backgroundColor }}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <canvas ref={canvasRef} className="prism-carousel__canvas" aria-hidden="true" />

      {captions && count > 0 && (
        <div className="prism-carousel__caption" key={activeIndex}>
          {renderCaption
            ? renderCaption(active, activeIndex)
            : (
              <>
                <span className="prism-carousel__eyebrow mono">{pad(activeIndex + 1)} / {pad(count)}</span>
                {active?.title && <h4>{active.title}</h4>}
                {active?.subtitle && <p>{active.subtitle}</p>}
                {active?.href && (
                  <a href={active.href} target="_blank" rel="noreferrer">
                    查看原片 <span aria-hidden="true">↗</span>
                  </a>
                )}
              </>
            )}
        </div>
      )}

      {controls && count > 1 && (
        <div className="prism-carousel__controls">
          <button type="button" className="prism-carousel__btn" onClick={() => go(-1)} aria-label="上一张">
            <span aria-hidden="true">←</span>
          </button>
          <span className="prism-carousel__count mono">{pad(activeIndex + 1)} <i>/</i> {pad(count)}</span>
          <button type="button" className="prism-carousel__btn" onClick={() => go(1)} aria-label="下一张">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  )
})

export default PrismCarousel
