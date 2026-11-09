import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakAnimal } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

type Flashcard = { id: string; word: string; texture: string }
type Card = { id: string; word: string; tile: Phaser.GameObjects.Container; back: Phaser.GameObjects.Image; face: Phaser.GameObjects.Image; open: boolean; matched: boolean }
type Theme = { id: string; title: string; subtitle: string; cards: Flashcard[]; available: boolean }

const themes: Theme[] = [
  { id: 'animals', title: 'ĐỘNG VẬT', subtitle: 'Animals · miễn phí', available: true, cards: [
    { id: 'cow', word: 'Cow', texture: 'drive-memory-animal-cow' }, { id: 'pig', word: 'Pig', texture: 'drive-memory-animal-pig' },
    { id: 'chicken', word: 'Chicken', texture: 'drive-memory-animal-chicken' }, { id: 'goat', word: 'Goat', texture: 'drive-memory-animal-goat' },
  ] },
  { id: 'plants', title: 'THỰC VẬT', subtitle: 'Plants · miễn phí', available: true, cards: [
    { id: 'pumpkin', word: 'Pumpkin', texture: 'drive-memory-plant-pumpkin' }, { id: 'tomato', word: 'Tomato', texture: 'drive-memory-plant-tomato' },
    { id: 'carrot', word: 'Carrot', texture: 'drive-memory-plant-carrot' },
  ] },
  { id: 'mixed', title: 'TỔNG HỢP', subtitle: 'Mixed cards · miễn phí', available: true, cards: [
    { id: 'cow', word: 'Cow', texture: 'drive-memory-animal-cow' }, { id: 'tomato', word: 'Tomato', texture: 'drive-memory-plant-tomato' },
    { id: 'chicken', word: 'Chicken', texture: 'drive-memory-animal-chicken' },
  ] },
  { id: 'home', title: 'ĐỒ VẬT TRONG NHÀ', subtitle: 'Chờ flashcard Drive', available: false, cards: [] },
  { id: 'bonus', title: 'BỘ THẺ BỔ SUNG', subtitle: 'Sắp mở khóa', available: false, cards: [] },
]

/** Home memory game: level 1 has four cards; level 2 has six, per the script. */
export class MemoryHomeScene extends BaseScene {
  private cards: Card[] = []
  private selected: Card[] = []
  private locked = false
  private theme?: Theme
  private level = 1
  constructor() { super('MemoryHome') }
  create() { this.showThemes() }

  private clear() { this.cards = []; this.selected = []; this.locked = false; this.children.removeAll(true) }
  private background() { this.add.image(768, 512, 'drive-memory-home').setDisplaySize(1536, 1024); this.add.rectangle(768, 512, 1536, 1024, 0x173d4e, .16) }

