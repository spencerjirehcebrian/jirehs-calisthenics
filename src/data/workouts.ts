import type { Workout, WorkoutId } from '@/types'

export const workouts: Workout[] = [
  {
    id: 'workout-a',
    name: 'Workout A',
    subtitle: 'Push focus with core',
    pairs: [
      {
        exercise1: {
          exerciseId: 'full-pushups',
          sets: 3,
          isMaxReps: true
        },
        exercise2: {
          exerciseId: 'bodyweight-squats',
          sets: 3,
          targetRepsMin: 15,
          targetRepsMax: 15
        }
      },
      {
        exercise1: {
          exerciseId: 'ring-rows-45',
          sets: 3,
          targetRepsMin: 8,
          targetRepsMax: 12
        },
        exercise2: {
          exerciseId: 'dead-bugs',
          sets: 3,
          targetRepsMin: 10,
          targetRepsMax: 10
        }
      },
      {
        exercise1: {
          exerciseId: 'dead-hang',
          sets: 3,
          targetDurationSeconds: 30
        },
        exercise2: {
          exerciseId: 'hollow-body-tuck',
          sets: 3,
          targetDurationSeconds: 20
        }
      }
    ]
  },
  {
    id: 'workout-b',
    name: 'Workout B',
    subtitle: 'Pull focus with legs',
    pairs: [
      {
        exercise1: {
          exerciseId: 'scapular-pulls',
          sets: 3,
          targetRepsMin: 10,
          targetRepsMax: 12
        },
        exercise2: {
          exerciseId: 'static-lunges',
          sets: 3,
          targetRepsMin: 8,
          targetRepsMax: 8
        }
      },
      {
        exercise1: {
          exerciseId: 'incline-pushups',
          sets: 3,
          targetRepsMin: 12,
          targetRepsMax: 15
        },
        exercise2: {
          exerciseId: 'ring-support-hold',
          sets: 3,
          targetDurationSeconds: 20
        }
      },
      {
        exercise1: {
          exerciseId: 'glute-bridges',
          sets: 3,
          targetRepsMin: 15,
          targetRepsMax: 15
        },
        exercise2: {
          exerciseId: 'plank',
          sets: 3,
          targetDurationSeconds: 30
        }
      }
    ]
  },
  {
    id: 'workout-c',
    name: 'Workout C',
    subtitle: 'Skill and strength combination',
    pairs: [
      {
        exercise1: {
          exerciseId: 'negative-pullups',
          sets: 3,
          targetRepsMin: 3,
          targetRepsMax: 5
        },
        exercise2: {
          exerciseId: 'deep-squats',
          sets: 3,
          targetRepsMin: 12,
          targetRepsMax: 12
        }
      },
      {
        exercise1: {
          exerciseId: 'full-pushups',
          sets: 3,
          isMaxReps: true
        },
        exercise2: {
          exerciseId: 'bird-dogs',
          sets: 3,
          targetRepsMin: 10,
          targetRepsMax: 10
        }
      },
      {
        exercise1: {
          exerciseId: 'ring-rows-horizontal',
          sets: 3,
          targetRepsMin: 8,
          targetRepsMax: 10
        },
        exercise2: {
          exerciseId: 'side-planks',
          sets: 3,
          targetDurationSeconds: 20
        }
      }
    ]
  }
]

export function getWorkoutById(id: WorkoutId): Workout | undefined {
  return workouts.find(w => w.id === id)
}
