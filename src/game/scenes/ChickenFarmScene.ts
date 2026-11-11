import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakBilingual } from '../systems/AudioManager'

type Friend = 'hen' | 'chick'

/**
 * Chicken Farm starts with the first authored learning beat: meet the hen and
 * chick, then identify the chick.  The later feeding/egg/colour beats are not
 * exposed here until their matching food and egg artwork is supplied.
 */
export class ChickenFarmScene extends BaseScene {
  private met = new Set<Friend>()
  private prompt?: Phaser.GameObjects.Text
  private locked = false

  constructor() { super('ChickenFarm') }

  preload() {
    [
      ['drive-chicken-farm', '/assets/drive/backgrounds/chicken-farm.png'],
      ['drive-chicken-hen', '/assets/drive/chicken/hen.png'],
      ['drive-chicken-hen-happy', '/assets/drive/chicken/hen-happy.png'],
      ['drive-chicken-chick', '/assets/drive/chicken/chick.png'],
    ].forEach(([key, path]) => { if (!this.textures.exists(key)) this.load.image(key, path) })
  }

  create() { this.showMeetFamily() }

  private reset() { this.tweens.killAll(); this.children.removeAll(true); this.met.clear(); this.locked = false }

  private background() {
    this.add.image(768, 512, 'drive-chicken-farm').setDisplaySize(1536, 1024)
    this.title('TRANG TRẠI GÀ · LEVEL 1', 'Chicken Farm · Lắng nghe và chạm vào gia đình gà')
    this.backButton('FarmMap')
    this.soundToggle()
  }

  private showMeetFamily() {
    this.reset(); this.background()
    this.prompt = this.add.text(768, 173, 'Chạm vào Gà mẹ và Gà con để nghe từ mới!', {
      fontFamily: 'Nunito', fontSize: '26px', fontStyle: 'bold', color: '#fff9d4', stroke: '#337262', strokeThickness: 6,
    }).setOrigin(.5)
    this.makeFriend('hen', 475, 550, 420, 278, 'HEN', 'Gà mẹ')
    this.makeFriend('chick', 1055, 552, 420, 278, 'CHICK', 'Gà con')
  }

  private makeFriend(id: Friend, x: number, y: number, width: number, height: number, word: string, vietnamese: string) {
    const image = this.add.image(0, -22, `drive-chicken-${id}`).setDisplaySize(width, height)
    const label = this.add.text(0, 165, `${word} · ${vietnamese}`, {
      fontFamily: 'Nunito', fontSize: '28px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 6,
    }).setOrigin(.5)
    const target = this.add.container(x, y, [image, label]).setSize(width + 40, height + 95).setInteractive({ useHandCursor: true })
    target.on('pointerover', () => this.tweens.add({ targets: target, scale: 1.045, duration: 120, ease: 'Sine.Out' }))
    target.on('pointerout', () => this.tweens.add({ targets: target, scale: 1, duration: 120, ease: 'Sine.Out' }))
    target.on('pointerdown', () => {
      if (this.locked) return
      this.met.add(id); playSfx('tap'); speakBilingual(word, vietnamese)
      this.tweens.add({ targets: target, y: y - 22, scaleY: .94, duration: 130, yoyo: true, ease: 'Quad.Out' })
      label.setColor('#fff5b1')
      if (this.met.size === 2) this.time.delayedCall(700, () => this.askForChick())
      else this.prompt?.setText(`Tuyệt! Bây giờ hãy chạm vào ${id === 'hen' ? 'Gà con' : 'Gà mẹ'} nhé.`)
    })
  }

  private askForChick() {
    this.tweens.killAll(); this.children.removeAll(true); this.locked = false
    this.background()
    this.add.text(768, 178, 'Where is the chick?', {
      fontFamily: 'Nunito', fontSize: '34px', fontStyle: 'bold', color: '#fff9d4', stroke: '#337262', strokeThickness: 7,
    }).setOrigin(.5)
    this.add.text(768, 222, 'Gà con ở đâu nhỉ? Chạm đúng bạn ấy nhé!', {
      fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#ffffff', stroke: '#337262', strokeThickness: 5,
    }).setOrigin(.5)
    this.answerFriend('hen', 480, 548, 'HEN', false)
    this.answerFriend('chick', 1055, 548, 'CHICK', true)
  }

  private answerFriend(id: Friend, x: number, y: number, label: string, correct: boolean) {
    const art = this.add.image(0, -12, `drive-chicken-${id}`).setDisplaySize(440, 293)
    const caption = this.add.text(0, 165, label, {
      fontFamily: 'Nunito', fontSize: '31px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 6,
    }).setOrigin(.5)
    const answer = this.add.container(x, y, [art, caption]).setSize(480, 410).setInteractive({ useHandCursor: true })
    answer.on('pointerover', () => this.tweens.add({ targets: answer, scale: 1.05, duration: 120, ease: 'Sine.Out' }))
    answer.on('pointerout', () => this.tweens.add({ targets: answer, scale: 1, duration: 120, ease: 'Sine.Out' }))
    answer.on('pointerdown', () => {
      if (this.locked) return
      if (!correct) { playSfx('error'); speakBilingual('Try again!', 'Bé thử lại nhé!'); this.tweens.add({ targets: answer, x: x + 16, duration: 65, yoyo: true, repeat: 3 }); return }
      this.locked = true; playSfx('success'); speakBilingual('Chick! Great job!', 'Gà con! Bé làm tốt lắm!')
      this.tweens.add({ targets: answer, scale: 1.14, duration: 210, yoyo: true, ease: 'Back.Out' })
      this.showSuccess()
    })
  }

  private showSuccess() {
    const result = this.add.container(768, 830, [
      this.add.text(0, -30, 'GREAT JOB!', { fontFamily: 'Nunito', fontSize: '44px', fontStyle: 'bold', color: '#fff5b1', stroke: '#8d4b1e', strokeThickness: 8 }).setOrigin(.5),
      this.add.text(0, 22, 'Bé đã tìm đúng gà con!', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', color: '#ffffff', stroke: '#337262', strokeThickness: 5 }).setOrigin(.5),
    ]).setAlpha(0)
    this.tweens.add({ targets: result, alpha: 1, y: 800, duration: 300, ease: 'Back.Out' })
    gameButton(this, 768, 914, 'VỀ NÔNG TRẠI', 0xff9c4c, () => this.scene.start('FarmMap'), 290)
  }
}
