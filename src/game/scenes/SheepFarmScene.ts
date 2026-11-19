import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { playSfx, speakBilingual } from '../systems/AudioManager'
import { useFarmStore } from '../../store/gameStore'

type Stage = 'intro1'|'feed'|'done1'|'intro2'|'tools'|'shear'|'collect'|'done2'|'intro3'|'guide3'|'count'|'final'
const ROOT = '/assets/drive/sheep/'
const NUMBERS = [{n:1,en:'One',vi:'Một'},{n:2,en:'Two',vi:'Hai'},{n:3,en:'Three',vi:'Ba'},{n:4,en:'Four',vi:'Bốn'},{n:5,en:'Five',vi:'Năm'}]

/** Scripted bilingual Sheep Farm: feed, shear/collect, then five counting questions. */
export class SheepFarmScene extends BaseScene {
  private stage: Stage = 'intro1'
  private fed = 0
  private cuts = 0
  private wool = 0
  private question = 0
  private guided = 0
  constructor() { super('SheepFarm') }

  preload() {
    const image = (key: string, folder: string, file: string) => { if (!this.textures.exists(key)) this.load.image(key, `${ROOT}${folder}/${file}`) }
    image('s-bg','1 cho cừu ăn','Backround.png'); image('s-sheep','1 cho cừu ăn','Cừu.PNG'); image('s-l1','1 cho cừu ăn','Level 1.PNG')
    image('s-bag','3 thực hiện cho cừu ăn','Balo.PNG'); image('s-grass-v2','imported','grass.png'); image('s-feed-guide','2 hướng dẫn cho cừu ăn','IMG_7334.PNG')
    image('s-eat1','4 cho cừu ăn','Cừu ăn 1.PNG'); image('s-eat2','4 cho cừu ăn','Cừu ăn 2.PNG'); image('s-eat3','4 cho cừu ăn','Cừu ăn 3.PNG')
    image('s-praise','4 cho cừu ăn','Lời khen.PNG'); image('s-star','4 cho cừu ăn','Tính điểm sao.PNG'); image('s-heart','4 cho cừu ăn','Tim.PNG')
    image('s-l2-bg','6 level 2','Backround.JPG'); image('s-l2-title','6 level 2','Bảng level 2.PNG'); image('s-tools','6 level 2','Bảng vacabulary.PNG')
    image('s-long','6 level 2','Cừu lông dài.PNG'); image('s-sheared','6 level 2','Cừu cắt xong.PNG'); image('s-scissors','6 level 2','Kéo.PNG')
    // Supplied, author-designed Level 2 tutorial art.  These are intentionally
    // used in place of text-only substitutes so the playable screen follows the
    // client flowboard rather than a generic minigame template.
    image('s-shear-bg','7 Hướng dẫn cắt lông cừu','guide-02.png')
    image('s-shear-tutorial','7 Hướng dẫn cắt lông cừu','guide-01.png')
    image('s-shear-steps','7 Hướng dẫn cắt lông cừu','guide-04.png')
    image('s-shear-prompt','7 Hướng dẫn cắt lông cừu','guide-05.png')
    image('s-wool','9 thu gom lông','IMG_7432.PNG'); image('s-basket','9 thu gom lông','IMG_7461.PNG'); image('s-done2','10 Hoàn thành level 2','IMG_7492.PNG')
    image('s-count-bg','11 đếm số cừu','IMG_7506.JPG'); image('s-count-intro','11 đếm số cừu','IMG_7509.PNG'); image('s-count-guide','12 hướng dẫn đếm','IMG_7542.PNG')
    image('s-count-task','13 thực hiện đếm','IMG_7556.PNG'); image('s-final-bg','14 kết','IMG_7554.JPG'); image('s-final-happy','14 kết','IMG_7585.PNG')
  }

