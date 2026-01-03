export * from './exercise'
export * from './workout'
export * from './warmup'
export * from './cooldown'
export * from './guided-flow'

// Navigation types
export type Screen =
  | 'home'
  | 'workout-selection'
  | 'warmup'
  | 'active-workout'
  | 'cooldown'
  | 'session-summary'
  | 'exercise-library'
  | 'settings'
  | 'practice'

// Settings types
export interface AudioSettings {
  restCountdown: boolean
  restComplete: boolean
  setComplete: boolean
  holdCountdown: boolean
  holdComplete: boolean
}

export interface Settings {
  audioCues: AudioSettings
  holdCountdown: 2 | 3
  deloadMode: boolean
}

// History types
export interface ExerciseHistoryEntry {
  lastReps?: number
  lastDuration?: number
}

export type ExerciseHistory = Record<string, ExerciseHistoryEntry>
