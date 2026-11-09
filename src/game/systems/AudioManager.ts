import { ProgressManager } from './ProgressManager'

export const stopSpeaking = () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }
export type SfxName = 'tap' | 'select' | 'drop' | 'tick' | 'success' | 'error' | 'bong'
const sfx: Record<SfxName, string> = {
  tap: '/assets/audio/click_001.wav', select: '/assets/audio/select_001.wav', drop: '/assets/audio/drop_001.wav',
  tick: '/assets/audio/tick_001.wav', success: '/assets/audio/confirmation_001.wav', error: '/assets/audio/error_001.wav', bong: '/assets/audio/bong_001.wav',
}
/** Short CC0 Kenney cues. Audio is created on discrete interactions only, never per frame. */
export const playSfx = (name: SfxName, volume = .32) => {
  if (!ProgressManager.load().soundEnabled) return false
  const audio = new Audio(sfx[name]); audio.volume = volume
  void audio.play().catch(() => { /* Browser may require the first user gesture. */ })
  return true
}
const voiceFor = (language: string) => speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(language.toLowerCase()))
const utteranceFor = (word: string, language: string, voice?: SpeechSynthesisVoice) => {
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = language; utterance.rate = .75; utterance.pitch = 1.05
  if (voice) utterance.voice = voice
  return utterance
}
export const speak = (word: string, language = 'en-US') => {
  if (!ProgressManager.load().soundEnabled || !('speechSynthesis' in window)) return false
  const voice = voiceFor(language)
  // Never hand Vietnamese text to the system's English default voice.
  if (language.toLowerCase().startsWith('vi') && !voice) return false
  stopSpeaking()
  speechSynthesis.speak(utteranceFor(word, language, voice))
  return true
}
export const speakAnimal = (word: string) => speak(word.toLowerCase(), 'en-US')
export const speakVietnamese = (word: string) => speak(word, 'vi-VN')
/** Queues English then Vietnamese without cutting the English word off. */
export const speakBilingual = (english: string, vietnamese: string) => {
  if (!ProgressManager.load().soundEnabled || !('speechSynthesis' in window)) return false
  const vietnameseVoice = voiceFor('vi')
  if (!vietnameseVoice) return speakAnimal(english)
  stopSpeaking(); speechSynthesis.speak(utteranceFor(english.toLowerCase(), 'en-US', voiceFor('en-US'))); speechSynthesis.speak(utteranceFor(vietnamese, 'vi-VN', vietnameseVoice))
  return true
}
