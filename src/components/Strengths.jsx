import SectionHead from './SectionHead'
import CapabilityVisual from './CapabilityVisual'
import StarBorder from './StarBorder'
import { capabilities } from '../data'

// hover="reveal"：静止时星轨完全隐藏、rAF 也会停下；鼠标进入卡片才点亮并绕边流动。
// clickPulse 关掉，因为能力卡不是按钮，点击时的环形脉冲会和悬停效果打架。
const STAR_PROPS = {
  as: 'article',
  color: '#FFFFFF',
  trailColor: '#A8BDC9',
  duration: 2.8,
  direction: 'clockwise',
  stars: 1,
  trailLength: 0.3,
  thickness: 1.3,
  radius: 14,
  glow: 0.58,
  hover: 'reveal',
  sparkle: false,
  clickPulse: false,
  theme: 'dark',
  backgroundColor: '#0D1115',
  textColor: '#ECEEE9',
  borderColor: 'rgba(236,238,233,.13)',
}

export default function Strengths() {
  return (
    <section className="section strengths" id="capabilities">
      <div className="container">
        <SectionHead
          index="04"
          en="CAPABILITIES / 个人优势"
          title="一个人，就是一条产线"
          note="从创意、生成、剪辑到分发与复盘，每个环节都能自己跑通，也能和团队接得上。"
          right={<span className="section-head__stamp">06 / SKILL SETS</span>}
        />

        <div className="cap-grid">
          {capabilities.map((c) => (
            <div className="cap-cell" key={c.id}>
              <StarBorder {...STAR_PROPS} className={`cap cap--${c.size}`}>
                {/* 内容单独一层做圆角裁切：卡本体必须 overflow:visible，
                    否则 StarBorder 外溢 48px 的辉光会被切掉。 */}
                <div className="cap__inner">
                  <span className="cap__ghost" aria-hidden="true">{c.id}</span>
                  <div className="cap__top">
                    <span className="mono cap__id">{c.id} / 06</span>
                    <span className="mono cap__key">{c.key}</span>
                  </div>
                  <div className="cap__visual">
                    <CapabilityVisual variant={c.visual} />
                  </div>
                  <div className="cap__body">
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                  <div className="cap__tags">
                    {c.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </StarBorder>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
