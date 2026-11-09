import { BaseScene } from './BaseScene'

/** Main menu composed from the supplied farm map, notice-board and button artwork. */
export class WelcomeScene extends BaseScene {
  constructor() { super('Welcome') }

  create() {
    this.add.image(768, 512, 'drive-farm-overview').setDisplaySize(1536, 1024)

    // Real Drive notice-board artwork: text remains native for crisp Vietnamese/localization.
    this.add.image(408, 430, 'drive-notice-board').setDisplaySize(570, 380).setDepth(2)
    // The wooden header remains intentionally empty: its usable text area is too narrow.
    this.add.text(408, 360, 'HAPPY FARM', {
      // Nunito is locally reliable in the Phaser canvas; it keeps the label legible if Google Fonts is unavailable.
      fontFamily: 'Nunito', fontSize: '40px', fontStyle: 'bold', color: '#7d3f16', stroke: '#fff9e8', strokeThickness: 4,
    }).setOrigin(.5).setDepth(3)
    this.add.text(408, 415, 'Nông trại tiếng Anh', {
      fontFamily: 'Nunito', fontSize: '27px', color: '#31576d', fontStyle: 'bold',
    }).setOrigin(.5).setDepth(3)
    this.add.text(408, 459, 'Chơi • Nghe • Ghi nhớ', {
      fontFamily: 'Nunito', fontSize: '24px', color: '#31576d', fontStyle: 'bold',
    }).setOrigin(.5).setDepth(3)
    this.add.text(408, 515, 'Cùng chăm sóc nông trại\nvà học tiếng Anh mỗi ngày!', {
      fontFamily: 'Nunito', fontSize: '22px', color: '#31576d', align: 'center', lineSpacing: 7,
    }).setOrigin(.5).setDepth(3)

    // Controls deliberately sit outside the board: they remain distinct from decorative art.
    this.menuButton(408, 680, 'drive-check', 'BẮT ĐẦU KHÁM PHÁ', () => this.scene.start('Avatar'))
    this.menuButton(408, 823, 'drive-help', 'CÁCH CHƠI', () => this.showHelp())

    this.add.image(1190, 845, 'drive-star').setDisplaySize(64, 64).setDepth(3)
    this.add.text(1303, 846, 'Học tiếng Anh cùng\nnhững người bạn đáng yêu!', {
      fontFamily: 'Baloo 2', fontSize: '25px', color: '#ffffff', stroke: '#285a6c', strokeThickness: 5, align: 'center',
    }).setOrigin(.5).setDepth(3)

    this.soundToggle()
  }

  private menuButton(x: number, y: number, icon: string, label: string, action: () => void) {
    const button = this.add.container(x, y).setSize(438, 130)
    const banner = this.add.image(0, 0, 'drive-cow-banner').setDisplaySize(438, 146).setInteractive({ useHandCursor: true })
    const badge = this.add.image(-158, 0, icon).setDisplaySize(62, 62)
    // Banner's cow and icon consume both ends; keep text in its measured clear centre area.
    const text = this.add.text(-8, 0, label, { fontFamily: 'Nunito', fontSize: '24px', fontStyle: 'bold', color: '#6d3814', stroke: '#fffdf2', strokeThickness: 2 }).setOrigin(.5)
    button.add([banner, badge, text])
    banner.on('pointerover', () => this.tweens.add({ targets: button, scaleX: 1.035, scaleY: 1.035, duration: 130, ease: 'Back.Out' }))
    banner.on('pointerout', () => this.tweens.add({ targets: button, scaleX: 1, scaleY: 1, duration: 130, ease: 'Sine.Out' }))
    banner.on('pointerdown', () => {
      this.tweens.add({ targets: button, scaleX: .96, scaleY: .96, duration: 80, yoyo: true, ease: 'Quad.Out', onComplete: action })
    })
  }

  private showHelp() {
    const shade = this.add.rectangle(768, 512, 1536, 1024, 0x173d4e, .48).setInteractive().setDepth(20)
    const board = this.add.image(768, 512, 'drive-notice-board').setDisplaySize(780, 520).setDepth(21)
    const title = this.add.text(768, 356, 'Cách chơi', { fontFamily: 'Baloo 2', fontSize: '48px', color: '#7d3f16' }).setOrigin(.5).setDepth(22)
    const copy = this.add.text(768, 497, '1. Chọn người bạn đồng hành\n2. Khám phá và chăm sóc nông trại\n3. Nghe, chọn đúng và nhận ngôi sao!', { fontFamily: 'Nunito', fontSize: '27px', color: '#405f72', align: 'center', lineSpacing: 17 }).setOrigin(.5).setDepth(22)
    const close = this.add.image(768, 680, 'drive-cow-banner').setDisplaySize(290, 97).setInteractive({ useHandCursor: true }).setDepth(22)
    const closeLabel = this.add.text(768, 680, 'ĐÃ HIỂU', { fontFamily: 'Baloo 2', fontSize: '26px', fontStyle: 'bold', color: '#704019', stroke: '#fffef2', strokeThickness: 3 }).setOrigin(.5).setDepth(23)
    close.on('pointerdown', () => [shade, board, title, copy, close, closeLabel].forEach((item) => item.destroy()))
  }
}
