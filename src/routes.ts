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
    showBackButton: true,
    showHeader: true
  },
  warmup: {
    screen: 'warmup',
    title: 'Warm-up',
    showBackButton: false,
    showHeader: true
  },
  'active-workout': {
    screen: 'active-workout',
    title: 'Workout',
    showBackButton: false,
    showHeader: true
  },
  cooldown: {
    screen: 'cooldown',
    title: 'Cool-down',
    showBackButton: false,
    showHeader: true
  },
  'session-summary': {
    screen: 'session-summary',
    title: 'Summary',
    showBackButton: false,
    showHeader: true
  },
  'exercise-library': {
    screen: 'exercise-library',
    title: 'Exercise Library',
    showBackButton: true,
    showHeader: true
  },
  settings: {
    screen: 'settings',
    title: 'Settings',
    showBackButton: true,
    showHeader: true
  },
  practice: {
    screen: 'practice',
    title: 'Practice',
    showBackButton: true,
    showHeader: true
  }
}
