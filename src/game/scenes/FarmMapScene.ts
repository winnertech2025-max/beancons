import { BaseScene } from './BaseScene'
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig'
import { ProgressManager } from '../systems/ProgressManager'
export class FarmMapScene extends BaseScene {
  constructor() { super('FarmMap') }
  preload() {
    [
      ['map-sign-warehouse', '/assets/drive/map-2026/warehouse-sign.png'],
      ['map-sign-chicken', '/assets/drive/map-2026/chicken-sign.png'],
      ['map-sign-crop', '/assets/drive/map-2026/crop-sign.png'],
      ['map-sign-cow', '/assets/drive/map-2026/cow-sign.png'],
      ['map-sign-sheep', '/assets/drive/map-2026/sheep-sign.png'],
      ['map-sign-home', '/assets/drive/map-2026/home-sign.png'],
    ].forEach(([key, path]) => { if (!this.textures.exists(key)) this.load.image(key, path) })
  }
  create() {
    if (this.textures.exists('drive-main-farm-map')) this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'drive-main-farm-map').setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT)
    else this.sky()
    const progress = ProgressManager.load()
    this.title('NÔNG TRẠI CỦA BÉ', 'Chạm vào một khu để khám phá nông trại')
    this.add.image(1400, 67, 'drive-star').setDisplaySize(34, 34)
    this.add.text(1454, 67, `${progress.totalStars} sao`, { fontFamily: 'Nunito', fontSize: '21px', fontStyle: 'bold', color: '#fff5b1', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5)
    this.soundToggle(1405, 122)
    const shop = this.add.container(1360, 220, [
      this.add.image(0, 0, 'drive-cow-banner').setDisplaySize(250, 76),
      this.add.image(-92, 0, 'drive-star').setDisplaySize(40, 40),
      this.add.text(24, 0, 'CỬA HÀNG', { fontFamily:'Nunito', fontSize:'19px', fontStyle:'bold', color:'#704019', stroke:'#fff9ea', strokeThickness:3 }).setOrigin(.5),
    ]).setSize(250, 76).setInteractive({ useHandCursor:true })
    shop.on('pointerdown', () => this.scene.start('FarmShop'))
    // Free-exploration mode requested by the client: completion/rewards remain
    // saved, but no illustrated destination is blocked by a prior activity.
    this.zone('VƯỜN RAU CỦ', 1190, 714, 350, 230, true, () => this.scene.start('CropFarm'), true, 'map-sign-crop')
    this.zone('TRANG TRẠI BÒ', 1124, 333, 345, 240, true, () => this.scene.start('CowFarm'), false, 'map-sign-cow')
    this.zone('TRANG TRẠI GÀ', 507, 515, 330, 245, true, () => this.scene.start('ChickenFarm'), false, 'map-sign-chicken')
    this.zone('HỒ CÂU CÁ', 757, 465, 440, 305, true, () => this.scene.start('FishingLake'))
    this.zone('TRANG TRẠI CỪU', 1252, 558, 330, 230, true, () => this.scene.start('SheepFarm'), false, 'map-sign-sheep')
    this.zone('NGÔI NHÀ', 360, 310, 370, 270, true, () => this.scene.start('MemoryHome'), false, 'map-sign-home')
    this.zone('NHÀ KHO', 770, 265, 285, 185, true, () => this.scene.start('Warehouse'), false, 'map-sign-warehouse')
    const reset = this.add.container(150, 944, [
      this.add.image(0, 0, 'drive-cow-banner').setDisplaySize(250, 84),
      this.add.text(0, 0, '↻  CHƠI LẠI TỪ ĐẦU', { fontFamily: 'Nunito', fontSize: '17px', fontStyle: 'bold', color: '#704019', stroke: '#fff9ea', strokeThickness: 3 }).setOrigin(.5),
    ]).setSize(250, 84).setInteractive({ useHandCursor: true })
    reset.on('pointerdown', () => { ProgressManager.reset(); this.scene.start('Welcome') })
  }
  private zone(label: string, x: number, y: number, width: number, height: number, unlocked: boolean, go?: () => void, guided = false, signTexture?: string) {
    const hit = this.add.ellipse(x, y, width, height, 0xffffff, 0.001).setInteractive({ useHandCursor: unlocked })
    const caption = signTexture
      ? this.add.image(x, y + 74, signTexture).setDisplaySize(210, 105).setOrigin(.5).setDepth(2)
      : this.add.text(x, y + 74, unlocked ? label : `${label}\nMỞ KHÓA SAU`, { fontFamily: 'Nunito', fontSize: unlocked ? '21px' : '16px', fontStyle: 'bold', align: 'center', color: unlocked ? '#fff' : '#d6e7ec', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5).setDepth(2)
    if (guided) { this.tweens.add({ targets: caption, y: y + 65, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' }); this.add.text(x, y - 72, 'BẮT ĐẦU Ở ĐÂY', { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#fff5b1', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5) }
    if (!unlocked) { caption.setAlpha(.78); return }
    const baseWidth = signTexture ? 210 : undefined
    const baseHeight = signTexture ? 105 : undefined
    let glow: Phaser.FX.Glow | undefined
    hit.on('pointerover', () => {
      this.tweens.killTweensOf(caption)
      if (signTexture && caption instanceof Phaser.GameObjects.Image) {
        glow = caption.preFX?.addGlow(0xfff3a1, 4, 0, false, .1, 16)
        this.tweens.add({ targets: caption, displayWidth: baseWidth! * 1.055, displayHeight: baseHeight! * 1.055, y: caption.y - 5, duration: 140, ease: 'Sine.Out' })
      } else this.tweens.add({ targets: caption, scale: 1.08, duration: 120, ease: 'Sine.Out' })
    })
    hit.on('pointerout', () => {
      this.tweens.killTweensOf(caption)
      if (signTexture && caption instanceof Phaser.GameObjects.Image) {
        if (glow) caption.preFX?.remove(glow)
        glow = undefined
        this.tweens.add({ targets: caption, displayWidth: baseWidth!, displayHeight: baseHeight!, y: y + 74, duration: 140, ease: 'Sine.Out' })
      } else this.tweens.add({ targets: caption, scale: 1, duration: 120, ease: 'Sine.Out' })
    })
    if (go) hit.on('pointerdown', go)
  }
}
