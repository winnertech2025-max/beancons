import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { WORLD_WIDTH } from '../config/gameConfig'
import { playSfx, speakBilingual } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

type DeliveryItem = 'milk' | 'carrot' | 'egg' | 'worm'
type DeliveryOrder = { id: 'chicken' | 'cow' | 'sheep' | 'fish'; card: string; items: DeliveryItem[] }

// These requirements deliberately mirror the text baked into the latest
// supplied Drive order cards. The written script currently disagrees for Cow,
// Sheep and Fish; see SCRIPT-ISSUES.md rather than silently mixing a displayed
// order with unrelated draggable goods.
const DELIVERY_ORDERS: DeliveryOrder[] = [
  { id: 'chicken', card: 'wh-order-chicken', items: ['milk'] },
  { id: 'cow', card: 'wh-order-cow', items: ['milk', 'milk', 'milk', 'carrot', 'carrot'] },
  { id: 'sheep', card: 'wh-order-sheep', items: ['egg'] },
  { id: 'fish', card: 'wh-order-fish', items: ['worm', 'worm', 'worm'] },
]
const DELIVERY_ITEMS: Record<DeliveryItem, { texture: string; label: string }> = {
  milk: { texture: 'wh-delivery-milk', label: 'Milk · Sữa' },
  carrot: { texture: 'wh-delivery-carrot', label: 'Carrot · Cà rốt' },
  egg: { texture: 'wh-delivery-egg', label: 'Egg · Trứng' },
  worm: { texture: 'wh-delivery-worm', label: 'Worm · Sâu' },
}

