import SectionHead from './SectionHead'
import { profile, stats, timeline } from '../data'

/**
 * 个人经历区（02）。
 * 左栏：肖像 + 联系方式卡片（电话/邮箱/GitHub/常驻地，全部取自 profile）。
 * 右栏：自我介绍、项目数据、时间线。
 * 所有文案与数字都来自 src/data.js，改内容不用动这个文件。
 */
export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHead
          index="02"
          en="ABOUT / 个人经历"
          title="不只会剪，也懂为什么被看见"
          note="计算机应用技术出身，把内容生产拆成可复用的流程，再一帧一帧做回来。"
          right={<span className="section-head__stamp">EST. 2022 — WUHAN</span>}
        />

        <div className="about__grid">
          <div className="about__col about__col--left">
            <div className="portrait">
              <div className="portrait__frame">
                <img src="/avatar.jpg" alt={`${profile.name} 头像`} loading="lazy" />
                <span className="portrait__tag">PORTRAIT / 001</span>
                <span className="portrait__corner portrait__corner--tl" />
                <span className="portrait__corner portrait__corner--br" />
                <span className="portrait__scan" />
              </div>
              <div className="portrait__caption">
                <span>{profile.name}</span>
                <span className="mono">{profile.latin}</span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card__head">
                <span>联系方式</span>
                <span className="mono">/ CONTACT</span>
              </div>
              <a className="contact-card__row" href={`tel:${profile.phone}`}>
                <span className="mono">TEL</span>
                <span>{profile.phone}</span>
                <i>↗</i>
              </a>
              <a className="contact-card__row" href={`mailto:${profile.email}`}>
                <span className="mono">MAIL</span>
                <span>{profile.email}</span>
                <i>↗</i>
              </a>
              <a className="contact-card__row" href={profile.github} target="_blank" rel="noreferrer">
                <span className="mono">GIT</span>
                <span>github.com/Jem-Geshibao</span>
                <i>↗</i>
              </a>
              <div className="contact-card__row contact-card__row--static">
                <span className="mono">BASE</span>
                <span>{profile.location}</span>
                <i>—</i>
              </div>
            </div>
          </div>

          <div className="about__col about__col--right">
            <div className="about__intro">
              <span className="about__quote" aria-hidden="true">“</span>
              <p className="about__lead">{profile.intro}</p>
              <p className="about__sub">{profile.introSub}</p>
              <div className="about__edu">
                <span className="mono">EDUCATION</span>
                <span>{profile.education}</span>
                <span className="mono about__edu-date">{profile.educationPeriod}</span>
              </div>
            </div>

            <div className="stats">
              <div className="stats__head">
                <span>项目数据</span>
                <span className="mono">/ BY THE NUMBERS</span>
              </div>
              <div className="stats__grid">
                {/* 数字条：value 与 suffix 分开渲染，让单位（+ / %）能用小字号 */}
                {stats.map((s) => (
                  <div className="stat" key={s.label}>
                    <div className="stat__value">
                      {s.value}<i>{s.suffix}</i>
                    </div>
                    <div className="stat__label">{s.label}</div>
                    <div className="stat__note mono">{s.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="timeline">
              <div className="timeline__head">
                <span>经历</span>
                <span className="mono">/ EXPERIENCE</span>
              </div>
              {/* 时间线：current 为 true 的那条会亮起呼吸点，做「在职中」标记 */}
              {timeline.map((item) => (
                <div className={`timeline__item ${item.current ? 'is-current' : ''}`} key={item.title}>
                  <div className="timeline__period mono">
                    {item.current && <i className="pulse-dot" />}
                    {item.period}
                  </div>
                  <div className="timeline__body">
                    <div className="timeline__title">
                      {item.title}
                      <span className="mono">{item.sub}</span>
                    </div>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
