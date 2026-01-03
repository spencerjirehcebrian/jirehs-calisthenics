import type { Exercise } from '@/types'

export const coreExercises: Exercise[] = [
  {
    id: 'dead-bugs-heel-taps',
    name: 'Dead Bugs (Heel Taps)',
    type: 'reps',
    category: 'core',
    description: 'Lying on back, alternate tapping heels to floor while maintaining core stability. Beginner dead bug variation.',
    formCues: [
      'Lie on back, knees at 90 degrees',
      'Press lower back firmly into floor',
      'Arms straight up toward ceiling',
      'Alternate tapping heels to floor',
      'Lower back must stay pressed to floor'
    ],
    targetRepsMin: 10,
    targetRepsMax: 10,
    progressionLevel: 1,
    nextExercise: 'dead-bugs'
  },
  {
    id: 'dead-bugs',
    name: 'Dead Bugs',
    type: 'reps',
    category: 'core',
    description: 'Anti-extension core exercise. Extend opposite arm and leg while maintaining a braced core.',
    formCues: [
      'Lie on back, arms toward ceiling, knees at 90 degrees',
      'Press lower back into floor',
      'Extend opposite arm and leg simultaneously',
      'Keep arm and leg hovering, not touching floor',
      'Return and switch sides'
    ],
    targetRepsMin: 8,
    targetRepsMax: 10,
    progressionLevel: 2,
    previousExercise: 'dead-bugs-heel-taps',
    nextExercise: 'dead-bugs-full'
  },
  {
    id: 'dead-bugs-full',
    name: 'Dead Bugs (Full)',
    type: 'reps',
    category: 'core',
    description: 'Advanced dead bug with leg fully extended during the lowering phase.',
    formCues: [
      'Start position same as standard dead bugs',
      'Extend leg completely straight when lowering',
      'Keep leg hovering 1-2 inches from floor',
      'Maintain lower back pressed to floor',
      'Return to start before switching sides'
    ],
    targetRepsMin: 8,
    targetRepsMax: 8,
    progressionLevel: 3,
    previousExercise: 'dead-bugs'
  },
  {
    id: 'hollow-body-tuck',
    name: 'Hollow Body Tuck Hold',
    type: 'timed',
    category: 'core',
    description: 'Foundational gymnastics core position with knees tucked. Builds the hollow body shape.',
    formCues: [
      'Lie on back, knees pulled to chest',
      'Lift shoulders slightly off floor',
      'Press lower back firmly into floor',
      'Arms can be at sides or extended overhead',
      'Hold position while breathing normally'
    ],
    targetDurationSeconds: 20,
    progressionLevel: 1,
    nextExercise: 'hollow-body-straddle'
  },
  {
    id: 'hollow-body-straddle',
    name: 'Hollow Body Straddle Hold',
    type: 'timed',
    category: 'core',
    description: 'Hollow body hold with legs extended in a wide straddle position.',
    formCues: [
      'Extend legs in wide straddle position',
      'Legs hover several inches off floor',
      'Lower back pressed into floor',
      'Shoulders lifted, arms extended overhead',
      'Body forms slight banana shape'
    ],
    targetDurationSeconds: 20,
    progressionLevel: 2,
    previousExercise: 'hollow-body-tuck',
    nextExercise: 'hollow-body-full'
  },
  {
    id: 'hollow-body-full',
    name: 'Hollow Body Hold',
    type: 'timed',
    category: 'core',
    description: 'Full hollow body position with legs together and extended. Foundation for advanced gymnastics skills.',
    formCues: [
      'Arms extended overhead, biceps by ears',
      'Legs extended and together',
      'Entire body forms banana shape',
      'Lower back pressed to floor',
      'Hold while maintaining position'
    ],
    targetDurationSeconds: 30,
    progressionLevel: 3,
    previousExercise: 'hollow-body-straddle'
  },
  {
    id: 'plank',
    name: 'Plank',
    type: 'timed',
    category: 'core',
    description: 'The standard front plank. Anti-extension exercise that builds core endurance.',
    formCues: [
      'Forearms on floor, elbows under shoulders',
      'Body in straight line from head to heels',
      'Squeeze glutes and brace core',
      'Do not let hips sag or pike up',
      'Breathe normally throughout'
    ],
    targetDurationSeconds: 30,
    progressionLevel: 1,
    nextExercise: 'side-planks'
  },
  {
    id: 'side-planks',
    name: 'Side Planks',
    type: 'timed-per-side',
    category: 'core',
    description: 'Lateral plank position. Targets obliques and lateral core stability.',
    formCues: [
      'Stack feet or stagger for stability',
      'Bottom elbow directly under shoulder',
      'Lift hips to create straight line',
      'Top arm can be on hip or extended up',
      'Hold then switch sides'
    ],
    targetDurationSeconds: 20,
    progressionLevel: 2,
    previousExercise: 'plank',
    nextExercise: 'plank-leg-lifts'
  },
  {
    id: 'plank-leg-lifts',
    name: 'Plank with Leg Lifts',
    type: 'reps',
    category: 'core',
    description: 'Standard plank with alternating leg lifts. Adds anti-rotation challenge.',
    formCues: [
      'Start in standard plank position',
      'Lift one leg a few inches off floor',
      'Keep hips level - no rotation',
      'Hold briefly, lower leg',
      'Alternate legs'
    ],
    targetRepsMin: 10,
    targetRepsMax: 12,
    progressionLevel: 3,
    previousExercise: 'side-planks'
  },
  {
    id: 'bird-dogs',
    name: 'Bird Dogs',
    type: 'reps',
    category: 'core',
    description: 'Quadruped position with opposite arm/leg extension. Trains core stability and coordination.',
    formCues: [
      'Start on hands and knees',
      'Hands under shoulders, knees under hips',
      'Extend opposite arm and leg simultaneously',
      'Keep back flat - no rotation or arching',
      'Return and switch sides'
    ],
    targetRepsMin: 10,
    targetRepsMax: 10,
    progressionLevel: 2
  }
]
