import { BaseScene } from './BaseScene'
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig'
import { ProgressManager } from '../systems/ProgressManager'
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
    // Free-exploration mode requested by the client: completion/rewards remain
    // saved, but no illustrated destination is blocked by a prior activity.
    this.zone('VƯỜN RAU CỦ', 1190, 714, 350, 230, true, () => this.scene.start('CropFarm'), true)
    this.zone('TRANG TRẠI BÒ', 1124, 333, 345, 240, true, () => this.scene.start('CowFarm'))
    this.zone('TRANG TRẠI GÀ', 507, 515, 330, 245, true, () => this.scene.start('ChickenFarm'))
    this.zone('HỒ CÂU CÁ', 757, 465, 440, 305, true, () => this.scene.start('FishingLake'))
    this.zone('TRANG TRẠI CỪU', 1252, 558, 330, 230, true, () => this.scene.start('SheepFarm'))
    this.zone('NGÔI NHÀ', 360, 310, 370, 270, true, () => this.scene.start('MemoryHome'))
    this.zone('NHÀ KHO', 770, 265, 285, 185, true, () => this.scene.start('Warehouse'))
    const reset = this.add.container(150, 944, [
      this.add.image(0, 0, 'drive-cow-banner').setDisplaySize(250, 84),
      this.add.text(0, 0, '↻  CHƠI LẠI TỪ ĐẦU', { fontFamily: 'Nunito', fontSize: '17px', fontStyle: 'bold', color: '#704019', stroke: '#fff9ea', strokeThickness: 3 }).setOrigin(.5),
    ]).setSize(250, 84).setInteractive({ useHandCursor: true })
    reset.on('pointerdown', () => { ProgressManager.reset(); this.scene.start('Welcome') })
  }
  private zone(label: string, x: number, y: number, width: number, height: number, unlocked: boolean, go?: () => void, guided = false) {
    // The supplied map-zone silhouette PNGs are not present in this workspace
    // yet. Do not draw a made-up ellipse: it visibly misaligns with the art.
    // The broad hit area remains so a child can tap the illustrated zone itself;
    // the matching transparent overlay will provide the exact hover outline
    // when the Drive zone assets are synced.
    const hit = this.add.ellipse(x, y, width, height, 0xffffff, 0.001).setInteractive({ useHandCursor: unlocked })
    const caption = this.add.text(x, y + 74, unlocked ? label : `${label}\nMỞ KHÓA SAU`, { fontFamily: 'Nunito', fontSize: unlocked ? '21px' : '16px', fontStyle: 'bold', align: 'center', color: unlocked ? '#fff' : '#d6e7ec', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5)
    if (guided) { this.tweens.add({ targets: caption, y: y + 65, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' }); this.add.text(x, y - 72, 'BẮT ĐẦU Ở ĐÂY', { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#fff5b1', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5) }
    if (!unlocked) { caption.setAlpha(.78); return }
    hit.on('pointerover', () => { this.tweens.killTweensOf(caption); this.tweens.add({ targets: caption, scale: 1.08, duration: 120, ease: 'Sine.Out' }) })
    hit.on('pointerout', () => { this.tweens.killTweensOf(caption); this.tweens.add({ targets: caption, scale: 1, duration: 120, ease: 'Sine.Out' }) })
    if (go) hit.on('pointerdown', go)
  }
}
