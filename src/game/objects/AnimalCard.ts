import Phaser from 'phaser'
import type { Animal } from '../../data/animals'

export function animalCard(scene: Phaser.Scene, x: number, y: number, animal: Animal, onClick: () => void, size = 175) {
  const width = size * 1.25; const height = size * .9
  const items: Phaser.GameObjects.GameObject[] = []
  const imageKey = `animal-${animal.id}`
  if (scene.textures.exists(imageKey)) {
    const art = scene.add.image(0, 0, imageKey).setDisplaySize(width, height)
    items.push(art)
  } else {
    const face = scene.add.circle(0, -4, height * .33, animal.color)
    const eyeA = scene.add.circle(-height * .12, -height * .07, 6, 0x4b342d); const eyeB = scene.add.circle(height * .12, -height * .07, 6, 0x4b342d); const nose = scene.add.circle(0, height * .13, 6, 0x704437)
    items.push(face, eyeA, eyeB, nose)
  }
  const card = scene.add.container(x, y, items).setSize(width, height)
  const hitArea = scene.add.rectangle(x, y, width, height, 0xffffff, .001).setName(`answer-${animal.id}`).setDepth(50).setInteractive({ useHandCursor: true })
  hitArea.on('pointerover', () => scene.tweens.add({ targets: card, y: y - 9, scaleX: 1.035, scaleY: 1.035, duration: 130 }))
  hitArea.on('pointerout', () => scene.tweens.add({ targets: card, y, scaleX: 1, scaleY: 1, duration: 130 }))
  hitArea.on('pointerdown', onClick)
  return card
}
