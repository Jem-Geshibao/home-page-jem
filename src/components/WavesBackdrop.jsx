import PatternWaves from './PatternWaves'

// 全站丝波点阵背景：冷灰白细点顺着丝绸折痕起伏，呼应纯白主色但压低亮度与速度，
// 让它像一层材质而不是抢眼的主视觉。Hero 不透明且 z-index:1，头图视频不受影响。
export default function WavesBackdrop() {
  return (
    <div className="waves-backdrop" aria-hidden="true">
      <PatternWaves
        preset="silk"
        color="#8FA3B0"
        backgroundColor="#08090B"
        spacing={14}
        markSize={0.62}
        depth={0.85}
        shine={0.5}
        contrast={1.15}
        speed={0.22}
        scale={1.5}
        direction={20}
        opacity={0.55}
        fade="edges"
        fadeSize={0.7}
        interactive
        cursorStrength={0.35}
        cursorSize={80}
        intro={false}
      />
      <div className="waves-backdrop__veil" />
    </div>
  )
}
