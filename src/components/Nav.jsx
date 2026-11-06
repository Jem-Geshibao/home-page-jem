import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { navItems, profile } from '../data'
import { gsap, EASE, prefersReducedMotion, shouldSkipIntro, whenIntroDone } from '../anim/motion'
import { scrollToSection } from '../utils/dom'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const innerRef = useRef(null)

  // 导航随开场结束一起落位，避免与幕布同时出现。
  useLayoutEffect(() => {
    const inner = innerRef.current
    if (!inner || prefersReducedMotion()) return undefined
    const play = () => {
      const tl = gsap.fromTo(
        inner.children,
        { y: -22, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.15, ease: EASE.out, stagger: 0.08, delay: 0.1 },
      )
      return tl
    }
    let tl = null
    let unlisten = () => {}
    if (shouldSkipIntro()) tl = play()
    else unlisten = whenIntroDone(() => { tl = play() })
    return () => {
      unlisten()
      tl?.kill()
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // 点击导航项：先关移动端菜单（避免遮罩残留），再交给统一的锚点跳转工具。
  const go = (e, id) => {
    setMenuOpen(false)
    scrollToSection(e, id)
  }

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="container nav__inner" ref={innerRef}>
        <a className="brand" href="#home" onClick={(e) => go(e, 'home')} aria-label="返回首页">
          <span className="brand__mark">J<span className="brand__dot">.</span>G</span>
          <span className="brand__meta">
            <span>{profile.name}</span>
            <span className="brand__meta-en">PORTFOLIO / 2026</span>
          </span>
        </a>

        <nav className={`nav__links ${menuOpen ? 'is-open' : ''}`} aria-label="主导航">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => go(e, item.id)}
              className={`nav__link ${active === item.id ? 'is-active' : ''}`}
            >
              <span className="nav__link-index">{item.index}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <span className="nav__status">
            <i className="pulse-dot" /> 可接合作
          </span>
          <a
            className="btn btn--outline nav__cta"
            href="#contact"
            onClick={(e) => go(e, 'contact')}
          >
            联系我 <span aria-hidden="true">↘</span>
          </a>
          <button
            className="nav__burger"
            aria-label="展开菜单"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
