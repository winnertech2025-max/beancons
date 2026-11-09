import { BaseScene } from './BaseScene'
import { animals, getAnimal } from '../../data/animals'
import { gameButton } from '../objects/GameButton'
import { speakAnimal, stopSpeaking } from '../systems/AudioManager'
import { ProgressManager } from '../systems/ProgressManager'

export class VocabularyScene extends BaseScene {
  private animalId='cat'
  init(data:{animalId?:string}){this.animalId=data.animalId||'cat'}
  shutdown(){ stopSpeaking() }
  constructor(){super('Vocabulary')}
  create(){
    this.sky()
    const animal=getAnimal(this.animalId); const current=animals.findIndex(item=>item.id===animal.id); ProgressManager.markLearned(animal.id)
    const goTo=(index:number)=>this.scene.start('Vocabulary',{animalId:animals[(index+animals.length)%animals.length].id})
    this.backButton(); this.title('Học từ vựng','Chạm nút loa để nghe phát âm chuẩn'); this.soundToggle()
    const card=this.panel(768,530,1070,590); card.setDepth(1)
    const photoFrame=this.add.rectangle(475,530,400,418,0x1c4054).setStrokeStyle(3,0xffffff,.8).setDepth(2)
    if(this.textures.exists(`animal-${animal.id}`)) this.add.image(475,530,`animal-${animal.id}`).setDisplaySize(380,398).setDepth(3)
    else this.add.circle(475,530,135,animal.color).setDepth(3)
    this.add.text(960,365,animal.english,{fontFamily:'Baloo 2',fontSize:'94px',fontStyle:'bold',color:'#254a63',resolution:2}).setOrigin(.5).setDepth(4)
    this.add.text(960,465,animal.phonetic,{fontFamily:'Nunito',fontSize:'31px',color:'#698092',resolution:2}).setOrigin(.5).setDepth(4)
    this.add.text(960,520,animal.vietnamese,{fontFamily:'Nunito',fontSize:'38px',fontStyle:'bold',color:'#36566b',resolution:2}).setOrigin(.5).setDepth(4)
    gameButton(this,960,625,'NGHE PHÁT ÂM',0x6685d9,()=>speakAnimal(animal.english),335).setDepth(4)
    gameButton(this,960,730,'VÀO THỬ THÁCH',0x62c978,()=>this.scene.start('Quiz',{farmId:this.animalId}),335).setDepth(4)
    const previous=this.add.text(345,790,'‹  Con trước',{fontFamily:'Nunito',fontSize:'21px',fontStyle:'bold',color:'#24516a',backgroundColor:'#eaf9ff',padding:{x:16,y:10}}).setOrigin(.5).setDepth(5).setInteractive({useHandCursor:true})
    const following=this.add.text(605,790,'Con tiếp  ›',{fontFamily:'Nunito',fontSize:'21px',fontStyle:'bold',color:'#24516a',backgroundColor:'#eaf9ff',padding:{x:16,y:10}}).setOrigin(.5).setDepth(5).setInteractive({useHandCursor:true})
    previous.on('pointerdown',()=>goTo(current-1)); following.on('pointerdown',()=>goTo(current+1)); void photoFrame
    this.add.text(768,885,`Từ ${current+1}/${animals.length}  •  Bạn có thể xem con trước hoặc con tiếp theo`,{fontFamily:'Nunito',fontSize:'20px',color:'#e9fbff',stroke:'#28617b',strokeThickness:4,resolution:2}).setOrigin(.5)
  }
}
