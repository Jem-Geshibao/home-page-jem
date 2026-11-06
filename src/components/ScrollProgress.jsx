import { useEffect, useRef } from 'react'

/**
 * 顶部阅读进度条：把「已滚动比例」映射成 scaleX(0~1)。
 * 滚动事件只登记一次 rAF，避免每个 scroll 事件都写一次样式（合成器友好）。
 */
export default function ScrollProgress() {
  const ref = useRef(null)

  useEffect(() => {
    let raf = 0
    /** 读一次滚动位置并写入 transform；raf 句柄清零表示「本帧已处理」。 */
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (ref.current) ref.current.style.transform = `scaleX(${p})`
      raf = 0
    }
    /** 滚动/尺寸变化时只排队一帧，本帧内多次触发会合并成一次读取。 */
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}
