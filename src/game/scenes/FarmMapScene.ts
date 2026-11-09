import { BaseScene } from './BaseScene'
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig'
import { ProgressManager } from '../systems/ProgressManager'
import { useFarmStore } from '../../store/gameStore'
export class FarmMapScene extends BaseScene {
  constructor() { super('FarmMap') }
  create() {
    if (this.textures.exists('drive-main-farm-map')) this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'drive-main-farm-map').setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT)
    else this.sky()
    const progress = ProgressManager.load()
    this.title('NÔNG TRẠI CỦA BÉ', 'Chạm vào một khu để khám phá nông trại')
    this.add.image(1400, 67, 'drive-star').setDisplaySize(34, 34)
    this.add.text(1454, 67, `${progress.totalStars} sao`, { fontFamily: 'Nunito', fontSize: '21px', fontStyle: 'bold', color: '#fff5b1', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5)
    this.soundToggle(1405, 122)
    // Migrate saves made before the Lake/Home unlocks existed: a completed Cow Farm
    // always means both post-Cow activities are available per the game script.
    let state = useFarmStore.getState()
    if (state.completedActivities.includes('cow-farm')) {
      if (!state.unlockedZones.includes('fishing-lake')) state.unlock('fishing-lake')
      if (!state.unlockedZones.includes('memory-home')) state.unlock('memory-home')
      state = useFarmStore.getState()
    }
    this.zone('VƯỜN RAU CỦ', 1190, 714, state.unlockedZones.includes('crop-farm'), () => this.scene.start('CropFarm'), true)
    this.zone('TRANG TRẠI BÒ', 1124, 333, state.unlockedZones.includes('cow-farm'), () => this.scene.start('CowFarm'))
    this.zone('TRANG TRẠI GÀ', 507, 515, false)
    this.zone('HỒ CÂU CÁ', 757, 465, state.unlockedZones.includes('fishing-lake'), () => this.scene.start('FishingLake'))
    this.zone('TRANG TRẠI CỪU', 1252, 558, false)
    this.zone('NGÔI NHÀ', 360, 310, state.unlockedZones.includes('memory-home'), () => this.scene.start('MemoryHome'))
    const reset = this.add.container(150, 944, [
      this.add.image(0, 0, 'drive-cow-banner').setDisplaySize(250, 84),
      this.add.text(0, 0, '↻  CHƠI LẠI TỪ ĐẦU', { fontFamily: 'Nunito', fontSize: '17px', fontStyle: 'bold', color: '#704019', stroke: '#fff9ea', strokeThickness: 3 }).setOrigin(.5),
    ]).setSize(250, 84).setInteractive({ useHandCursor: true })
    reset.on('pointerdown', () => { ProgressManager.reset(); this.scene.start('Welcome') })
  }
  private zone(label: string, x: number, y: number, unlocked: boolean, go?: () => void, guided = false) {
    const hit = this.add.ellipse(x, y, 208, 122, 0xffffff, 0.001).setInteractive({ useHandCursor: unlocked })
    const caption = this.add.text(x, y + 74, unlocked ? label : `${label}\nMỞ KHÓA SAU`, { fontFamily: 'Nunito', fontSize: unlocked ? '21px' : '16px', fontStyle: 'bold', align: 'center', color: unlocked ? '#fff' : '#d6e7ec', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5)
    if (guided) { this.tweens.add({ targets: caption, y: y + 65, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' }); this.add.text(x, y - 72, 'BẮT ĐẦU Ở ĐÂY', { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#fff5b1', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5) }
    if (!unlocked) { caption.setAlpha(.78); return }
    hit.on('pointerover', () => this.tweens.add({ targets: caption, scale: 1.08, duration: 120, ease: 'Sine.Out' }))
    hit.on('pointerout', () => this.tweens.add({ targets: caption, scale: 1, duration: 120, ease: 'Sine.Out' }))
    if (go) hit.on('pointerdown', go)
  }
}
