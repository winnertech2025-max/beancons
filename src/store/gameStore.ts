import { create } from 'zustand'

export type FarmerAvatar = 'girl' | 'boy' | null
export type FarmInventory = Record<string, number>
export type FarmState = {
  version: 4; stars: number; avatar: FarmerAvatar; introComplete: boolean; soundEnabled: boolean; musicEnabled: boolean; voiceEnabled: boolean
  learned: string[]; unlockedZones: string[]; inventory: FarmInventory; ownedItems: string[]; completedActivities: string[]; rewardEvents: string[]; bestScores: Record<string, number>
}

const STORAGE_KEY = 'happy-farm-state-v3'
const initialState: FarmState = { version: 4, stars: 0, avatar: null, introComplete: false, soundEnabled: true, musicEnabled: true, voiceEnabled: true, learned: [], unlockedZones: ['crop-farm'], inventory: {}, ownedItems: [], completedActivities: [], rewardEvents: [], bestScores: {} }
const read = (): FarmState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const saved = JSON.parse(raw) as Partial<FarmState>
    return { ...initialState, ...saved, version: 4, musicEnabled: saved.musicEnabled ?? saved.soundEnabled ?? true, voiceEnabled: saved.voiceEnabled ?? saved.soundEnabled ?? true, inventory: { ...initialState.inventory, ...saved.inventory }, bestScores: { ...initialState.bestScores, ...saved.bestScores } }
  } catch { return initialState }
}
const write = (state: FarmState) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* storage may be unavailable */ } }
const unique = (items: string[], item: string) => items.includes(item) ? items : [...items, item]

type FarmActions = {
  setAvatar: (avatar: Exclude<FarmerAvatar, null>) => void; completeIntro: () => void; toggleSound: () => void; toggleMusic: () => void; toggleVoice: () => void
  learn: (word: string) => void; unlock: (zone: string) => void; addItem: (item: string, quantity?: number) => void
  reward: (eventId: string, amount: number) => boolean; spend: (amount: number) => boolean; buy: (itemId: string, cost: number) => boolean
  complete: (activity: string) => void; saveBestScore: (roundId: string, stars: number) => void; reset: () => void
}

export const useFarmStore = create<FarmState & FarmActions>((set, get) => {
  const persist = (next: FarmState) => { write(next); set(next) }
  return {
    ...read(),
    setAvatar: (avatar) => persist({ ...get(), avatar }),
    completeIntro: () => persist({ ...get(), introComplete: true }),
    toggleSound: () => persist({ ...get(), soundEnabled: !get().soundEnabled }),
    toggleMusic: () => persist({ ...get(), musicEnabled: !get().musicEnabled }),
    toggleVoice: () => persist({ ...get(), voiceEnabled: !get().voiceEnabled }),
    learn: (word) => persist({ ...get(), learned: unique(get().learned, word) }),
    unlock: (zone) => persist({ ...get(), unlockedZones: unique(get().unlockedZones, zone) }),
    addItem: (item, quantity = 1) => { const current = get(); persist({ ...current, inventory: { ...current.inventory, [item]: (current.inventory[item] || 0) + quantity } }) },
    reward: (eventId, amount) => { const current = get(); if (current.rewardEvents.includes(eventId) || amount <= 0) return false; persist({ ...current, stars: current.stars + amount, rewardEvents: [...current.rewardEvents, eventId] }); return true },
    spend: (amount) => { const current = get(); if (amount <= 0 || current.stars < amount) return false; persist({ ...current, stars: current.stars - amount }); return true },
    buy: (itemId, cost) => { const current = get(); if (current.ownedItems.includes(itemId) || current.stars < cost) return false; persist({ ...current, stars: current.stars - cost, ownedItems: [...current.ownedItems, itemId] }); return true },
    complete: (activity) => persist({ ...get(), completedActivities: unique(get().completedActivities, activity) }),
    saveBestScore: (roundId, stars) => { const current = get(); persist({ ...current, bestScores: { ...current.bestScores, [roundId]: Math.max(current.bestScores[roundId] || 0, stars) } }) },
    reset: () => persist(initialState),
  }
})
