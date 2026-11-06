/**
 * 占位实现 —— 不含任何第三方组件源码。
 *
 * 这里的「丝波点阵」是用纯 CSS 模拟的低成本替身：只保留同名 props 与同名容器类，
 * 视觉上是一个缓慢漂移的冷灰点阵，用于保证项目 clone 下来就能跑、页面结构完整。
 *
 * 想要正式效果：
 *   1. 打开 https://reactbits.dev/backgrounds/pattern-waves
 *   2. 选 JavaScript + CSS 变体，复制源码
 *   3. 覆盖本文件与 PatternWaves.css，调用方（WavesBackdrop）无需改动
 *
 * 正式组件基于 ogl 的 WebGL 着色器，支持丝波 / 涟漪 / 光标交互；
 * 本文件只做降级示意，交互类 props（interactive、cursorStrength 等）会被忽略。
 */
import './PatternWaves.css'

export default function PatternWaves({
  color = '#8FA3B0',
  backgroundColor = '#08090B',
  spacing = 14,
  opacity = 1,
  className = '',
}) {
  return (
    <div
      className={`pattern-waves${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      style={{
        '--pw-color': color,
        '--pw-bg': backgroundColor,
        '--pw-spacing': `${spacing}px`,
        '--pw-opacity': opacity,
      }}
    />
  )
}
