import { useCallback, useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { gameConfig } from './game/config/gameConfig'
import { useFarmStore } from './store/gameStore'
import { startBackgroundMusic } from './game/systems/AudioManager'
import './App.css'

function App() {
  const host = useRef<HTMLDivElement>(null)
  const game = useRef<Phaser.Game | null>(null)
  const videoTimer = useRef<number | null>(null)
  const loadingFinished = useRef(false)
  const [portrait, setPortrait] = useState(false)
  const [showLoadingVideo, setShowLoadingVideo] = useState(true)
  const finishLoadingVideo = useCallback((status: 'complete' | 'unavailable') => {
    if (loadingFinished.current) return
    loadingFinished.current = true
    if (videoTimer.current !== null) window.clearTimeout(videoTimer.current)
    document.documentElement.dataset.happyFarmLoadingVideo = status
    window.dispatchEvent(new Event(`happy-farm:loading-video-${status}`))
    setShowLoadingVideo(false)
  }, [])
  const markVideoUnavailable = useCallback(() => finishLoadingVideo('unavailable'), [finishLoadingVideo])
  const markVideoPlaying = useCallback(() => {
    if (loadingFinished.current) return
    document.documentElement.dataset.happyFarmLoadingVideo = 'playing'
    window.dispatchEvent(new Event('happy-farm:loading-video-playing'))
  }, [])
  const requestVideoPlay = useCallback((video: HTMLVideoElement) => { void video.play().catch(markVideoUnavailable) }, [markVideoUnavailable])
  useEffect(() => {
    const startMusic = () => startBackgroundMusic()
    window.addEventListener('pointerdown', startMusic, { once: true })
    return () => window.removeEventListener('pointerdown', startMusic)
  }, [])
  useEffect(() => {
    const check = () => setPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 700)
    let observer: ResizeObserver | undefined
    check(); window.addEventListener('resize', check)
    const launch = async () => {
      await document.fonts?.ready
      if (host.current && !game.current) {
        game.current = new Phaser.Game({ ...gameConfig, parent: host.current })
        if (import.meta.env.DEV) {
          const qaWindow = window as Window & { __HAPPY_FARM_QA__?: { scenes: () => string[]; state: () => ReturnType<typeof useFarmStore.getState>; reset: () => void; start: (scene: string) => void } }
          qaWindow.__HAPPY_FARM_QA__ = {
            scenes: () => game.current?.scene.getScenes(true).map((scene) => scene.scene.key) ?? [],
            state: () => useFarmStore.getState(),
            reset: () => useFarmStore.getState().reset(),
            start: (scene: string) => game.current?.scene.start(scene),
          }
        }
        observer = new ResizeObserver(() => requestAnimationFrame(() => game.current?.scale.refresh()))
        observer.observe(host.current)
      }
    }
    void launch()
    // The supplied animation is an opening only: it must never become a gate that
    // leaves a child on Loading.  This watchdog is deliberately independent of
    // browser media events, which can be unreliable on mobile/embedded browsers.
    videoTimer.current = window.setTimeout(() => finishLoadingVideo('complete'), 5000)
    return () => { if (videoTimer.current !== null) window.clearTimeout(videoTimer.current); delete (window as Window & { __HAPPY_FARM_QA__?: unknown }).__HAPPY_FARM_QA__; window.removeEventListener('resize', check); observer?.disconnect(); game.current?.destroy(true); game.current = null }
  }, [finishLoadingVideo])
  return <main className="game-shell"><div className="game-stage">{showLoadingVideo && <video className="loading-video" autoPlay muted playsInline loop preload="auto" onCanPlay={(event) => requestVideoPlay(event.currentTarget)} onPlaying={markVideoPlaying} onError={markVideoUnavailable} aria-hidden="true"><source src="/assets/kling_20261108_VIDEO_Animate_th_4110_0.mp4" type="video/mp4" /></video>}<div ref={host} className="game-canvas" aria-label="Happy Farm game" /></div>{portrait && <div className="rotate-note"><div className="phone">▱</div><strong>Hãy xoay ngang màn hình</strong><span>Happy Farm sẽ vui hơn ở chế độ ngang!</span></div>}</main>
}
export default App
