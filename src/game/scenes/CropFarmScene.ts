import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { useFarmStore } from '../../store/gameStore'
import { playSfx, speakBilingual } from '../systems/AudioManager'

type CropStage = 'seed' | 'water' | 'pest' | 'fertilize' | 'grow' | 'harvest'

type SeedSpec = {
  id: string
  texture: string
  english: string
  vietnamese: string
  target: [number, number]
  hitArea: [number, number]
  shelf: [number, number]
}

const SEED_SPECS: SeedSpec[] = [
  { id: 'radish', texture: 'drive-radish-seeds', english: 'Radish', vietnamese: 'Củ cải', target: [650, 495], hitArea: [175, 64], shelf: [310, 300] },
  { id: 'tomato', texture: 'drive-tomato-seeds', english: 'Tomato', vietnamese: 'Cà chua', target: [360, 602], hitArea: [205, 82], shelf: [425, 300] },
  { id: 'carrot', texture: 'drive-carrot-seeds', english: 'Carrot', vietnamese: 'Cà rốt', target: [920, 590], hitArea: [200, 82], shelf: [540, 300] },
  { id: 'cabbage', texture: 'drive-cabbage-seeds', english: 'Cabbage', vietnamese: 'Bắp cải', target: [1250, 650], hitArea: [205, 83], shelf: [655, 300] },
  { id: 'strawberry', texture: 'drive-strawberry-seeds', english: 'Strawberry', vietnamese: 'Dâu tây', target: [720, 720], hitArea: [225, 95], shelf: [770, 300] },
]

