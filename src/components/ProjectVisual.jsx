import { useState } from 'react'

const A = '#FFFFFF'

function Arena() {
  const horizontals = [322, 340, 362, 388, 420, 458, 502]
  const rays = [-260, -120, 0, 130, 280, 460, 680, 940, 1220]
  return (
    <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="pvis__svg">
      <defs>
        <linearGradient id="ar-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#101418" />
          <stop offset="1" stopColor="#04070A" />
        </linearGradient>
        <radialGradient id="ar-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#39464E" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0A1216" stopOpacity="0" />
        </radialGradient>
        <pattern id="ar-scan" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#ffffff" opacity="0.025" />
        </pattern>
      </defs>
      <rect width="800" height="520" fill="url(#ar-bg)" />
      <ellipse cx="520" cy="205" rx="360" ry="250" fill="url(#ar-glow)" />
      <g fill="none" stroke={A} strokeOpacity="0.14" strokeWidth="1">
        {horizontals.map((y) => <line key={y} x1="0" y1={y} x2="800" y2={y} />)}
        {rays.map((x) => <line key={x} x1="400" y1="316" x2={x} y2="520" />)}
      </g>
      <path d="M0 316 L120 250 L196 278 L268 232 L340 288 L410 262 L470 316 Z" fill="#0A0E11" opacity="0.9" />
      <path d="M470 316 L540 268 L610 296 L690 244 L800 288 L800 316 Z" fill="#0A0F12" opacity="0.85" />
      <path d="M0 316 L120 250 L196 278 L268 232 L340 288 L410 262 L470 316" fill="none" stroke={A} strokeOpacity="0.3" strokeWidth="1.2" />
      <g transform="translate(620 148)" fill="none" stroke={A} strokeOpacity="0.6">
        <circle r="46" strokeWidth="1" />
        <circle r="30" strokeOpacity="0.32" />
        <circle r="4" fill={A} stroke="none" />
        <path d="M-62 0h28 M34 0h28 M0 -62v28 M0 34v28" strokeWidth="1.2" />
        <path d="M-46 -12v-14h14 M46 -12v-14h-14 M-46 12v14h14 M46 12v14h-14" strokeOpacity="0.35" />
      </g>
      <g fill={A} opacity="0.55" fontFamily="monospace" fontSize="10" letterSpacing="3">
        <text x="40" y="52">TACTICAL FRAME / 001</text>
        <text x="40" y="72" opacity="0.6">ASSET · SCENE · SHOT</text>
        <text x="660" y="460">80W+</text>
      </g>
      <rect width="800" height="520" fill="url(#ar-scan)" />
    </svg>
  )
}

function Drama() {
  const frames = [0, 1, 2, 3]
  return (
    <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="pvis__svg">
      <defs>
        <linearGradient id="dr-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#111318" />
          <stop offset="1" stopColor="#06080B" />
        </linearGradient>
        <linearGradient id="dr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C262E" />
          <stop offset="1" stopColor="#0A1014" />
        </linearGradient>
      </defs>
      <rect width="800" height="520" fill="url(#dr-bg)" />
      <text x="40" y="62" fill={A} opacity="0.55" fontFamily="monospace" fontSize="11" letterSpacing="4">STORYBOARD / 06 FRAMES</text>
      {frames.map((i) => {
        const x = 40 + i * 184
        return (
          <g key={i}>
            <rect x={x} y={100} width={168} height={196} rx="2" fill="url(#dr-sky)" stroke="#ffffff" strokeOpacity="0.14" />
            <rect x={x - 5} y={94} width="10" height="14" rx="1" fill="#ffffff" opacity="0.18" />
            <rect x={x + 163} y={94} width="10" height="14" rx="1" fill="#ffffff" opacity="0.18" />
            <rect x={x - 5} y={288} width="10" height="14" rx="1" fill="#ffffff" opacity="0.18" />
            <rect x={x + 163} y={288} width="10" height="14" rx="1" fill="#ffffff" opacity="0.18" />
            <circle cx={x + 84 + i * 6} cy={164 - i * 5} r="24" fill={A} opacity={0.1 + i * 0.06} />
            <path d={`M${x} 262 L${x + 48} 214 L${x + 88} 248 L${x + 124} 202 L${x + 168} 258 V296 H${x} Z`} fill="#0B1013" />
            <text x={x + 8} y={282} fill="#ffffff" opacity="0.35" fontFamily="monospace" fontSize="9">S{i + 1} / {i + 3}s</text>
            {i === 2 && <rect x={x} y={100} width={168} height={196} fill="none" stroke={A} strokeWidth="2" opacity="0.85" />}
          </g>
        )
      })}
      <g fontFamily="monospace" fontSize="10" letterSpacing="2">
        <text x="40" y="336" fill="#ffffff" opacity="0.4">TIMELINE</text>
      </g>
      <g>
        <line x1="40" y1="356" x2="760" y2="356" stroke="#ffffff" strokeOpacity="0.14" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x={40 + i * 120} y={350} width={i % 2 ? 76 : 104} height="12" fill={A} opacity={i === 2 ? 0.7 : 0.18} />
            <line x1={40 + i * 120} y1="344" x2={40 + i * 120} y2="368" stroke="#ffffff" strokeOpacity="0.2" />
          </g>
        ))}
      </g>
      <g stroke={A} strokeOpacity="0.5" fill="none">
        <path d="M40 424 H760" strokeOpacity="0.12" />
        <path d="M40 424 " />
      </g>
      <g fill={A} opacity="0.45">
        {Array.from({ length: 56 }, (_, i) => {
          const h = 5 + Math.abs(Math.sin(i * 1.7) * 26)
          return <rect key={i} x={40 + i * 13} y={424 - h / 2} width="3" height={h} rx="1.5" />
        })}
      </g>
      <text x="40" y="476" fill="#ffffff" opacity="0.3" fontFamily="monospace" fontSize="10" letterSpacing="3">VISUAL CONTINUITY CHECK · PASS</text>
    </svg>
  )
}

