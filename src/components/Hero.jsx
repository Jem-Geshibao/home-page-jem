import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data'
import { gsap, EASE, prefersReducedMotion, shouldSkipIntro, whenIntroDone } from '../anim/motion'
import { scrollToSection } from '../utils/dom'

/**
 * Hero 底层的 Canvas 2D 氛围层：跟随鼠标的柔光 + 缓慢上浮的尘点 + 一条竖向扫描带。
 * 有意不用 WebGL —— 首屏已经有一段视频，再叠一层 3D 会把低端显卡推到过热。
 * 系统开启「减弱动态效果」时直接不启动 rAF，只留静态底色。
 */
function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let raf = 0
    let t = 0
    const mouse = { x: 0.68, y: 0.42, tx: 0.68, ty: 0.42 }
    const particles = Array.from({ length: 74 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      s: Math.random() * 0.00022 + 0.00006,
      a: Math.random() * 0.38 + 0.08,
      warm: Math.random() > 0.82,
    }))

    // 按 dpr 放大位图（上限 2 倍，再高只烧 GPU 不增清晰度），并用 setTransform 让后续按 CSS 像素作画。
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    /** 鼠标坐标归一化到 0~1，供柔光层插值跟随。 */
    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth
      mouse.ty = e.clientY / window.innerHeight
    }

    /** 每帧：清屏 → 柔光 → 尘点 → 扫描带。尘点飘出上边界后从底部重新投胎。 */
    const draw = () => {
      t += 1
      mouse.x += (mouse.tx - mouse.x) * 0.035
      mouse.y += (mouse.ty - mouse.y) * 0.035
      ctx.clearRect(0, 0, w, h)

      // soft accent glow following cursor
      const gx = mouse.x * w
      const gy = mouse.y * h
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.42)
      glow.addColorStop(0, 'rgba(255,255,255,0.038)')
      glow.addColorStop(0.45, 'rgba(190,205,215,0.012)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      // drifting dust
      for (const p of particles) {
        p.y -= p.s
        if (p.y < -0.02) {
          p.y = 1.02
          p.x = Math.random()
        }
        const px = (p.x + Math.sin(t * 0.0016 + p.y * 9) * 0.008) * w
        const py = p.y * h
        ctx.beginPath()
        ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.warm
          ? `rgba(255,255,255,${p.a})`
          : `rgba(214,226,220,${p.a * 0.7})`
        ctx.fill()
      }

      // slow scan band
      const bandY = ((t * 0.42) % (h + 260)) - 130
      const band = ctx.createLinearGradient(0, bandY - 90, 0, bandY + 90)
      band.addColorStop(0, 'rgba(255,255,255,0)')
      band.addColorStop(0.5, 'rgba(255,255,255,0.016)')
      band.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = band
      ctx.fillRect(0, bandY - 90, w, 180)

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
}

const PRIMARY_VIDEO = '/shanghaimajor.mp4'
// 主视频加载失败（编码不支持 / 403）时退回体积更小的 hero.mp4，再失败就只留海报图。
const FALLBACK_VIDEO = '/hero.mp4'

