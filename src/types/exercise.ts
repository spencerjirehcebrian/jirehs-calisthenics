export type ExerciseType = 'reps' | 'timed' | 'timed-per-side'

export type ExerciseCategory = 'push' | 'pull' | 'core' | 'legs' | 'holds'

export type ProgressionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface Exercise {
  id: string
  name: string
  type: ExerciseType
  category: ExerciseCategory
  description: string
  formCues: string[]
  equipmentSetup?: string
  targetRepsMin?: number
  targetRepsMax?: number
  targetDurationSeconds?: number
  progressionLevel: ProgressionLevel
  previousExercise?: string
  nextExercise?: string
}

export interface WorkoutExercise {
  exerciseId: string
  sets: number
  targetRepsMin?: number
  targetRepsMax?: number
  targetDurationSeconds?: number
  isMaxReps?: boolean
}

export interface ExercisePair {
  exercise1: WorkoutExercise
  exercise2: WorkoutExercise
}
