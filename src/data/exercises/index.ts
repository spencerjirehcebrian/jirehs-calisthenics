import type { Exercise, ExerciseCategory } from '@/types'
import { pushExercises } from './push'
import { pullExercises } from './pull'
import { coreExercises } from './core'
import { legExercises } from './legs'
import { holdExercises } from './holds'

export const allExercises: Exercise[] = [
  ...pushExercises,
  ...pullExercises,
  ...coreExercises,
  ...legExercises,
  ...holdExercises
]

export const exerciseMap: Record<string, Exercise> = allExercises.reduce(
  (acc, exercise) => {
    acc[exercise.id] = exercise
    return acc
  },
  {} as Record<string, Exercise>
)

export function getExerciseById(id: string): Exercise | undefined {
  return exerciseMap[id]
}

export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return allExercises.filter(e => e.category === category)
}

export { pushExercises, pullExercises, coreExercises, legExercises, holdExercises }
