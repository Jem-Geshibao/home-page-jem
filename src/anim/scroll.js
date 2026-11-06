import { gsap, ScrollTrigger, prefersReducedMotion, EASE } from './motion'

/**
 * 全站滚动动效。所有入场动画只注册一次（once: true），
 * 只有作品封面和首屏两处视差用 scrub，避免长列表里堆满逐帧回调。
 *
 * 约定：
 * - 用完即弃的入场动画一律 once，滚回去不重播（作品集网站不需要反复看同一个进场）；
 * - 位移/缩放都走 transform，不碰 layout 属性；
 * - 返回的清理函数做两件事：摘掉 load 监听 + ctx.revert() 把内联样式还原，
 *   这样 StrictMode 双挂载不会残留上一次的 opacity:0。
 *
 * @returns {() => void} 清理函数，交给 useLayoutEffect 的 return 调用
 */
export function initScrollAnimations() {
  const ctx = gsap.context(() => {
    if (prefersReducedMotion()) return

    ScrollTrigger.config({ ignoreMobileResize: true })

    /* ---------------- 区块大标题：遮罩揭开 + 规则线拉开 ---------------- */
    gsap.utils.toArray('.section-head').forEach((head) => {
      const title = head.querySelector('.section-head__title')
      const rule = head.querySelector('.section-head__rule')
      const meta = head.querySelector('.section-head__meta')
      const note = head.querySelector('.section-head__note')
      const right = head.querySelector('.section-head__right')

      const tl = gsap.timeline({
        scrollTrigger: { trigger: head, start: 'top 82%', once: true },
      })

      if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: EASE.inOut }, 0)
      if (meta) tl.from(meta, { opacity: 0, y: 22, duration: 1.1, ease: EASE.soft }, 0.05)
      if (title) tl.from(title, { yPercent: 128, rotate: 1.8, duration: 1.6, ease: EASE.out }, 0.12)
      if (note) tl.from(note, { opacity: 0, y: 28, duration: 1.2, ease: EASE.soft }, 0.4)
      if (right) tl.from(right, { opacity: 0, y: 22, duration: 1.1, ease: EASE.soft }, 0.5)
    })

    /* ---------------- 作品卡：大位移 stagger + 封面遮罩拉开 ---------------- */
    const cards = gsap.utils.toArray('.work-card')
    if (cards.length) {
      gsap.set(cards, {
        opacity: 0,
        y: 96,
        scale: 0.965,
        rotateX: 5,
        transformPerspective: 1400,
        transformOrigin: '50% 100%',
      })

      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          batch.forEach((card, i) => {
            const tl = gsap.timeline({ delay: i * 0.11 })
            tl.to(card, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.4, ease: EASE.out })
            const media = card.querySelector('.pvis')
            if (media) {
              tl.fromTo(
                media,
                { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.18 },
                { clipPath: 'inset(0% 0% 0% 0%)', scale: 1.06, duration: 1.7, ease: EASE.out },
                0.12,
              )
            }
          })
        },
      })

      // 封面轻微视差：整体放大 6%，所以位移不会露边。
      cards.forEach((card) => {
        const media = card.querySelector('.pvis')
        if (!media) return
        gsap.fromTo(
          media,
          { yPercent: -3.2 },
          {
            yPercent: 3.2,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
          },
        )
      })
    }

    /* ---------------- 优势卡：依次 stagger 上浮 ---------------- */
    const caps = gsap.utils.toArray('.cap-cell')
    if (caps.length) {
      gsap.set(caps, { opacity: 0, y: 84, scale: 0.96 })
      ScrollTrigger.batch(caps, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.35,
            ease: EASE.out,
            stagger: 0.11,
          }),
      })
    }

    /* ---------------- 个人经历 ---------------- */
    const portrait = document.querySelector('.portrait')
    if (portrait) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: portrait, start: 'top 86%', once: true },
      })
      const frame = portrait.querySelector('.portrait__frame')
      const caption = portrait.querySelector('.portrait__caption')
      if (frame) {
        tl.fromTo(
          frame,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: EASE.out },
        )
      }
      if (caption) tl.from(caption, { opacity: 0, y: 20, duration: 1, ease: EASE.soft }, 0.45)
    }

    const contactCard = document.querySelector('.contact-card')
    if (contactCard) {
      const rows = contactCard.querySelectorAll('.contact-card__row')
      const tl = gsap.timeline({
        scrollTrigger: { trigger: contactCard, start: 'top 88%', once: true },
      })
      tl.from(contactCard, { opacity: 0, y: 54, duration: 1.3, ease: EASE.out }).from(
        rows,
        { opacity: 0, y: 18, duration: 0.9, ease: EASE.soft, stagger: 0.07 },
        0.35,
      )
    }

    const intro = document.querySelector('.about__intro')
    if (intro) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: intro, start: 'top 86%', once: true },
      })
      tl.from(intro, { opacity: 0, y: 52, duration: 1.4, ease: EASE.out })
      const quote = intro.querySelector('.about__quote')
      if (quote) tl.from(quote, { opacity: 0, scale: 0.7, transformOrigin: '30% 70%', duration: 1.4 }, 0.15)
    }

    const stats = document.querySelector('.stats')
    if (stats) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stats, start: 'top 88%', once: true },
      })
      tl.from(stats, { opacity: 0, y: 52, duration: 1.3, ease: EASE.out }).from(
        stats.querySelectorAll('.stat'),
        { opacity: 0, y: 30, duration: 1, ease: EASE.soft, stagger: 0.08 },
        0.3,
      )
    }

    const timeline = document.querySelector('.timeline')
    if (timeline) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: timeline, start: 'top 88%', once: true },
      })
      tl.from(timeline, { opacity: 0, y: 52, duration: 1.3, ease: EASE.out }).from(
        timeline.querySelectorAll('.timeline__item'),
        { opacity: 0, x: -22, y: 16, duration: 1, ease: EASE.soft, stagger: 0.09 },
        0.3,
      )
    }

    /* ---------------- 工作流条 ---------------- */
    const interlude = document.querySelector('.interlude__inner')
    if (interlude) {
      gsap.from(interlude.querySelectorAll('p span, p i'), {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: EASE.soft,
        stagger: 0.05,
        scrollTrigger: { trigger: interlude, start: 'top 90%', once: true },
      })
    }

    /* ---------------- 联系区 ---------------- */
    const contact = document.querySelector('.contact')
    if (contact) {
      const titleLines = gsap.utils.toArray('.contact__title > span')
      const tl = gsap.timeline({
        scrollTrigger: { trigger: contact, start: 'top 78%', once: true },
      })
      tl.from(contact.querySelector('.contact__head'), { opacity: 0, y: 22, duration: 1.1 }, 0)
      if (titleLines.length) {
        tl.from(titleLines, {
          yPercent: 128,
          opacity: 0,
          duration: 1.6,
          ease: EASE.out,
          stagger: 0.13,
        }, 0.1)
      }
      const lead = contact.querySelector('.contact__lead')
      if (lead) tl.from(lead, { opacity: 0, y: 26, duration: 1.2, ease: EASE.soft }, 0.55)
      const emailWrap = contact.querySelector('.contact__email-wrap')
      if (emailWrap) tl.from(emailWrap, { opacity: 0, y: 34, duration: 1.2, ease: EASE.soft }, 0.65)
      tl.from(
        contact.querySelectorAll('.channel'),
        { opacity: 0, y: 28, duration: 1.05, ease: EASE.soft, stagger: 0.07 },
        0.8,
      )
      tl.from(contact.querySelector('.footer'), { opacity: 0, duration: 1.1 }, 1)
    }
  })

  // 图片/字体加载完成后行高会变，重新量一次触发点（否则标题可能提前/滞后触发）。
  const refresh = () => ScrollTrigger.refresh()
  const onLoad = () => refresh()
  window.addEventListener('load', onLoad)
  if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {})

  return () => {
    window.removeEventListener('load', onLoad)
    ctx.revert()
  }
}
