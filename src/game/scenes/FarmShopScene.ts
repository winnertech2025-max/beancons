import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { useFarmStore } from '../../store/gameStore'
import { playSfx, speakBilingual } from '../systems/AudioManager'

type ShopItem = { id: string; title: string; vi: string; texture: string; price: number }
const ITEMS: ShopItem[] = [
  { id: 'garden-tree', title: 'TREE', vi: 'Cây xanh', texture: 'shop-tree', price: 2 },
  { id: 'flower-bush', title: 'FLOWERS', vi: 'Bụi hoa', texture: 'shop-flower', price: 2 },
  { id: 'sunflower', title: 'SUNFLOWER', vi: 'Hoa hướng dương', texture: 'shop-sunflower', price: 3 },
]

/** Economy screen built only from supplied decoration art. */
export class FarmShopScene extends BaseScene {
  constructor() { super('FarmShop') }
  preload() {
    ;[['shop-tree','/assets/drive/decorations/tree.png'], ['shop-flower','/assets/drive/decorations/flower-bush.png'], ['shop-sunflower','/assets/drive/vegetation/sunflower.png']].forEach(([key, path]) => {
      if (!this.textures.exists(key)) this.load.image(key, path)
    })
  }
  create() { this.draw() }
  private draw() {
    this.children.removeAll(true)
    this.add.image(768, 512, 'drive-farm-overview').setDisplaySize(1536, 1024)
    this.add.rectangle(768, 512, 1536, 1024, 0x173d4e, .22)
    this.title('CỬA HÀNG NÔNG TRẠI', 'Farm Shop · Đổi sao lấy đồ trang trí')
    this.backButton('FarmMap'); this.soundToggle()
    const state = useFarmStore.getState()
    this.add.image(1360, 170, 'drive-star').setDisplaySize(48, 48)
    this.add.text(1420, 170, `${state.stars} SAO`, { fontFamily:'Nunito', fontSize:'28px', fontStyle:'bold', color:'#fff5b1', stroke:'#25556a', strokeThickness:6 }).setOrigin(.5)
    this.add.text(768, 260, 'Chạm món đồ để nghe từ mới. Mua xong, đồ thuộc về nông trại của bé!', { fontFamily:'Nunito', fontSize:'24px', fontStyle:'bold', color:'#fff', stroke:'#25556a', strokeThickness:5 }).setOrigin(.5)
    ITEMS.forEach((item, index) => this.item(item, 390 + index * 380, 575))
  }
  private item(item: ShopItem, x: number, y: number) {
    const owned = useFarmStore.getState().ownedItems.includes(item.id)
    const art = this.add.image(x, y - 65, item.texture).setDisplaySize(200, 180).setInteractive({ useHandCursor:true })
    art.on('pointerdown', () => { playSfx('select'); speakBilingual(item.title, item.vi) })
    this.add.text(x, y + 65, `${item.title}\n${item.vi}`, { fontFamily:'Nunito', fontSize:'25px', fontStyle:'bold', color:'#fff9d4', stroke:'#704019', strokeThickness:6, align:'center' }).setOrigin(.5)
    if (owned) { this.add.text(x, y + 155, 'ĐÃ SỞ HỮU', { fontFamily:'Nunito', fontSize:'20px', fontStyle:'bold', color:'#fff5b1', stroke:'#25556a', strokeThickness:5 }).setOrigin(.5); return }
    gameButton(this, x, y + 160, `MUA · ${item.price} ★`, 0xffbd55, () => {
      if (!useFarmStore.getState().buy(item.id, item.price)) { playSfx('error'); speakBilingual('Not enough stars.', 'Bé chưa đủ sao!'); return }
      playSfx('success'); speakBilingual('Purchased!', 'Bé đã mua thành công!'); this.draw()
    }, 240)
  }
}
