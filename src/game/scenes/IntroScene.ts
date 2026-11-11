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
    this.add.text(430, 713, avatar, { fontFamily: 'Nunito', fontSize: '20px', fontStyle: 'bold', color: '#36566b', stroke: '#fff9e9', strokeThickness: 3 }).setOrigin(.5).setDepth(3)
    // The board has generous supplied-art space: use it for one clear greeting hierarchy,
    // rather than stacking several equally small lines in the middle.
    this.add.text(860, 318, 'XIN CHÀO, BÉ YÊU!', { fontFamily: 'Nunito', fontSize: '44px', fontStyle: '900', color: '#99521f', stroke: '#fff9e9', strokeThickness: 7 }).setOrigin(.5).setDepth(3)
    this.add.text(860, 385, 'Chào mừng bạn đến với', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', color: '#405f70' }).setOrigin(.5).setDepth(3)
    this.add.text(860, 425, 'HAPPY FARM', { fontFamily: 'Nunito', fontSize: '34px', fontStyle: '900', color: '#287aa1', stroke: '#edfaff', strokeThickness: 4 }).setOrigin(.5).setDepth(3)
    this.add.text(860, 476, 'Hello! Welcome to Happy Farm.', { fontFamily: 'Nunito', fontSize: '22px', color: '#4e7080', fontStyle: 'bold' }).setOrigin(.5).setDepth(3)
    this.add.text(860, 548, 'Mình cùng trồng cây, chăm sóc\nvà học tiếng Anh với các bạn nhé!', { fontFamily: 'Nunito', fontSize: '25px', color: '#40566a', fontStyle: 'bold', align: 'center', lineSpacing: 9 }).setOrigin(.5).setDepth(3)
    gameButton(this, 860, 675, 'ĐỒNG Ý, ĐI THÔI!', 0xff9c4c, () => { useFarmStore.getState().completeIntro(); this.scene.start('FarmMap') }, 370).setDepth(4)
  }
}
