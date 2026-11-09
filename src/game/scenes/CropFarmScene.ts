import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { useFarmStore } from '../../store/gameStore'
import { playSfx, speakAnimal } from '../systems/AudioManager'

type CropStage = 'seed' | 'water' | 'pest' | 'fertilize' | 'grow' | 'harvest'

/** Script module 2: a real crop lifecycle, persisted through the shared farm store. */
export class CropFarmScene extends BaseScene {
  private stage: CropStage = 'seed'; private stageText!: Phaser.GameObjects.Text; private action?: Phaser.GameObjects.Container
  constructor() { super('CropFarm') }
  create() {
    this.add.image(768, 512, 'drive-crop-farm').setDisplaySize(1536, 1024)
    this.add.rectangle(768, 512, 1536, 1024, 0x153c55, .08)
    this.title('VƯỜN RAU CỦ', 'Crop Farm • Gieo hạt, chăm sóc và thu hoạch')
    this.backButton('FarmMap'); this.soundToggle()
    this.add.text(768, 160, 'Good job! Now let’s move the seed bag to spread the seeds!', { fontFamily: 'Nunito', fontSize: '22px', color: '#fff', stroke: '#397848', strokeThickness: 4 }).setOrigin(.5)
    this.add.text(768, 190, 'Tốt lắm! Hãy kéo túi hạt giống vào luống đất nhé!', { fontFamily: 'Nunito', fontSize: '20px', color: '#f4fff2', stroke: '#397848', strokeThickness: 3 }).setOrigin(.5)
    // Reserve a separate baseline below the action artwork so the step label never sits inside a button.
    this.stageText = this.add.text(768, 970, '', { fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#fff', stroke: '#397848', strokeThickness: 5 }).setOrigin(.5)
    this.renderStage()
  }
  private renderStage() {
    const labels: Record<CropStage, string> = { seed: '1. Kéo túi hạt vào luống đất', water: '2. Tưới nước cho hạt', pest: '3. Bắt sâu để bảo vệ cây', fertilize: '4. Bón phân cho cây khỏe', grow: '5. Cà rốt đang lớn — chờ 10 giây', harvest: '6. Thu hoạch cà rốt vào kho!' }
    this.stageText.setText(labels[this.stage])
    if (this.stage === 'seed') this.makeSeedBag()
    else if (this.stage === 'water') this.action = this.toolAction('drive-watering-can', 'TƯỚI NƯỚC', () => this.advance('pest'))
    else if (this.stage === 'pest') this.action = gameButton(this, 768, 890, 'BẮT SÂU', 0xff9c4c, () => this.advance('fertilize'), 280)
    else if (this.stage === 'fertilize') this.action = this.toolAction('drive-garden-fork', 'BÓN PHÂN', () => this.startGrowth())
    else if (this.stage === 'harvest') this.action = gameButton(this, 768, 890, 'THU HOẠCH', 0x62c978, () => this.harvest(), 300)
  }
  private makeSeedBag() {
    // The carrot plot is part of the supplied background: guide with copy, not a synthetic ring.
    const targetX = 470; const targetY = 570
    const targetLabel = this.add.text(targetX, targetY + 102, 'THẢ VÀO LUỐNG CÀ RỐT', { fontFamily: 'Nunito', fontSize: '17px', fontStyle: 'bold', color: '#fff8c7', stroke: '#397848', strokeThickness: 5 }).setOrigin(.5)
    const bag = this.add.image(255, 660, 'drive-seed-bag').setDisplaySize(190, 210).setInteractive({ draggable: true, useHandCursor: true })
    this.tweens.add({ targets: bag, y: 646, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
    this.input.setDraggable(bag)
    this.input.on('drag', (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => { if (object === bag) bag.setPosition(dragX, dragY) })
    this.input.once('dragend', (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (object !== bag) return
      if (Phaser.Math.Distance.Between(bag.x, bag.y, targetX, targetY) < 180) {
        playSfx('drop'); targetLabel.destroy(); bag.destroy()
        this.celebrate(targetX, targetY, 4)
        const seeded = this.add.text(targetX, targetY, 'HẠT ĐÃ GIEO!', { fontFamily: 'Nunito', fontSize: '27px', fontStyle: 'bold', color: '#fff8c7', stroke: '#397848', strokeThickness: 6 }).setOrigin(.5)
        this.tweens.add({ targets: seeded, y: targetY - 44, alpha: 0, duration: 1000, delay: 450, onComplete: () => seeded.destroy() })
        this.advance('water')
      } else {
        playSfx('error', .2); this.tweens.add({ targets: bag, x: 255, y: 660, duration: 350, ease: 'Back.Out' })
      }
    })
  }
  private toolAction(texture: string, label: string, onClick: () => void) {
    const art = this.add.image(0, -35, texture).setDisplaySize(texture === 'drive-watering-can' ? 130 : 82, 92)
    const caption = this.add.text(0, 58, label, { fontFamily: 'Nunito', fontSize: '24px', fontStyle: 'bold', color: '#fff8c7', stroke: '#5a3924', strokeThickness: 5 }).setOrigin(.5)
    const control = this.add.container(768, 850, [art, caption]).setSize(230, 180).setInteractive({ useHandCursor: true })
    control.on('pointerover', () => this.tweens.add({ targets: control, scale: 1.08, duration: 140 }))
    control.on('pointerout', () => this.tweens.add({ targets: control, scale: 1, duration: 140 }))
    control.on('pointerdown', () => { playSfx('tap'); this.tweens.add({ targets: control, scale: .9, yoyo: true, duration: 90, onComplete: onClick }) })
    return control
  }
  private advance(next: CropStage) { this.action?.destroy(); this.action = undefined; this.stage = next; this.renderStage() }
  private startGrowth() {
    this.action?.destroy(); this.action = undefined
    this.stage = 'grow'; this.renderStage()
    // This is an in-game crop timer from the script, not an artificial loading bar.
    const progress = this.add.container(768, 855).setDepth(10)
    const frame = this.add.graphics()
    frame.fillStyle(0x643b1e, .94).fillRoundedRect(-252, -31, 504, 62, 30)
    frame.fillStyle(0xfff6d6, 1).fillRoundedRect(-244, -23, 488, 46, 22)
    const fill = this.add.graphics()
    const icon = this.add.image(-278, 0, 'drive-seed-bag').setDisplaySize(62, 69)
    const label = this.add.text(0, 0, 'Cà rốt đang lớn · 10 giây', { fontFamily: 'Nunito', fontSize: '21px', fontStyle: 'bold', color: '#5b391e', stroke: '#fff9e6', strokeThickness: 3 }).setOrigin(.5)
    progress.add([frame, fill, icon, label])
    let seconds = 10
    const paint = () => {
      const amount = (10 - seconds) / 10
      fill.clear().fillStyle(0xffb83d, 1).fillRoundedRect(-236, -15, Math.max(0, 472 * amount), 30, 15)
      label.setText(seconds > 0 ? `Cà rốt đang lớn · ${seconds} giây` : 'Cà rốt đã chín!')
    }
    paint()
    this.time.addEvent({ delay: 1000, repeat: 9, callback: () => {
      seconds -= 1; paint()
      if (seconds > 0) playSfx('tick', .1)
      if (seconds === 0) {
        playSfx('success'); progress.destroy(); this.celebrate(760, 610, 7)
        const ready = this.add.text(760, 610, 'CÀ RỐT ĐÃ CHÍN!', { fontFamily: 'Nunito', fontSize: '37px', fontStyle: 'bold', color: '#fff8c7', stroke: '#e66f29', strokeThickness: 7 }).setOrigin(.5)
        this.tweens.add({ targets: ready, y: 574, alpha: 0, duration: 1400, delay: 800, onComplete: () => ready.destroy() })
        this.stage = 'harvest'; this.renderStage()
      }
    } })
  }
  private celebrate(x: number, y: number, count: number) {
    for (let index = 0; index < count; index += 1) {
      const star = this.add.image(x, y, 'drive-star').setDisplaySize(30, 30).setDepth(16)
      this.tweens.add({ targets: star, x: x + Phaser.Math.Between(-105, 105), y: y + Phaser.Math.Between(-90, -32), angle: Phaser.Math.Between(-100, 100), alpha: 0, scale: .25, duration: Phaser.Math.Between(600, 900), ease: 'Cubic.Out', onComplete: () => star.destroy() })
    }
  }
  private harvest() {
    this.action?.destroy(); this.action = undefined
    const store = useFarmStore.getState(); store.addItem('carrot', 1); store.reward('crop-farm:first-harvest', 1); store.complete('crop-farm'); store.unlock('cow-farm')
    playSfx('success'); this.celebrate(768, 480, 10); speakAnimal('Great job! You harvested a carrot.')
    this.add.container(768, 525, [this.add.rectangle(0, 0, 700, 215, 0xfff7df, .98).setStrokeStyle(6, 0xffffff), this.add.text(0, -35, 'GREAT JOB!', { fontFamily: 'Baloo 2', fontSize: '52px', color: '#e68a35' }).setOrigin(.5), this.add.text(0, 32, 'Bé đã thu hoạch cà rốt và nhận 1 ngôi sao!', { fontFamily: 'Nunito', fontSize: '26px', color: '#40566a' }).setOrigin(.5), this.add.text(0, 75, 'Carrot +1   •   ★ +1', { fontFamily: 'Baloo 2', fontSize: '25px', color: '#62a65a' }).setOrigin(.5)]).setDepth(20)
    gameButton(this, 768, 890, 'VỀ NÔNG TRẠI', 0x6685d9, () => this.scene.start('FarmMap'), 310).setDepth(21)
  }
}
