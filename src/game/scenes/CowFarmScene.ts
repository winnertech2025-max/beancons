import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakAnimal, speakBilingual } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

type CowStage = 'feed' | 'vocabulary' | 'chooseBucket' | 'milk' | 'load' | 'finish'

/** Full Level 1 flow using the approved, updated Cow Farm artwork from Drive. */
export class CowFarmScene extends BaseScene {
  private stage: CowStage = 'feed'; private instruction!: Phaser.GameObjects.Text; private foodObjects: Phaser.GameObjects.Container[] = []; private taps = 0
  constructor() { super('CowFarm') }
  init(data: { stage?: CowStage }) { this.stage = data.stage ?? 'feed'; this.foodObjects = []; this.taps = 0 }
  create() {
    const background = this.stage === 'load' ? 'drive-cow-delivery-barn'
      : this.stage === 'chooseBucket' ? 'drive-cow-milking-empty'
        : this.stage === 'milk' ? 'drive-cow-milking-bucket'
          : 'drive-cow-farm'
    this.add.image(768, 512, background).setDisplaySize(1536, 1024)
    this.add.rectangle(768, 512, 1536, 1024, 0x153c55, .08); this.title('LEVEL 1 · FEED THE COW', 'Cho bò ăn · Vắt sữa · Giao hàng'); this.backButton('FarmMap'); this.soundToggle()
    this.instruction = this.add.text(768, 170, '', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', color: '#fff9d4', stroke: '#357348', strokeThickness: 6 }).setOrigin(.5)
    if (this.stage === 'feed') this.startFeed(); else if (this.stage === 'chooseBucket') this.chooseBucket(); else if (this.stage === 'milk') this.startMilking(); else if (this.stage === 'load') this.startLoadingMilk(); else if (this.stage === 'finish') this.showFinish()
  }
  private startFeed() {
    this.instruction.setText('“I\'m hungry!” · “Tôi đói quá!”'); const cue = this.add.text(510, 590, 'HÃY THẢ THỨC ĂN VÀO BÒ', { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#fff8c7', stroke: '#42753e', strokeThickness: 5 }).setOrigin(.5)
    this.tweens.add({ targets: cue, alpha: .55, duration: 800, yoyo: true, repeat: -1 }); this.time.delayedCall(450, () => speakAnimal("I'm hungry!")); this.time.delayedCall(1500, () => { if (this.stage === 'feed') { this.instruction.setText('Find the grass! · Hãy tìm cỏ!'); speakAnimal('Find the grass!') } })
    this.addFood('drive-cow-grass', 'GRASS', 'CỎ', 1090, 790, true, 140, 72, cue); this.addFood('drive-cow-hay', 'HAY', 'CỎ KHÔ', 1270, 790, false, 130, 88, cue); this.addFood('drive-flower-bush', 'FLOWERS', 'HOA', 1435, 790, false, 116, 108, cue)
  }
  private addFood(texture: string, english: string, vietnamese: string, x: number, y: number, correct: boolean, width: number, height: number, cue: Phaser.GameObjects.Text) {
    const art = this.add.image(0, -22, texture).setDisplaySize(width, height); const en = this.add.text(0, 67, english, { fontFamily: 'Nunito', fontSize: '21px', fontStyle: 'bold', color: '#fff9d4', stroke: '#5d3922', strokeThickness: 5 }).setOrigin(.5); const vi = this.add.text(0, 91, vietnamese, { fontFamily: 'Nunito', fontSize: '17px', fontStyle: 'bold', color: '#fff', stroke: '#5d3922', strokeThickness: 4 }).setOrigin(.5)
    const item = this.add.container(x, y, [art, en, vi]).setSize(150, 150).setInteractive({ draggable: true, useHandCursor: true }); this.foodObjects.push(item); this.input.setDraggable(item); item.on('pointerdown', () => { playSfx('select', .22); speakAnimal(english) }); this.input.on('drag', (_p: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => { if (object === item) item.setPosition(dragX, dragY) })
    item.on('dragend', () => { if (this.stage !== 'feed') return; if (correct && Phaser.Math.Distance.Between(item.x, item.y, 565, 545) < 200) { playSfx('success'); this.foodObjects.forEach((food) => food.disableInteractive()); this.instruction.setText('Yummy! Thank you! · Ngon quá, cảm ơn bé!'); speakAnimal('Yummy! Thank you!'); cue.destroy(); item.destroy(); this.celebrate(565, 500); this.time.delayedCall(1300, () => this.showVocabulary()) } else { playSfx('error', .2); this.instruction.setText('Try again! · Bé thử lại nhé!'); speakAnimal('Try again!'); this.tweens.add({ targets: item, x, y, duration: 320, ease: 'Back.Out' }); this.time.delayedCall(950, () => this.instruction.setText('Find the grass! · Hãy tìm cỏ!')) } })
  }
  private showVocabulary() {
    this.stage = 'vocabulary'; this.foodObjects.forEach((item) => item.destroy()); this.instruction.setText('Cùng nghe và nhắc lại các từ mới!'); this.add.rectangle(768, 525, 1536, 880, 0x183c46, .24).setDepth(10); this.add.image(768, 530, 'drive-notice-board').setDisplaySize(920, 615).setDepth(11); this.add.text(768, 336, 'TỪ VỰNG CỦA BÉ', { fontFamily: 'Nunito', fontSize: '35px', fontStyle: 'bold', color: '#704019', stroke: '#fff9ea', strokeThickness: 4 }).setOrigin(.5).setDepth(12)
    const words: Array<[string, string, string]> = [['COW', 'Con bò', 'drive-star'], ['GRASS', 'Cỏ', 'drive-cow-grass'], ['HAY', 'Cỏ khô', 'drive-cow-hay'], ['FLOWER', 'Hoa', 'drive-flower-bush']]; words.forEach(([english, vietnamese, texture], index) => { const x = 545 + (index % 2) * 450; const y = 475 + Math.floor(index / 2) * 116; const icon = this.add.image(-132, 0, texture).setDisplaySize(index === 1 ? 74 : 54, 54); const en = this.add.text(-45, -12, english, { fontFamily: 'Nunito', fontSize: '26px', fontStyle: 'bold', color: '#75401c' }).setOrigin(0, .5); const vi = this.add.text(-45, 21, vietnamese, { fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#3e6577' }).setOrigin(0, .5); const word = this.add.container(x, y, [icon, en, vi]).setSize(340, 85).setDepth(12).setInteractive({ useHandCursor: true }); word.on('pointerdown', () => { playSfx('select', .2); speakBilingual(english, vietnamese); this.tweens.add({ targets: word, scale: 1.08, duration: 110, yoyo: true }) }) })
    gameButton(this, 768, 735, 'TIẾP TỤC VẮT SỮA', 0xffbd55, () => this.scene.restart({ stage: 'chooseBucket' }), 360).setDepth(13)
  }
  private chooseBucket() {
    this.instruction.setText('Hãy chọn đúng chiếc xô để giúp bò vắt sữa!')
    this.time.delayedCall(350, () => speakBilingual('Please help me milk!', 'Hãy giúp tôi vắt sữa!'))
    const board = this.add.image(768, 550, 'drive-cow-selection-board').setDisplaySize(1044, 696).setDepth(10)
    const items: Array<[number, number, string, string, boolean]> = [
      [531, 494, 'Chair', 'Chiếc ghế', false], [769, 478, 'Hat', 'Chiếc nón', false], [1000, 478, 'Apple', 'Quả táo', false], [627, 681, 'Milk bottle', 'Bình sữa', false], [899, 681, 'Bucket', 'Cái xô', true],
    ]
    items.forEach(([x, y, english, vietnamese, correct]) => {
      const hotspot = this.add.rectangle(x, y, 190, 190, correct ? 0xffe45c : 0xffffff, .001).setDepth(11).setInteractive({ useHandCursor: true })
      hotspot.on('pointerover', () => { hotspot.setFillStyle(0xffef82, .22); board.setTint(0xffffdf) })
      hotspot.on('pointerout', () => { hotspot.setFillStyle(correct ? 0xffe45c : 0xffffff, .001); board.clearTint() })
      hotspot.on('pointerdown', () => {
        playSfx('select', .22)
        if (!correct) { speakBilingual(english, vietnamese); this.instruction.setText(`Đây là ${vietnamese}. Hãy tìm cái xô nhé!`); this.tweens.add({ targets: hotspot, scale: .9, yoyo: true, duration: 100 }); return }
        speakAnimal('Bucket'); this.instruction.setText('Đúng rồi! Xô đã được đặt cạnh bò.'); board.destroy(); items.forEach(() => hotspot.removeAllListeners())
        this.cameras.main.flash(180, 255, 239, 150); this.time.delayedCall(550, () => this.scene.restart({ stage: 'milk' }))
      })
    })
  }
  private startMilking() {
    this.instruction.setText('Xô đã ở cạnh bò! Chạm theo nhịp để vắt sữa.'); this.time.delayedCall(350, () => speakBilingual('The bucket is ready!', 'Xô đã sẵn sàng!')); this.beginMilkingRhythm()
  }
  private beginMilkingRhythm() { this.instruction.setText('TOUCH chú bò theo nhịp · 0 / 5'); const meter = this.add.text(930, 780, 'SỮA: 0 / 5', { fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#fff8c7', stroke: '#5d3922', strokeThickness: 4 }).setOrigin(.5); const touch = gameButton(this, 690, 615, 'TOUCH BÒ', 0xffbd55, () => { this.taps += 1; playSfx('tick', .18); this.instruction.setText(`TOUCH chú bò theo nhịp · ${this.taps} / 5`); meter.setText(`SỮA: ${this.taps} / 5`); if (this.taps >= 5) { touch.destroy(); meter.destroy(); playSfx('success'); speakAnimal('Great job!'); this.add.image(768, 512, 'drive-cow-milking-full').setDisplaySize(1536, 1024).setDepth(20); this.celebrate(930, 680); this.time.delayedCall(1050, () => this.scene.restart({ stage: 'load' })) } }, 220); this.tweens.add({ targets: touch, scale: 1.06, duration: 520, yoyo: true, repeat: -1 }) }
  private startLoadingMilk() { this.instruction.setText('“The truck is here!” · Kéo 2 bình sữa lên xe.'); this.time.delayedCall(450, () => speakAnimal('The truck is here!')); const truck = this.add.image(1160, 690, 'drive-cow-truck').setDisplaySize(330, 220); let loaded = 0; for (let index = 0; index < 2; index += 1) { const bottle = this.add.image(260 + index * 180, 710, 'drive-cow-bottle-milk').setDisplaySize(112, 120).setInteractive({ draggable: true, useHandCursor: true }); this.input.setDraggable(bottle); this.input.on('drag', (_p: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, x: number, y: number) => { if (object === bottle) bottle.setPosition(x, y) }); bottle.on('dragend', () => { if (Phaser.Math.Distance.Between(bottle.x, bottle.y, truck.x, truck.y) > 235) { playSfx('error', .2); this.tweens.add({ targets: bottle, x: 260 + index * 180, y: 710, duration: 260, ease: 'Back.Out' }); return } bottle.destroy(); loaded += 1; playSfx('drop'); speakAnimal(loaded === 1 ? 'One' : 'Two'); if (loaded === 2) this.time.delayedCall(500, () => gameButton(this, 768, 860, 'START', 0xffbd55, () => { playSfx('bong'); this.tweens.add({ targets: truck, x: 1750, duration: 1200, onComplete: () => this.scene.restart({ stage: 'finish' }) }) }, 250)) }) } }
  private showFinish() { const store = useFarmStore.getState(); store.addItem('milk', 2); store.reward('cow-farm:complete', 1); store.complete('cow-farm'); store.unlock('fishing-lake'); store.unlock('memory-home'); this.instruction.setText('Tuyệt vời! Bé đã hoàn thành Level 1.'); this.add.image(768, 450, 'drive-star').setDisplaySize(165, 165); this.add.text(768, 580, 'LITTLE FARMER', { fontFamily: 'Nunito', fontSize: '44px', fontStyle: 'bold', color: '#fff8c7', stroke: '#74421c', strokeThickness: 7 }).setOrigin(.5); this.add.text(768, 630, 'Sữa +2   ·   Ngôi sao +1', { fontFamily: 'Nunito', fontSize: '27px', fontStyle: 'bold', color: '#fff', stroke: '#355f71', strokeThickness: 5 }).setOrigin(.5); gameButton(this, 580, 790, 'CHƠI LẠI LEVEL 1', 0xffbd55, () => this.scene.restart({ stage: 'feed' }), 330); gameButton(this, 950, 790, 'VỀ NÔNG TRẠI', 0xffbd55, () => this.scene.start('FarmMap'), 310) }
  private celebrate(x: number, y: number) { for (let index = 0; index < 7; index += 1) { const star = this.add.image(x, y, 'drive-star').setDisplaySize(31, 31).setDepth(20); this.tweens.add({ targets: star, x: x + Phaser.Math.Between(-105, 105), y: y + Phaser.Math.Between(-105, -24), angle: Phaser.Math.Between(-100, 100), alpha: 0, scale: .25, duration: Phaser.Math.Between(560, 850), onComplete: () => star.destroy() }) } }
}
