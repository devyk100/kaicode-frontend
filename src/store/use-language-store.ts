import { create } from 'zustand'

interface LanguageState {
  language: string
  setLanguage: (language: string) => void
  setInitialLanguage: (initialLanguage: string) => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: '',
  setLanguage: (language) => set({ language: language }),
  setInitialLanguage: (initialLanguage) => set({language: initialLanguage }),
}))
