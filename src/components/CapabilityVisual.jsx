// 能力卡片的抽象线框视觉：统一 560×116 画布，白色细线 + 冷灰，与作品区照片形成虚实对比
// 所有线条走同一组 class，hover 时由 CSS 统一点亮 / 描边动画，不引入 Canvas 或 WebGL。

function Frames() {
  const xs = [24, 134, 244, 354, 464]
  return (
    <g>
      {xs.map((x, i) => (
        <g key={x}>
          <rect className="capvis__fill" x={x} y={20} width={86} height={58} rx={2} />
          <circle className="capvis__dot" cx={x + 24 + i * 6} cy={38} r={3} />
          <path className="capvis__line" d={`M${x + 8} 70 L${x + 30} ${52 + i * 2} L${x + 54} 64 L${x + 78} 44`} />
          <line className="capvis__thin" x1={x + 8} y1={12} x2={x + 78} y2={12} />
        </g>
      ))}
      <line className="capvis__thin" x1={24} y1={96} x2={550} y2={96} />
      {xs.map((x) => <circle key={x} className="capvis__dot" cx={x + 43} cy={96} r={2.6} />)}
      <text className="capvis__label" x={24} y={112}>SHOT / FRAME SEQUENCE</text>
      <text className="capvis__label" x={550} y={112} textAnchor="end">05 FRAMES</text>
    </g>
  )
}

function Timeline() {
  const rows = [
    { y: 16, blocks: [[24, 92], [128, 66], [206, 104], [322, 74], [408, 128]] },
    { y: 46, blocks: [[24, 132], [168, 82], [262, 124], [398, 138]] },
    { y: 76, blocks: [[24, 68], [104, 148], [264, 90], [366, 170]] },
  ]
  const wave = [10, 18, 8, 22, 14, 26, 12, 20, 9, 24, 16, 11, 21, 13, 7, 19, 15, 23, 10, 17, 8, 20, 12, 25, 14, 9, 18, 11]
  return (
    <g>
      {rows.map((row, ri) => (
        <g key={row.y}>
          {row.blocks.map(([x, w], i) => (
            <rect
              key={`${x}-${i}`}
              className={ri === 2 ? 'capvis__thin-fill' : 'capvis__fill'}
              x={x} y={row.y} width={w} height={22} rx={2}
            />
          ))}
        </g>
      ))}
      {wave.map((h, i) => (
        <line key={i} className="capvis__thin" x1={30 + i * 19} y1={87 - h / 2} x2={30 + i * 19} y2={87 + h / 2} />
      ))}
      <line className="capvis__line capvis__playhead" x1={300} y1={8} x2={300} y2={104} />
      <path className="capvis__fill" d="M294 8 L306 8 L300 16 Z" />
      <text className="capvis__label" x={24} y={112}>TRACKS / VIDEO · AUDIO · FX</text>
      <text className="capvis__label" x={550} y={112} textAnchor="end">PLAYHEAD 00:12</text>
    </g>
  )
}

function Nodes() {
  const left = [[70, 26], [70, 58], [70, 90]]
  const mid = [[176, 38], [176, 78]]
  const right = [[470, 26], [470, 58], [470, 90]]
  const links = [
    'M82 26 C130 26 132 38 164 38', 'M82 58 C130 58 132 38 164 38',
    'M82 58 C130 58 132 78 164 78', 'M82 90 C130 90 132 78 164 78',
    'M190 38 C230 38 234 58 266 58', 'M190 78 C230 78 234 58 266 58',
    'M294 58 C334 58 338 26 458 26', 'M294 58 C334 58 338 58 458 58',
    'M294 58 C334 58 338 90 458 90',
  ]
  return (
    <g>
      {links.map((d, i) => <path key={i} className="capvis__line" d={d} />)}
      {left.map(([x, y]) => <circle key={`l${y}`} className="capvis__node" cx={x} cy={y} r={6} />)}
      {mid.map(([x, y]) => <rect key={`m${y}`} className="capvis__node" x={x - 6} y={y - 6} width={12} height={12} rx={2} />)}
      {right.map(([x, y]) => <circle key={`r${y}`} className="capvis__node" cx={x} cy={y} r={6} />)}
      <circle className="capvis__core" cx={280} cy={58} r={17} />
      <circle className="capvis__dot" cx={280} cy={58} r={4} />
      <line className="capvis__thin" x1={24} y1={106} x2={550} y2={106} />
      <text className="capvis__label" x={24} y={112}>INPUT / SKILL / OUTPUT</text>
      <text className="capvis__label" x={550} y={112} textAnchor="end">AGENT GRAPH</text>
    </g>
  )
}