  create() { this.render() }
  private clear() { this.tweens.killAll(); this.time.removeAllEvents(); this.input.removeAllListeners(); this.children.removeAll(true) }
  private bg(key = 's-bg') { this.add.image(768,512,key).setDisplaySize(1536,1024) }
  private hud(level: number, title: string, sub: string) {
    this.backButton('FarmMap').setDepth(30); this.soundToggle(1390,70).setDepth(30)
    this.add.image(178,72,'s-bag').setDisplaySize(70,77).setDepth(20)
    this.add.text(768,60,`LEVEL ${level} · ${title}`,{fontFamily:'Nunito',fontSize:'29px',fontStyle:'bold',color:'#fff9d4',stroke:'#704019',strokeThickness:7}).setOrigin(.5).setDepth(20)
    this.add.text(768,97,sub,{fontFamily:'Nunito',fontSize:'20px',fontStyle:'bold',color:'#fff',stroke:'#704019',strokeThickness:5}).setOrigin(.5).setDepth(20)
    this.add.text(1185,70,`⭐ ${useFarmStore.getState().stars} SAO`,{fontFamily:'Nunito',fontSize:'24px',fontStyle:'bold',color:'#fff5a8',stroke:'#704019',strokeThickness:6}).setOrigin(.5).setDepth(20)
  }
  private task(en: string, vi: string) {
    this.add.image(768,910,'drive-cow-banner').setDisplaySize(620,132).setDepth(25)
    this.add.text(768,886,en,{fontFamily:'Nunito',fontSize:'24px',fontStyle:'bold',color:'#704019',align:'center',wordWrap:{width:530}}).setOrigin(.5).setDepth(26)
    this.add.text(768,924,vi,{fontFamily:'Nunito',fontSize:'18px',fontStyle:'bold',color:'#315d71',align:'center',wordWrap:{width:530}}).setOrigin(.5).setDepth(26)
  }
  private next(label: string, action: () => void) { return gameButton(this,768,824,label,0x73ca45,action,340).setDepth(30) }
  private sheep(x: number, y: number, key='s-sheep', size=235) { return this.add.image(x,y,key).setDisplaySize(size,size*.94).setDepth(5) }
  private render() { this.clear(); ({intro1:()=>this.intro1(),feed:()=>this.feed(),done1:()=>this.done1(),intro2:()=>this.intro2(),tools:()=>this.tools(),shear:()=>this.shear(),collect:()=>this.collect(),done2:()=>this.done2(),intro3:()=>this.intro3(),guide3:()=>this.guide3(),count:()=>this.count(),final:()=>this.final()}[this.stage])() }

