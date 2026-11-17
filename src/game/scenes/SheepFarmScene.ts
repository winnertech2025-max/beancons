import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakBilingual } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

type Stage = 'intro1'|'feed'|'intro2'|'shear'|'collect'|'intro3'|'count'|'final'
export class SheepFarmScene extends BaseScene {
  private stage: Stage = 'intro1'; private fed=0; private cuts=0; private readonly root='/assets/drive/sheep/'
  constructor(){super('SheepFarm')}
  preload(){const a=(k:string,f:string,n:string)=>{if(!this.textures.exists(k))this.load.image(k,`${this.root}${f}/${n}`)};a('sheep-bg','1 cho cừu ăn','Backround.png');a('sheep','1 cho cừu ăn','Cừu.PNG');a('sheep-l1','1 cho cừu ăn','Level 1.PNG');a('sheep-guide','2 hướng dẫn cho cừu ăn','IMG_7324.PNG');a('sheep-l2','6 level 2','Bảng can you help me.png');a('sheep-wool','9 thu gom lông','IMG_7432.PNG');a('sheep-wool-counter','9 thu gom lông','59FA3FDA-916A-4B21-B539-40D592FD4C2C.png');a('sheep-count-bg','11 đếm số cừu','IMG_7506.JPG');a('sheep-count-title','12 hướng dẫn đếm','IMG_7536.PNG');a('sheep-final-bg','14 kết','IMG_7554.JPG');if(!this.textures.exists('sheep-grass'))this.load.image('sheep-grass','/assets/drive/cow/grass.png')}
  create(){this.render()}
  private clear(){this.tweens.killAll();this.time.removeAllEvents();this.children.removeAll(true)}
  private base(t:string,s:string,b='sheep-bg'){this.add.image(768,512,b).setDisplaySize(1536,1024);this.title(t,s);this.backButton('FarmMap');this.soundToggle()}
  private sheep(x:number,y:number){return this.add.image(x,y,'sheep').setDisplaySize(220,220)}
  private next(t:string,go:()=>void){return gameButton(this,768,890,t,0x73ca45,go,340)}
  private render(){this.clear();({intro1:()=>this.intro1(),feed:()=>this.feed(),intro2:()=>this.intro2(),shear:()=>this.shear(),collect:()=>this.collect(),intro3:()=>this.intro3(),count:()=>this.count(),final:()=>this.final()}[this.stage])()}
  private intro1(){this.base('LEVEL 1 · FEED THE SHEEP','Cho cừu ăn');this.add.image(768,220,'sheep-l1').setDisplaySize(330,112);[470,768,1065].forEach(x=>this.sheep(x,560));this.add.image(768,350,'sheep-guide').setDisplaySize(500,185);speakBilingual("I'm hungry!",'Tôi đói quá!');this.next('BẮT ĐẦU CHO ĂN',()=>{this.stage='feed';this.render()})}
  private feed(){this.base('LEVEL 1 · FEED THE SHEEP','Kéo cỏ đến miệng từng chú cừu');const sheep=[this.sheep(430,560),this.sheep(768,560),this.sheep(1105,560)];const counter=this.add.text(768,220,'0 / 3',{fontFamily:'Nunito',fontSize:'46px',fontStyle:'bold',color:'#fff5b1',stroke:'#704019',strokeThickness:8}).setOrigin(.5);this.add.image(768,350,'sheep-guide').setDisplaySize(470,174);const grass=this.add.image(768,820,'sheep-grass').setDisplaySize(135,120).setInteractive({useHandCursor:true});grass.on('pointerdown',(p:Phaser.Input.Pointer)=>{const move=(q:Phaser.Input.Pointer)=>grass.setPosition(q.x,q.y);const up=(q:Phaser.Input.Pointer)=>{this.input.off('pointermove',move);const target=sheep.find(s=>Phaser.Math.Distance.Between(q.x,q.y,s.x,s.y)<145&&s.active);if(!target)return this.tweens.add({targets:grass,x:768,y:820,duration:170});target.destroy();this.fed++;counter.setText(`${this.fed} / 3`);playSfx('success');speakBilingual('Yummy! Thank you!','Ngon quá! Cảm ơn bé!');grass.setPosition(768,820);if(this.fed===3)this.time.delayedCall(500,()=>{this.stage='intro2';this.render()})};this.input.on('pointermove',move);this.input.once('pointerup',up);move(p)})}
  private intro2(){this.base('LEVEL 2 · SHEAR THE SHEEP','Cắt lông cừu');this.add.image(768,310,'sheep-l2').setDisplaySize(680,360);this.sheep(768,650);speakBilingual('Our wool is too long! Can you help me shear the sheep?','Lông của chúng tôi dài quá! Bé giúp chúng tôi cắt lông cừu nhé!');this.next('BẮT ĐẦU CẮT LÔNG',()=>{this.stage='shear';this.render()})}
  private shear(){this.base('LEVEL 2 · SHEAR THE SHEEP','Chạm kéo 3 lần để cắt lông');const sheep=this.sheep(768,540);const progress=this.add.text(768,220,'0 / 3 lần cắt',{fontFamily:'Nunito',fontSize:'38px',fontStyle:'bold',color:'#fff5b1',stroke:'#704019',strokeThickness:7}).setOrigin(.5);const cut=gameButton(this,768,835,'✂️  CẮT LÔNG',0xffbd55,()=>{this.cuts++;playSfx('tick');progress.setText(`${this.cuts} / 3 lần cắt`);this.tweens.add({targets:sheep,scaleX:.9,duration:120,yoyo:true});if(this.cuts===3){playSfx('success');speakBilingual('Beautiful sheep! Well done!','Chú cừu thật đẹp! Bé đã thu hoạch lông thành công!');cut.destroy();this.time.delayedCall(500,()=>{this.stage='collect';this.render()})}},280)}
  private collect() {
    this.base('LEVEL 2 · COLLECT THE WOOL', 'Chạm các búi lông để thu gom vào giỏ')
    this.sheep(690, 570).setDepth(3)
    const counter = this.add.image(768, 265, 'sheep-wool-counter').setDisplaySize(430, 144).setVisible(false).setDepth(5)
    const count = this.add.text(768, 220, 'ĐÃ THU: 0 / 9', { fontFamily: 'Nunito', fontSize: '31px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 6 }).setOrigin(.5).setDepth(5)
    const basket = this.add.image(1110, 640, 'sheep-wool').setDisplaySize(165, 82).setDepth(4)
    this.add.text(1110, 718, 'GIỎ LÔNG', { fontFamily: 'Nunito', fontSize: '22px', fontStyle: 'bold', color: '#fff9d4', stroke: '#704019', strokeThickness: 5 }).setOrigin(.5).setDepth(5)
    let got = 0
    const positions: Array<[number, number]> = [[420,700],[550,790],[680,700],[810,790],[940,700],[445,850],[595,880],[765,860],[930,875]]
    positions.forEach(([x, y]) => {
      const wool = this.add.image(x, y, 'sheep-wool').setDisplaySize(96, 48).setDepth(4).setInteractive({ useHandCursor: true })
      wool.on('pointerdown', () => {
        wool.disableInteractive(); playSfx('drop')
        this.tweens.add({
          targets: wool, x: 1110, y: 640, scaleX: .25, scaleY: .25, duration: 300, ease: 'Back.In',
          onComplete: () => {
            wool.destroy(); got += 1; count.setText(`ĐÃ THU: ${got} / 9`)
            if (got === 3) { counter.setVisible(true); this.tweens.add({ targets: counter, scale: 1.06, duration: 160, yoyo: true, onComplete: () => this.time.delayedCall(650, () => counter.setVisible(false)) }) }
            if (got === 9) {
              this.tweens.add({ targets: [basket, counter], scale: 1.08, duration: 150, yoyo: true })
              this.time.delayedCall(450, () => { this.stage = 'intro3'; this.render() })
            }
          },
        })
      })
    })
  }
  private intro3(){this.base('LEVEL 3 · COUNT THE SHEEP','Đếm số cừu · Count the sheep','sheep-count-bg');this.add.image(768,270,'sheep-count-title').setDisplaySize(470,180);[510,768,1025].forEach(x=>this.sheep(x,590));speakBilingual('Can you help me count the sheep?','Bé có thể giúp tôi đếm số cừu không?');this.next('CÙNG ĐẾM NÀO',()=>{this.stage='count';this.render()})}
  private count(){this.base('LEVEL 3 · COUNT THE SHEEP','How many sheep? · Có bao nhiêu chú cừu?','sheep-count-bg');[510,768,1025].forEach(x=>this.sheep(x,500));this.add.text(768,250,'How many sheep?',{fontFamily:'Nunito',fontSize:'46px',fontStyle:'bold',color:'#fff9d4',stroke:'#704019',strokeThickness:8}).setOrigin(.5);[[2,430],[3,768],[4,1106]].forEach(([n,x])=>gameButton(this,x,805,String(n),n===3?0x77cc47:0xa65ed2,()=>this.answer(n===3),190))}
  private answer(ok:boolean){if(!ok){playSfx('error');speakBilingual('Try again!','Bé thử lại nhé!');return}playSfx('success');speakBilingual('Correct! Three sheep!','Chính xác! Có ba chú cừu!');this.time.delayedCall(500,()=>{this.stage='final';this.render()})}
  private final(){this.base('SHEEP FARM COMPLETED!','Hoàn thành Chuồng Cừu!','sheep-final-bg');useFarmStore.getState().reward('sheep-farm',3);useFarmStore.getState().complete('sheep-farm');this.add.text(768,470,'⭐ ⭐ ⭐\nTuyệt vời! Bé đã chăm sóc tất cả chú cừu.',{fontFamily:'Nunito',fontSize:'43px',fontStyle:'bold',align:'center',color:'#fff9d4',stroke:'#704019',strokeThickness:8}).setOrigin(.5);gameButton(this,560,850,'CHƠI LẠI',0x39a9e6,()=>{this.stage='intro1';this.fed=0;this.cuts=0;this.render()},260);gameButton(this,970,850,'VỀ BẢN ĐỒ',0xffbd55,()=>this.scene.start('FarmMap'),280)}
}
