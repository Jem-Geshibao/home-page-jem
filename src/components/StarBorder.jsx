/**
 * 占位实现 —— 不含任何第三方组件源码。
 *
 * 优势卡的「流光边框」CSS 替身：静默状态只有一道细描边，悬停时一段冷白光沿边框滑行。
 * 同构 DOM（.star-border > .star-border__light + children）、同名 CSS 变量，
 * 因此 Strengths 里那套 props 与 styles.css 的 `.cap.star-border` 覆盖都能继续生效。
 *
 * 想要正式效果：
 *   1. 打开 https://reactbits.dev/components/star-border
 *   2. 选 JavaScript + CSS 变体，复制源码
 *   3. 覆盖本文件与 StarBorder.css
 *
 * 正式组件用 canvas 沿边框路径绘制拖尾光带（可选星点 / 点击脉冲）；
 * 本文件是遮罩环 + 渐变滑行，只有「光在边框上跑」这一层观感。
 */
import './StarBorder.css'

export default function StarBorder({
  as: Component = 'button',
  children,
  className = '',
  style,
  thickness = 1,
  radius = 12,
  backgroundColor,
  textColor,
  borderColor,
  ...rest
}) {
  return (
    <Component
      className={`star-border${className ? ` ${className}` : ''}`}
      style={{
        '--star-border-radius': `${radius}px`,
        '--star-border-thickness': `${thickness}px`,
        '--star-border-surface': backgroundColor ?? '#0D1115',
        '--star-border-text': textColor ?? '#ECEEE9',
        '--star-border-track': borderColor ?? 'rgba(236,238,233,.13)',
        ...style,
      }}
      {...(Component === 'button' && rest.type === undefined ? { type: 'button' } : null)}
      {...rest}
    >
      <span className="star-border__light" aria-hidden="true" />
      {children}
    </Component>
  )
}