export default function Hero() {
  const [videoOk, setVideoOk] = useState(true)
  const [videoSrc, setVideoSrc] = useState(PRIMARY_VIDEO)
  const rootRef = useRef(null)
  const heroTl = useRef(null)

  // 首屏进场 + 滚动视差。标题走「遮罩上移 + 整体纵向压缩回位」，不用淡入。
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return undefined

    const ctx = gsap.context(() => {
      gsap.to('.hero__media', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.5 },
      })
      gsap.to('.hero__content', {
        y: -70,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.5 },
      })
    }, root)

    const play = () => {
      const tl = gsap.timeline({ defaults: { ease: EASE.out } })
      heroTl.current = tl

      tl.fromTo('.hero__media', { scale: 1.12 }, { scale: 1, duration: 2.6, ease: EASE.out }, 0)
        .fromTo('.hero__guides span', { scaleY: 0, opacity: 0 }, {
          scaleY: 1, opacity: 1, duration: 1.8, stagger: 0.1, transformOrigin: '50% 0%',
        }, 0)
        .fromTo('.hero__topline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 }, 0.1)
        .fromTo('.hero__kicker', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.1 }, 0.2)
        .fromTo('.hero__title', { scaleY: 1.06, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 2.1 }, 0.28)
        .fromTo('[data-hero-line]', { yPercent: 128, rotate: 2.2 }, {
          yPercent: 0, rotate: 0, duration: 1.6, ease: EASE.out, stagger: 0.13,
        }, 0.3)
        .fromTo('.hero__subrow', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.3 }, 0.72)
        .fromTo('.hero__actions .btn', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09 }, 0.85)
        .fromTo('.hero__bottom', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.2 }, 0.95)
        .fromTo('.hero__aside > *', { opacity: 0, scale: 0.86 }, {
          opacity: 1, scale: 1, duration: 1.3, stagger: 0.1, transformOrigin: '50% 50%',
        }, 0.7)

      return tl
    }

    let unlisten = () => {}
    if (shouldSkipIntro()) play()
    else unlisten = whenIntroDone(play)

    return () => {
      unlisten()
      heroTl.current?.kill()
      ctx.revert()
    }
  }, [])

  // 视频降级链：主视频 → 备用 hero.mp4 → 只留 poster 静帧（不显示黑框）。
  const onVideoError = () => {
    if (videoSrc === PRIMARY_VIDEO) setVideoSrc(FALLBACK_VIDEO)
    else setVideoOk(false)
  }

  return (
    <section className="hero" id="home" ref={rootRef}>
      <div className="hero__media" aria-hidden="true">
        {videoOk && (
          <video
            key={videoSrc}
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero-poster.jpg"
            onError={onVideoError}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        <HeroCanvas />
        <div className="hero__scrim" />
        <div className="hero__grain" />
      </div>

      <div className="hero__guides" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <div className="container hero__inner">
        <div className="hero__topline">
          <div className="hero__index">
            <span className="index-num">01</span>
            <span className="index-rule" />
            <span>PORTFOLIO / 2026</span>
          </div>
          <div className="hero__coords">22°32′N 114°03′E · SHENZHEN</div>
        </div>

        <div className="hero__content">
          <div className="hero__kicker">
            <span className="pulse-dot" />
            <span>OPEN FOR COLLABORATION</span>
            <span className="hero__kicker-line" />
            <span>{profile.name} / {profile.latin}</span>
          </div>

          <h1 className="hero__title">
            <span className="hero__title-mask">
              <span className="hero__title-line" data-hero-line>把游戏</span>
            </span>
            <span className="hero__title-mask">
              <span className="hero__title-line hero__title-line--outline" data-hero-line>
                剪成故事<span className="hero__title-period">.</span>
              </span>
            </span>
          </h1>

          <div className="hero__subrow">
            <p className="hero__roles">
              {profile.roles.map((r, i) => (
                <span key={r}>
                  {r}
                  {i < profile.roles.length - 1 && <i className="hero__slash">/</i>}
                </span>
              ))}
            </p>
            <p className="hero__desc">
              从剧本拆解、AI 生成到剪辑包装与账号增长，<br />
              用一条完整工作流，把一帧画面变成被看见的内容。
            </p>
          </div>

          <div className="hero__actions">
            <a className="btn btn--solid" href="#work" onClick={(e) => scrollToSection(e, 'work')}>
              查看作品 <span aria-hidden="true">↘</span>
            </a>
            <a className="btn btn--ghost" href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>
              联系我 <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>

        <div className="hero__aside" aria-hidden="true">
          <div className="hero__badge">
            <svg viewBox="0 0 120 120" className="hero__badge-ring">
              <defs>
                <path id="badgePath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text>
                <textPath href="#badgePath" startOffset="0">
                  AVAILABLE FOR WORK · AVAILABLE FOR WORK ·
                </textPath>
              </text>
            </svg>
            <span className="hero__badge-core">↗</span>
          </div>
          <span className="hero__vertical">SCROLL TO EXPLORE</span>
          <span className="hero__vertical-line" />
        </div>

        <div className="hero__bottom">
          <div className="hero__meta">
            <span className="meta-label">BASED IN</span>
            <span className="meta-value">{profile.location}</span>
          </div>
          <div className="hero__meta">
            <span className="meta-label">FOCUS</span>
            <span className="meta-value">AI VIDEO · GAME CONTENT</span>
          </div>
          <div className="hero__meta">
            <span className="meta-label">STATUS</span>
            <span className="meta-value"><i className="pulse-dot" /> 自由职业 · 可接合作</span>
          </div>
          <div className="hero__scroll">
            <span>02 / ABOUT</span>
            <span className="hero__scroll-line"><i /></span>
          </div>
        </div>
      </div>
    </section>
  )
}