function Cast() {
  return (
    <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="pvis__svg">
      <defs>
        <linearGradient id="cs-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0E1216" />
          <stop offset="1" stopColor="#05070A" />
        </linearGradient>
        <radialGradient id="cs-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2A3C46" stopOpacity="0.7" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="520" fill="url(#cs-bg)" />
      <ellipse cx="420" cy="230" rx="400" ry="240" fill="url(#cs-glow)" />
      <rect x="40" y="40" width="720" height="440" fill="none" stroke="#ffffff" strokeOpacity="0.1" />
      <g>
        <rect x="300" y="40" width="200" height="52" fill="#0A0E10" stroke="#ffffff" strokeOpacity="0.12" />
        <text x="326" y="74" fill="#ffffff" opacity="0.85" fontFamily="monospace" fontSize="20">16 : 14</text>
        <circle cx="474" cy="66" r="4" fill="#FF5C46" />
        <text x="486" y="71" fill="#FF5C46" fontFamily="monospace" fontSize="10" letterSpacing="2">LIVE</text>
      </g>
      <g stroke={A} strokeOpacity="0.55" fill="none">
        <circle cx="400" cy="230" r="66" />
        <circle cx="400" cy="230" r="20" strokeOpacity="0.28" />
        <path d="M400 148v30 M400 282v30 M318 230h30 M452 230h30" strokeWidth="1.4" />
      </g>
      <g fill="#ffffff" opacity="0.22" fontFamily="monospace" fontSize="10" letterSpacing="3">
        <text x="62" y="76">MAP / DUST II</text>
        <text x="62" y="96">ROUND 30</text>
        <text x="640" y="76">CS2 MAJOR</text>
      </g>
      <g>
        <rect x="150" y="366" width="500" height="30" fill="#000" opacity="0.55" />
        <text x="400" y="386" textAnchor="middle" fill="#ECEEE9" fontSize="14" fontFamily="monospace" letterSpacing="1">HE PICKS UP THE AWP — ONE TAP, HEADSHOT</text>
        <rect x="196" y="404" width="408" height="30" fill="#000" opacity="0.55" />
        <text x="400" y="425" textAnchor="middle" fill={A} fontSize="14" letterSpacing="2">他起大狙，一枪爆头</text>
      </g>
      <g fill={A} opacity="0.4">
        {Array.from({ length: 60 }, (_, i) => {
          const h = 4 + Math.abs(Math.sin(i * 0.9) * 18)
          return <rect key={i} x={40 + i * 12} y={460 - h / 2} width="2" height={h} />
        })}
      </g>
      <text x="40" y="500" fill="#ffffff" opacity="0.3" fontFamily="monospace" fontSize="10" letterSpacing="3">EN / ZH  ·  SRT  ·  TERM CORRECTION</text>
    </svg>
  )
}

