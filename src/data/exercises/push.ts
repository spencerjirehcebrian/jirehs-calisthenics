import type { Exercise } from '@/types'

export const pushExercises: Exercise[] = [
  {
    id: 'wall-pushups',
    name: 'Wall Push-ups',
    type: 'reps',
    category: 'push',
    description: 'Push-ups performed against a wall. The easiest push-up variation for building foundational pushing strength.',
    formCues: [
      'Stand arm\'s length from wall',
      'Place hands slightly wider than shoulders',
      'Keep body straight from head to heels',
      'Lower chest toward wall with control',
      'Push back to start with full arm extension'
    ],
    targetRepsMin: 5,
    targetRepsMax: 10,
    progressionLevel: 1,
    nextExercise: 'incline-pushups'
  },
  {
    id: 'incline-pushups',
    name: 'Incline Push-ups',
    type: 'reps',
    category: 'push',
    description: 'Push-ups with hands elevated on a surface like a table or bench. Intermediate progression between wall and floor push-ups.',
    formCues: [
      'Hands on elevated surface, slightly wider than shoulders',
      'Maintain straight line from head to heels',
      'Elbows at 45-degree angle from body',
      'Lower chest to surface with control',
      'Full lockout at top of each rep'
    ],
    equipmentSetup: 'Use a sturdy table, counter, or bench at approximately hip to waist height.',
    targetRepsMin: 12,
    targetRepsMax: 15,
    progressionLevel: 2,
    previousExercise: 'wall-pushups',
    nextExercise: 'full-pushups'
  },
  {
    id: 'full-pushups',
    name: 'Push-ups',
    type: 'reps',
    category: 'push',
    description: 'Standard floor push-ups. The foundational pushing exercise for upper body strength.',
    formCues: [
      'Hands slightly wider than shoulder width',
      'Elbows at 45-degree angle from body',
      'Chest touches floor at bottom',
      'Full lockout at top',
      'Maintain straight line from head to heels throughout'
    ],
    targetRepsMin: 3,
    targetRepsMax: 8,
    progressionLevel: 3,
    previousExercise: 'incline-pushups',
    nextExercise: 'diamond-pushups'
  },
  {
    id: 'diamond-pushups',
    name: 'Diamond Push-ups',
    type: 'reps',
    category: 'push',
    description: 'Push-ups with hands close together forming a diamond shape. Increases tricep and inner chest emphasis.',
    formCues: [
      'Hands together under chest, index fingers and thumbs touching',
      'Elbows stay close to body during descent',
      'Lower chest to hands',
      'Full extension at top',
      'Keep core tight to prevent hip sag'
    ],
    targetRepsMin: 8,
    targetRepsMax: 12,
    progressionLevel: 4,
    previousExercise: 'full-pushups',
    nextExercise: 'decline-pushups'
  },
  {
    id: 'decline-pushups',
    name: 'Decline Push-ups',
    type: 'reps',
    category: 'push',
    description: 'Push-ups with feet elevated. Increases difficulty and shifts emphasis to upper chest and shoulders.',
    formCues: [
      'Feet elevated on sturdy surface',
      'Hands shoulder-width apart on floor',
      'Maintain straight line from heels through head',
      'Lower until chest nearly touches floor',
      'Full lockout at top'
    ],
    equipmentSetup: 'Elevate feet on a chair, bench, or box approximately knee height.',
    targetRepsMin: 8,
    targetRepsMax: 12,
    progressionLevel: 5,
    previousExercise: 'diamond-pushups',
    nextExercise: 'ring-pushups'
  },
  {
    id: 'ring-pushups',
    name: 'Ring Push-ups',
    type: 'reps',
    category: 'push',
    description: 'Push-ups performed on gymnastic rings. The instability dramatically increases stabilizer muscle activation.',
    formCues: [
      'Rings set at lowest stable height for your strength',
      'Grip rings with neutral wrist position',
      'Keep rings from flaring out during movement',
      'Lower with control, chest between rings',
      'Push to full lockout'
    ],
    equipmentSetup: 'Set rings 6-12 inches from floor. Lower rings = harder.',
    targetRepsMin: 8,
    targetRepsMax: 12,
    progressionLevel: 6,
    previousExercise: 'decline-pushups',
    nextExercise: 'ring-pushups-rto'
  },
  {
    id: 'ring-pushups-rto',
    name: 'Ring Push-ups (RTO)',
    type: 'reps',
    category: 'push',
    description: 'Ring push-ups with rings turned out at the top. The most advanced ring push-up variation.',
    formCues: [
      'At top of movement, rotate rings so palms face forward',
      'Hold RTO position briefly at lockout',
      'Lower with rings returning to neutral',
      'Maintain ring control throughout',
      'Full range of motion on each rep'
    ],
    equipmentSetup: 'Set rings 6-12 inches from floor. Master standard ring push-ups first.',
    targetRepsMin: 8,
    targetRepsMax: 12,
    progressionLevel: 7,
    previousExercise: 'ring-pushups'
  }
]
