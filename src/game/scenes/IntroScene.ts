import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { useFarmStore } from '../../store/gameStore'

export class IntroScene extends BaseScene {
  constructor() { super('Intro') }
  create() {
    this.add.image(768, 512, 'drive-farm-overview').setDisplaySize(1536, 1024)
    this.add.rectangle(768, 512, 1536, 1024, 0x1c6e92, .32)
    this.title('HAPPY FARM', 'A farm adventure for little learners')
    const avatar = useFarmStore.getState().avatar === 'boy' ? 'BÉ NÔNG DÂN' : 'BÉ NÔNG DÂN'
    // This is a supplied notice-board asset, not a generic white dialog rectangle.
    this.add.image(768, 515, 'drive-notice-board').setDisplaySize(1120, 747).setDepth(1)
    const isBoy = useFarmStore.getState().avatar === 'boy'
    const portrait = this.add.image(430, 492, isBoy ? 'drive-boy-wave' : 'drive-girl-welcome').setDisplaySize(395, 327).setDepth(3)
    this.add.ellipse(430, 680, 300, 34, 0x355d6d, .19).setDepth(2)
    this.tweens.add({ targets: portrait, y: 480, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
    this.add.text(430, 665, avatar, { fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#36566b' }).setOrigin(.5).setDepth(3)
    this.add.text(860, 370, 'Xin chào! Chào mừng bạn\nđã đến nông trại Happy Farm.', { fontFamily: 'Nunito', fontSize: '28px', fontStyle: 'bold', color: '#31576d', align: 'center', lineSpacing: 8 }).setOrigin(.5).setDepth(3)
    this.add.text(860, 460, 'Hello! Welcome to Happy Farm.', { fontFamily: 'Nunito', fontSize: '28px', color: '#31576d', fontStyle: 'bold' }).setOrigin(.5).setDepth(3)
    this.add.text(860, 545, 'Bây giờ, chúng ta sẽ học trồng cây\nvà chăm sóc các bạn động vật nhé!', { fontFamily: 'Nunito', fontSize: '24px', color: '#40566a', align: 'center', lineSpacing: 8 }).setOrigin(.5).setDepth(3)
    gameButton(this, 860, 675, 'ĐỒNG Ý, ĐI THÔI!', 0xff9c4c, () => { useFarmStore.getState().completeIntro(); this.scene.start('FarmMap') }, 370).setDepth(4)
  }
}
