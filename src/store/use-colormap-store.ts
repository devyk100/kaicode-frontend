import { create } from 'zustand'

type ColorClientPair = [string, string]

type Store = {
  data: Map<string, Set<ColorClientPair>>
  addValue: (key: string, value: ColorClientPair) => void
  removeValue: (key: string, value: ColorClientPair) => void
  removeClientIdFromAll: (clientId: string) => void
  getValues: (key: string) => ColorClientPair[]
  resetKey: (key: string) => void
  resetAll: () => void
}

export const useMapSetStore = create<Store>((set, get) => ({
  data: new Map(),

  addValue: (key, value) => {
    set((state) => {
      const map = new Map(state.data)
      const currentSet = new Set(map.get(key) ?? [])
      currentSet.add(value)
      map.set(key, currentSet)
      return { data: map }
    })
  },

  removeValue: (key, value) => {
    set((state) => {
      const map = new Map(state.data)
      const currentSet = map.get(key)
      if (currentSet) {
        const newSet = new Set([...currentSet].filter(v => !(v[0] === value[0] && v[1] === value[1])))
        map.set(key, newSet)
      }
      return { data: map }
    })
  },

  removeClientIdFromAll: (clientId) => {
    set((state) => {
      const map = new Map(state.data)
      for (const [key, setOfPairs] of map.entries()) {
        const filtered = new Set([...setOfPairs].filter(([_, id]) => id !== clientId))
        map.set(key, filtered)
      }
      return { data: map }
    })
  },

  getValues: (key) => {
    return Array.from(get().data.get(key) ?? [])
  },

  resetKey: (key) => {
    set((state) => {
      const map = new Map(state.data)
      map.set(key, new Set())
      return { data: map }
    })
  },

  resetAll: () => {
    set(() => ({ data: new Map() }))
  }
}))
