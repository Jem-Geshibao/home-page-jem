import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 统一缓动：出场一律 expo，起步快、收尾极慢，且不带任何回弹。
export const EASE = {
  out: 'expo.out',
  inOut: 'expo.inOut',
  soft: 'power3.out',
}

/** 读取系统「减弱动态效果」偏好；动效入口都先问它，命中就整体降级成静态。 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 是否需要跳过开场动画。
 * 两种情况跳过：系统要求减弱动效；或者通过 ?work=xxx 从分享链接直达作品集
 * （这时用户是来看作品的，不该再等 2.8 秒的开场）。
 */
export const shouldSkipIntro = () => {
  if (prefersReducedMotion()) return true
  return new URLSearchParams(window.location.search).has('work')
}

// 开场是否已结束的模块级标记：Hero / Nav 的进场动画靠它决定「等开场」还是「立刻播」。
let introFinished = false

/** 开场是否已结束。 */
export const isIntroFinished = () => introFinished

/** 标记开场结束并广播事件（只生效一次），Hero / Nav 监听到后接续进场。 */
export function finishIntro() {
  if (introFinished) return
  introFinished = true
  window.dispatchEvent(new Event('intro:done'))
}

/**
 * 开场结束后再执行回调；如果开场已经结束（或本次跳过开场），立刻执行。
 * 返回解绑函数，方便在 useEffect 清理阶段把还没触发的监听摘掉。
 */
export function whenIntroDone(cb) {
  if (introFinished) {
    cb()
    return () => {}
  }
  const handler = () => cb()
  window.addEventListener('intro:done', handler, { once: true })
  return () => window.removeEventListener('intro:done', handler)
}

export { gsap, ScrollTrigger }
