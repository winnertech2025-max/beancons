import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakBilingual } from '../systems/AudioManager'

/** The supplied sheep panorama already includes the animals and jump rail. */
export class SheepFarmScene extends BaseScene {
  private jumps = 0
  private busy = false
  private round = 1

  constructor() { super('SheepFarm') }

  preload() {
    if (!this.textures.exists('drive-sheep-farm')) this.load.image('drive-sheep-farm', '/assets/drive/backgrounds/sheep-farm.png')
  }

  init(data: { round?: number }) { this.round = data.round ?? 1; this.jumps = 0; this.busy = false }

  create() {
    this.add.image(768, 512, 'drive-sheep-farm').setDisplaySize(1536, 1024)
    this.title('TRANG TRẠI CỪU', 'Sheep Farm · Lắng nghe và đếm từng cú nhảy')
    this.backButton('FarmMap')
    this.soundToggle()
    this.add.text(768, 170, `LƯỢT ${this.round} · Jump three times!`, { fontFamily: 'Nunito', fontSize: '42px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 8 }).setOrigin(.5)
    this.add.text(768, 218, 'Nhấn JUMP 3 lần để các bạn cừu cùng vượt rào nhé!', { fontFamily: 'Nunito', fontSize: '24px', fontStyle: 'bold', color: '#fff', stroke: '#337262', strokeThickness: 5 }).setOrigin(.5)
    const counter = this.add.text(768, 292, '0 / 3', { fontFamily: 'Nunito', fontSize: '58px', fontStyle: 'bold', color: '#fff5b1', stroke: '#704019', strokeThickness: 9 }).setOrigin(.5)
    speakBilingual('Jump three times!', 'Nhảy ba lần nhé!')
    const jump = gameButton(this, 768, 850, 'JUMP!', 0xffbd55, () => {
      if (this.busy || this.jumps >= 3) return
      this.busy = true
      this.jumps += 1
      counter.setText(`${this.jumps} / 3`)
      playSfx('tap')
      // The sheep are part of the authored panorama, so give the scene a
      // bounded physical response instead of covering them with invented art.
      this.cameras.main.shake(90, .0016)
      this.tweens.add({ targets: jump, scaleY: .88, duration: 85, yoyo: true, onComplete: () => {
        this.busy = false
        if (this.jumps < 3) speakBilingual(String(this.jumps), `Lần ${this.jumps}!`)
        else this.complete(counter, jump)
      } })
    }, 270)
    this.tweens.add({ targets: jump, scale: 1.045, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
  }

  private complete(counter: Phaser.GameObjects.Text, jump: Phaser.GameObjects.Container) {
    playSfx('success'); speakBilingual('Great job!', 'Bé đã nhảy đủ ba lần rồi!')
    counter.setText('3 / 3 · GREAT JOB!').setFontSize(42)
    jump.destroy()
    // The script says a completed three-jump turn advances to the next turn;
    // it must not end the entire Sheep Farm on the first three presses.
    gameButton(this, 768, 850, 'LƯỢT TIẾP THEO', 0xffbd55, () => this.scene.restart({ round: this.round + 1 }), 300)
  }
}
