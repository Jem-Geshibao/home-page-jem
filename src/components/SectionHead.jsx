/**
 * 区块标题头：编号 + 英文小标 + 遮罩标题 + 说明 + 右侧插槽。
 * 标题外面那层 .section-head__title-mask 由 GSAP 做「遮罩上移揭开」，
 * 所以 h2 是包在 span 里而不是直接放在栅格里。
 *
 * @param {string} index 区块序号（"02"）
 * @param {string} en 英文小标（"ABOUT / 个人经历"）
 * @param {string} title 中文主标题
 * @param {string} [note] 标题下方的一句说明，可省略
 * @param {React.ReactNode} [right] 右侧插槽（外链 / 印章 / 计数）
 */
export default function SectionHead({ index, en, title, note, right }) {
  return (
    <div className="section-head">
      <span className="section-head__rule" aria-hidden="true" />
      <div className="section-head__meta">
        <span className="index-num">{index}</span>
        <span className="index-rule" />
        <span className="section-head__en">{en}</span>
      </div>
      <div className="section-head__main">
        <span className="section-head__title-mask">
          <h2 className="section-head__title">{title}</h2>
        </span>
        {note && <p className="section-head__note">{note}</p>}
      </div>
      {right && <div className="section-head__right">{right}</div>}
    </div>
  )
}