function Rings() {
  const dots = [[0, -1], [0.7, -0.7], [1, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7]]
  return (
    <g>
      {[20, 34, 48].map((r) => <circle key={r} className="capvis__line" cx={280} cy={58} r={r} />)}
      <circle className="capvis__core" cx={280} cy={58} r={9} />
      <circle className="capvis__dot" cx={280} cy={58} r={3} />
      {dots.map(([dx, dy], i) => (
        <circle key={i} className="capvis__dot" cx={280 + dx * 48} cy={58 + dy * 48} r={2.8} />
      ))}
      <path className="capvis__thin" d="M24 58 H216 M344 58 H550" />
      {[42, 90, 138].map((x, i) => (
        <g key={x}>
          <rect className="capvis__fill" x={x} y={30 + i * 8} width={62} height={20} rx={2} />
          <line className="capvis__thin" x1={x + 8} y1={44 + i * 8} x2={x + 50 + i * 4} y2={44 + i * 8} />
        </g>
      ))}
      {[406, 456, 506].map((x, i) => (
        <g key={x}>
          <rect className="capvis__fill" x={x} y={30 + i * 8} width={44} height={20} rx={2} />
          <circle className="capvis__dot" cx={x + 22} cy={40 + i * 8} r={2.6} />
        </g>
      ))}
      <text className="capvis__label" x={24} y={108}>TOPIC → PUBLISH → REVIEW</text>
      <text className="capvis__label" x={550} y={108} textAnchor="end">LOOP 06</text>
    </g>
  )
}

function Crosshair() {
  return (
    <g>
      <path className="capvis__thin" d="M24 58 H196 M364 58 H550" />
      {[18, 32, 46].map((r) => (
        <path key={r} className="capvis__line" d={`M${120 - r} 58 A${r} ${r} 0 0 1 120 ${58 - r}`} />
      ))}
      <path className="capvis__line" d="M120 58 L168 26" />
      <circle className="capvis__dot" cx={152} cy={38} r={3} />
      <circle className="capvis__core" cx={280} cy={58} r={34} />
      <circle className="capvis__line" cx={280} cy={58} r={20} />
      <circle className="capvis__dot" cx={280} cy={58} r={3.5} />
      <path className="capvis__line" d="M280 14 V38 M280 78 V102 M236 58 H260 M300 58 H324" />
      <path className="capvis__thin" d="M246 24 L256 34 M314 24 L304 34 M246 92 L256 82 M314 92 L304 82" />
      {[[400, 34], [438, 76], [486, 44], [520, 82]].map(([x, y], i) => (
        <g key={x}>
          <circle className="capvis__line" cx={x} cy={y} r={10 + (i % 2) * 4} />
          <circle className="capvis__dot" cx={x} cy={y} r={2.4} />
        </g>
      ))}
      <text className="capvis__label" x={24} y={108}>RADAR / HIGHLIGHT DETECTION</text>
      <text className="capvis__label" x={550} y={108} textAnchor="end">CS2 CONTEXT</text>
    </g>
  )
}

function Growth() {
  const bars = [[40, 26], [96, 38], [152, 32], [208, 54], [264, 48], [320, 68], [376, 62], [432, 82]]
  const points = [[40, 82], [120, 74], [200, 60], [280, 52], [360, 34], [440, 22], [520, 14]]
  return (
    <g>
      <line className="capvis__thin" x1={24} y1={96} x2={550} y2={96} />
      {bars.map(([x, h]) => (
        <rect key={x} className="capvis__thin-fill" x={x} y={96 - h} width={30} height={h} rx={1} />
      ))}
      <polyline className="capvis__line" points={points.map(([x, y]) => `${x},${y}`).join(' ')} />
      {points.map(([x, y]) => <circle key={x} className="capvis__dot" cx={x} cy={y} r={3} />)}
      <path className="capvis__line" d="M508 26 L528 12 L528 20 M528 12 L520 12" />
      <line className="capvis__thin" x1={24} y1={20} x2={550} y2={20} />
      <line className="capvis__thin" x1={24} y1={58} x2={550} y2={58} />
      <text className="capvis__label" x={24} y={112}>PLAY / INTERACTION / CONVERSION</text>
      <text className="capvis__label" x={550} y={112} textAnchor="end">+128%</text>
    </g>
  )
}

// 六种线框场景：能力卡按 data.js 里的 visual 字段取用，取不到时退回 frames。
const SCENES = {
  frames: Frames,
  timeline: Timeline,
  nodes: Nodes,
  rings: Rings,
  crosshair: Crosshair,
  growth: Growth,
}

/** 能力卡内的抽象线框视觉（纯 SVG，无动画循环）。 */
export default function CapabilityVisual({ variant }) {
  const Scene = SCENES[variant] || Frames
  return (
    <svg className="capvis" viewBox="0 0 560 116" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Scene />
    </svg>
  )
}