function Beanbag() {
  const tiles = Array.from({ length: 12 }, (_, i) => i)
  return (
    <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="pvis__svg">
      <defs>
        <linearGradient id="bb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0C1114" />
          <stop offset="1" stopColor="#05070A" />
        </linearGradient>
        <linearGradient id="bb-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1A2228" />
          <stop offset="1" stopColor="#0A1014" />
        </linearGradient>
      </defs>
      <rect width="800" height="520" fill="url(#bb-bg)" />
      <text x="40" y="58" fill={A} opacity="0.55" fontFamily="monospace" fontSize="11" letterSpacing="4">ASSET GRID / NO WATERMARK</text>
      {tiles.map((i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = 40 + col * 132
        const y = 90 + row * 132
        const hot = i === 5
        return (
          <g key={i}>
            <rect x={x} y={y} width="116" height="116" rx="3" fill="url(#bb-tile)" stroke={hot ? A : '#ffffff'} strokeOpacity={hot ? 0.9 : 0.1} strokeWidth={hot ? 1.6 : 1} />
            <circle cx={x + 58} cy={y + 48} r={18 + (i % 3) * 5} fill={A} opacity={hot ? 0.22 : 0.07} />
            <path d={`M${x} ${y + 96} L${x + 34} ${y + 68} L${x + 66} ${y + 88} L${x + 92} ${y + 62} L${x + 116} ${y + 84} V${y + 116} H${x} Z`} fill="#0B1114" opacity="0.9" />
            {hot && (
              <g>
                <circle cx={x + 100} cy={y + 16} r="11" fill={A} />
                <path d={`M${x + 100} ${y + 10}v10 M${x + 95} ${y + 16}l5 5 5-5`} stroke="#08090B" strokeWidth="1.6" fill="none" />
              </g>
            )}
          </g>
        )
      })}
      <g>
        <rect x="580" y="90" width="180" height="116" rx="3" fill="#0A0F11" stroke="#ffffff" strokeOpacity="0.1" />
        <text x="600" y="124" fill="#ffffff" opacity="0.4" fontFamily="monospace" fontSize="10" letterSpacing="2">BATCH EXPORT</text>
        <text x="600" y="164" fill={A} fontFamily="monospace" fontSize="26">.ZIP</text>
        <text x="600" y="188" fill="#ffffff" opacity="0.3" fontFamily="monospace" fontSize="10">12 ITEMS / 100%</text>
      </g>
      <g>
        <rect x="580" y="222" width="180" height="116" rx="3" fill="#0A0F11" stroke="#ffffff" strokeOpacity="0.1" />
        <circle cx="670" cy="270" r="30" fill="none" stroke="#FF5C46" strokeOpacity="0.5" strokeWidth="1.4" />
        <line x1="648" y1="248" x2="692" y2="292" stroke="#FF5C46" strokeOpacity="0.6" strokeWidth="1.4" />
        <text x="600" y="322" fill="#ffffff" opacity="0.3" fontFamily="monospace" fontSize="10" letterSpacing="2">WATERMARK / OFF</text>
      </g>
      <g fill={A} opacity="0.5" fontFamily="monospace" fontSize="10" letterSpacing="3">
        <text x="580" y="380">CHROMIUM EXT</text>
        <text x="580" y="400" opacity="0.6">JSZIP · BLOB URL</text>
      </g>
      <line x1="40" y1="470" x2="760" y2="470" stroke="#ffffff" strokeOpacity="0.1" />
      <text x="40" y="496" fill="#ffffff" opacity="0.3" fontFamily="monospace" fontSize="10" letterSpacing="3">DETECT → EXTRACT → DOWNLOAD</text>
    </svg>
  )
}

// 四种主题的抽象 SVG 插画：真实封面加载失败（或还没配图）时顶上去，卡片不会开天窗。
const SCENES = { arena: Arena, drama: Drama, cast: Cast, beanbag: Beanbag }

/**
 * 作品卡视觉层：有真实封面就渲染 <img>，否则退回对应主题的 SVG 插画。
 * @param {string} variant 主题名（arena / drama / cast / beanbag），决定插画与调色
 * @param {string} [cover] 封面图路径
 * @param {string} [coverPosition] object-position，逐图设置裁切焦点
 * @param {string} [coverAlt] 封面替代文本（装饰性插画则不需要）
 */
export default function ProjectVisual({ variant, cover, coverPosition = '50% 50%', coverAlt = '' }) {
  // 封面加载失败时退回原来的抽象 SVG 插画，避免卡片出现空白
  const [coverFailed, setCoverFailed] = useState(false)
  const Scene = SCENES[variant] || Arena
  const showCover = Boolean(cover) && !coverFailed

  return (
    <div className={`pvis pvis--${variant}${showCover ? ' pvis--photo' : ''}`}>
      {showCover ? (
        <img
          className="pvis__cover"
          src={cover}
          alt={coverAlt}
          decoding="async"
          style={{ objectPosition: coverPosition }}
          onError={() => setCoverFailed(true)}
        />
      ) : (
        <Scene />
      )}
      <span className="pvis__noise" />
    </div>
  )
}
