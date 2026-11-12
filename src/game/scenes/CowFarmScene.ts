import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakAnimal, speakBilingual, speakVietnamese } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

type CowStage = 'feed' | 'vocabulary' | 'chooseBucket' | 'milk' | 'load' | 'finish'

/** Full Level 1 flow using the approved, updated Cow Farm artwork from Drive. */
export class CowFarmScene extends BaseScene {
  private stage: CowStage = 'feed'; private instruction!: Phaser.GameObjects.Text; private foodObjects: Phaser.GameObjects.Container[] = []; private taps = 0
  constructor() { super('CowFarm') }
  preload() {
    [
      ['drive-cow-farm', '/assets/drive/backgrounds/cow-farm.png'], ['drive-cow-delivery-barn', '/assets/drive/backgrounds/cow-delivery-barn.png'],
      ['drive-cow-grass', '/assets/drive/cow/grass.png'], ['drive-cow-hay', '/assets/drive/cow/hay.png'], ['drive-flower-bush', '/assets/drive/decorations/flower-bush.png'], ['drive-cow-hungry', '/assets/drive/cow/cow-hungry.png'],
      ['drive-cow-selection-board', '/assets/drive/cow/selection-board.png'], ['drive-cow-milking-empty', '/assets/drive/cow/milking-scene-a.png'], ['drive-cow-milking-bucket', '/assets/drive/cow/milking-scene-b.png'], ['drive-cow-milking-full', '/assets/drive/cow/milking-scene-c.png'], ['drive-cow-truck', '/assets/drive/cow/truck.png'], ['drive-cow-bottle-milk', '/assets/drive/cow/bottle-milk.png'],
    ].forEach(([key, path]) => { if (!this.textures.exists(key)) this.load.image(key, path) })
  }
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
  /** All narrated phrases keep the approved order: English first, Vietnamese second. */
  private say(english: string, vietnamese: string) { speakBilingual(english, vietnamese) }
  private startFeed() {
    this.instruction.setText('“I\'m hungry!” · “Tôi đói quá!”'); const cue = this.add.text(510, 590, 'HÃY THẢ THỨC ĂN VÀO BÒ', { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#fff8c7', stroke: '#42753e', strokeThickness: 5 }).setOrigin(.5)
    this.tweens.add({ targets: cue, alpha: .55, duration: 800, yoyo: true, repeat: -1 }); this.time.delayedCall(450, () => this.say("I'm hungry!", 'Tôi đói quá!')); this.time.delayedCall(1500, () => { if (this.stage === 'feed') { this.instruction.setText('Find the grass! · Hãy tìm cỏ!'); this.say('Find the grass!', 'Hãy tìm cỏ!') } })
    this.addFood('drive-cow-grass', 'GRASS', 'CỎ', 1090, 790, true, 140, 72, cue); this.addFood('drive-cow-hay', 'HAY', 'CỎ KHÔ', 1270, 790, false, 130, 88, cue); this.addFood('drive-flower-bush', 'FLOWERS', 'HOA', 1435, 790, false, 116, 108, cue)
  }
  private addFood(texture: string, english: string, vietnamese: string, x: number, y: number, correct: boolean, width: number, height: number, cue: Phaser.GameObjects.Text) {
    const art = this.add.image(0, -22, texture).setDisplaySize(width, height); const en = this.add.text(0, 67, english, { fontFamily: 'Nunito', fontSize: '21px', fontStyle: 'bold', color: '#fff9d4', stroke: '#5d3922', strokeThickness: 5 }).setOrigin(.5); const vi = this.add.text(0, 91, vietnamese, { fontFamily: 'Nunito', fontSize: '17px', fontStyle: 'bold', color: '#fff', stroke: '#5d3922', strokeThickness: 4 }).setOrigin(.5)
    const item = this.add.container(x, y, [art, en, vi]).setSize(150, 150).setInteractive({ draggable: true, useHandCursor: true }); this.foodObjects.push(item); this.input.setDraggable(item)
    // Script 2 specifies two taps for vocabulary: English first, then Vietnamese.
    let pronunciationTap = 0
    item.on('pointerdown', () => { playSfx('select', .22); pronunciationTap += 1; if (pronunciationTap % 2 === 1) speakAnimal(english); else speakVietnamese(vietnamese) })
    this.input.on('drag', (_p: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => { if (object === item) item.setPosition(dragX, dragY) })
    item.on('dragend', () => { if (this.stage !== 'feed') return; if (correct && Phaser.Math.Distance.Between(item.x, item.y, 565, 545) < 200) { playSfx('success'); this.foodObjects.forEach((food) => food.disableInteractive()); this.instruction.setText('Yummy! Thank you! · Ngon quá, cảm ơn bé!'); this.say('Yummy! Thank you!', 'Ngon quá, cảm ơn bé!'); cue.destroy(); item.destroy(); this.celebrate(565, 500); this.time.delayedCall(1300, () => this.showVocabulary()) } else { playSfx('error', .2); this.instruction.setText('Try again! · Bé thử lại nhé!'); this.say('Try again!', 'Bé thử lại nhé!'); this.tweens.add({ targets: item, x, y, duration: 320, ease: 'Back.Out' }); this.time.delayedCall(950, () => this.instruction.setText('Find the grass! · Hãy tìm cỏ!')) } })
  }
  private showVocabulary() {
    this.stage = 'vocabulary'; this.foodObjects.forEach((item) => item.destroy()); this.instruction.setText('Cùng nghe và nhắc lại các từ mới!'); this.add.rectangle(768, 525, 1536, 880, 0x183c46, .24).setDepth(10); this.add.image(768, 530, 'drive-notice-board').setDisplaySize(920, 615).setDepth(11); this.add.text(768, 336, 'TỪ VỰNG CỦA BÉ', { fontFamily: 'Nunito', fontSize: '35px', fontStyle: 'bold', color: '#704019', stroke: '#fff9ea', strokeThickness: 4 }).setOrigin(.5).setDepth(12)
    // The Level 1 script defines these four words exactly: Cow, Grass, Hay, Eat.
    const words: Array<[string, string, string]> = [['COW', 'Con bò', 'drive-cow-hungry'], ['GRASS', 'Cỏ', 'drive-cow-grass'], ['HAY', 'Cỏ khô', 'drive-cow-hay'], ['EAT', 'Ăn', 'drive-cow-grass']]
    words.forEach(([english, vietnamese, texture], index) => {
      const x = 545 + (index % 2) * 450; const y = 475 + Math.floor(index / 2) * 116
      const icon = this.add.image(-132, 0, texture).setDisplaySize(index === 0 ? 72 : index === 1 ? 74 : 54, 54)
      const en = this.add.text(-45, -12, english, { fontFamily: 'Nunito', fontSize: '26px', fontStyle: 'bold', color: '#75401c' }).setOrigin(0, .5)
      const vi = this.add.text(-45, 21, vietnamese, { fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#3e6577' }).setOrigin(0, .5)
      const word = this.add.container(x, y, [icon, en, vi]).setSize(340, 85).setDepth(12).setInteractive({ useHandCursor: true })
      word.on('pointerdown', () => { playSfx('select', .2); speakBilingual(english, vietnamese); this.tweens.add({ targets: word, scale: 1.08, duration: 110, yoyo: true }) })
    })
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
        this.say('Bucket!', 'Cái xô!'); this.instruction.setText('Correct! The bucket is beside the cow. · Đúng rồi! Xô đã được đặt cạnh bò.'); board.destroy(); items.forEach(() => hotspot.removeAllListeners())
        this.cameras.main.flash(180, 255, 239, 150); this.time.delayedCall(550, () => this.scene.restart({ stage: 'milk' }))
      })
    })
  }
  private startMilking() {
    this.instruction.setText('Xô đã ở cạnh bò! Chạm theo nhịp để vắt sữa.'); this.time.delayedCall(350, () => speakBilingual('The bucket is ready!', 'Xô đã sẵn sàng!')); this.beginMilkingRhythm()
  }
  private beginMilkingRhythm() { this.instruction.setText('Touch the cow in rhythm! · Chạm bò theo nhịp! · 0 / 5'); const meter = this.add.text(930, 780, 'SỮA: 0 / 5', { fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#fff8c7', stroke: '#5d3922', strokeThickness: 4 }).setOrigin(.5); const touch = gameButton(this, 690, 615, 'TOUCH BÒ', 0xffbd55, () => { this.taps += 1; playSfx('tick', .18); this.instruction.setText(`Touch the cow in rhythm! · Chạm bò theo nhịp! · ${this.taps} / 5`); meter.setText(`SỮA: ${this.taps} / 5`); if (this.taps >= 5) { touch.destroy(); meter.destroy(); playSfx('success'); this.say('Great job!', 'Bé làm tốt lắm!'); this.add.image(768, 512, 'drive-cow-milking-full').setDisplaySize(1536, 1024).setDepth(20); this.celebrate(930, 680); this.time.delayedCall(1050, () => this.scene.restart({ stage: 'load' })) } }, 220); this.tweens.add({ targets: touch, scale: 1.06, duration: 520, yoyo: true, repeat: -1 }) }
  private startLoadingMilk() {
    const totalBottles = 10
    const numberWords: Array<[string, string]> = [['One', 'Một'], ['Two', 'Hai'], ['Three', 'Ba'], ['Four', 'Bốn'], ['Five', 'Năm'], ['Six', 'Sáu'], ['Seven', 'Bảy'], ['Eight', 'Tám'], ['Nine', 'Chín'], ['Ten', 'Mười']]
    this.instruction.setText('The truck is here! · Xe tải đến rồi!')
    const truck = this.add.image(-270, 655, 'drive-cow-truck').setDisplaySize(430, 286).setDepth(3)
    const lamp = this.add.circle(-375, 573, 11, 0xffef59, .95).setDepth(4)
    this.tweens.add({ targets: truck, x: 1050, duration: 1150, ease: 'Sine.Out', onComplete: () => {
      lamp.setPosition(truck.x - 105, truck.y - 82)
      this.say('The truck is here!', 'Xe tải đến rồi!')
      this.instruction.setText(`Drag the milk bottles onto the truck! · Kéo bình sữa lên xe! · 0 / ${totalBottles}`)
    } })
    this.tweens.add({ targets: lamp, alpha: .25, duration: 230, yoyo: true, repeat: -1 })
    let loaded = 0
    const loadedLabel = this.add.text(1045, 838, `BÌNH SỮA: 0 / ${totalBottles}`, { fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#fff8c7', stroke: '#5d3922', strokeThickness: 5 }).setOrigin(.5)
    for (let index = 0; index < totalBottles; index += 1) {
      const originX = 185 + (index % 5) * 116; const originY = 570 + Math.floor(index / 5) * 162
      const bottle = this.add.image(originX, originY, 'drive-cow-bottle-milk').setDisplaySize(76, 90).setDepth(5).setInteractive({ draggable: true, useHandCursor: true })
      this.input.setDraggable(bottle)
      this.input.on('drag', (_p: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, x: number, y: number) => { if (object === bottle) bottle.setPosition(x, y) })
      bottle.on('dragend', () => {
        if (Phaser.Math.Distance.Between(bottle.x, bottle.y, truck.x, truck.y) > 275) { playSfx('error', .2); this.tweens.add({ targets: bottle, x: originX, y: originY, duration: 260, ease: 'Back.Out' }); return }
        bottle.disableInteractive(); loaded += 1; playSfx('drop'); this.say(numberWords[loaded - 1][0], numberWords[loaded - 1][1]); loadedLabel.setText(`BÌNH SỮA: ${loaded} / ${totalBottles}`)
        // `setDisplaySize` establishes a texture-specific base scale. Tweening
        // `scale: .55` would overwrite it and blow the supplied bottle art up.
        this.tweens.add({ targets: bottle, x: truck.x - 15 + (loaded % 3) * 30, y: truck.y - 56 - Math.floor((loaded - 1) / 3) * 20, scaleX: bottle.scaleX * .55, scaleY: bottle.scaleY * .55, duration: 230, ease: 'Back.Out' })
        if (loaded !== totalBottles) return
        this.time.delayedCall(850, () => {
          this.say('Goodbye, have a safe trip!', 'Chào tạm biệt, chúc chuyến đi an toàn!')
          this.instruction.setText('Tap START to begin the delivery! · Chạm START để xe khởi hành!')
          gameButton(this, 768, 890, 'START', 0xffbd55, () => {
            playSfx('bong'); lamp.setAlpha(1)
            this.tweens.add({ targets: truck, y: truck.y - 13, scaleY: .94, duration: 140, yoyo: true, repeat: 3, ease: 'Sine.InOut', onComplete: () => {
              this.tweens.add({ targets: [truck, lamp], x: '+=850', duration: 1150, ease: 'Sine.In', onComplete: () => this.scene.restart({ stage: 'finish' }) })
            } })
          }, 250)
        })
      })
    }
  }
  private showFinish() { const store = useFarmStore.getState(); store.addItem('milk', 10); store.reward('cow-farm:complete', 1); store.complete('cow-farm'); store.unlock('fishing-lake'); store.unlock('memory-home'); this.instruction.setText('Great job! You completed Level 1. · Tuyệt vời! Bé đã hoàn thành Level 1.'); this.add.image(768, 450, 'drive-star').setDisplaySize(165, 165); this.add.text(768, 580, 'LITTLE FARMER', { fontFamily: 'Nunito', fontSize: '44px', fontStyle: 'bold', color: '#fff8c7', stroke: '#74421c', strokeThickness: 7 }).setOrigin(.5); this.add.text(768, 630, 'Milk +10   ·   Sữa +10   ·   Ngôi sao +1', { fontFamily: 'Nunito', fontSize: '27px', fontStyle: 'bold', color: '#fff', stroke: '#355f71', strokeThickness: 5 }).setOrigin(.5); gameButton(this, 580, 790, 'CHƠI LẠI LEVEL 1', 0xffbd55, () => this.scene.restart({ stage: 'feed' }), 330); gameButton(this, 950, 790, 'VỀ NÔNG TRẠI', 0xffbd55, () => this.scene.start('FarmMap'), 310) }
  private celebrate(x: number, y: number) { for (let index = 0; index < 7; index += 1) { const star = this.add.image(x, y, 'drive-star').setDisplaySize(31, 31).setDepth(20); this.tweens.add({ targets: star, x: x + Phaser.Math.Between(-105, 105), y: y + Phaser.Math.Between(-105, -24), angle: Phaser.Math.Between(-100, 100), alpha: 0, scale: .25, duration: Phaser.Math.Between(560, 850), onComplete: () => star.destroy() }) } }
}
