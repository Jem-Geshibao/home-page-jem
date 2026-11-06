import { useEffect, useState } from 'react'
import { profile } from '../data'

/**
 * 页脚本地时间：固定用 Asia/Shanghai 时区（访客在别的时区也能看到「作者此刻的时间」），
 * 每秒 tick 一次，卸载时清掉定时器。
 */
function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat('zh-CN', {
          timeZone: 'Asia/Shanghai',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date()),
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/** 联系区：大标题揭幕 + 邮箱 CTA + 六条联系渠道 + 页脚。 */
export default function Contact() {
  const time = useClock()

  // 联系方式统一在这里配置：href 为 null 的渲染成静态行（没有可跳转的地址，不放占位链接）。
  const channels = [
    { key: 'EMAIL', label: '邮箱', value: profile.email, href: `mailto:${profile.email}` },
    { key: 'PHONE', label: '电话', value: profile.phone, href: `tel:${profile.phone}` },
    { key: 'GITHUB', label: '开源主页', value: 'Jem-Geshibao', href: profile.github },
    { key: 'KUAISHOU', label: '快手', value: '1.5W 粉丝 · 累计获赞 30W+', href: null },
    { key: 'WECHAT', label: '视频号', value: '1000+ 粉丝 · 生态号运营', href: null },
    { key: 'LOCATION', label: '所在地', value: profile.location, href: null },
  ]

  return (
    <section className="contact" id="contact">
      <div className="contact__bg" aria-hidden="true">
        <span className="contact__glow" />
        <span className="contact__grid" />
        <span className="contact__word">CONTACT</span>
      </div>

      <div className="container contact__inner">
        <div className="contact__head">
          <div className="contact__index">
            <span className="index-num">05</span>
            <span className="index-rule" />
            <span className="mono">CONTACT / 联系方式</span>
          </div>
          <span className="mono contact__available"><i className="pulse-dot" /> 目前可接商业合作 / 内容项目</span>
        </div>

        <div className="contact__main">
          <div className="contact__title-wrap">
            <h2 className="contact__title">
              <span>要不要一起，</span>
              <span className="contact__title-outline">做点有意思的<span className="contact__period">.</span></span>
            </h2>
            <p className="contact__lead">
              游戏内容、AI 影像、短视频策划与账号增长 —— 有一个想法，就从一条消息开始。
            </p>
          </div>

          <div className="contact__email-wrap">
            <a className="contact__email" href={`mailto:${profile.email}`}>
              <span>{profile.email}</span>
              <i aria-hidden="true">↗</i>
            </a>
            <a className="btn btn--solid contact__cta" href={`mailto:${profile.email}`}>
              写封邮件 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="contact__channels">
          {channels.map((c) =>
            c.href ? (
              <a
                className="channel"
                key={c.key}
                href={c.href}
                {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className="mono channel__key">{c.key}</span>
                <span className="channel__label">{c.label}</span>
                <span className="channel__value">{c.value}</span>
                <i aria-hidden="true">↗</i>
              </a>
            ) : (
              <div className="channel channel--static" key={c.key}>
                <span className="mono channel__key">{c.key}</span>
                <span className="channel__label">{c.label}</span>
                <span className="channel__value">{c.value}</span>
                <i aria-hidden="true">—</i>
              </div>
            ),
          )}
        </div>

        <footer className="footer">
          <span>© 2026 {profile.name} · {profile.latin}</span>
          <span className="mono footer__mid">BUILT WITH REACT + VITE / NO TEMPLATE</span>
          <span className="mono footer__time">LOCAL TIME · {time || '--:--:--'} CST</span>
          <a
            className="footer__top"
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            BACK TO TOP <span aria-hidden="true">↑</span>
          </a>
        </footer>
      </div>
    </section>
  )
}
