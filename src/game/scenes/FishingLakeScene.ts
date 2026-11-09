import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakAnimal } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

// First 20 free levels transcribed from the approved script. Art falls back to a labelled catch
// only when the corresponding Drive PNG has not yet been supplied.
const LEVELS = [
  ['Fish', 'Fish', 'Crab', 'drive-fishing-fish'], ['Frog', 'Eel', 'Frog'], ['Crab', 'Fish', 'Crab', 'drive-fishing-crab'], ['Turtle', 'Frog', 'Turtle'], ['Shrimp', 'Jellyfish', 'Shrimp'], ['Duck', 'Duck', 'Pond Snail'], ['Crocodile', 'Crocodile', 'Stork'], ['Crayfish', 'Crayfish', 'Freshwater Clam'], ['Stone', 'Kingfisher', 'Stone'], ['Tadpole', 'Crayfish', 'Tadpole'], ['Pond Snail', 'Pond Snail', 'Crayfish'], ['Freshwater Shrimp', 'Freshwater Shrimp', 'Frog'], ['Duckling', 'Seagull', 'Duckling'], ['Penguin', 'Jellyfish', 'Penguin'], ['Goose', 'Goose', 'Tadpole'], ['Capybara', 'Capybara', 'Water Beetle'], ['Jellyfish', 'Jellyfish', 'Water Vole'], ['Squid', 'Cuttlefish', 'Squid'], ['Apple Snail', 'Apple Snail', 'Oyster'], ['Dragonfly', 'Leech', 'Dragonfly'],
] as const

export class FishingLakeScene extends BaseScene {
  private level = 0
  constructor() { super('FishingLake') }
  init() { this.level = 0 }
  create() { this.drawLevel() }
  private drawLevel() {
    this.children.removeAll(true); this.add.image(768, 512, 'drive-fishing-pond').setDisplaySize(1536, 1024)
    this.title(`HỒ NƯỚC · LEVEL ${this.level + 1}`, `Fishing Lake · ${this.level + 1} / 20 miễn phí`); this.backButton('FarmMap'); this.soundToggle()
    const [, , , texture] = LEVELS[this.level]; this.add.text(768, 174, 'Bé sẽ câu được gì nhỉ?', { fontFamily: 'Nunito', fontSize: '26px', fontStyle: 'bold', color: '#fff9d4', stroke: '#27718b', strokeThickness: 6 }).setOrigin(.5)
    const cast = gameButton(this, 1270, 820, 'THẢ CẦN', 0xffbd55, () => { cast.destroy(); this.revealCatch(texture) }, 280)
    this.tweens.add({ targets: cast, x: this.level % 2 ? 1080 : 1180, duration: Math.max(420, 1000 - this.level * 25), yoyo: true, repeat: -1, ease: 'Sine.InOut' })
  }
  private revealCatch(texture?: string) {
    const [target, optionA, optionB] = LEVELS[this.level]; playSfx('bong')
    if (texture) this.add.image(768, 470, texture).setDisplaySize(255, 170).setScale(.2).setDepth(5).setData('catch-art', true)
    const revealed = this.children.getChildren().find((child) => child.getData('catch-art'))
    if (revealed) this.tweens.add({ targets: revealed, scale: 1, y: 430, duration: 480, ease: 'Back.Out' })
    else { this.add.image(768, 470, 'drive-notice-board').setDisplaySize(470, 315); this.add.text(768, 470, `BÉ CÂU ĐƯỢC\n${target.toUpperCase()}`, { fontFamily: 'Nunito', fontSize: '32px', fontStyle: 'bold', color: '#704019', align: 'center' }).setOrigin(.5) }
    this.add.text(768, 650, 'What did you catch? · Bé câu được gì?', { fontFamily: 'Nunito', fontSize: '27px', fontStyle: 'bold', color: '#fff9d4', stroke: '#27718b', strokeThickness: 6 }).setOrigin(.5)
    gameButton(this, 580, 790, optionA.toUpperCase(), 0xffbd55, () => this.answer(optionA, target), 300)
    gameButton(this, 955, 790, optionB.toUpperCase(), 0xffbd55, () => this.answer(optionB, target), 300)
  }
  private answer(choice: string, target: string) {
    if (choice !== target) { playSfx('error'); speakAnimal('Try again!'); return }
    playSfx('success'); speakAnimal(target); useFarmStore.getState().reward(`fishing-lake:${this.level + 1}`, 5)
    this.level += 1
    if (this.level < LEVELS.length) this.time.delayedCall(650, () => this.drawLevel())
    else { useFarmStore.getState().complete('fishing-lake'); this.scene.start('FarmMap') }
  }
}