/** Script module 2: a real crop lifecycle, persisted through the shared farm store. */
export class CropFarmScene extends BaseScene {
  private stage: CropStage = 'seed'; private stageText!: Phaser.GameObjects.Text; private instruction!: Phaser.GameObjects.Text; private translation!: Phaser.GameObjects.Text; private action?: Phaser.GameObjects.Container; private garden!: Phaser.GameObjects.Image
  private stageObjects: Phaser.GameObjects.GameObject[] = []
  private interactionCleanup?: () => void
  constructor() { super('CropFarm') }
  preload() {
    [
      ['drive-crop-empty', '/assets/drive/crop-2026/bed-empty.png'], ['drive-crop-seeds', '/assets/drive/crop-2026/bed-seeds.png'], ['drive-crop-sprouts', '/assets/drive/crop-2026/bed-sprouts.png'],
      ['drive-radish-seeds', '/assets/drive/crop-2026/radish-seeds-transparent.png'], ['drive-tomato-seeds', '/assets/drive/crop-2026/D1CF7FD8-2096-4388-8FFF-64FB87F2ACDC.png'], ['drive-carrot-seeds', '/assets/drive/crop-2026/D3DB1974-5B70-4AE4-B37E-612B079C8857.png'], ['drive-cabbage-seeds', '/assets/drive/crop-2026/D15D49CF-B668-4076-9C11-F5D359050CDD.png'], ['drive-strawberry-seeds', '/assets/drive/crop-2026/EEBB5901-BFEC-4625-8E50-06778C7CB176.png'],
      ['drive-watering-can', '/assets/drive/crop-2026/watering-can.png'], ['drive-fertilizer', '/assets/drive/crop-2026/fertilizer.png'], ['drive-crop-worm', '/assets/drive/crop-2026/caterpillar-transparent.png'], ['drive-crop-ladybug', '/assets/drive/crop-2026/ladybug-transparent.png'], ['drive-bug-net', '/assets/drive/crop-2026/bug-net.png'], ['drive-notice-board', '/assets/drive/ui/notice-board.png']
    ].forEach(([key, path]) => { if (!this.textures.exists(key)) this.load.image(key, path) })
  }
  create() {
    this.garden = this.add.image(768, 512, 'drive-crop-empty').setDisplaySize(1536, 1024)
    this.add.rectangle(768, 512, 1536, 1024, 0x153c55, .08)
    this.title('VƯỜN RAU CỦ', 'Crop Farm • Gieo hạt, chăm sóc và thu hoạch')
    this.backButton('FarmMap'); this.soundToggle()
    this.instruction = this.add.text(768, 160, '', { fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#fff', stroke: '#397848', strokeThickness: 4 }).setOrigin(.5)
    this.translation = this.add.text(768, 190, '', { fontFamily: 'Nunito', fontSize: '20px', color: '#f4fff2', stroke: '#397848', strokeThickness: 3 }).setOrigin(.5)
    // Reserve a separate baseline below the action artwork so the step label never sits inside a button.
    this.stageText = this.add.text(768, 970, '', { fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#fff', stroke: '#397848', strokeThickness: 5 }).setOrigin(.5)
    this.renderStage()
  }
  private renderStage() {
    this.clearStageObjects()
    const beds: Record<CropStage, string> = { seed: 'drive-crop-empty', water: 'drive-crop-seeds', pest: 'drive-crop-sprouts', fertilize: 'drive-crop-sprouts', grow: 'drive-crop-sprouts', harvest: 'drive-crop-sprouts' }
    this.garden.setTexture(beds[this.stage])
    const labels: Record<CropStage, string> = { seed: '1. Kéo túi hạt vào luống đất', water: '2. Tưới nước cho hạt', pest: '3. Bắt sâu để bảo vệ cây', fertilize: '4. Bón phân cho cây khỏe', grow: '5. Cây đang lớn — chờ 10 giây', harvest: '6. Thu hoạch nông sản vào kho!' }
    const instructions: Record<CropStage, [string, string]> = {
      seed: ['Plant every seed bag in its matching garden bed!', 'Kéo từng túi hạt vào đúng luống đất tương ứng nhé!'],
      water: ['Tap the watering can to water the seeds!', 'Chạm bình tưới để tưới hạt giống nào!'],
      pest: ['Find and catch the pests!', 'Hãy bắt sâu để bảo vệ cây nhé!'],
      fertilize: ['Use the garden fork to fertilize the soil!', 'Dùng dụng cụ làm đất cho cây khỏe hơn!'],
      grow: ['The crops are growing!', 'Các cây đang lớn lên rồi!'],
      harvest: ['Tap harvest and take the crops to the farm!', 'Chạm thu hoạch để mang nông sản về nông trại!'],
    }
    this.stageText.setText(labels[this.stage])
    this.instruction.setText(instructions[this.stage][0])
    this.translation.setText(instructions[this.stage][1])
    if (this.stage === 'seed') this.makeSeedBag()
    else if (this.stage === 'water') this.action = this.toolAction('drive-watering-can', 'TƯỚI NƯỚC', () => this.waterCrop())
    else if (this.stage === 'pest') this.catchPests()
    else if (this.stage === 'fertilize') this.action = this.toolAction('drive-fertilizer', 'BÓN PHÂN', () => this.startGrowth())
    else if (this.stage === 'harvest') this.action = gameButton(this, 768, 890, 'THU HOẠCH', 0x62c978, () => this.harvest(), 300)
  }
  private makeSeedBag() {
    const counter = this.track(this.add.text(768, 385, 'ĐÃ GIEO: 0 / 5', { fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#fff8c7', stroke: '#397848', strokeThickness: 5 }).setOrigin(.5).setDepth(8))
    const plantedLabels = new Map<string, Phaser.GameObjects.Text>()
    const bags = new Map<string, Phaser.GameObjects.Image>()
    let planted = 0

    // These labels are intentionally attached to the supplied soil beds, so a child
    // knows both the crop name and the exact drop destination before dragging.
    SEED_SPECS.forEach((seed) => {
      const [targetX, targetY] = seed.target
      const label = this.track(this.add.text(targetX, targetY + 68, `${seed.english}\n${seed.vietnamese}`, { fontFamily: 'Nunito', fontSize: '15px', fontStyle: 'bold', align: 'center', color: '#fff8c7', stroke: '#5b391e', strokeThickness: 4, lineSpacing: 0 }).setOrigin(.5).setDepth(7))
      plantedLabels.set(seed.id, label)
      const [shelfX, shelfY] = seed.shelf
      const bag = this.track(this.add.image(shelfX, shelfY, seed.texture).setDisplaySize(92, 100).setDepth(10).setInteractive({ draggable: true, useHandCursor: true }))
      bags.set(seed.id, bag)
      this.input.setDraggable(bag)
      bag.on('dragstart', () => { bag.setDepth(15); label.setScale(1.15).setTint(0xfff2a5) })
    })
    const onDrag = (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      if (object instanceof Phaser.GameObjects.Image && [...bags.values()].includes(object)) object.setPosition(dragX, dragY)
    }
    const onDragEnd = (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      const seed = SEED_SPECS.find((item) => bags.get(item.id) === object)
      if (!seed || !(object instanceof Phaser.GameObjects.Image) || !object.input?.enabled) return
      const [targetX, targetY] = seed.target; const [shelfX, shelfY] = seed.shelf
      const label = plantedLabels.get(seed.id)!
      label.clearTint().setScale(1)
      // Use the visible soil bed's individual ellipse, not a generic circular
      // hotspot. A bag dropped on the path or a neighbouring bed is rejected.
      const [radiusX, radiusY] = seed.hitArea
      const insideCorrectBed = (((object.x - targetX) / radiusX) ** 2) + (((object.y - targetY) / radiusY) ** 2) <= 1
      if (!insideCorrectBed) {
        playSfx('error', .2)
        this.tweens.add({ targets: object, x: shelfX, y: shelfY, duration: 260, ease: 'Back.Out' })
        return
      }
      object.disableInteractive().setDepth(6)
      // `setDisplaySize` internally uses a fractional scale. Tweening to a
      // literal `scale: .62` overrides that fraction and makes the high-res
      // packet enormous. Keep the authored packet compact by tweening its
      // final display dimensions instead.
      this.tweens.add({ targets: object, x: targetX, y: targetY, displayWidth: 58, displayHeight: 63, duration: 190, ease: 'Back.Out' })
      label.setText(`${seed.english}\nĐÃ GIEO!`).setColor('#fff8c7')
      planted += 1; counter.setText(`ĐÃ GIEO: ${planted} / ${SEED_SPECS.length}`)
      playSfx('drop'); this.celebrate(targetX, targetY, 3)
      if (planted === SEED_SPECS.length) this.time.delayedCall(650, () => this.advance('water'))
    }
    this.input.on('drag', onDrag)
    this.input.on('dragend', onDragEnd)
    this.interactionCleanup = () => { this.input.off('drag', onDrag); this.input.off('dragend', onDragEnd) }
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
  private waterCrop() {
    const can = this.action
    if (!can) return
    can.disableInteractive()
    playSfx('tap')
    // Water is feedback for this exact action, not a permanent particle system.
    // It is kept to one short burst so it stays smooth on low-end phones.
    const droplets: Phaser.GameObjects.Arc[] = []
    for (let index = 0; index < 12; index += 1) {
      const drop = this.add.circle(704 + Phaser.Math.Between(-26, 28), 804 + Phaser.Math.Between(-8, 12), Phaser.Math.Between(4, 7), 0x7cddf5, .92).setDepth(8)
      droplets.push(drop)
      this.tweens.add({ targets: drop, x: 610 + Phaser.Math.Between(-85, 85), y: 635 + Phaser.Math.Between(-22, 40), alpha: 0, scale: .45, duration: Phaser.Math.Between(420, 620), delay: index * 35, ease: 'Quad.Out', onComplete: () => drop.destroy() })
    }
    this.tweens.add({ targets: can, angle: -17, x: 718, duration: 180, yoyo: true, repeat: 1, ease: 'Sine.InOut', onComplete: () => this.advance('pest') })
  }
  private catchPests() {
    const positions = [[560, 560], [700, 610], [835, 565]]
    let caught = 0
    const counter = this.track(this.add.text(768, 860, 'SÂU ĐÃ BẮT: 0 / 3', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', color: '#fff8c7', stroke: '#397848', strokeThickness: 5 }).setOrigin(.5))
    const net = this.track(this.add.image(1260, 835, 'drive-bug-net').setDisplaySize(150, 150).setInteractive({ draggable: true, useHandCursor: true }).setDepth(12))
    this.input.setDraggable(net)
    this.input.on('drag', (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => { if (object === net) net.setPosition(dragX, dragY) })
    const pests: Phaser.GameObjects.Image[] = []
    positions.forEach(([x, y]) => {
      const pest = this.track(this.add.image(x, y, pests.length % 2 === 0 ? 'drive-crop-worm' : 'drive-crop-ladybug').setDisplaySize(92, 70).setDepth(8))
      pests.push(pest)
      this.tweens.add({ targets: pest, y: y - 10, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
    })
    net.on('dragend', () => {
      const pest = pests.find((candidate) => candidate.active && Phaser.Math.Distance.Between(net.x, net.y, candidate.x, candidate.y) < 105)
      if (!pest) { playSfx('error', .18); this.tweens.add({ targets: net, x: 1260, y: 835, duration: 220, ease: 'Back.Out' }); return }
      pest.setActive(false); caught += 1; playSfx('success'); speakBilingual('Worm!', 'Con sâu!')
      this.tweens.add({ targets: pest, scale: .2, alpha: 0, duration: 220, onComplete: () => pest.destroy() })
      this.tweens.add({ targets: net, x: 1260, y: 835, duration: 220, ease: 'Back.Out' })
      counter.setText(`SÂU ĐÃ BẮT: ${caught} / 3`)
      if (caught === positions.length) { net.disableInteractive(); this.time.delayedCall(350, () => this.advance('fertilize')) }
    })
  }
  private track<T extends Phaser.GameObjects.GameObject>(object: T): T { this.stageObjects.push(object); return object }
  private clearStageObjects() { this.interactionCleanup?.(); this.interactionCleanup = undefined; this.stageObjects.splice(0).forEach((object) => object.destroy()) }
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
    // This packet is preloaded in this scene. Keep it inside the bar; the old
    // stale key rendered Phaser's missing-texture placeholder outside the frame.
    const icon = this.add.image(-214, 0, 'drive-carrot-seeds').setDisplaySize(42, 46)
    const label = this.add.text(22, 0, 'Các cây đang lớn · 10 giây', { fontFamily: 'Nunito', fontSize: '21px', fontStyle: 'bold', color: '#5b391e', stroke: '#fff9e6', strokeThickness: 3 }).setOrigin(.5)
    progress.add([frame, fill, icon, label])
    let seconds = 10
    const paint = () => {
      const amount = (10 - seconds) / 10
      fill.clear().fillStyle(0xffb83d, 1).fillRoundedRect(-236, -15, Math.max(0, 472 * amount), 30, 15)
      label.setText(seconds > 0 ? `Các cây đang lớn · ${seconds} giây` : 'Các cây đã chín!')
    }
    paint()
    this.time.addEvent({ delay: 1000, repeat: 9, callback: () => {
      seconds -= 1; paint()
      if (seconds > 0) playSfx('tick', .1)
      if (seconds === 0) {
        playSfx('success'); progress.destroy(); this.celebrate(760, 610, 7)
        const ready = this.add.text(760, 610, 'CÂY ĐÃ CHÍN!', { fontFamily: 'Nunito', fontSize: '37px', fontStyle: 'bold', color: '#fff8c7', stroke: '#e66f29', strokeThickness: 7 }).setOrigin(.5)
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
    // The result board owns the message hierarchy. Leaving the last task copy
    // visible underneath made the success screen read like two conflicting states.
    this.instruction.setVisible(false); this.translation.setVisible(false); this.stageText.setVisible(false)
    const store = useFarmStore.getState(); ['radish', 'tomato', 'carrot', 'cabbage', 'strawberry'].forEach((item) => store.addItem(item, 1)); store.reward('crop-farm:first-harvest', 1); store.complete('crop-farm'); store.unlock('cow-farm')
    playSfx('success'); this.celebrate(768, 480, 10); speakBilingual('Great job! You harvested your crops.', 'Tuyệt vời! Bé đã thu hoạch nông sản.')
    this.add.image(768, 510, 'drive-notice-board').setDisplaySize(790, 525).setDepth(20)
    this.add.text(768, 412, 'TUYỆT VỜI!', { fontFamily: 'Nunito', fontSize: '46px', fontStyle: '900', color: '#99521f', stroke: '#fff9e9', strokeThickness: 7 }).setOrigin(.5).setDepth(21)
    this.add.text(768, 490, 'Bé đã thu hoạch nông sản\nvà nhận 1 ngôi sao!', { fontFamily: 'Nunito', fontSize: '30px', fontStyle: 'bold', color: '#40566a', align: 'center', lineSpacing: 10 }).setOrigin(.5).setDepth(21)
    this.add.text(768, 575, 'HARVEST +5    ★ +1', { fontFamily: 'Nunito', fontSize: '26px', fontStyle: '900', color: '#62a65a', stroke: '#f9ffe9', strokeThickness: 4 }).setOrigin(.5).setDepth(21)
    gameButton(this, 768, 690, 'VỀ NÔNG TRẠI', 0xff9c4c, () => this.scene.start('FarmMap'), 310).setDepth(22)
  }
}
