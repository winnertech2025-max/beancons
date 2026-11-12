import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakBilingual } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'
import { fishingLevelAssets } from '../config/assets'

type Answer = { word: string; texture: string }
type FishingRound = { target: string; caughtTexture: string; answers: [Answer, Answer]; unavailableReason?: string }
const VIETNAMESE_WORD: Record<string, string> = {
  Fish: 'Con cá', Frog: 'Con ếch', Crab: 'Con cua', Turtle: 'Con rùa', Shrimp: 'Con tôm', Duck: 'Con vịt', Crocodile: 'Cá sấu', Crayfish: 'Tôm càng', Stone: 'Hòn đá', Tadpole: 'Nòng nọc', 'Pond Snail': 'Ốc ao', 'Freshwater Shrimp': 'Tép', Duckling: 'Vịt con', Penguin: 'Chim cánh cụt', Goose: 'Ngỗng', Capybara: 'Chuột lang nước', Jellyfish: 'Con sứa', Squid: 'Mực ống', 'Apple Snail': 'Ốc bươu', Dragonfly: 'Chuồn chuồn',
}

// The supplied folders do not use one identical asset order.  This is an
// explicit asset-to-word map checked against the card artwork, not an index
// assumption. It prevents a child selecting the visible Frog card and being
// marked wrong because a different slot happened to be named first.
const LEVELS: FishingRound[] = [
  { target: 'Fish', caughtTexture: 'l01-1', answers: [{ word: 'Fish', texture: 'l01-2' }, { word: 'Crab', texture: 'l01-3' }] },
  { target: 'Frog', caughtTexture: 'l02-1', answers: [{ word: 'Frog', texture: 'l02-2' }, { word: 'Eel', texture: 'l02-3' }] },
  { target: 'Crab', caughtTexture: 'l03-3', answers: [{ word: 'Fish', texture: 'l03-1' }, { word: 'Crab', texture: 'l03-2' }] },
  { target: 'Turtle', caughtTexture: 'l04-3', answers: [{ word: 'Frog', texture: 'l04-1' }, { word: 'Turtle', texture: 'l04-2' }] },
  { target: 'Shrimp', caughtTexture: 'l05-1', answers: [{ word: 'Jellyfish', texture: 'l05-2' }, { word: 'Shrimp', texture: 'l05-3' }] },
  { target: 'Duck', caughtTexture: 'l06-1', answers: [{ word: 'Duck', texture: 'l06-1' }, { word: 'Pond Snail', texture: 'l06-2' }] },
  { target: 'Crocodile', caughtTexture: 'l07-2', answers: [{ word: 'Crocodile', texture: 'l07-1' }, { word: 'Stork', texture: 'l07-3' }] },
  { target: 'Crayfish', caughtTexture: 'l08-3', answers: [{ word: 'Crayfish', texture: 'l08-1' }, { word: 'Freshwater Clam', texture: 'l08-2' }] },
  { target: 'Stone', caughtTexture: 'l09-3', answers: [{ word: 'Kingfisher', texture: 'l09-1' }, { word: 'Stone', texture: 'l09-2' }] },
  { target: 'Tadpole', caughtTexture: 'l10-3', answers: [{ word: 'Crayfish', texture: 'l10-1' }, { word: 'Tadpole', texture: 'l10-2' }] },
  { target: 'Pond Snail', caughtTexture: 'l11-2', answers: [{ word: 'Pond Snail', texture: 'l11-2' }, { word: 'Crayfish', texture: 'l11-1' }] },
  { target: 'Freshwater Shrimp', caughtTexture: 'l12-3', answers: [{ word: 'Freshwater Shrimp', texture: 'l12-2' }, { word: 'Frog', texture: 'l12-1' }] },
  { target: 'Duckling', caughtTexture: 'l13-1', answers: [{ word: 'Seagull', texture: 'l13-2' }, { word: 'Duckling', texture: 'l13-3' }] },
  { target: 'Penguin', caughtTexture: 'l14-3', answers: [{ word: 'Jellyfish', texture: 'l14-1' }, { word: 'Penguin', texture: 'l14-2' }] },
  { target: 'Goose', caughtTexture: 'l15-4', answers: [{ word: 'Tadpole', texture: 'l15-1' }, { word: 'Goose', texture: 'l15-2' }] },
  { target: 'Capybara', caughtTexture: 'l16-2', answers: [{ word: 'Capybara', texture: 'l16-2' }, { word: 'Water Beetle', texture: 'l16-1' }] },
  { target: 'Jellyfish', caughtTexture: 'l17-3', answers: [{ word: 'Jellyfish', texture: 'l17-1' }, { word: 'Water Vole', texture: 'l17-2' }] },
  // Local Drive copy has Cuttlefish art but no supplied Squid card/answer.
  // Do not label Cuttlefish as Squid: this round is held until that exact art arrives.
  { target: 'Squid', caughtTexture: 'l18-1', answers: [{ word: 'Cuttlefish', texture: 'l18-2' }, { word: 'Squid', texture: 'l18-1' }], unavailableReason: 'Thiếu thẻ Squid đúng theo kịch bản.' },
  { target: 'Apple Snail', caughtTexture: 'l19-3', answers: [{ word: 'Apple Snail', texture: 'l19-1' }, { word: 'Oyster', texture: 'l19-2' }] },
  { target: 'Dragonfly', caughtTexture: 'l20-3', answers: [{ word: 'Seagull', texture: 'l20-1' }, { word: 'Dragonfly', texture: 'l20-2' }] },
]

