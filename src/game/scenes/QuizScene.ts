import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { getAnimal } from '../../data/animals'
import { questionBank } from '../../data/questionBank'
import { selectRound, type RoundQuestion, type RoundSize } from '../systems/QuestionBank'
import { animalCard } from '../objects/AnimalCard'
import { speakAnimal, stopSpeaking } from '../systems/AudioManager'
import { gameButton } from '../objects/GameButton'

export class QuizScene extends BaseScene {
  private farmId = 'cat'; private questions: RoundQuestion[] = []; private index = 0; private roundSize: RoundSize = 5
  private firstTryCorrect = 0; private attempts = 0; private triedCurrent = false; private locked = false
  constructor() { super('Quiz') }
  init(data: { farmId?: string; roundSize?: RoundSize }) { this.farmId = data.farmId || 'cat'; this.roundSize = data.roundSize || 5; this.questions = selectRound(questionBank, this.roundSize); this.index = 0; this.firstTryCorrect = 0; this.attempts = 0; this.triedCurrent = false; this.locked = false }
  shutdown() { stopSpeaking() }
  create() { this.drawRound() }
  private drawRound() {
    this.locked = false; this.triedCurrent = false; this.children.removeAll(true); this.sky(); this.backButton('Vocabulary'); this.title('WHO AM I?', 'Nghe từ tiếng Anh, rồi chọn đúng người bạn nhé!')
    const home = this.add.text(1430, 62, '⌂  Nông trại', { fontFamily: 'Nunito', fontSize: '19px', fontStyle: 'bold', color: '#fff', backgroundColor: '#173b55', padding: { x: 12, y: 8 } }).setInteractive({ useHandCursor: true }); home.on('pointerdown', () => this.scene.start('FarmMap')); this.soundToggle(1425, 124)
    const question = this.questions[this.index]
    this.add.rectangle(768, 202, 660, 18, 0xffffff, .7); this.add.rectangle(438 + (660 * ((this.index + 1) / this.questions.length) / 2), 202, 660 * ((this.index + 1) / this.questions.length), 18, 0x62d76b).setOrigin(.5)
    this.add.text(768, 242, `Câu ${this.index + 1} / ${this.questions.length}   •   Đúng ngay lần đầu: ${this.firstTryCorrect}`, { fontFamily: 'Baloo 2', fontSize: '25px', color: '#fff', stroke: '#26738c', strokeThickness: 4, resolution: 2 }).setOrigin(.5)
    this.add.text(768, 314, question.promptEn, { fontFamily: 'Baloo 2', fontSize: '33px', fontStyle: 'bold', color: '#fff', stroke: '#287a9e', strokeThickness: 4, resolution: 2 }).setOrigin(.5)
    this.add.text(768, 355, question.promptVi, { fontFamily: 'Nunito', fontSize: '21px', color: '#effbff', stroke: '#287a9e', strokeThickness: 3, resolution: 2 }).setOrigin(.5)
    gameButton(this, 768, 430, 'NGHE LẠI', 0xa78be8, () => speakAnimal(question.audioText), 290)
    const positions = [[250, 625], [510, 625], [768, 625], [1026, 625], [1286, 625]]
    if (question.type === 'LISTEN_AND_CHOOSE') {
      question.shuffledOptions.forEach((option, i) => { const animal = getAnimal(option); animalCard(this, positions[i][0], positions[i][1], animal, () => this.answer(option, question.correctAnswer)) })
    } else {
      const target = getAnimal(question.assetKey)
      if (this.textures.exists(`animal-${target.id}`)) this.add.image(768, 548, `animal-${target.id}`).setDisplaySize(250, 170)
      question.shuffledOptions.forEach((option, i) => gameButton(this, positions[i][0], 760, getAnimal(option).english, 0x6685d9, () => this.answer(option, question.correctAnswer), 205).setScale(.72))
    }
    this.time.delayedCall(300, () => speakAnimal(question.audioText))
  }
  private answer(choice: string, expected: string) {
    if (this.locked) return; this.attempts++
    if (choice === expected) { this.locked = true; if (!this.triedCurrent) this.firstTryCorrect++; this.showCorrect(); return }
    this.triedCurrent = true
    const feedback = this.add.container(768, 865, [this.add.rectangle(0, 0, 420, 82, 0xf07c77, .98).setStrokeStyle(4, 0xffffff), this.add.text(0, 0, 'Thử lại nhé!', { fontFamily: 'Baloo 2', fontSize: '34px', fontStyle: 'bold', color: '#fff' }).setOrigin(.5)]).setDepth(100)
    this.tweens.add({ targets: feedback, x: '+=11', yoyo: true, repeat: 3, duration: 45 }); this.time.delayedCall(850, () => feedback.destroy())
  }
  private showCorrect() {
    const card = this.add.container(768, 835, [this.add.rectangle(0, 0, 500, 190, 0x62d76b, .99).setStrokeStyle(5, 0xffffff), this.add.text(0, -48, '✓  CHÍNH XÁC!', { fontFamily: 'Baloo 2', fontSize: '39px', fontStyle: 'bold', color: '#fff' }).setOrigin(.5)]).setDepth(100)
    for (let i = 0; i < 7; i++) { const star = this.add.text(768, 740, '★', { fontSize: '38px', color: '#ffe17a', stroke: '#fff', strokeThickness: 3 }).setOrigin(.5); this.tweens.add({ targets: star, x: Phaser.Math.Between(470, 1060), y: Phaser.Math.Between(480, 710), alpha: 0, duration: 700, delay: i * 70, onComplete: () => star.destroy() }) }
    gameButton(this, 768, 875, this.index === this.questions.length - 1 ? 'XEM KẾT QUẢ' : 'TIẾP TỤC', 0xff9c4c, () => { this.index++; if (this.index >= this.questions.length) this.scene.start('Result', { farmId: this.farmId, correct: this.firstTryCorrect, attempts: this.attempts, total: this.questions.length }); else this.drawRound() }, 300).setDepth(101)
    this.tweens.add({ targets: card, scaleX: { from: .75, to: 1 }, scaleY: { from: .75, to: 1 }, duration: 260, ease: 'Back.Out' })
  }
}
