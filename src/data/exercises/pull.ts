import type { Exercise } from '@/types'

export const pullExercises: Exercise[] = [
  {
    id: 'dead-hang',
    name: 'Dead Hang',
    type: 'timed',
    category: 'pull',
    description: 'Hanging from a bar with straight arms. Builds grip strength and shoulder stability essential for pulling movements.',
    formCues: [
      'Full grip around bar, thumbs wrapped',
      'Arms completely straight',
      'Shoulders engaged (not shrugging to ears)',
      'Core lightly engaged',
      'Breathe normally throughout hold'
    ],
    equipmentSetup: 'Use a pull-up bar or sturdy overhead support.',
    targetDurationSeconds: 30,
    progressionLevel: 1,
    nextExercise: 'scapular-pulls'
  },
  {
    id: 'scapular-pulls',
    name: 'Scapular Pulls',
    type: 'reps',
    category: 'pull',
    description: 'From a dead hang, pull shoulder blades down and together without bending arms. Teaches proper lat engagement.',
    formCues: [
      'Start in dead hang position',
      'Pull shoulder blades down and back',
      'Arms stay completely straight',
      'Body rises slightly (1-2 inches)',
      'Hold briefly at top, lower with control'
    ],
    equipmentSetup: 'Use a pull-up bar or sturdy overhead support.',
    targetRepsMin: 10,
    targetRepsMax: 12,
    progressionLevel: 2,
    previousExercise: 'dead-hang',
    nextExercise: 'ring-rows-steep'
  },
  {
    id: 'ring-rows-steep',
    name: 'Ring Rows (Steep Angle)',
    type: 'reps',
    category: 'pull',
    description: 'Horizontal pulling on rings with body nearly upright. The easiest ring row variation.',
    formCues: [
      'Stand close to anchor point (nearly upright)',
      'Grip rings with neutral grip',
      'Pull chest toward rings',
      'Keep body straight like a plank',
      'Lower with control'
    ],
    equipmentSetup: 'Set rings at waist height or higher. Stand close to anchor point.',
    targetRepsMin: 12,
    targetRepsMax: 15,
    progressionLevel: 3,
    previousExercise: 'scapular-pulls',
    nextExercise: 'ring-rows-45'
  },
  {
    id: 'ring-rows-45',
    name: 'Ring Rows (45 Degree)',
    type: 'reps',
    category: 'pull',
    description: 'Ring rows with body at approximately 45 degrees to the floor. Intermediate difficulty.',
    formCues: [
      'Body at 45-degree angle to floor',
      'Grip rings with palms facing each other',
      'Pull until hands reach sides of chest',
      'Maintain rigid plank position',
      'Full arm extension at bottom'
    ],
    equipmentSetup: 'Set rings at waist height. Walk feet under anchor point until body reaches 45 degrees.',
    targetRepsMin: 8,
    targetRepsMax: 12,
    progressionLevel: 4,
    previousExercise: 'ring-rows-steep',
    nextExercise: 'ring-rows-horizontal'
  },
  {
    id: 'ring-rows-horizontal',
    name: 'Ring Rows (Horizontal)',
    type: 'reps',
    category: 'pull',
    description: 'Ring rows with body parallel to the floor. The most challenging ring row variation.',
    formCues: [
      'Body completely horizontal',
      'Heels on floor (or elevated for more difficulty)',
      'Pull chest to rings',
      'Squeeze shoulder blades together at top',
      'Full range of motion each rep'
    ],
    equipmentSetup: 'Set rings low. Walk feet forward until body is horizontal. Elevate feet on box for added difficulty.',
    targetRepsMin: 8,
    targetRepsMax: 10,
    progressionLevel: 5,
    previousExercise: 'ring-rows-45',
    nextExercise: 'jackknife-pullups'
  },
  {
    id: 'jackknife-pullups',
    name: 'Jackknife Pull-ups',
    type: 'reps',
    category: 'pull',
    description: 'Pull-ups with feet supported on a box or chair. Allows practice of vertical pulling with assistance.',
    formCues: [
      'Grip bar, feet on elevated surface',
      'Use minimal leg assistance',
      'Focus on pulling with back muscles',
      'Chin over bar at top',
      'Lower with control'
    ],
    equipmentSetup: 'Place a chair or box in front of or below the pull-up bar.',
    targetRepsMin: 8,
    targetRepsMax: 12,
    progressionLevel: 6,
    previousExercise: 'ring-rows-horizontal',
    nextExercise: 'negative-pullups'
  },
  {
    id: 'negative-pullups',
    name: 'Negative Pull-ups',
    type: 'reps',
    category: 'pull',
    description: 'Jump or step to the top of a pull-up, then lower as slowly as possible. Critical progression to full pull-ups.',
    formCues: [
      'Jump or step to top position (chin over bar)',
      'Lower over 5 full seconds minimum',
      'Control the entire descent',
      'Arms fully straight at bottom',
      'Reset and repeat'
    ],
    equipmentSetup: 'Use a box or step to reach the top position of the pull-up.',
    targetRepsMin: 3,
    targetRepsMax: 5,
    progressionLevel: 7,
    previousExercise: 'jackknife-pullups',
    nextExercise: 'full-pullups'
  },
  {
    id: 'full-pullups',
    name: 'Pull-ups',
    type: 'reps',
    category: 'pull',
    description: 'The full pull-up. A complete vertical pulling movement from dead hang to chin over bar.',
    formCues: [
      'Start from complete dead hang',
      'Pull shoulder blades down first',
      'Pull until chin clears bar',
      'Lower with control to full extension',
      'No kipping or swinging'
    ],
    equipmentSetup: 'Use a pull-up bar or sturdy overhead support.',
    targetRepsMin: 5,
    targetRepsMax: 10,
    progressionLevel: 8,
    previousExercise: 'negative-pullups'
  }
]
