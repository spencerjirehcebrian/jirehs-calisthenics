import type { Exercise } from '@/types'

export const legExercises: Exercise[] = [
  {
    id: 'bodyweight-squats',
    name: 'Bodyweight Squats',
    type: 'reps',
    category: 'legs',
    description: 'Standard air squat to parallel. Foundation of lower body training.',
    formCues: [
      'Feet shoulder-width apart',
      'Toes slightly pointed out',
      'Squat until thighs parallel to floor',
      'Knees track over toes',
      'Drive through heels to stand'
    ],
    targetRepsMin: 15,
    targetRepsMax: 20,
    progressionLevel: 1,
    nextExercise: 'deep-squats'
  },
  {
    id: 'deep-squats',
    name: 'Deep Squats',
    type: 'reps',
    category: 'legs',
    description: 'Full depth squat with thighs touching calves. Builds mobility and full range strength.',
    formCues: [
      'Descend as low as mobility allows',
      'Thighs should touch calves at bottom',
      'Keep heels on floor (elevate if needed)',
      'Maintain upright torso',
      'Pause briefly at bottom'
    ],
    targetRepsMin: 12,
    targetRepsMax: 15,
    progressionLevel: 2,
    previousExercise: 'bodyweight-squats',
    nextExercise: 'bulgarian-split-squats'
  },
  {
    id: 'bulgarian-split-squats',
    name: 'Bulgarian Split Squats',
    type: 'reps',
    category: 'legs',
    description: 'Single leg squat with rear foot elevated. Significant unilateral leg strength builder.',
    formCues: [
      'Rear foot on elevated surface behind you',
      'Lower until front thigh is parallel',
      'Front knee tracks over toes',
      'Keep torso upright',
      'Complete all reps then switch legs'
    ],
    equipmentSetup: 'Use a chair, bench, or step for rear foot elevation.',
    targetRepsMin: 8,
    targetRepsMax: 10,
    progressionLevel: 3,
    previousExercise: 'deep-squats',
    nextExercise: 'assisted-pistol-squats'
  },
  {
    id: 'assisted-pistol-squats',
    name: 'Assisted Pistol Squats',
    type: 'reps',
    category: 'legs',
    description: 'Single leg squat while holding rings or doorframe for balance assistance.',
    formCues: [
      'Hold rings or doorframe for balance',
      'Extend non-working leg forward',
      'Squat as deep as possible on one leg',
      'Use minimal hand assistance',
      'Complete all reps then switch legs'
    ],
    equipmentSetup: 'Use gymnastics rings, TRX, or a sturdy doorframe.',
    targetRepsMin: 5,
    targetRepsMax: 8,
    progressionLevel: 4,
    previousExercise: 'bulgarian-split-squats',
    nextExercise: 'pistol-squats'
  },
  {
    id: 'pistol-squats',
    name: 'Pistol Squats',
    type: 'reps',
    category: 'legs',
    description: 'Full single leg squat with no assistance. Advanced unilateral leg exercise.',
    formCues: [
      'Stand on one leg',
      'Extend other leg straight forward',
      'Squat to full depth on standing leg',
      'Keep heel on floor',
      'Stand up without assistance'
    ],
    targetRepsMin: 3,
    targetRepsMax: 5,
    progressionLevel: 5,
    previousExercise: 'assisted-pistol-squats'
  },
  {
    id: 'static-lunges',
    name: 'Static Lunges',
    type: 'reps',
    category: 'legs',
    description: 'Stationary lunge position with alternating legs. Builds single leg strength and stability.',
    formCues: [
      'Split stance with feet hip-width apart',
      'Lower back knee toward floor',
      'Front knee stays over ankle',
      'Push through front heel to return',
      'Alternate legs each rep'
    ],
    targetRepsMin: 8,
    targetRepsMax: 8,
    progressionLevel: 2,
    nextExercise: 'walking-lunges'
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    type: 'reps',
    category: 'legs',
    description: 'Forward stepping lunges that travel across the floor.',
    formCues: [
      'Step forward into lunge position',
      'Back knee nearly touches floor',
      'Push off front foot to step through',
      'Continue walking forward',
      'Maintain upright posture'
    ],
    targetRepsMin: 10,
    targetRepsMax: 12,
    progressionLevel: 3,
    previousExercise: 'static-lunges'
  },
  {
    id: 'glute-bridges',
    name: 'Glute Bridges',
    type: 'reps',
    category: 'legs',
    description: 'Hip thrust from floor position. Targets glutes and posterior chain.',
    formCues: [
      'Lie on back, knees bent, feet flat',
      'Feet hip-width apart near glutes',
      'Drive hips toward ceiling',
      'Squeeze glutes hard at top',
      'Lower with control'
    ],
    targetRepsMin: 15,
    targetRepsMax: 20,
    progressionLevel: 1
  }
]
