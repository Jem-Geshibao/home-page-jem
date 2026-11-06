import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import GalleryBackdrop from './GalleryBackdrop'
import PrismCarousel from './PrismCarousel'
import './WorkGallery.css'

/** 序号补零（"3" → "03"），用于 VIDEO / 01 这类编号。 */
const pad = (n) => String(n).padStart(2, '0')

// 站内作品集面板：由 ?work=<slug> 驱动，portal 到 body 以避开外层 section 的 transform 形成的包含块。
// 官方链接放进 data.js 的 gallery.videos 即可自动渲染成视频墙；数组为空时显示「片单索取」空态，
// 不会生成任何假链接。
export default function WorkGallery({ project, onClose }) {
  const closeRef = useRef(null)
  const gallery = project.gallery || {}
  const videos = gallery.videos || []

  // Prism Carousel 的 items 形状与官方 props 一致；video 是站点扩展字段，
  // 供 renderCaption 保留编号 / 话题 / 平台等原有信息。
  const carouselItems = useMemo(() => videos.map((v) => ({
    src: v.cover || project.cover,
    alt: `${v.title} — 官方视频封面`,
    title: v.title,
    subtitle: [v.platform, ...(v.hashtags || [])].filter(Boolean).join(' · '),
    href: v.url,
    filter: v.filter,
    video: v,
  })), [videos, project.cover])

  /** 自定义字幕：官方 PrismCarousel 只给标题/副标题，这里补回编号、话题、平台与「查看原片」外链。 */
  const renderCaption = (item, index) => {
    if (!item) return null
    const v = item.video
    return (
      <div className="wg__prism-caption">
        <span className="mono wg__prism-id">VIDEO / {pad(index + 1)}</span>
        <h4>{v.title}</h4>
        {v.hashtags?.length > 0 && (
          <div className="wg__prism-tags">
            {v.hashtags.map((t) => <span key={t}>{t}</span>)}
          </div>
        )}
        <div className="wg__prism-meta mono">
          {[v.platform, v.date, v.views].filter(Boolean).map((t) => <span key={t}>{t}</span>)}
        </div>
        <a className="wg__prism-link" href={v.url} target="_blank" rel="noreferrer">
          查看官方原片 <span aria-hidden="true">↗</span>
        </a>
      </div>
    )
  }

  // 面板打开期间锁住页面滚动、把焦点移到关闭按钮，并支持 Esc 关闭；
  // 卸载时把 overflow 与焦点都还回去，避免「关掉面板后页面滚不动」。
  useEffect(() => {
    const previous = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [onClose])

  /** 空态里的「索取完整片单」：先关面板，等 body 滚动锁解除后再滚到联系区。 */
  const goContact = () => {
    onClose()
    // 等面板卸载、body 滚动锁解除后，按绝对文档坐标滚（offsetTop 会受 offsetParent 影响偏小）。
    setTimeout(() => {
      const el = document.getElementById('contact')
      // getBoundingClientRect().top + scrollY 才是真实文档坐标，面板里的 offsetParent 不可靠。
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
      window.history.replaceState(null, '', '#contact')
    }, 0)
  }

  return createPortal(
    <div
      className="wg"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="wg__panel" role="dialog" aria-modal="true" aria-labelledby="wg-title">
        <GalleryBackdrop />
        <div className="wg__bar">
          <span className="mono wg__bar-label">SELECTED WORK / {project.id} · OFFICIAL RELEASE</span>
          <button ref={closeRef} type="button" className="wg__close" onClick={onClose} aria-label="关闭作品集">
            关闭 <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="wg__scroll">
          <div className="wg__inner">
            <header className="wg__head">
              <span className="mono wg__cat">{project.category} · {project.year}</span>
              <h2 id="wg-title" className="wg__title">{project.title}</h2>
              <span className="mono wg__en">{project.en}</span>
              <p className="wg__desc">{project.desc}</p>
            </header>

            <div className="wg__metrics">
              {project.metrics.map((m) => (
                <div className="wg__metric" key={m}>
                  <span className="wg__metric-value">{m}</span>
                </div>
              ))}
            </div>

            <section className="wg__section">
              <div className="wg__section-head">
                <span className="mono">01 / MY ROLE</span>
                <h3>我负责的环节</h3>
              </div>
              <div className="wg__roles">
                {(gallery.roles || []).map((r, i) => (
                  <span className="wg__role" key={r}>
                    <i className="mono">{String(i + 1).padStart(2, '0')}</i>{r}
                  </span>
                ))}
              </div>
            </section>

            <section className="wg__section">
              <div className="wg__section-head">
                <span className="mono">02 / OFFICIAL RELEASE</span>
                <h3>已发布作品</h3>
                <span className="mono wg__count">
                  {videos.length ? `${String(videos.length).padStart(2, '0')} VIDEOS` : 'LINKS PENDING'}
                </span>
              </div>

              {carouselItems.length > 0 ? (
                <div className="wg__prism">
                  <PrismCarousel
                    items={carouselItems}
                    aspect={0.75}
                    size={0.94}
                    neighborScale={0.78}
                    gap={18}
                    radius={14}
                    saturation={0}
                    dim={0.3}
                    sweep={1}
                    sweepDuration={1.1}
                    dispersion={0.85}
                    autoplay
                    interval={5}
                    loop
                    captions
                    controls
                    draggable
                    wheel={false}
                    pauseOnHover
                    backgroundColor="transparent"
                    dpr={2}
                    renderCaption={renderCaption}
                    ariaLabel="《迷你枪战精英》已发布作品轮播，左右方向键或拖拽切换，回车打开当前官方原片"
                  />
                  <span className="mono wg__prism-hint">拖拽 / 方向键切换 · 点击画面打开官方原片</span>
                </div>
              ) : (
                <div className="wg__empty">
                  <span className="mono wg__empty-kicker">OFFICIALLY PUBLISHED</span>
                  <p>作品已在《迷你枪战精英》官方账号发布，单条链接正在整理。</p>
                  <span className="wg__empty-note">为避免放错链接，这里暂不放占位跳转。</span>
                  <button type="button" className="btn btn--outline wg__empty-btn" onClick={goContact}>
                    索取完整片单 <span aria-hidden="true">↘</span>
                  </button>
                </div>
              )}
            </section>

            <footer className="wg__foot">
              <span className="mono">{gallery.note}</span>
              <button type="button" className="text-link" onClick={onClose}>
                返回作品区 <span aria-hidden="true">↗</span>
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
