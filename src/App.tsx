import { useCallback, useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { gameConfig } from './game/config/gameConfig'
import { useFarmStore } from './store/gameStore'
import './App.css'

function App() {
  const host = useRef<HTMLDivElement>(null)
  const game = useRef<Phaser.Game | null>(null)
  const videoTimer = useRef<number | null>(null)
  const videoFallbackTimer = useRef<number | null>(null)
  const [portrait, setPortrait] = useState(false)
  const [showLoadingVideo, setShowLoadingVideo] = useState(true)
  const markVideoUnavailable = useCallback(() => {
    if (videoTimer.current !== null) window.clearTimeout(videoTimer.current)
    if (videoFallbackTimer.current !== null) window.clearTimeout(videoFallbackTimer.current)
    document.documentElement.dataset.happyFarmLoadingVideo = 'unavailable'
    window.dispatchEvent(new Event('happy-farm:loading-video-unavailable'))
    setShowLoadingVideo(false)
  }, [])
  const markVideoPlaying = useCallback(() => {
    if (videoFallbackTimer.current !== null) window.clearTimeout(videoFallbackTimer.current)
    document.documentElement.dataset.happyFarmLoadingVideo = 'playing'
    window.dispatchEvent(new Event('happy-farm:loading-video-playing'))
    if (videoTimer.current === null) videoTimer.current = window.setTimeout(() => {
      document.documentElement.dataset.happyFarmLoadingVideo = 'complete'
      window.dispatchEvent(new Event('happy-farm:loading-video-complete'))
    }, 5000)
  }, [])
  const requestVideoPlay = useCallback((video: HTMLVideoElement) => { void video.play().catch(markVideoUnavailable) }, [markVideoUnavailable])
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
    // Some embedded/automated browsers never settle a media element. Do not leave Boot blocked.
    videoFallbackTimer.current = window.setTimeout(() => {
      if (document.documentElement.dataset.happyFarmLoadingVideo !== 'playing') markVideoUnavailable()
    }, 7000)
    const hideVideo = () => setShowLoadingVideo(false)
    window.addEventListener('happy-farm:boot-complete', hideVideo)
    return () => { if (videoTimer.current !== null) window.clearTimeout(videoTimer.current); if (videoFallbackTimer.current !== null) window.clearTimeout(videoFallbackTimer.current); delete (window as Window & { __HAPPY_FARM_QA__?: unknown }).__HAPPY_FARM_QA__; window.removeEventListener('resize', check); window.removeEventListener('happy-farm:boot-complete', hideVideo); observer?.disconnect(); game.current?.destroy(true); game.current = null }
  }, [markVideoUnavailable])
  return <main className="game-shell"><div className="game-stage">{showLoadingVideo && <video className="loading-video" autoPlay muted playsInline loop preload="auto" onCanPlay={(event) => requestVideoPlay(event.currentTarget)} onPlaying={markVideoPlaying} onError={markVideoUnavailable} aria-hidden="true"><source src="/assets/kling_20261108_VIDEO_Animate_th_4110_0.mp4" type="video/mp4" /></video>}<div ref={host} className="game-canvas" aria-label="Happy Farm game" /></div>{portrait && <div className="rotate-note"><div className="phone">▱</div><strong>Hãy xoay ngang màn hình</strong><span>Happy Farm sẽ vui hơn ở chế độ ngang!</span></div>}</main>
}
export default App
