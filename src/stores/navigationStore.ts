import { create } from 'zustand'
import type { Screen } from '@/types'

interface NavigationState {
  currentScreen: Screen
  previousScreen: Screen | null

  navigate: (screen: Screen) => void
  goBack: () => void
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentScreen: 'home',
  previousScreen: null,

  navigate: (screen) =>
    set((state) => ({
      currentScreen: screen,
      previousScreen: state.currentScreen
    })),

  goBack: () => {
    const { previousScreen } = get()
    if (previousScreen) {
      set({ currentScreen: previousScreen, previousScreen: null })
    }
  }
}))
