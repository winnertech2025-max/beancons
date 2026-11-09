import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakAnimal } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

// First 20 free rounds, transcribed from the approved script. Each round uses
// supplied Drive art in public/assets/drive/fishing/levels.
const LEVELS = [
  ['Fish', 'Fish', 'Crab'], ['Frog', 'Eel', 'Frog'], ['Crab', 'Fish', 'Crab'], ['Turtle', 'Frog', 'Turtle'], ['Shrimp', 'Jellyfish', 'Shrimp'],
  ['Duck', 'Duck', 'Pond Snail'], ['Crocodile', 'Crocodile', 'Stork'], ['Crayfish', 'Crayfish', 'Freshwater Clam'], ['Stone', 'Kingfisher', 'Stone'], ['Tadpole', 'Crayfish', 'Tadpole'],
  ['Pond Snail', 'Pond Snail', 'Crayfish'], ['Freshwater Shrimp', 'Freshwater Shrimp', 'Frog'], ['Duckling', 'Seagull', 'Duckling'], ['Penguin', 'Jellyfish', 'Penguin'], ['Goose', 'Goose', 'Tadpole'],
  ['Capybara', 'Capybara', 'Water Beetle'], ['Jellyfish', 'Jellyfish', 'Water Vole'], ['Squid', 'Cuttlefish', 'Squid'], ['Apple Snail', 'Apple Snail', 'Oyster'], ['Dragonfly', 'Leech', 'Dragonfly'],
] as const

export class FishingLakeScene extends BaseScene {
  private level = 0
  constructor() { super('FishingLake') }
  init() { this.level = 0 }
  create() { this.drawLevel() }

  private drawLevel() {
    this.tweens.killAll(); this.children.removeAll(true)
    this.add.image(768, 512, 'drive-fishing-pond').setDisplaySize(1536, 1024)
    this.title(`HỒ NƯỚC · LEVEL ${this.level + 1}`, `Fishing Lake · ${this.level + 1} / 20 miễn phí`)
    this.backButton('FarmMap'); this.soundToggle()
    this.add.text(768, 174, 'Chạm nút cần đang di chuyển để thả câu!', { fontFamily: 'Nunito', fontSize: '26px', fontStyle: 'bold', color: '#fff9d4', stroke: '#27718b', strokeThickness: 6 }).setOrigin(.5)
    this.createMovingRod()
  }

  private createMovingRod() {
    // Starts at lower-right and roams farther/faster with each level.
    const rod = this.rodControl(1290, 810, 'THẢ CẦN', () => this.castLine(rod))
    const spread = Math.min(700, 150 + this.level * 34)
    const duration = Math.max(440, 1400 - this.level * 45)
    const targets = [
      { x: 1290 - spread, y: 810 - spread * .45 },
      { x: 1290 - spread * .35, y: 345 + Math.min(210, this.level * 11) },
      { x: 1290 - spread * .78, y: 685 - Math.min(230, this.level * 13) },
    ]
    this.tweens.add({ targets: rod, ...targets[0], delay: 850, duration, ease: 'Sine.InOut', yoyo: true, repeat: -1 })
    this.time.delayedCall(duration * 2, () => {
      if (rod.active) this.tweens.add({ targets: rod, ...targets[1], duration, ease: 'Sine.InOut', yoyo: true, repeat: -1 })
    })
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
    this.add.text(768, 286, 'Cá cắn rồi! Bây giờ kéo cần lên nhé!', { fontFamily: 'Nunito', fontSize: '24px', fontStyle: 'bold', color: '#fff9d4', stroke: '#27718b', strokeThickness: 6 }).setOrigin(.5)
    this.time.delayedCall(550, () => {
      rod.destroy()
      const reel = this.rodControl(1260, 795, 'KÉO CẦN', () => { reel.destroy(); this.revealCatch() })
      this.tweens.add({ targets: reel, y: 775, duration: 430, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
    })
  }

  private revealCatch() {
    const [target, optionA, optionB] = LEVELS[this.level]
    const levelId = String(this.level + 1).padStart(2, '0')
    const caughtArt = `drive-fishing-l${levelId}-1`
    // Most folders provide a transparent catch plus two answer cards. A few
    // provide only two cards; in that case use those cards for the answers too.
    const answerAArt = this.textures.exists(`drive-fishing-l${levelId}-3`) ? `drive-fishing-l${levelId}-2` : caughtArt
    const answerBArt = this.textures.exists(`drive-fishing-l${levelId}-3`) ? `drive-fishing-l${levelId}-3` : `drive-fishing-l${levelId}-2`
    const direction = Phaser.Math.Between(0, 1) ? 1 : -1
    const caught = this.add.image(768 + direction * 370, 585 + Phaser.Math.Between(-105, 105), caughtArt).setDisplaySize(260, 174).setDepth(6)
    playSfx('bong')
    this.tweens.add({ targets: caught, x: 768, y: 435, angle: direction * 8, duration: 540, ease: 'Back.Out', onComplete: () => caught.setAngle(0) })
    this.add.text(768, 655, 'What did you catch? · Bé câu được gì?', { fontFamily: 'Nunito', fontSize: '27px', fontStyle: 'bold', color: '#fff9d4', stroke: '#27718b', strokeThickness: 6 }).setOrigin(.5)
    this.answerCard(answerAArt, 500, 805, optionA, target)
    this.answerCard(answerBArt, 1035, 805, optionB, target)
  }

  private answerCard(texture: string, x: number, y: number, choice: string, target: string) {
    if (!this.textures.exists(texture)) return gameButton(this, x, y, choice.toUpperCase(), 0xffbd55, () => this.answer(choice, target), 300)
    const card = this.add.image(x, y, texture).setDisplaySize(270, 180).setInteractive({ useHandCursor: true })
    card.on('pointerover', () => this.tweens.add({ targets: card, scale: 1.06, duration: 120 }))
    card.on('pointerout', () => this.tweens.add({ targets: card, scale: 1, duration: 120 }))
    card.on('pointerdown', () => { playSfx('tap'); this.tweens.add({ targets: card, scale: .94, yoyo: true, duration: 80, onComplete: () => this.answer(choice, target) }) })
  }

  private answer(choice: string, target: string) {
    if (choice !== target) { playSfx('error'); speakAnimal('Try again!'); return }
    playSfx('success'); speakAnimal(target); useFarmStore.getState().reward(`fishing-lake:${this.level + 1}`, 5)
    this.level += 1
    if (this.level < LEVELS.length) this.time.delayedCall(650, () => this.drawLevel())
    else { useFarmStore.getState().complete('fishing-lake'); this.scene.start('FarmMap') }
  }
}