/** Farm Delivery follows the authored order → explore goods → load truck flow. */
export class WarehouseScene extends BaseScene {
  private explored = new Set<string>()
  private selected = 0
  private loaded = 0
  private locked = false
  private transitioning = false
  private timerEvent?: Phaser.Time.TimerEvent
  // A visit is a sequence of deliveries. Do not show the final result after a
  // single card; the mailbox remains the child-visible progress tracker.
  private delivered = new Set<DeliveryOrder['id']>()
  private readonly p = '/assets/drive/warehouse/'
  constructor() { super('Warehouse') }
  preload() {
    const a = (key: string, folder: string, file: string) => { if (!this.textures.exists(key)) this.load.image(key, `${this.p}${folder}/${file}`) }
    a('wh-ready-bg', 'Are u ready', '67AAD3A5-1271-4CA6-AA54-DF8B9DE3E4BF.png')
    a('wh-ready-board', 'Are u ready', 'IMG_7232.PNG'); a('wh-truck', 'Are u ready', '740C705C-D7C1-489D-9785-C21EEF7F7AD2.png')
    a('wh-yes', 'Are u ready', 'IMG_7168.PNG'); a('wh-exit', 'Are u ready', '7C0E205C-22DB-4C4C-8549-86F6DC0F70A3.png')
    // The supplied Warehouse NPC is an opaque white-background export. Use the
    // matching transparent female pose already supplied for the game so the
    // welcome scene remains visually integrated with its illustrated barn.
    a('wh-welcome-bg', 'Chào mừng (2)', 'Backround.png'); if (!this.textures.exists('drive-girl-welcome')) this.load.image('drive-girl-welcome', '/assets/drive/npc/girl/welcome.png'); a('wh-speech', 'Chào mừng (2)', 'Thoại.png'); a('wh-go', 'Chào mừng (2)', 'Let’s go.png')
    a('wh-orders-bg', 'đơn hàng giao (3)', 'Backround.png')
    a('wh-prepare-bg', 'Chuẩn bị hàng hoá', 'D702734A-7A68-408F-925F-5413DEC0F5CE.png'); a('wh-shelf', 'Chuẩn bị hàng hoá', 'IMG_7221.PNG'); a('wh-pumpkin', 'Chuẩn bị hàng hoá', 'IMG_7173.PNG')
    a('wh-delivery-bg', 'Giao hàng (5)', 'Backround.png'); a('wh-load-truck', 'Giao hàng (5)', 'Xe tải.PNG')
    a('wh-delivery-milk', 'Giao hàng (5)', 'Sữa.png'); a('wh-delivery-carrot', 'Giao hàng (5)', 'Carot.png'); a('wh-delivery-egg', 'Giao hàng (5)', 'Trứng.PNG'); a('wh-delivery-worm', 'Giao hàng (5)', 'Sâu.png')
    a('wh-order-chicken', 'Giao hàng (5)', 'Order của gà.PNG'); a('wh-order-cow', 'Giao hàng (5)', 'Order của bò.PNG'); a('wh-order-sheep', 'Giao hàng (5)', 'Order của cừu.PNG'); a('wh-order-fish', 'Giao hàng (5)', 'Order của cá.PNG')
    a('wh-success-bg', 'Giao hàng thành công', '8BBFE057-455C-43B4-A2CA-7277391E179C.png'); a('wh-fish', 'Giao hàng thành công', '9420D4D8-18C6-4DDB-B219-9C0C627BA787.png'); a('wh-next', 'Giao hàng thành công', 'A6FA9FB6-1B96-4BE6-A02A-30784182C6EF.png')
  }
  create() { this.ready() }
  private clear() { this.timerEvent?.remove(false); this.timerEvent = undefined; this.tweens.killAll(); this.children.removeAll(true); this.locked = false }
  private bg(key: string, title: string, sub: string) { this.add.image(768, 512, key).setDisplaySize(1536, 1024); this.title(title, sub); this.backButton('FarmMap'); this.soundToggle() }
  private artButton(key: string, x: number, y: number, w: number, onClick: () => void) {
    const b = this.add.image(x, y, key).setDisplaySize(w, w * (this.textures.get(key).getSourceImage().height / this.textures.get(key).getSourceImage().width)).setInteractive({ useHandCursor: true })
    // `setDisplaySize` creates a small scale for high-resolution source PNGs.
    // Literal scale `1.06` reset that scale, which made the CTA enormous on hover.
    const baseScaleX = b.scaleX; const baseScaleY = b.scaleY
    b.on('pointerover', () => { this.tweens.killTweensOf(b); this.tweens.add({ targets: b, scaleX: baseScaleX * 1.04, scaleY: baseScaleY * 1.04, duration: 110 }) })
    b.on('pointerout', () => { this.tweens.killTweensOf(b); this.tweens.add({ targets: b, scaleX: baseScaleX, scaleY: baseScaleY, duration: 110 }) })
    b.on('pointerdown', () => { playSfx('tap'); onClick() })
    return b
  }
  /** A short, deliberate fade prevents the illustrated Warehouse pages from
   * popping abruptly while also locking out double taps during a change. */
  private changePage(render: () => void) {
    if (this.transitioning) return
    this.transitioning = true
    this.cameras.main.fadeOut(150, 92, 54, 27)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      render()
      this.cameras.main.fadeIn(180, 92, 54, 27)
      this.transitioning = false
    })
  }
  private ready() { this.clear(); this.bg('wh-ready-bg', 'NHÀ KHO · FARM DELIVERY', 'Giao thức ăn đến các bạn động vật')
    this.add.image(760, 232, 'wh-truck').setDisplaySize(430, 286); this.add.image(768, 493, 'wh-ready-board').setDisplaySize(500, 400)
    this.artButton('wh-yes', 768, 600, 300, () => { speakBilingual("Let's deliver food to farm animals!", 'Cùng giao hàng cho các bạn động vật nhé!'); this.changePage(() => this.welcome()) })
  }
  private welcome() { this.clear(); this.bg('wh-welcome-bg', 'NHÀ KHO · FARM DELIVERY', 'Giao thức ăn đến các bạn động vật')
    this.add.image(390, 635, 'drive-girl-welcome').setDisplaySize(370, 420); this.add.image(930, 365, 'wh-speech').setDisplaySize(620, 310)
    speakBilingual('Hello! Can you help me deliver food to the farm animals?', 'Xin chào! Bé có thể giúp bác giao thức ăn cho các con vật không?')
    // The authored CTA is a very wide 3:1 illustration. Preserve that aspect
    // ratio and keep it in the clear lower-right area; using a square display
    // size here was the source of the giant cropped button in the UI.
    this.artButton('wh-go', 1055, 760, 380, () => this.changePage(() => this.orders()))
  }
  private orders() { this.clear(); this.bg('wh-orders-bg', 'ĐƠN HÀNG GIAO HÀNG', 'Chạm một đơn để xem bạn nào cần thức ăn')
    const x = [255, 595, 935, 1275]; DELIVERY_ORDERS.forEach((order, i) => {
      const done = this.delivered.has(order.id)
      const card = this.add.image(x[i], 500, order.card).setDisplaySize(218, 327).setAlpha(done ? .48 : 1)
      if (done) { this.add.image(x[i], 645, 'drive-check').setDisplaySize(62, 62); return }
      card.setInteractive({ useHandCursor: true }); const baseScaleX = card.scaleX; const baseScaleY = card.scaleY
      card.on('pointerover', () => { this.tweens.killTweensOf(card); this.tweens.add({ targets: card, scaleX: baseScaleX * 1.04, scaleY: baseScaleY * 1.04, duration: 100 }) }); card.on('pointerout', () => { this.tweens.killTweensOf(card); this.tweens.add({ targets: card, scaleX: baseScaleX, scaleY: baseScaleY, duration: 100 }) }); card.on('pointerdown', () => { this.selected = i; playSfx('select'); this.changePage(() => this.prepare()) })
    })
    this.add.text(768, 826, `${this.delivered.size} / ${DELIVERY_ORDERS.length} đơn đã giao · Mỗi đơn có thời hạn 05:00`, { fontFamily: 'Nunito', fontSize: '25px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 6 }).setOrigin(.5)
  }
  private prepare() { this.clear(); this.explored.clear(); this.bg('wh-prepare-bg', 'CHUẨN BỊ HÀNG HÓA', 'Chạm từng vật phẩm để nghe tiếng Anh trước, tiếng Việt sau')
    this.add.image(768, 355, 'wh-shelf').setDisplaySize(700, 467)
    const goods = [['Corn','Ngô'],['Grass','Cỏ'],['Carrot','Cà rốt'],['Water','Nước'],['Milk','Sữa'],['Egg','Trứng gà'],['Worm','Sâu'],['Pumpkin','Bí đỏ'],['Cabbage','Bắp cải']]
    // Measured from the supplied shelf-board itself (not the old generic grid).
    // These generous touch rectangles sit inside each illustrated cell.
    const coords = [[529,340],[686,340],[842,340],[990,340],[508,500],[646,500],[775,500],[904,500],[1038,500]]
    const progress = this.add.text(768, 790, `0 / ${goods.length} vật phẩm đã khám phá`, { fontFamily: 'Nunito', fontSize: '23px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 6 }).setOrigin(.5)
    goods.forEach(([en, vi], i) => {
      const [x, y] = coords[i]
      const spot = this.add.zone(x, y, 130, 125).setInteractive({ useHandCursor: true })
      spot.on('pointerover', () => this.tweens.add({ targets: spot, scale: 1.04, duration: 90 }))
      spot.on('pointerout', () => this.tweens.add({ targets: spot, scale: 1, duration: 90 }))
      spot.on('pointerdown', () => {
        if (this.explored.has(en)) { playSfx('select'); speakBilingual(en, vi); return }
        this.explored.add(en); playSfx('success'); speakBilingual(en, vi)
        const selected = this.add.rectangle(x, y, 136, 131, 0xffeb74, .24).setStrokeStyle(5, 0xffffff, .95).setDepth(8)
        this.tweens.add({ targets: selected, alpha: .05, duration: 650, delay: 180, onComplete: () => selected.destroy() })
        this.tweens.add({ targets: spot, scale: .92, duration: 80, yoyo: true })
        progress.setText(`${this.explored.size} / ${goods.length} vật phẩm đã khám phá`)
        if (this.explored.size === goods.length) this.showLoadButton()
      })
    })
  }
  private showLoadButton() { const b = this.add.image(768, 875, 'wh-yes').setDisplaySize(360, 120).setInteractive({useHandCursor:true}); this.tweens.add({ targets: b, scaleX: b.scaleX * 1.05, scaleY: b.scaleY * 1.05, duration: 500, yoyo: true, repeat: -1 }); b.on('pointerdown', () => this.changePage(() => this.delivery())) }
  private delivery() { this.clear(); this.bg('wh-delivery-bg', 'GIAO HÀNG', 'Kéo đúng hàng vào các ô trên xe trước khi hết 05:00')
    const order = DELIVERY_ORDERS[this.selected]
    this.loaded = 0
    this.add.image(945, 515, 'wh-load-truck').setDisplaySize(700, 388); this.add.text(270, 220, 'Đơn đang giao', {fontFamily:'Nunito',fontSize:'34px',fontStyle:'bold',color:'#fff9d4',stroke:'#704019',strokeThickness:7}).setOrigin(.5)
    this.add.image(270, 440, order.card).setDisplaySize(225, 338); const timer = this.add.text(265, 694, '05:00', {fontFamily:'Nunito',fontSize:'41px',fontStyle:'bold',color:'#fff5b1',stroke:'#704019',strokeThickness:7}).setOrigin(.5)
    let left = 300; this.timerEvent = this.time.addEvent({ delay: 1000, repeat: 299, callback: () => { left--; timer.setText(`${String(Math.floor(left / 60)).padStart(2,'0')}:${String(left % 60).padStart(2,'0')}`); if (!left) this.failure() } })
    const startX = 540 - (order.items.length - 1) * 60
    order.items.forEach((kind, i) => { const { texture, label } = DELIVERY_ITEMS[kind]; const homeX = startX + i * 120; const item = this.add.image(homeX, 832, texture).setDisplaySize(80, 80).setInteractive({useHandCursor:true}); this.add.text(homeX, 903,label,{fontFamily:'Nunito',fontSize:'13px',fontStyle:'bold',color:'#fff',stroke:'#704019',strokeThickness:4}).setOrigin(.5); item.on('pointerdown', (pointer: Phaser.Input.Pointer) => { if (this.locked || !item.input?.enabled) return; playSfx('tap'); const move = (p: Phaser.Input.Pointer) => item.setPosition(p.x, p.y); const finish = (p: Phaser.Input.Pointer) => { this.input.off('pointermove', move); if (p.x > 720 && p.x < 1240 && p.y > 340 && p.y < 660) { item.disableInteractive(); this.tweens.add({targets:item,x:760+this.loaded*93,y:510,duration:180}); this.loaded++; playSfx('drop'); if (this.loaded === order.items.length) this.success() } else this.tweens.add({targets:item,x:homeX,y:832,duration:180}) }; this.input.on('pointermove', move); this.input.once('pointerup', finish); move(pointer) }) })
    this.add.text(930, 765, `Kéo ${order.items.length} món hàng đúng theo đơn lên xe`, {fontFamily:'Nunito',fontSize:'24px',fontStyle:'bold',color:'#fff9d4',stroke:'#704019',strokeThickness:6}).setOrigin(.5)
  }
  private failure() { if (this.locked) return; this.locked = true; useFarmStore.getState().spend(1); playSfx('error'); speakBilingual('Time is up. Try again!', 'Hết giờ rồi. Bé bị trừ 1 ngôi sao, mình thử lại nhé!'); this.time.delayedCall(1300, () => this.changePage(() => this.orders())) }
  private success() { if (this.locked) return; this.locked = true; const order = DELIVERY_ORDERS[this.selected]; this.delivered.add(order.id); useFarmStore.getState().reward(`warehouse-delivery:${order.id}`, 1); playSfx('success'); speakBilingual('Delivery success!', 'Giao hàng thành công!'); this.time.delayedCall(700, () => this.changePage(() => { this.clear(); this.bg('wh-success-bg', 'DELIVERY SUCCESS!', `Đơn ${this.delivered.size}/${DELIVERY_ORDERS.length} đã giao · Bé nhận 1 ngôi sao`); this.add.image(530, 580, 'wh-fish').setDisplaySize(300, 300); this.artButton('wh-next', 1000, 780, 320, () => this.changePage(() => this.delivered.size === DELIVERY_ORDERS.length ? this.complete() : this.orders())) })) }
  private complete() { useFarmStore.getState().complete('warehouse-delivery'); this.clear(); this.bg('wh-success-bg', 'ALL DELIVERIES COMPLETED!', 'Bé đã giao đủ tất cả đơn hàng!'); this.add.text(WORLD_WIDTH/2, 520, '⭐ ⭐ ⭐\nTuyệt vời, Bé giao hàng giỏi quá!', {fontFamily:'Nunito',fontSize:'42px',fontStyle:'bold',align:'center',color:'#fff9d4',stroke:'#704019',strokeThickness:8}).setOrigin(.5); this.artButton('wh-next', 768, 760, 360, () => this.scene.start('FarmMap')) }
}
