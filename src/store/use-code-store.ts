import { create } from 'zustand'

interface CodeState {
  code: string
  setCode: (newCode: string) => void
  setInitialCode: (initialCode: string) => void
}

export const useCodeStore = create<CodeState>((set) => ({
  code: '',
  setCode: (newCode) => set({ code: newCode }),
  setInitialCode: (initialCode) => set({ code: initialCode }),
}))