  private intro1() {
    this.bg(); this.hud(1,'FEED THE SHEEP','Cho cừu ăn')
    this.add.image(768,180,'s-l1').setDisplaySize(430,143); [430,768,1106].forEach(x=>this.sheep(x,545))
    this.add.image(768,345,'s-feed-guide').setDisplaySize(620,178)
    this.task('Hello, little farmer! Can you help me feed the sheep?','Xin chào, bác nông dân nhỏ! Bé có thể giúp cho cừu ăn không?')
    this.next("LET'S PLAY! · CÙNG CHƠI",()=>{this.stage='feed';this.render()})
    this.time.delayedCall(250,()=>speakBilingual("I'm hungry! Please feed us!",'Tôi đói quá! Hãy cho chúng tôi ăn nhé!'))
  }
  private feed() {
    this.bg(); this.hud(1,'FEED THE SHEEP','Cho cừu ăn')
    const sheep = [[430,545],[768,545],[1106,545]].map(([x,y])=>this.sheep(x,y))
    const counter=this.add.text(768,190,'SHEEP FED: 0 / 3\nCừu đã ăn: 0 / 3',{fontFamily:'Nunito',fontSize:'25px',fontStyle:'bold',align:'center',color:'#fff9d4',stroke:'#704019',strokeThickness:6}).setOrigin(.5).setDepth(20)
    this.add.image(768,300,'s-feed-guide').setDisplaySize(490,141); this.task('Drag the grass to the sheep’s mouth!','Kéo bó cỏ đến miệng từng chú cừu nhé!')
    const bag=this.add.image(155,770,'s-bag').setDisplaySize(138,151).setInteractive({useHandCursor:true}).setDepth(15)
    const hint=this.add.text(155,858,'CHẠM BALO',{fontFamily:'Nunito',fontSize:'18px',fontStyle:'bold',color:'#fff9d4',stroke:'#704019',strokeThickness:5}).setOrigin(.5).setDepth(16)
    // `setDisplaySize` establishes a fractional Phaser scale. Animating the
    // raw `scale` here blew the supplied backpack up to its native 477px width
    // and covered the grass. Pulse the rendered size instead.
    this.tweens.add({targets:bag,displayWidth:145,displayHeight:159,duration:650,yoyo:true,repeat:-1})
    this.tweens.add({targets:hint,scale:1.05,duration:650,yoyo:true,repeat:-1})
    // The visual bag is intentionally small, but its touch target is not:
    // this is a first interaction for young children and must work reliably.
    let bagOpened=false
    const openBag=()=>{if(bagOpened)return;bagOpened=true;hint.destroy(); playSfx('tap'); const grass=this.add.image(285,785,'s-grass-v2').setDisplaySize(120,125).setInteractive({useHandCursor:true}).setDepth(18); this.drag(grass,(p)=>{
      const target=sheep.find(item=>item.active&&Phaser.Math.Distance.Between(p.x,p.y,item.x,item.y)<160)
      if(!target){this.tweens.add({targets:grass,x:285,y:785,duration:180});return}
      const idx=sheep.indexOf(target); target.setTexture(['s-eat1','s-eat2','s-eat3'][idx]).setDisplaySize(250,235); this.fed++;counter.setText(`SHEEP FED: ${this.fed} / 3\nCừu đã ăn: ${this.fed} / 3`)
      playSfx('success');speakBilingual('Yummy! Yummy!','Ngon quá! Ngon quá!');this.tweens.add({targets:target,displayWidth:266,displayHeight:249,duration:150,yoyo:true});grass.setPosition(285,785)
      if(this.fed===3)this.time.delayedCall(700,()=>{this.stage='done1';this.render()})
    }); speakBilingual('Drag the grass to the sheep’s mouth!','Bé hãy kéo bó cỏ đến miệng cừu nhé!')}
    bag.on('pointerdown',openBag)
    this.add.zone(155,770,250,230).setInteractive({useHandCursor:true}).setDepth(14).on('pointerdown',openBag)
    this.input.on('pointerdown',(pointer: Phaser.Input.Pointer)=>{if(pointer.x<300&&pointer.y>620)openBag()})
    // The supplied tutorial depicts the backpack opening before the child
    // begins the drag. Keep the direct tap, with a short guided fallback so a
    // child is never stranded if they miss the small illustrated backpack.
    this.time.delayedCall(280,openBag)
  }
  private done1() {
    this.bg();this.hud(1,'LEVEL 1 COMPLETED','Bé đã hoàn thành nhiệm vụ!')
    this.add.image(768,340,'s-praise').setDisplaySize(700,340);this.add.image(768,615,'s-star').setDisplaySize(350,130);this.add.image(600,700,'s-heart').setDisplaySize(75,70);this.add.image(936,700,'s-heart').setDisplaySize(75,70)
    useFarmStore.getState().reward('sheep-farm-level-1',1);speakBilingual('Wonderful! You fed all the sheep! Great job, little farmer!','Tuyệt vời! Bé đã cho tất cả các chú cừu ăn rồi! Bé làm tốt lắm!')
    this.next('NEXT LEVEL →',()=>{this.stage='intro2';this.render()})
  }
  private intro2() {
    this.bg('s-shear-bg');this.hud(2,'SHEAR THE SHEEP','Cắt lông cừu');this.add.image(768,190,'s-l2-title').setDisplaySize(430,142);[470,768,1066].forEach(x=>this.sheep(x,525,'s-long',290))
    this.task('Look at our wool! It’s too long! Can you help us?','Bé nhìn xem! Lông của chúng tôi dài quá! Bé có thể giúp chúng tôi không?')
    this.next("LET'S SHEAR! · CÙNG CẮT LÔNG",()=>{this.stage='tools';this.render()})
    this.time.delayedCall(250,()=>speakBilingual('Hello again, little farmer! Look at our wool! It is too long!','Xin chào bé nông dân! Bé nhìn xem! Lông của chúng tôi dài quá!'))
  }
  private tools() {
    this.bg('s-shear-bg');this.hud(2,'SHEAR THE SHEEP','Cắt lông cừu');this.add.image(768,150,'s-shear-tutorial').setDisplaySize(610,203);this.add.image(768,810,'s-shear-steps').setDisplaySize(880,293)
    const cards:[string,string,string,number,number][]=[['s-scissors','Scissors','Kéo',430,570],['s-wool','Wool','Lông cừu',768,570],['s-basket','Basket','Giỏ',1106,570]]
    cards.forEach(([key,en,vi,x,y])=>{const width=key==='s-basket'?145:155;const height=key==='s-basket'?145:150;const art=this.add.image(x,y,key).setDisplaySize(width,height).setInteractive({useHandCursor:true}).setDepth(7);this.add.text(x,690,`${en}\n${vi}`,{fontFamily:'Nunito',fontSize:'22px',fontStyle:'bold',align:'center',color:'#fff9d4',stroke:'#704019',strokeThickness:5}).setOrigin(.5).setDepth(8);art.on('pointerdown',()=>{playSfx('tap');speakBilingual(en,vi);this.tweens.add({targets:art,displayWidth:width*1.08,displayHeight:height*1.08,duration:130,yoyo:true});if(key==='s-scissors')this.time.delayedCall(420,()=>{this.stage='shear';this.render()})})})
  }
  private shear() {
    this.bg('s-shear-bg');this.hud(2,'SHEAR THE SHEEP','Cắt lông cừu');const sheep=this.sheep(768,485,'s-long',440);this.add.graphics().lineStyle(9,0xffd753,.95).lineBetween(510,475,1020,475)
    const status=this.add.text(768,212,'CUT: 0 / 3\nCắt lông: 0 / 3',{fontFamily:'Nunito',fontSize:'29px',fontStyle:'bold',align:'center',color:'#fff9d4',stroke:'#704019',strokeThickness:6}).setOrigin(.5).setDepth(20);this.add.image(1210,330,'s-shear-prompt').setDisplaySize(330,240).setDepth(20)
    const scissors=this.add.image(230,760,'s-scissors').setDisplaySize(135,135).setInteractive({useHandCursor:true}).setDepth(22);this.drag(scissors,(p,_start)=>{
      // The scissors begin in the backpack at lower-left. A valid gesture
      // reaches the right end of the marked wool line; requiring the initial
      // pointer to already be on that line made the requested drag impossible.
      const ok=p.x>900&&Math.abs(p.y-475)<145
      if(!ok){playSfx('error');speakBilingual('Try again!','Bé thử lại nhé!');this.tweens.add({targets:scissors,x:230,y:760,duration:160});return}
      this.cuts++;status.setText(`CUT: ${this.cuts} / 3\nCắt lông: ${this.cuts} / 3`);playSfx('tick');speakBilingual('Cut! Cut!','Cắt nào! Cắt nào!');this.add.image(650+this.cuts*90,700,'s-wool').setDisplaySize(105,54).setDepth(10);scissors.setPosition(230,760)
      if(this.cuts===3){sheep.setTexture('s-sheared').setDisplaySize(440,414);playSfx('success');this.time.delayedCall(700,()=>{this.stage='collect';this.render()})}
    })
  }
  private collect() {
    this.bg('s-shear-bg');this.hud(2,'COLLECT THE WOOL','Thu gom lông cừu');this.sheep(610,485,'s-sheared',385);this.add.image(768,835,'s-shear-steps').setDisplaySize(760,253)
    const status=this.add.text(768,185,'WOOL COLLECTED: 0 / 6\nĐã thu gom: 0 / 6',{fontFamily:'Nunito',fontSize:'28px',fontStyle:'bold',align:'center',color:'#fff9d4',stroke:'#704019',strokeThickness:6}).setOrigin(.5).setDepth(20)
    const bag=this.add.image(160,765,'s-bag').setDisplaySize(135,148).setInteractive({useHandCursor:true}).setDepth(15);this.add.text(160,855,'MỞ BALO',{fontFamily:'Nunito',fontSize:'18px',fontStyle:'bold',color:'#fff9d4',stroke:'#704019',strokeThickness:5}).setOrigin(.5).setDepth(16)
    let bagOpened=false
    const openBag=()=>{if(bagOpened)return;bagOpened=true;const basket=this.add.image(300,760,'s-basket').setDisplaySize(150,150).setInteractive({useHandCursor:true}).setDepth(20);this.drag(basket,()=>{basket.setPosition(1120,690);speakBilingual('Put the wool into the basket!','Bé hãy bỏ lông cừu vào giỏ!');this.addWool(basket,status)});playSfx('tap')}
    bag.on('pointerdown',openBag)
    this.add.zone(160,765,250,230).setInteractive({useHandCursor:true}).setDepth(14).on('pointerdown',openBag)
    this.input.on('pointerdown',(pointer: Phaser.Input.Pointer)=>{if(pointer.x<300&&pointer.y>620)openBag()})
  }
  private addWool(basket: Phaser.GameObjects.Image,status: Phaser.GameObjects.Text) {
    [[370,690],[510,790],[660,710],[790,800],[930,690],[1010,800]].forEach(([x,y])=>{const piece=this.add.image(x,y,'s-wool').setDisplaySize(112,56).setInteractive({useHandCursor:true}).setDepth(18);this.drag(piece,(p)=>{
      if(Phaser.Math.Distance.Between(p.x,p.y,basket.x,basket.y)>170){this.tweens.add({targets:piece,x,y,duration:160});return};piece.disableInteractive();playSfx('drop');this.tweens.add({targets:piece,x:basket.x,y:basket.y,displayWidth:18,displayHeight:9,duration:230,onComplete:()=>{piece.destroy();this.wool++;status.setText(`WOOL COLLECTED: ${this.wool} / 6\nĐã thu gom: ${this.wool} / 6`);if(this.wool===6)this.time.delayedCall(600,()=>{this.stage='done2';this.render()})}})
    })})
  }
  private done2() {
    this.bg('s-l2-bg');this.hud(2,'LEVEL 2 COMPLETED','Bé đã cắt và thu hoạch lông cừu thành công!');this.add.image(768,430,'s-done2').setDisplaySize(360,414)
    useFarmStore.getState().reward('sheep-farm-level-2',1);speakBilingual('Amazing! All the wool has been collected! Thank you, little farmer!','Tuyệt vời! Bé đã thu gom hết lông cừu rồi! Cảm ơn bé nông dân!')
    this.next('NEXT LEVEL →',()=>{this.stage='intro3';this.render()})
  }
  private intro3() {
    this.bg('s-count-bg');this.hud(3,'COUNT THE SHEEP','Đếm số lượng cừu');this.add.image(768,260,'s-count-intro').setDisplaySize(440,290);this.task('Can you help me count the sheep?','Bé có thể giúp mình đếm những chú cừu không?')
    this.next("LET'S COUNT! · CÙNG ĐẾM",()=>{this.stage='guide3';this.render()});this.time.delayedCall(200,()=>speakBilingual('Hello, little farmer! Can you help me count the sheep?','Xin chào bé nông dân! Bé có thể giúp mình đếm những chú cừu không?'))
  }
  private guide3() {
    this.bg('s-count-bg');this.hud(3,'COUNT THE SHEEP','Đếm số lượng cừu');this.add.image(768,220,'s-count-guide').setDisplaySize(430,287);this.task('Touch each sheep from left to right. Let’s count together!','Chạm từng chú cừu từ trái sang phải. Chúng ta cùng đếm nhé!')
    NUMBERS.forEach((number,index)=>{const x=330+index*215;const sheep=this.sheep(x,545,'s-sheep',165).setInteractive({useHandCursor:true});sheep.on('pointerdown',()=>{if(index!==this.guided){playSfx('error');speakBilingual('Let’s count together!','Chúng ta cùng đếm lại nào!');return};this.guided++;playSfx('tick');speakBilingual(number.en,number.vi);this.add.text(x,405,`${number.n}\n${number.en}`,{fontFamily:'Nunito',fontSize:'35px',fontStyle:'bold',align:'center',color:'#fff5a8',stroke:'#704019',strokeThickness:7}).setOrigin(.5).setDepth(15);this.tweens.add({targets:sheep,displayWidth:178,displayHeight:168,duration:140,yoyo:true});if(this.guided===5)this.time.delayedCall(600,()=>{this.stage='count';this.question=0;this.render()})})})
  }
  private count() {
    const target=NUMBERS[this.question];this.bg('s-count-bg');this.hud(3,'COUNT THE SHEEP',`Câu hỏi ${this.question+1} / 5 · Đếm số lượng cừu`);this.add.image(768,180,'s-count-task').setDisplaySize(435,144);this.add.text(768,300,'How many sheep can you see?\nBé nhìn thấy bao nhiêu chú cừu?',{fontFamily:'Nunito',fontSize:'27px',fontStyle:'bold',align:'center',color:'#fff9d4',stroke:'#704019',strokeThickness:6}).setOrigin(.5).setDepth(15)
    const positions: Array<[number,number]>=[[768,510],[590,510],[946,510],[505,665],[1030,665]];for(let i=0;i<target.n;i++)this.sheep(...positions[i],'s-sheep',175);this.task('How many sheep?','Bé nhìn thấy bao nhiêu chú cừu?')
    Phaser.Utils.Array.Shuffle([target.n,Math.max(1,target.n-1),Math.min(5,target.n+1)].filter((n,i,a)=>a.indexOf(n)===i)).forEach((n,i)=>gameButton(this,455+i*315,770,String(n),n===target.n?0x73ca45:0xffbd55,()=>this.answer(n,target.n),200).setDepth(22));speakBilingual('How many sheep can you see?','Bé nhìn thấy bao nhiêu chú cừu?')
  }
  private answer(value:number,expected:number) {
    if(value!==expected){playSfx('error');speakBilingual('Try again! Let’s count together!','Bé thử lại nhé! Chúng ta cùng đếm lại nào!');const sheep=this.children.list.filter(x=>x instanceof Phaser.GameObjects.Image&&(x as Phaser.GameObjects.Image).texture.key==='s-sheep') as Phaser.GameObjects.Image[];sheep.forEach((item,index)=>this.time.delayedCall(index*260,()=>{this.tweens.add({targets:item,displayWidth:189,displayHeight:179,duration:120,yoyo:true});speakBilingual(NUMBERS[index].en,NUMBERS[index].vi)}));return}
    playSfx('success');speakBilingual(`Correct! ${NUMBERS[expected-1].en} sheep!`,`Chính xác! Có ${expected} chú cừu!`);if(this.question===4)this.time.delayedCall(650,()=>{this.stage='final';this.render()});else{this.question++;this.time.delayedCall(650,()=>this.render())}
  }
  private final() {
    this.bg('s-final-bg');this.hud(3,'SHEEP FARM MASTER','Bé là chuyên gia chăm sóc cừu!');[560,768,976].forEach((x,index)=>this.add.image(x,410,'s-final-happy').setDisplaySize(185,185).setDepth(8).setAngle(index===1?0:index===0?-5:5));this.add.text(768,665,'⭐ ⭐ ⭐\nSHEEP FARM COMPLETED!\nHoàn thành Chuồng Cừu!',{fontFamily:'Nunito',fontSize:'34px',fontStyle:'bold',align:'center',color:'#fff9d4',stroke:'#704019',strokeThickness:7}).setOrigin(.5)
    useFarmStore.getState().reward('sheep-farm-level-3',1);useFarmStore.getState().complete('sheep-farm');speakBilingual('Fantastic! You counted all the sheep! You are a smart little farmer!','Tuyệt vời! Bé đã đếm được tất cả những chú cừu! Bé là một bác nông dân nhỏ thật thông minh!')
    gameButton(this,555,855,'PLAY AGAIN · CHƠI LẠI',0x39a9e6,()=>{this.stage='intro1';this.fed=0;this.cuts=0;this.wool=0;this.question=0;this.guided=0;this.render()},320);gameButton(this,990,855,'BACK TO MAP · VỀ BẢN ĐỒ',0xffbd55,()=>this.scene.start('FarmMap'),360)
  }
  private drag(item: Phaser.GameObjects.Image, onDrop: (pointer: Phaser.Input.Pointer,start: Phaser.Math.Vector2)=>void) {
    // Let Phaser own the drag lifecycle.  The former scene-wide pointer
    // listeners competed with the backpack zone and were dropped on some
    // browsers after the first interaction.  Phaser's drag manager keeps the
    // actual pointer capture through the whole movement, including touch.
    this.input.setDraggable(item)
    const start = new Phaser.Math.Vector2()
    item.on('dragstart', (pointer: Phaser.Input.Pointer) => start.set(pointer.x, pointer.y))
    item.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => item.setPosition(dragX, dragY))
    item.on('dragend', (pointer: Phaser.Input.Pointer) => onDrop(pointer, start))
  }
}
