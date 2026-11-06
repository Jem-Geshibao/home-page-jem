import MicroSlats from './MicroSlats'

// 作品集面板专属背景：冷灰白细长条顺着「涌浪」起伏，鼠标划过会搅动流体并留下光痕。
// 只在面板打开时挂载（面板是 portal 到 body 的独立层），不影响全站的 PatternWaves。
// 亮度刻意压低 + veil 中间压暗，保证标题与视频卡文字始终清晰。
export default function GalleryBackdrop() {
  return (
    <div className="wg__bg" aria-hidden="true">
      <MicroSlats
        preset="swell"
        color="#AFC2CD"
        glintColor="#FFFFFF"
        backgroundColor="#080A0C"
        slatWidth={10}
        slatHeight={26}
        gap={3}
        roundness={0.75}
        scale={1.5}
        speed={0.45}
        direction={250}
        chop={0.62}
        stretch={0}
        glint={0.8}
        contrast={1.25}
        perspective={0.55}
        fog={0.5}
        interactive
        cursorStrength={0.55}
        cursorSize={48}
        swirl={0}
        trail={1.3}
        lean={0}
        intro
        introDuration={1.6}
      />
      <div className="wg__bg-veil" />
    </div>
  )
}
