import { BaseScene } from './BaseScene'
import { gameButton } from '../objects/GameButton'
import { animals } from '../../data/animals'
import { ProgressManager } from '../systems/ProgressManager'

export class ResultScene extends BaseScene {
  private farmId='cat'; private score=0; private attempts=0; private total=5
  constructor(){super('Result')}
  init(data:{farmId?:string;correct?:number;attempts?:number;total?:number}){this.farmId=data.farmId||'cat';this.score=data.correct||0;this.attempts=data.attempts||0;this.total=data.total||5}
  create(){
    this.sky()
    const firstTryRate=this.score/this.total
    const stars=firstTryRate>=1?3:firstTryRate>=.8?2:firstTryRate>=.6?1:0
    const progress=ProgressManager.award('quiz',stars)
    const x=768; const y=500
    const frame=this.add.graphics().setDepth(10)
    frame.fillStyle(0x51c6e8,.98).fillRoundedRect(x-350,y-270,700,540,36)
    frame.lineStyle(9,0xffffff,.95).strokeRoundedRect(x-350,y-270,700,540,36)
    frame.fillStyle(0xf9fdff,1).fillRoundedRect(x-325,y-238,650,480,27)
    const header=this.add.graphics().setDepth(11)
    header.fillStyle(0xffffff,1).fillRoundedRect(x-190,y-300,380,74,32)
    header.lineStyle(5,0xc0efff,1).strokeRoundedRect(x-190,y-300,380,74,32)
    this.add.text(x,y-264,'Kết quả của bé',{fontFamily:'Baloo 2',fontSize:'37px',fontStyle:'bold',color:'#2c6e9b',resolution:2}).setOrigin(.5).setDepth(12)
    this.add.text(x,y-176,`${'★'.repeat(stars)}${'☆'.repeat(3-stars)}`,{fontFamily:'Arial',fontSize:'65px',color:'#ffd54a',stroke:'#e7a41f',strokeThickness:4,resolution:2}).setOrigin(.5).setDepth(12)
    this.add.text(x,y-111,`${this.score} / ${this.total} đúng ngay lần đầu  •  ${this.attempts} lượt chọn`,{fontFamily:'Nunito',fontSize:'20px',fontStyle:'bold',color:'#5d8299',resolution:2}).setOrigin(.5).setDepth(12)
    this.add.text(x,y-98,'Từ vựng đã học',{fontFamily:'Nunito',fontSize:'22px',fontStyle:'bold',color:'#5d8299',resolution:2}).setOrigin(.5).setDepth(12)
    const learned=animals; learned.forEach((animal,index)=>{
      const px=x-250+index*125; const py=y-20
      this.add.rectangle(px,py,105,98,0xe8f7ff,1).setStrokeStyle(2,0xc0efff).setDepth(11)
      const texture=`animal-${animal.id}`
      if(this.textures.exists(texture)) this.add.image(px,py-6,texture).setDisplaySize(94,63).setDepth(12)
      else this.add.circle(px,py-6,28,animal.color).setDepth(12)
      this.add.text(px,py+41,animal.english,{fontFamily:'Nunito',fontSize:'14px',fontStyle:'bold',color:'#37627d',resolution:2}).setOrigin(.5).setDepth(12)
    })
    this.add.text(x,y+93,`Tổng sao đã có: ★ ${progress.totalStars}`,{fontFamily:'Nunito',fontSize:'20px',fontStyle:'bold',color:'#5d8299',resolution:2}).setOrigin(.5).setDepth(12)
    gameButton(this,x,y+175,'CHƠI LẠI',0x1f9be1,()=>this.scene.start('Quiz',{farmId:this.farmId}),330).setDepth(12)
    const close=this.add.text(x+310,y-255,'×',{fontFamily:'Arial',fontSize:'48px',fontStyle:'bold',color:'#ffffff',stroke:'#2e94bf',strokeThickness:5,resolution:2}).setOrigin(.5).setDepth(13).setInteractive({useHandCursor:true})
    close.on('pointerdown',()=>this.scene.start('FarmMap'))
  }
}
