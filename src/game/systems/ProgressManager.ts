import { useFarmStore } from '../../store/gameStore'
export type Progress = { totalStars: number; completed: string[]; learned: string[]; bestScores: Record<string, number>; soundEnabled: boolean; musicEnabled: boolean; voiceEnabled: boolean }
const toLegacy = (): Progress => { const state = useFarmStore.getState(); return { totalStars: state.stars, completed: state.completedActivities, learned: state.learned, bestScores: state.bestScores, soundEnabled: state.soundEnabled, musicEnabled: state.musicEnabled, voiceEnabled: state.voiceEnabled } }
export const ProgressManager = {
  load(): Progress { return toLegacy() },
  save() { /* Store writes immediately, retained only for older scene callers. */ },
  markLearned(animal: string) { useFarmStore.getState().learn(animal); return toLegacy() },
  setSoundEnabled(value: boolean) { const store = useFarmStore.getState(); if (store.soundEnabled !== value) store.toggleSound(); return toLegacy() },
  setMusicEnabled(value: boolean) { const store = useFarmStore.getState(); if (store.musicEnabled !== value) store.toggleMusic(); return toLegacy() },
  setVoiceEnabled(value: boolean) { const store = useFarmStore.getState(); if (store.voiceEnabled !== value) store.toggleVoice(); return toLegacy() },
  award(farm: string, stars: number) { const store = useFarmStore.getState(); const old = store.bestScores[farm] || 0; const improvement = Math.max(0, stars - old); store.saveBestScore(farm, stars); if (improvement) store.reward(`best-score:${farm}:${stars}`, improvement); store.complete(farm); return toLegacy() },
  reset() { useFarmStore.getState().reset() },
}
