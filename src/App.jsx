import { useLayoutEffect } from 'react'
import Nav from './components/Nav'
import Intro from './components/Intro'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import WavesBackdrop from './components/WavesBackdrop'
import Marquee from './components/Marquee'
import About from './components/About'
import Projects from './components/Projects'
import Strengths from './components/Strengths'
import Contact from './components/Contact'
import { initScrollAnimations } from './anim/scroll'

export default function App() {
  // 滚动动效集中在这里初始化：子组件 DOM 已挂载，StrictMode 双跑时可整体 revert。
  useLayoutEffect(() => initScrollAnimations(), [])

  return (
    <>
      <Intro />
      <WavesBackdrop />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />

        <div className="interlude" aria-label="工作流程">
          <div className="container interlude__inner">
            <span className="mono">WORKFLOW / 工作流</span>
            <p>
              <span>想法</span><i>→</i><span>剧本</span><i>→</i><span>分镜</span><i>→</i>
              <span>生成</span><i>→</i><span>剪辑</span><i>→</i><span>发布</span><i>→</i><span>复盘</span>
            </p>
            <span className="mono interlude__loop">↻ REPEAT</span>
          </div>
        </div>

        <Strengths />
        <Contact />
      </main>
    </>
  )
}
