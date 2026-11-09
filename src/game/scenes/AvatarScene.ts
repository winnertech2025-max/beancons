import { BaseScene } from './BaseScene'
import { useFarmStore, type FarmerAvatar } from '../../store/gameStore'

export class AvatarScene extends BaseScene {
  private selecting = false
  constructor() { super('Avatar') }
  create() {
    this.selecting = false
    this.add.image(768, 512, 'drive-farm-overview').setDisplaySize(1536, 1024)
    this.add.rectangle(768, 512, 1536, 1024, 0x1c6e92, 0.35)
    this.title('CHỌN NGƯỜI NÔNG DÂN', 'Choose your Happy Farm helper • Chọn bạn đồng hành')
    this.add.text(768, 222, 'Bé muốn hóa thân thành ai?', { fontFamily: 'Baloo 2', fontSize: '36px', color: '#ffffff', stroke: '#24536b', strokeThickness: 5 }).setOrigin(.5)
    this.add.text(768, 266, 'Chạm vào người bạn đồng hành để bắt đầu', { fontFamily: 'Nunito', fontSize: '21px', color: '#eafaff', fontStyle: 'bold' }).setOrigin(.5)
    this.avatarOption('girl', 470, 'drive-girl-smile', 'BÉ GÁI', 'Farmer Girl', 0xef8ca9)
    this.avatarOption('boy', 1066, 'drive-boy-wave', 'BÉ TRAI', 'Farmer Boy', 0x54b5e5)
    this.backButton('Welcome')
    this.input.keyboard?.on('keydown-G', () => this.choose('girl'))
    this.input.keyboard?.on('keydown-B', () => this.choose('boy'))
  }
  private avatarOption(avatar: Exclude<FarmerAvatar, null>, x: number, texture: string, title: string, subtitle: string, accent: number) {
    const card = this.add.container(x, 520)
    const shadow = this.add.ellipse(0, 190, 310, 38, 0x163a52, .36)
    // The supplied character PNGs already have alpha; do not put them in white placeholder cards.
    const portrait = this.add.image(0, -20, texture).setDisplaySize(390, 323).setInteractive({ useHandCursor: true })
    const label = this.add.text(0, 196, title, { fontFamily: 'Baloo 2', fontSize: '34px', fontStyle: 'bold', color: '#ffffff', stroke: '#28566e', strokeThickness: 5 }).setOrigin(.5)
    const sub = this.add.text(0, 238, subtitle, { fontFamily: 'Nunito', fontSize: '22px', color: '#ffffff', stroke: '#28566e', strokeThickness: 4 }).setOrigin(.5)
    const hint = this.add.text(0, 276, 'Chạm để chọn', { fontFamily: 'Nunito', fontSize: '19px', color: '#fff5bd', stroke: '#28566e', strokeThickness: 3, fontStyle: 'bold' }).setOrigin(.5)
    card.add([shadow, portrait, label, sub, hint])
    portrait.on('pointerover', () => this.tweens.add({ targets: card, y: 506, scaleX: 1.035, scaleY: 1.035, duration: 150, ease: 'Back.Out' }))
    portrait.on('pointerout', () => this.tweens.add({ targets: card, y: 520, scaleX: 1, scaleY: 1, duration: 150, ease: 'Sine.Out' }))
    portrait.on('pointerdown', () => this.choose(avatar, card, accent))
  }
  private choose(avatar: Exclude<FarmerAvatar, null>, selectedCard?: Phaser.GameObjects.Container, accent = 0xffcf58) {
    if (this.selecting) return
    this.selecting = true
    useFarmStore.getState().setAvatar(avatar)
    if (selectedCard) this.tweens.add({ targets: selectedCard, scaleX: 1.09, scaleY: .94, duration: 90, yoyo: true, ease: 'Quad.Out' })
    const confirmation = this.add.text(768, 830, `Tuyệt vời! Bé chọn ${avatar === 'girl' ? 'Farmer Girl' : 'Farmer Boy'}.`, { fontFamily: 'Baloo 2', fontSize: '28px', color: '#ffffff', stroke: '#28566e', strokeThickness: 5, backgroundColor: Phaser.Display.Color.IntegerToColor(accent).rgba, padding: { x: 20, y: 10 } }).setOrigin(.5).setScale(.8)
    this.tweens.add({ targets: confirmation, scale: 1, duration: 180, ease: 'Back.Out' })
    this.time.delayedCall(520, () => this.scene.start('Intro'))
  }
}
