import { useEffect, useRef, useState } from 'react'
import { gsap, EASE, finishIntro, shouldSkipIntro } from '../anim/motion'
import './Intro.css'

/**
 * 首屏开场：计数 000→100 + 字标遮罩揭开 + 三块幕布错开上移。
 * 幕布拉到一半（1.74s）时派发 intro:done，Hero 标题接着进场，两段动效咬在一起，
 * 中间不留空档，也不会让用户等两层动画。
 */
export default function Intro() {
  const skip = useRef(shouldSkipIntro())
  const [mounted, setMounted] = useState(!skip.current)

  const rootRef = useRef(null)
  const counterRef = useRef(null)

  useEffect(() => {
    if (skip.current) {
      finishIntro()
      return undefined
    }

    const root = rootRef.current
    if (!root) return undefined

    document.documentElement.classList.add('is-intro')

    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: EASE.out },
        onComplete: () => {
          document.documentElement.classList.remove('is-intro')
          setMounted(false)
        },
      })

      tl.to('.intro__word .intro__mask > span', { y: 0, yPercent: 0, duration: 1.15, stagger: 0.06 }, 0.05)
        .to('.intro__sub', { opacity: 1, y: 0, duration: 0.8 }, 0.32)
        .to(counter, {
          v: 100,
          duration: 1.32,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            }
          },
        }, 0.1)
        .fromTo('.intro__bar i', { scaleX: 0 }, { scaleX: 1, duration: 1.32, ease: 'power2.inOut' }, 0.1)
        .to('.intro__content', { opacity: 0, y: -18, duration: 0.45, ease: 'power2.in' }, 1.4)
        .fromTo('.intro__seam', { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: EASE.inOut }, 1.42)
        .to('.intro__panel', { yPercent: -101, duration: 1.05, ease: EASE.inOut, stagger: 0.07 }, 1.55)
        .call(() => finishIntro(), null, 1.74)
        .to('.intro__seam', { opacity: 0, duration: 0.4 }, 2.05)
        .to(root, { autoAlpha: 0, duration: 0.45, ease: 'power1.out' }, 2.3)

      return tl
    }, root)

    return () => {
      ctx.revert()
      document.documentElement.classList.remove('is-intro')
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="intro" ref={rootRef} aria-hidden="true">
      <div className="intro__panels">
        <span className="intro__panel" />
        <span className="intro__panel" />
        <span className="intro__panel" />
      </div>

      <span className="intro__seam" />

      <div className="intro__content">
        <span className="intro__word">
          <span className="intro__mask"><span style={{ transform: 'translateY(110%)' }}>JEM</span></span>
          <span className="intro__mask"><span style={{ transform: 'translateY(110%)' }}>GESHIBAO</span></span>
        </span>

        <span className="intro__sub">PORTFOLIO / 2026 — AI VIDEO &amp; GAME CONTENT</span>

        <div className="intro__meter">
          <span className="intro__bar"><i /></span>
          <span className="intro__count mono" ref={counterRef}>000</span>
        </div>
      </div>
    </div>
  )
}
