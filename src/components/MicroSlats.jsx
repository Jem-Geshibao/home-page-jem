/**
 * 占位实现 —— 不含任何第三方组件源码。
 *
 * 作品集面板背景的 CSS 替身：竖细条 + 透视倾斜 + 缓慢起伏，保底让面板不至于是一块纯黑。
 *
 * 想要正式效果：
 *   1. 打开 https://reactbits.dev/backgrounds/micro-slats
 *   2. 选 JavaScript + CSS 变体，复制源码
 *   3. 覆盖本文件与 MicroSlats.css，调用方（GalleryBackdrop）无需改动
 *
 * 正式组件是 ogl + 流体着色器，支持鼠标搅动、光痕拖尾；本文件忽略交互类 props。
 */
import './MicroSlats.css'

export default function MicroSlats({
  color = '#AFC2CD',
  glintColor = '#FFFFFF',
  backgroundColor = '#080A0C',
  slatWidth = 10,
  gap = 3,
  speed = 0.45,
  className = '',
}) {
  return (
    <div
      className={`micro-slats${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      style={{
        '--ms-color': color,
        '--ms-glint': glintColor,
        '--ms-bg': backgroundColor,
        '--ms-slat': `${slatWidth}px`,
        '--ms-gap': `${gap}px`,
        '--ms-duration': `${Math.max(6, 18 / Math.max(0.15, speed))}s`,
      }}
    />
  )
}
