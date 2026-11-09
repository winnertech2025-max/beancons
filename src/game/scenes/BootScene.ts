import Phaser from 'phaser'
import { assets } from '../config/assets'
import { questionBank } from '../../data/questionBank'
import { validateQuestionBank } from '../systems/QuestionBank'

/** Preloads game assets invisibly while App.tsx plays the supplied 5-second MP4 full screen. */
export class BootScene extends Phaser.Scene {
  private assetsReady = false
  private videoComplete = document.documentElement.dataset.happyFarmLoadingVideo === 'complete'
  private videoUnavailable = document.documentElement.dataset.happyFarmLoadingVideo === 'unavailable'
  private started = false

  constructor() { super('Boot') }

  init() {
    const complete = () => { this.videoComplete = true; this.startWhenReady() }
    const unavailable = () => { this.videoUnavailable = true; this.startWhenReady() }
    window.addEventListener('happy-farm:loading-video-complete', complete)
    window.addEventListener('happy-farm:loading-video-unavailable', unavailable)
    this.events.once('shutdown', () => {
      window.removeEventListener('happy-farm:loading-video-complete', complete)
      window.removeEventListener('happy-farm:loading-video-unavailable', unavailable)
    })
  }

  preload() {
    const loading = assets.backgrounds.find((asset) => asset.id === 'drive-loading')
    if (loading) this.load.image(loading.id, loading.path)
    assets.backgrounds.filter((asset) => asset.id !== 'drive-loading').forEach((asset) => this.load.image(asset.id, asset.path))
    assets.driveObjects.forEach((asset) => this.load.image(asset.id, asset.path))
    assets.animals.forEach((asset) => this.load.image(`animal-${asset.id}`, asset.path))
    this.load.on('loaderror', (file: Phaser.Loader.File) => console.warn(`[Happy Farm] Asset unavailable: ${file.key}.`))
  }

  create() {
    const issues = validateQuestionBank(questionBank, assets.animals.map((asset) => asset.id))
    if (issues.length) console.error('[Happy Farm] Question Bank validation failed', issues)
    this.assetsReady = true
    this.startWhenReady()
  }

  private startWhenReady() {
    if (this.started || !this.assetsReady || (!this.videoComplete && !this.videoUnavailable)) return
    this.started = true
    window.dispatchEvent(new Event('happy-farm:boot-complete'))
    this.scene.start('Welcome')
  }
}
