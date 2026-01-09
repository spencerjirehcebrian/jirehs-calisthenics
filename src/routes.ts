import type { Screen } from '@/types'

interface RouteDefinition {
  screen: Screen
  title: string
  showBackButton: boolean
  showHeader: boolean
}

export const routes: Record<Screen, RouteDefinition> = {
  home: {
    screen: 'home',
    title: "Jireh's Calisthenics",
    showBackButton: false,
    showHeader: false
  },
  'workout-selection': {
    screen: 'workout-selection',
    title: 'Select Workout',
    showBackButton: false,
    showHeader: false
  },
  warmup: {
    screen: 'warmup',
    title: 'Warm-up',
    showBackButton: false,
    showHeader: false
  },
  'active-workout': {
    screen: 'active-workout',
    title: 'Workout',
    showBackButton: false,
    showHeader: false
  },
  cooldown: {
    screen: 'cooldown',
    title: 'Cool-down',
    showBackButton: false,
    showHeader: false
  },
  'session-summary': {
    screen: 'session-summary',
    title: 'Summary',
    showBackButton: false,
    showHeader: false
  },
  'exercise-library': {
    screen: 'exercise-library',
    title: 'Exercise Library',
    showBackButton: false,
    showHeader: false
  },
  settings: {
    screen: 'settings',
    title: 'Settings',
    showBackButton: false,
    showHeader: false
  },
  practice: {
    screen: 'practice',
    title: 'Practice',
    showBackButton: false,
    showHeader: false
  }
}
