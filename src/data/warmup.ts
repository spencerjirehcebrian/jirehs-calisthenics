import type { WarmupPhase } from '@/types'

export const warmupPhases: WarmupPhase[] = [
  {
    id: 'phase-1',
    name: 'Elevate Heart Rate',
    durationMinutes: '2-3',
    movements: [
      {
        id: 'jumping-jacks',
        name: 'Jumping Jacks',
        type: 'reps',
        reps: 50,
        instructions: 'Or jog in place for 2-3 minutes'
      }
    ]
  },
  {
    id: 'phase-2',
    name: 'Joint Circles',
    durationMinutes: '2-3',
    movements: [
      { id: 'neck-circles', name: 'Neck Circles', type: 'reps', reps: 10, perDirection: true },
      { id: 'shoulder-circles-forward', name: 'Shoulder Circles Forward', type: 'reps', reps: 10 },
      { id: 'shoulder-circles-backward', name: 'Shoulder Circles Backward', type: 'reps', reps: 10 },
      { id: 'arm-circles', name: 'Arm Circles', type: 'reps', reps: 10 },
      { id: 'wrist-circles', name: 'Wrist Circles', type: 'reps', reps: 10 },
      { id: 'hip-circles', name: 'Hip Circles', type: 'reps', reps: 10, perDirection: true },
      { id: 'knee-circles', name: 'Knee Circles', type: 'reps', reps: 10 },
      { id: 'ankle-circles', name: 'Ankle Circles', type: 'reps', reps: 10 },
      { id: 'wrist-rocks', name: 'Wrist Rocks', type: 'reps', reps: 10, instructions: 'On all fours, rock back and forth' }
    ]
  },
  {
    id: 'phase-3',
    name: 'Dynamic Stretches',
    durationMinutes: '3-5',
    movements: [
      { id: 'cat-cow-warmup', name: 'Cat-Cow', type: 'reps', reps: 10 },
      { id: 'leg-swings', name: 'Leg Swings (Front-to-Back)', type: 'reps', reps: 10, instructions: 'Each leg' },
      { id: 'hip-circles-dynamic', name: 'Hip Circles', type: 'reps', reps: 5, perDirection: true },
      { id: 'inchworms', name: 'Inchworms', type: 'reps', reps: 8 }
    ]
  },
  {
    id: 'phase-4',
    name: 'Movement Activation',
    durationMinutes: '3-5',
    movements: [
      { id: 'scapular-pushups-warmup', name: 'Scapular Push-ups', type: 'reps', reps: 10 },
      { id: 'wall-pushups-warmup', name: 'Wall Push-ups', type: 'reps', reps: 10 },
      { id: 'dead-hang-warmup', name: 'Dead Hang', type: 'timed', durationSeconds: 30 }
    ]
  }
]
