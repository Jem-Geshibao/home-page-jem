// 首屏下的跑马灯文案：一行关键词循环滚动，作为「能力标签」的快速预告。
// 复制两组内容首尾相接，CSS 平移 -50% 时刚好无缝接上。
const words = [
  'AI VIDEO',
  'CS2 / CS:GO',
  'GAME CONTENT',
  'SHORT-FORM STRATEGY',
  'AGENT WORKFLOW',
  'POST PRODUCTION',
]

/** 关键词跑马灯（纯 CSS 动画，无 JS 参与；aria-hidden 避免读屏重复朗读）。 */
export default function Marquee() {
  const line = words.map((w) => (
    <span className="marquee__item" key={w}>
      {w} <span className="marquee__star">✳</span>
    </span>
  ))
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <div className="marquee__group">{line}</div>
        <div className="marquee__group">{line}</div>
      </div>
    </div>
  )
}
