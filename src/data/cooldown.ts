import type { CooldownStretch } from '@/types'

export const cooldownStretches: CooldownStretch[] = [
  {
    id: 'cross-arm-shoulder',
    name: 'Cross-Arm Shoulder Stretch',
    type: 'timed-per-side',
    durationSeconds: 30,
    perSide: true,
    instructions: 'Pull arm across body with opposite hand'
  },
  {
    id: 'pigeon-stretch',
    name: 'Pigeon Stretch',
    type: 'timed-per-side',
    durationSeconds: 60,
    perSide: true,
    instructions: 'Hip flexor and glute stretch'
  },
  {
    id: 'wrist-flexor',
    name: 'Wrist Flexor Stretch',
    type: 'timed',
    durationSeconds: 30,
    instructions: 'Prayer position, press palms together'
  },
  {
    id: 'cat-cow-cooldown',
    name: 'Cat-Cow',
    type: 'reps',
    reps: 10,
    instructions: 'Slow, controlled movements'
  },
  {
    id: 'thread-the-needle',
    name: 'Thread the Needle',
    type: 'reps-per-side',
    reps: 10,
    perSide: true,
    instructions: 'Thoracic spine rotation'
  }
]
