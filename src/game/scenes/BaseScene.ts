import Phaser from 'phaser'
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig'
import { ProgressManager } from '../systems/ProgressManager'
import { pauseBackgroundMusic, startBackgroundMusic } from '../systems/AudioManager'
export class BaseScene extends Phaser.Scene {
  title(text: string, subtitle?: string) { const group = this.add.container(WORLD_WIDTH / 2, 69); const heading = this.add.text(0, subtitle ? -17 : 0, text, { fontFamily: 'Nunito', fontSize: '31px', fontStyle: 'bold', color: '#ffffff', stroke: '#25556a', strokeThickness: 6 }).setOrigin(.5); group.add(heading); if (subtitle) group.add(this.add.text(0, 27, subtitle, { fontFamily: 'Nunito', fontSize: '19px', fontStyle: 'bold', color: '#ffffff', stroke: '#25556a', strokeThickness: 4 }).setOrigin(.5)); return group }
  sky() { this.cameras.main.setBackgroundColor('#48c9ef'); if (this.textures.exists('farm-map')) this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'farm-map').setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT).setAlpha(.27).setDepth(-30); this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x258fbd, .42).setDepth(-29); if (this.textures.exists('cloud-layer')) this.add.image(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'cloud-layer').setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT).setAlpha(.16).setDepth(-28) }
  panel(x: number, y: number, width: number, height: number, color = 0xffffff) { const shadow=this.add.rectangle(x+9,y+11,width,height,0x173b55,.22); const card=this.add.rectangle(x,y,width,height,color,.97).setStrokeStyle(3,0xffffff,.9); return this.add.container(0,0,[shadow,card]) }
  backButton(target = 'FarmMap') { const arrow=this.add.image(-52,0,'drive-arrow-left').setDisplaySize(34,27); const label=this.add.text(16,0,'Quay lại', { fontFamily: 'Nunito', fontStyle:'bold',fontSize: '20px', color: '#fff', stroke: '#25556a', strokeThickness: 5 }).setOrigin(.5); const chip=this.add.container(104,70,[arrow,label]).setSize(178,54).setInteractive({useHandCursor:true}); chip.on('pointerdown', () => this.scene.start(target)); return chip }
  soundToggle(x = 1412, y = 63) {
    const icon = this.add.image(-53, 0, 'drive-sound-on').setDisplaySize(38, 31)
    const music = this.add.text(19, -14, '', { fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#fff', stroke: '#25556a', strokeThickness: 4 }).setOrigin(.5)
    const voice = this.add.text(19, 14, '', { fontFamily: 'Nunito', fontSize: '14px', fontStyle: 'bold', color: '#fff', stroke: '#25556a', strokeThickness: 4 }).setOrigin(.5)
    const control = this.add.container(x, y, [icon, music, voice]).setSize(214, 60).setInteractive({ useHandCursor: true })
    const render = () => { const state = ProgressManager.load(); icon.setTexture(state.musicEnabled || state.voiceEnabled ? 'drive-sound-on' : 'drive-sound-off'); music.setText(`NHẠC: ${state.musicEnabled ? 'BẬT' : 'TẮT'}`); voice.setText(`GIỌNG: ${state.voiceEnabled ? 'BẬT' : 'TẮT'}`) }
    render(); control.on('pointerdown', (pointer: Phaser.Input.Pointer) => { const state = ProgressManager.load(); if (pointer.y < control.y) { ProgressManager.setMusicEnabled(!state.musicEnabled); if (state.musicEnabled) pauseBackgroundMusic(); else startBackgroundMusic() } else { ProgressManager.setVoiceEnabled(!state.voiceEnabled); if (state.voiceEnabled && 'speechSynthesis' in window) speechSynthesis.cancel() }; render() })
    return control
  }
}
