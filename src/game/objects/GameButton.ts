import Phaser from 'phaser'
import { playSfx } from '../systems/AudioManager'
export function gameButton(scene: Phaser.Scene, x: number, y: number, label: string, color: number, onClick: () => void, width = 280) {
  // Reuse the supplied farm banner instead of generic colour rectangles.
  const banner = scene.add.image(0, 0, 'drive-cow-banner').setDisplaySize(width, Math.round(width / 3))
  const text = scene.add.text(-8, 0, label, { fontFamily: 'Nunito', fontSize: `${Math.max(18, Math.min(26, width / 12))}px`, fontStyle: 'bold', color: '#6d3814', stroke: '#fffdf2', strokeThickness: 3 }).setOrigin(.5)
  const container = scene.add.container(x, y, [banner, text]).setSize(width, Math.round(width / 3)).setInteractive({ useHandCursor: true })
  container.on('pointerover', () => scene.tweens.add({ targets: container, scaleX: 1.06, scaleY: 1.06, duration: 120 }))
  container.on('pointerout', () => scene.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 120 }))
  container.on('pointerdown', () => { playSfx('tap'); scene.tweens.add({ targets: container, scaleX: .94, scaleY: .94, yoyo: true, duration: 80, onComplete: onClick }) })
  void color
  return container
}
