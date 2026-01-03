export type CooldownStretchType = 'timed' | 'timed-per-side' | 'reps' | 'reps-per-side'

export interface CooldownStretch {
  id: string
  name: string
  type: CooldownStretchType
  durationSeconds?: number
  reps?: number
  perSide?: boolean
  instructions?: string
}