  private showThemes() {
    this.clear(); this.background(); this.title('NGÔI NHÀ · LẬT THẺ', 'Memory cards · Chọn một bộ thẻ để bắt đầu'); this.backButton('FarmMap'); this.soundToggle()
    this.add.text(768, 174, 'Lật hai thẻ giống nhau để nghe từ tiếng Anh!', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', color: '#fff9d4', stroke: '#315d71', strokeThickness: 6 }).setOrigin(.5)
    themes.forEach((theme, index) => this.themeButton(theme, 485 + (index % 3) * 285, 370 + Math.floor(index / 3) * 280))
  }

  private themeButton(theme: Theme, x: number, y: number) {
    const art = this.add.image(0, 0, 'drive-cow-banner').setDisplaySize(285, 142).setAlpha(theme.available ? 1 : .86)
    const title = this.add.text(-3, -15, theme.title, { fontFamily: 'Nunito', fontSize: theme.title.length > 15 ? '19px' : '24px', fontStyle: 'bold', color: theme.available ? '#704019' : '#6d7376', align: 'center', wordWrap: { width: 190 } }).setOrigin(.5)
    const subtitle = this.add.text(-3, 30, theme.available ? theme.subtitle : `🔒 ${theme.subtitle}`, { fontFamily: 'Nunito', fontSize: '16px', fontStyle: 'bold', color: theme.available ? '#315d71' : '#59666d', align: 'center', wordWrap: { width: 175 } }).setOrigin(.5)
    const button = this.add.container(x, y, [art, title, subtitle]).setSize(285, 142)
    if (!theme.available) return
    button.setInteractive({ useHandCursor: true }); button.on('pointerover', () => button.setScale(1.04)); button.on('pointerout', () => button.setScale(1)); button.on('pointerdown', () => { playSfx('select'); this.theme = theme; this.level = 1; this.drawRound() })
  }

  private drawRound() {
    if (!this.theme) return
    this.clear(); this.background(); const totalCards = this.level === 1 ? 4 : 6
    this.title(`NGÔI NHÀ · ${this.theme.title} · LEVEL ${this.level}`, `${totalCards} thẻ · Find the matching pair`); this.backButton('FarmMap'); this.soundToggle()
    const source = this.theme.cards.slice(0, totalCards / 2); const deck = source.flatMap((item) => [item, item]).sort(() => Math.random() - .5)
    this.add.text(768, 166, 'Chạm hai thẻ để ghép cặp!', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', color: '#fff9d4', stroke: '#315d71', strokeThickness: 6 }).setOrigin(.5)
    const positions = totalCards === 4 ? [[485, 390], [1050, 390], [485, 675], [1050, 675]] : [[380, 360], [768, 360], [1156, 360], [380, 675], [768, 675], [1156, 675]]
    deck.forEach((entry, index) => this.makeCard(entry, positions[index][0], positions[index][1], totalCards === 4 ? 270 : 225))
  }

  private makeCard(entry: Flashcard, x: number, y: number, size: number) {
    const back = this.add.image(0, 0, 'drive-memory-back').setDisplaySize(size, size)
    const face = this.add.image(0, 0, entry.texture).setDisplaySize(size, size * .67).setVisible(false)
    const tile = this.add.container(x, y, [back, face]).setSize(size, size).setInteractive({ useHandCursor: true })
    const card: Card = { id: entry.id, word: entry.word, tile, back, face, open: false, matched: false }
    tile.on('pointerover', () => { if (!card.open && !card.matched) tile.setScale(1.035) }); tile.on('pointerout', () => { if (!card.matched) tile.setScale(1) }); tile.on('pointerdown', () => this.open(card)); this.cards.push(card)
  }

  private open(card: Card) {
    if (this.locked || card.open || card.matched) return
    card.open = true; playSfx('select'); this.tweens.add({ targets: card.tile, scaleX: 0, duration: 115, ease: 'Sine.In', onComplete: () => { card.back.setVisible(false); card.face.setVisible(true); this.tweens.add({ targets: card.tile, scaleX: 1, duration: 115, ease: 'Sine.Out' }) } })
    this.selected.push(card); if (this.selected.length === 2) this.checkPair()
  }

  private checkPair() {
    this.locked = true; const [one, two] = this.selected
    if (one.id === two.id) {
      one.matched = two.matched = true; playSfx('success'); speakAnimal(one.word)
      this.tweens.add({ targets: [one.tile, two.tile], scale: 1.1, duration: 160, yoyo: true, onComplete: () => { this.selected = []; this.locked = false; if (this.cards.every((card) => card.matched)) this.roundComplete() } }); return
    }
    playSfx('error'); speakAnimal('Oh no!'); this.time.delayedCall(800, () => { [one, two].forEach((item) => { this.tweens.add({ targets: item.tile, scaleX: 0, duration: 110, onComplete: () => { item.open = false; item.back.setVisible(true); item.face.setVisible(false); this.tweens.add({ targets: item.tile, scaleX: 1, duration: 110 }) } }) }); this.selected = []; this.locked = false })
  }

  private roundComplete() {
    if (!this.theme) return
    useFarmStore.getState().reward(`memory-home:${this.theme.id}:level-${this.level}`, 1)
    if (this.level === 1 && this.theme.cards.length >= 3) { gameButton(this, 768, 900, 'LEVEL 2 · 6 THẺ', 0xffbd55, () => { this.level = 2; this.drawRound() }, 330); return }
    useFarmStore.getState().complete('memory-home'); const state = useFarmStore.getState()
    if (state.completedActivities.includes('fishing-lake')) { state.unlock('chicken-farm'); state.unlock('sheep-farm') }
    gameButton(this, 768, 900, 'CHỌN BỘ THẺ KHÁC', 0xffbd55, () => this.showThemes(), 360)
  }
}
