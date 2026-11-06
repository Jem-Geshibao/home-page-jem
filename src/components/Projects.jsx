import { useCallback, useEffect, useState } from 'react'
import SectionHead from './SectionHead'
import ProjectVisual from './ProjectVisual'
import BorderGlow from './BorderGlow'
import WorkGallery from './WorkGallery'
import { projects, profile, glowColors } from '../data'

/** 从地址栏读 ?work=<slug>，作为「当前打开哪个作品集」的唯一数据源。 */
const workFromUrl = () => new URLSearchParams(window.location.search).get('work')

/**
 * 精选项目区（4 张 BorderGlow 卡片）。
 * 带 gallery 的项目点开走站内面板（?work=slug），开源项目直接外链 GitHub；
 * 面板状态放在 URL 里，所以刷新、分享、浏览器前进后退都能复现同一屏。
 */
export default function Projects() {
  // ?work=<slug> 驱动站内作品集面板：不动 #home/#work/#contact 锚点，链接可直接分享。
  const [activeWork, setActiveWork] = useState(workFromUrl)

  useEffect(() => {
    const onPop = () => setActiveWork(workFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // 打开作品集：写入 ?work= 并 pushState，产生一条历史记录（返回键可关面板）。
  const openWork = useCallback((slug) => {
    const url = new URL(window.location.href)
    url.searchParams.set('work', slug)
    window.history.pushState(null, '', url.pathname + url.search + url.hash)
    setActiveWork(slug)
  }, [])

  // 关闭作品集：用 replaceState 抹掉 ?work=（关闭动作不该再留一条历史）。
  const closeWork = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete('work')
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
    setActiveWork(null)
  }, [])

  const activeProject = projects.find((p) => p.work === activeWork)

  return (
    <section className="section work" id="work">
      <div className="container">
        <SectionHead
          index="03"
          en="SELECTED WORK / 精选项目"
          title="做过的东西，比说过的更清楚"
          note="从游戏官方内容到开源 Skill，从一条爆款视频到一套可复用的工作流。"
          right={
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
              GITHUB 主页 <span>↗</span>
            </a>
          }
        />

        <div className="work__grid">
          {projects.map((p) => {
            const hasGallery = Boolean(p.work)
            const href = hasGallery
              ? `?work=${p.work}${window.location.hash}`
              : (p.link || '#contact')

            return (
              <div
                key={p.id}
                className={`work-card ${p.span === 'wide' ? 'work-card--wide' : 'work-card--narrow'}`}
              >
                <BorderGlow
                  className="work-card__glow"
                  edgeSensitivity={22}
                  glowColor="200 24 88"
                  backgroundColor="#0A0D0F"
                  borderRadius={16}
                  glowRadius={28}
                  glowIntensity={0.9}
                  coneSpread={28}
                  animated={false}
                  fillOpacity={0.32}
                  colors={glowColors}
                >
                  <a
                    className="work-card__link"
                    href={href}
                    {...(p.link ? { target: '_blank', rel: 'noreferrer' } : {})}
                    onClick={hasGallery ? (e) => { e.preventDefault(); openWork(p.work) } : undefined}
                    aria-label={hasGallery ? `打开 ${p.title} 作品集` : `查看项目 ${p.title}`}
                  >
                    <ProjectVisual
                      variant={p.variant}
                      cover={p.cover}
                      coverPosition={p.coverPosition}
                      coverAlt={p.coverAlt}
                    />
                    <span className="work-card__veil" />
                    <span className="work-card__frame" />

                    <div className="work-card__top">
                      <span className="mono">PROJECT / {p.id}</span>
                      <span className="mono work-card__cat">{p.category}</span>
                    </div>

                    <div className="work-card__bottom">
                      <div className="work-card__main">
                        <span className="work-card__en mono">{p.en} · {p.year}</span>
                        <h3 className="work-card__title">{p.title}</h3>
                        <p className="work-card__desc">{p.desc}</p>
                        <div className="work-card__tags">
                          {p.tags.map((t) => <span key={t}>{t}</span>)}
                        </div>
                      </div>
                      <div className="work-card__aside">
                        {/* 四张卡片统一用 ↗：hover 时共用 rotate(45deg) 动效，视觉与指向完全一致。
                            「站内展开 / 新标签外链」的区别只保留在链接的 aria-label 上。 */}
                        <span className="work-card__arrow" aria-hidden="true">↗</span>
                        <div className="work-card__metrics">
                          {p.metrics.map((m) => <span key={m} className="mono">{m}</span>)}
                        </div>
                      </div>
                    </div>
                  </a>
                </BorderGlow>
              </div>
            )
          })}
        </div>

        <div className="work__foot">
          <span className="mono">04 / 04 PROJECTS SHOWN</span>
          <span className="work__foot-line" />
          <span className="mono">MORE ON REQUEST</span>
        </div>
      </div>

      {activeProject && <WorkGallery project={activeProject} onClose={closeWork} />}
    </section>
  )
}
