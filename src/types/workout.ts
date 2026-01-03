import type { ExercisePair } from './exercise'

export type WorkoutId = 'workout-a' | 'workout-b' | 'workout-c'

export interface Workout {
  id: WorkoutId
  name: string
  subtitle: string
  pairs: ExercisePair[]
}
