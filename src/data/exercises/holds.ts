import type { Exercise } from '@/types'

export const holdExercises: Exercise[] = [
  {
    id: 'ring-support-hold',
    name: 'Ring Support Hold',
    type: 'timed',
    category: 'holds',
    description: 'Static hold at top of dip position on rings. Foundation for all ring work.',
    formCues: [
      'Jump or press to top of dip position',
      'Arms completely straight',
      'Rings touching outside of hips',
      'Turn rings out slightly (RTO)',
      'Shoulders depressed (pushed down)'
    ],
    equipmentSetup: 'Set rings at hip height. Use a box to help get into position if needed.',
    targetDurationSeconds: 20,
    progressionLevel: 1
  }
]
