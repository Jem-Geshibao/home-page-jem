/**
 * 占位实现 —— 不含任何第三方组件源码。
 *
 * 作品卡的「边框辉光」CSS 替身：悬停时边框提亮 + 光标位置带一团跟随的柔光。
 * 同名 props、同构 DOM（.border-glow-card > .edge-light + .border-glow-inner），
 * 因此调用方（Projects）与 styles.css 里的选择器都不用改。
 *
 * 想要正式效果：
 *   1. 打开 https://reactbits.dev/components/border-glow
 *   2. 选 JavaScript + CSS 变体，复制源码
 *   3. 覆盖本文件与 BorderGlow.css
 *
 * 正式组件用 mesh gradient 沿「最近的边」点亮、支持多色锥形渐变；
 * 本文件只保留「边框 + 跟随光斑」的近似观感。
 */
import { useCallback, useRef } from 'react'
import './BorderGlow.css'

export default function BorderGlow({
  children,
  className = '',
  glowColor = '200 24 88',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  fillOpacity = 0.5,
  style,
}) {
  const cardRef = useRef(null)

  // 把光标位置写进 CSS 变量，光斑由样式层绘制，React 不参与逐帧渲染。
  const handlePointerMove = useCallback((event) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }, [])

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      className={`border-glow-card${className ? ` ${className}` : ''}`}
      style={{
        '--card-bg': backgroundColor,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--glow-intensity': glowIntensity,
        '--fill-opacity': fillOpacity,
        '--glow': glowColor,
        ...style,
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  )
}