export class FishingLakeScene extends BaseScene {
  private level = 0
  private castHint!: Phaser.GameObjects.Text
  constructor() { super('FishingLake') }
  init() { this.level = 0 }
  preload() {
    if (!this.textures.exists('drive-fishing-pond')) this.load.image('drive-fishing-pond', '/assets/drive/backgrounds/fishing-pond.png')
    this.queueLevelAssets(this.level)
  }
  create() { this.drawLevel() }

  private queueLevelAssets(level: number) {
    const prefix = `drive-fishing-l${String(level + 1).padStart(2, '0')}-`
    fishingLevelAssets.filter((asset) => asset.id.startsWith(prefix) && !this.textures.exists(asset.id)).forEach((asset) => this.load.image(asset.id, asset.path))
  }

  private loadLevelAssets(level: number, done: () => void) {
    const prefix = `drive-fishing-l${String(level + 1).padStart(2, '0')}-`
    const missing = fishingLevelAssets.filter((asset) => asset.id.startsWith(prefix) && !this.textures.exists(asset.id))
    if (!missing.length) { done(); return }
    missing.forEach((asset) => this.load.image(asset.id, asset.path))
    this.load.once(Phaser.Loader.Events.COMPLETE, done)
    this.load.start()
  }

  private drawLevel() {
    this.tweens.killAll(); this.children.removeAll(true)
    this.add.image(768, 512, 'drive-fishing-pond').setDisplaySize(1536, 1024)
    this.title(`HỒ NƯỚC · LEVEL ${this.level + 1}`, `Fishing Lake · ${this.level + 1} / 20 miễn phí`)
    this.backButton('FarmMap'); this.soundToggle()
    this.castHint = this.add.text(768, 174, 'Chạm nút cần đang di chuyển để thả câu!', { fontFamily: 'Nunito', fontSize: '26px', fontStyle: 'bold', color: '#fff9d4', stroke: '#27718b', strokeThickness: 6 }).setOrigin(.5)
    this.createMovingRod()
  }

  private createMovingRod() {
    // Starts at lower-right, then moves only through usable water positions.
    // A new destination is picked after every leg, so it cannot get stuck
    // oscillating along one short line.
    const rod = this.rodControl(1290, 810, 'THẢ CẦN', () => this.castLine(rod))
    const reach = Math.min(1, .26 + this.level * .045)
    const candidates = [
      { x: 1110, y: 690 }, { x: 980, y: 500 }, { x: 770, y: 390 },
      { x: 580, y: 490 }, { x: 485, y: 650 }, { x: 760, y: 715 }, { x: 1050, y: 590 },
    ].filter((_point, index) => index < 2 + Math.ceil(reach * 5))
    const duration = Math.max(520, 1450 - this.level * 42)
    let previous = -1
    const travel = () => {
      if (!rod.active || !rod.input?.enabled) return
      const choices = candidates.map((_point, index) => index).filter((index) => index !== previous)
      previous = Phaser.Utils.Array.GetRandom(choices)
      const point = candidates[previous]
      this.tweens.add({ targets: rod, x: point.x, y: point.y, duration, delay: 500, ease: 'Sine.InOut', onComplete: travel })
    }
    travel()
  }

