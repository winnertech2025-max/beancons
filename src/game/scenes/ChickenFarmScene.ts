import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakBilingual } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

type Friend = 'hen' | 'chick'

/** Level 1 follows the authored chicken-care sequence; every beat is playable. */
export class ChickenFarmScene extends BaseScene {
  private met = new Set<Friend>()
  private locked = false
  private eggs = 0
  private selectedColour = 0xffffff

  constructor() { super('ChickenFarm') }
  preload() {
    const files: Array<[string, string]> = [
      ['drive-chicken-farm', '/assets/drive/backgrounds/chicken-farm.png'], ['drive-chicken-hen', '/assets/drive/chicken/hen.png'], ['drive-chicken-hen-happy', '/assets/drive/chicken/hen-happy.png'], ['drive-chicken-chick', '/assets/drive/chicken/chick.png'], ['drive-chicken-trough', '/assets/drive/chicken/feed-trough.png'], ['drive-chicken-water', '/assets/drive/chicken/water-trough.png'], ['drive-chicken-nest', '/assets/drive/chicken/nest.png'], ['drive-chicken-corn', '/assets/drive/warehouse/Chuẩn bị hàng hoá (4)/Bắp.png'], ['drive-chicken-grass', '/assets/drive/cow/grass.png'], ['drive-chicken-hay', '/assets/drive/cow/hay.png'], ['drive-chicken-flower', '/assets/drive/cow/flower.png'], ['drive-chicken-egg', '/assets/drive/warehouse/Chuẩn bị hàng hoá (4)/Trứng.PNG'],
    ]
    files.forEach(([key, path]) => { if (!this.textures.exists(key)) this.load.image(key, path) })
  }
  create() { this.showMeet() }
  private clear() { this.tweens.killAll(); this.children.removeAll(true); this.locked = false }
  private bg(sub: string) { this.add.image(768, 512, 'drive-chicken-farm').setDisplaySize(1536, 1024); this.title('TRANG TRẠI GÀ · LEVEL 1', sub); this.backButton('FarmMap'); this.soundToggle() }
  private heading(en: string, vi: string) { this.add.text(768, 164, en, { fontFamily: 'Nunito', fontSize: '34px', fontStyle: 'bold', color: '#fff9d4', stroke: '#337262', strokeThickness: 7 }).setOrigin(.5); this.add.text(768, 208, vi, { fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#fff', stroke: '#337262', strokeThickness: 5 }).setOrigin(.5) }

  private showMeet() {
    this.clear(); this.met.clear(); this.bg('Bước 1/4 · Làm quen với gia đình gà'); this.heading('Meet the chicken family!', 'Chạm Gà mẹ và Gà con để nghe từ mới!')
    this.friend('hen', 475, 550, 'HEN', 'Gà mẹ'); this.friend('chick', 1055, 552, 'CHICK', 'Gà con')
  }
  private friend(id: Friend, x: number, y: number, en: string, vi: string) {
    const art = this.add.image(0, -22, `drive-chicken-${id}`).setDisplaySize(420, 278); const label = this.add.text(0, 165, `${en} · ${vi}`, { fontFamily: 'Nunito', fontSize: '28px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 6 }).setOrigin(.5); const target = this.add.container(x, y, [art, label]).setSize(460, 380).setInteractive({ useHandCursor: true })
    target.on('pointerdown', () => { if (this.locked) return; this.met.add(id); playSfx('tap'); speakBilingual(en, vi); this.tweens.add({ targets: target, y: y - 22, scaleY: .94, duration: 130, yoyo: true }); if (this.met.size === 2) this.time.delayedCall(550, () => this.askChick()) })
  }
  private askChick() {
    this.clear(); this.bg('Bước 1/4 · Nhận biết gà con'); this.heading('Where is the chick?', 'Gà con ở đâu nhỉ? Chạm đúng bạn ấy nhé!'); this.answerFriend('hen', 480, false); this.answerFriend('chick', 1055, true)
  }
  private answerFriend(id: Friend, x: number, correct: boolean) {
    const art = this.add.image(0, -12, `drive-chicken-${id}`).setDisplaySize(440, 293); const label = this.add.text(0, 165, id.toUpperCase(), { fontFamily: 'Nunito', fontSize: '31px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 6 }).setOrigin(.5); const answer = this.add.container(x, 548, [art, label]).setSize(480, 410).setInteractive({ useHandCursor: true })
    answer.on('pointerdown', () => { if (this.locked) return; if (!correct) { playSfx('error'); speakBilingual('Try again!', 'Bé thử lại nhé!'); this.tweens.add({ targets: answer, x: x + 16, duration: 65, yoyo: true, repeat: 3 }); return }; this.locked = true; playSfx('success'); speakBilingual('Chick! Great job!', 'Gà con! Bé làm tốt lắm!'); this.tweens.add({ targets: answer, scale: 1.12, duration: 180, yoyo: true, onComplete: () => this.showFeed() }) })
  }

  private showFeed() {
    this.clear(); this.bg('Bước 2/4 · Cho gà ăn và uống'); this.heading('Feed the chicks!', 'Chạm món ăn để nghe từ; kéo ngô vào máng ăn.')
    const trough = this.add.image(1110, 630, 'drive-chicken-trough').setDisplaySize(330, 220).setDepth(2); this.add.image(1075, 515, 'drive-chicken-chick').setDisplaySize(250, 165).setDepth(3)
    const food: Array<[string, string, string, number, number, boolean]> = [['drive-chicken-corn', 'Corn', 'Ngô', 230, 430, true], ['drive-chicken-grass', 'Grass', 'Cỏ', 425, 430, false], ['drive-chicken-hay', 'Hay', 'Rơm', 230, 650, false], ['drive-chicken-flower', 'Flower', 'Hoa', 425, 650, false]]
    food.forEach(([key, en, vi, x, y, correct]) => {
      const item = this.add.image(x, y, key).setDisplaySize(125, 104).setInteractive({ draggable: correct, useHandCursor: true }); const label = this.add.text(x, y + 76, `${en} · ${vi}`, { fontFamily: 'Nunito', fontSize: '17px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 4 }).setOrigin(.5); item.on('pointerdown', () => speakBilingual(en, vi))
      if (correct) { item.on('drag', (_p: Phaser.Input.Pointer, dx: number, dy: number) => { item.setPosition(dx, dy); label.setPosition(dx, dy + 76) }); item.on('dragend', () => { if (Phaser.Geom.Rectangle.Contains(trough.getBounds(), item.x, item.y)) { item.disableInteractive(); label.destroy(); this.tweens.add({ targets: item, x: 1075, y: 602, alpha: 0, duration: 260, onComplete: () => item.destroy() }); playSfx('success'); speakBilingual('Good job!', 'Gà con đã được ăn rồi!'); this.time.delayedCall(500, () => this.showWater()) } else this.tweens.add({ targets: [item, label], x, y, duration: 180 }) }) }
    })
  }
  private showWater() {
    this.clear(); this.bg('Bước 2/4 · Cho gà uống nước'); this.heading('Touch the water trough!', 'Chạm máng nước để các bạn gà uống nhé!'); const water = this.add.image(768, 600, 'drive-chicken-water').setDisplaySize(440, 293).setInteractive({ useHandCursor: true }); this.add.image(510, 575, 'drive-chicken-chick').setDisplaySize(300, 200); this.add.image(1050, 575, 'drive-chicken-chick').setDisplaySize(300, 200)
    water.on('pointerdown', () => { playSfx('success'); speakBilingual('Nice!', 'Tuyệt vời, gà con đã uống nước!'); this.tweens.add({ targets: water, scaleX: water.scaleX * 1.06, scaleY: water.scaleY * 1.06, duration: 150, yoyo: true, onComplete: () => this.showEggs() }) })
  }

  private showEggs() {
    this.clear(); this.eggs = 0; this.bg('Bước 3/4 · Thu hoạch trứng'); this.heading('Collect 10 eggs!', 'Chạm trứng để đưa vào giỏ và nghe cách đếm.'); this.add.image(470, 595, 'drive-chicken-nest').setDisplaySize(420, 280); this.add.image(1070, 660, 'drive-chicken-hen-happy').setDisplaySize(330, 230); const counter = this.add.text(768, 330, 'EGGS: 0 / 10', { fontFamily: 'Nunito', fontSize: '42px', fontStyle: 'bold', color: '#fff5b1', stroke: '#704019', strokeThickness: 8 }).setOrigin(.5); this.add.image(1160, 420, 'drive-chicken-nest').setDisplaySize(200, 132); this.add.text(1160, 495, 'GIỎ TRỨNG', { fontFamily: 'Nunito', fontSize: '19px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 5 }).setOrigin(.5)
    const spawn = () => { const egg = this.add.image(475, 575, 'drive-chicken-egg').setDisplaySize(120, 80).setInteractive({ useHandCursor: true }).setDepth(5); egg.on('pointerdown', () => { if (this.locked) return; this.locked = true; this.eggs += 1; counter.setText(`EGGS: ${this.eggs} / 10`); playSfx('drop'); speakBilingual(this.eggs === 1 ? 'One egg!' : `${this.eggs} eggs!`, `${this.eggs} quả trứng!`); this.tweens.add({ targets: egg, x: 1160, y: 410, scaleX: egg.scaleX * .42, scaleY: egg.scaleY * .42, duration: 360, ease: 'Back.In', onComplete: () => { egg.destroy(); this.locked = false; if (this.eggs < 10) spawn(); else { playSfx('success'); speakBilingual('Great job!', 'Bé đã thu đủ mười quả trứng!'); gameButton(this, 768, 895, 'NEXT · TÔ MÀU', 0xffbd55, () => this.showColour(), 330) } } }) }) }; spawn()
  }
  private showColour() {
    this.clear(); this.bg('Bước 4/4 · Sáng tạo cùng màu sắc'); this.heading('Colour the egg!', 'Chạm màu để nghe từ; sau đó chạm trứng để tô màu.'); const egg = this.add.image(768, 560, 'drive-chicken-egg').setDisplaySize(360, 240).setInteractive({ useHandCursor: true }); const colours: Array<[string, string, number]> = [['Red', 'Đỏ', 0xef5b5b], ['Yellow', 'Vàng', 0xf7c948], ['Blue', 'Xanh dương', 0x55aaff], ['Green', 'Xanh lá', 0x61c66b]]
    colours.forEach(([en, vi, colour], index) => { const chip = this.add.circle(390 + index * 250, 825, 48, colour).setStrokeStyle(7, 0xffffff).setInteractive({ useHandCursor: true }); this.add.text(390 + index * 250, 895, en, { fontFamily: 'Nunito', fontSize: '18px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 4 }).setOrigin(.5); chip.on('pointerdown', () => { this.selectedColour = colour; speakBilingual(en, vi); this.tweens.add({ targets: chip, scale: 1.13, duration: 100, yoyo: true }) }) })
    egg.on('pointerdown', () => { egg.setTint(this.selectedColour); playSfx('success'); speakBilingual('Congratulations!', 'Bé vẽ đẹp lắm!'); this.time.delayedCall(350, () => this.showComplete()) })
  }
  private showComplete() {
    this.clear(); this.bg('Hoàn thành nhiệm vụ 4/4'); this.add.image(460, 565, 'drive-chicken-hen-happy').setDisplaySize(360, 250); this.add.image(1070, 565, 'drive-chicken-chick').setDisplaySize(360, 240); this.add.text(768, 310, 'CONGRATULATIONS!\nHAPPY LITTLE FARMER', { fontFamily: 'Nunito', fontSize: '43px', fontStyle: 'bold', align: 'center', color: '#fff5b1', stroke: '#704019', strokeThickness: 8 }).setOrigin(.5); this.add.text(768, 465, 'Bé đã hoàn thành Level 1!\nNhiệm vụ hoàn thành 4/4 · Từ tiếng Anh đã học 10+', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', align: 'center', color: '#fff', stroke: '#337262', strokeThickness: 5 }).setOrigin(.5); const store = useFarmStore.getState(); store.addItem('egg', 10); store.reward('chicken-farm:level-1', 1); store.complete('chicken-farm'); gameButton(this, 575, 830, 'PLAY LEVEL 2', 0xffbd55, () => this.showLevelTwoIntro(), 310); gameButton(this, 955, 830, 'VỀ NÔNG TRẠI', 0xff9c4c, () => this.scene.start('FarmMap'), 320)
  }

  private showLevelTwoIntro() {
    this.clear(); this.bg('LEVEL 2 · Tìm trứng ẩn'); this.add.image(370, 585, 'drive-chicken-hen-happy').setDisplaySize(360, 250); this.add.text(900, 390, 'OH NO! MY EGGS ARE MISSING!\nCan you find them?', { fontFamily: 'Nunito', fontSize: '36px', fontStyle: 'bold', align: 'center', color: '#fff9d4', stroke: '#704019', strokeThickness: 7 }).setOrigin(.5); this.add.text(900, 500, 'Khám phá đống rơm, bụi cây, chuồng gà,\ncây lớn và phía sau giỏ để tìm trứng.', { fontFamily: 'Nunito', fontSize: '23px', fontStyle: 'bold', align: 'center', color: '#fff', stroke: '#337262', strokeThickness: 5 }).setOrigin(.5); gameButton(this, 900, 700, "LET'S FIND!", 0xffbd55, () => this.playLevelTwo(), 310)
  }
  private playLevelTwo() {
    this.clear(); this.bg('LEVEL 2 · Tìm trứng ẩn'); this.heading('Find 10 eggs!', 'Chạm các khu vực để khám phá trứng ẩn nhé!')
    let found = 0; const counter = this.add.text(1260, 270, 'EGGS FOUND\n0 / 10', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', align: 'center', color: '#fff5b1', stroke: '#704019', strokeThickness: 6 }).setOrigin(.5)
    const areas: Array<[string, number, number]> = [['HAYSTACK · Đống rơm', 285, 555], ['GREEN BUSH · Bụi cây', 605, 690], ['CHICKEN COOP · Chuồng gà', 995, 450], ['BIG TREE · Cây lớn', 265, 355], ['BASKET · Giỏ', 1235, 685]]
    areas.forEach(([name, x, y]) => { const zone = this.add.zone(x, y, 220, 170).setInteractive({ useHandCursor: true }); const label = this.add.text(x, y + 102, name, { fontFamily: 'Nunito', fontSize: '17px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 4 }).setOrigin(.5); this.tweens.add({ targets: label, alpha: .6, duration: 800, yoyo: true, repeat: -1 }); zone.on('pointerdown', () => { if (found >= 10) return; for (let i = 0; i < 2 && found < 10; i += 1) { found += 1; const egg = this.add.image(x + (i ? 28 : -28), y - 15, 'drive-chicken-egg').setDisplaySize(75, 50).setDepth(5); this.tweens.add({ targets: egg, y: y - 80, scaleX: egg.scaleX * 1.13, scaleY: egg.scaleY * 1.13, duration: 180, yoyo: true, onComplete: () => egg.destroy() }); speakBilingual('Egg!', 'Quả trứng!') }; playSfx('success'); counter.setText(`EGGS FOUND\n${found} / 10`); if (found === 10) this.time.delayedCall(500, () => this.showLevelTwoComplete()) }) })
  }
  private showLevelTwoComplete() {
    this.clear(); this.bg('LEVEL 2 · Hoàn thành'); this.add.image(455, 585, 'drive-chicken-hen-happy').setDisplaySize(380, 265); this.add.text(870, 405, 'GREAT JOB!\nYOU FOUND ALL THE EGGS!', { fontFamily: 'Nunito', fontSize: '42px', fontStyle: 'bold', align: 'center', color: '#fff5b1', stroke: '#704019', strokeThickness: 8 }).setOrigin(.5); this.add.text(870, 520, 'Bé giỏi quá! Bé đã tìm đủ trứng!', { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', color: '#fff', stroke: '#337262', strokeThickness: 5 }).setOrigin(.5); const store = useFarmStore.getState(); store.addItem('egg', 10); store.reward('chicken-farm:level-2', 1); store.complete('chicken-farm:level-2'); gameButton(this, 870, 720, 'VỀ NÔNG TRẠI', 0xff9c4c, () => this.scene.start('FarmMap'), 320)
  }
}