  private rodControl(x: number, y: number, label: string, action: () => void) {
    const art = this.add.graphics()
    art.lineStyle(15, 0x74411c, 1).lineBetween(-64, 24, 48, -36)
    art.lineStyle(5, 0xffd783, 1).lineBetween(-59, 20, 45, -33)
    art.fillStyle(0xffc14a, 1).fillCircle(55, -41, 12)
    art.lineStyle(3, 0xffffff, .9).lineBetween(55, -28, 55, 17)
    art.fillStyle(0xff6b5e, 1).fillCircle(55, 23, 7)
    const caption = this.add.text(0, 55, label, { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#704019', stroke: '#fff9e8', strokeThickness: 4 }).setOrigin(.5)
    const control = this.add.container(x, y, [art, caption]).setSize(166, 130).setInteractive({ useHandCursor: true })
    control.on('pointerover', () => this.tweens.add({ targets: control, scale: 1.08, duration: 110 }))
    control.on('pointerout', () => this.tweens.add({ targets: control, scale: 1, duration: 110 }))
    control.on('pointerdown', () => { playSfx('tap'); action() })
    return control
  }

  private castLine(rod: Phaser.GameObjects.Container) {
    rod.disableInteractive(); this.tweens.killTweensOf(rod)
    this.tweens.add({ targets: rod, x: 1115, y: 635, angle: -16, duration: 260, ease: 'Quad.Out' })
    this.castHint.setText('Fish on! Reel it in! · Cá cắn rồi! Kéo cần lên nhé!')
    speakBilingual('Fish on! Reel it in!', 'Cá cắn rồi! Kéo cần lên nhé!')
    this.time.delayedCall(550, () => {
      rod.destroy()
      const reel = this.rodControl(1260, 795, 'KÉO CẦN', () => { reel.destroy(); this.revealCatch() })
      this.tweens.add({ targets: reel, y: 775, duration: 430, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
    })
  }

  private revealCatch() {
    const round = LEVELS[this.level]
    this.castHint.setVisible(false)
    if (round.unavailableReason) { this.showUnavailableRound(round.unavailableReason); return }
    const caughtArt = `drive-fishing-${round.caughtTexture}`
    const direction = Phaser.Math.Between(0, 1) ? 1 : -1
    const caught = this.add.image(768 + direction * 370, 585 + Phaser.Math.Between(-105, 105), caughtArt).setDisplaySize(225, 150).setDepth(6)
    playSfx('bong')
    this.tweens.add({ targets: caught, x: 768, y: 435, angle: direction * 8, duration: 540, ease: 'Back.Out', onComplete: () => caught.setAngle(0) })
    this.add.text(768, 655, 'What did you catch? · Bé câu được gì?', { fontFamily: 'Nunito', fontSize: '27px', fontStyle: 'bold', color: '#fff9d4', stroke: '#27718b', strokeThickness: 6 }).setOrigin(.5)
    this.answerCard(`drive-fishing-${round.answers[0].texture}`, 520, 812, round.answers[0].word, round.target)
    this.answerCard(`drive-fishing-${round.answers[1].texture}`, 1015, 812, round.answers[1].word, round.target)
  }

  private answerCard(texture: string, x: number, y: number, choice: string, target: string) {
    if (!this.textures.exists(texture)) return gameButton(this, x, y, choice.toUpperCase(), 0xffbd55, () => this.answer(choice, target), 300)
    const card = this.add.image(x, y, texture).setDisplaySize(226, 151).setInteractive({ useHandCursor: true })
    const baseScaleX = card.scaleX; const baseScaleY = card.scaleY
    card.on('pointerover', () => { this.tweens.killTweensOf(card); this.tweens.add({ targets: card, scaleX: baseScaleX * 1.025, scaleY: baseScaleY * 1.025, duration: 90, ease: 'Sine.Out' }) })
    card.on('pointerout', () => { this.tweens.killTweensOf(card); this.tweens.add({ targets: card, scaleX: baseScaleX, scaleY: baseScaleY, duration: 90, ease: 'Sine.Out' }) })
    card.on('pointerdown', () => { playSfx('tap'); this.tweens.add({ targets: card, scaleX: baseScaleX * .94, scaleY: baseScaleY * .94, yoyo: true, duration: 80, onComplete: () => this.answer(choice, target) }) })
  }

  private answer(choice: string, target: string) {
    if (choice !== target) { playSfx('error'); speakBilingual('Try again!', 'Bé thử lại nhé!'); return }
    playSfx('success'); speakBilingual(target, VIETNAMESE_WORD[target] ?? target); useFarmStore.getState().reward(`fishing-lake:${this.level + 1}`, 5)
    this.level += 1
    if (this.level < LEVELS.length) this.time.delayedCall(650, () => this.loadLevelAssets(this.level, () => this.drawLevel()))
    else { useFarmStore.getState().complete('fishing-lake'); this.scene.start('FarmMap') }
  }

  private showUnavailableRound(reason: string) {
    this.add.text(768, 470, 'VÒNG NÀY ĐANG ĐƯỢC BỔ SUNG', { fontFamily: 'Nunito', fontSize: '31px', fontStyle: 'bold', color: '#fff9d4', stroke: '#27718b', strokeThickness: 6 }).setOrigin(.5)
    this.add.text(768, 520, reason, { fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#ffffff', stroke: '#27718b', strokeThickness: 4 }).setOrigin(.5)
    gameButton(this, 768, 620, 'VỀ NÔNG TRẠI', 0xffbd55, () => this.scene.start('FarmMap'), 300)
  }
}
