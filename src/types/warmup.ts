export type WarmupMovementType = 'reps' | 'timed' | 'timed-per-direction'

export interface WarmupMovement {
  id: string
  name: string
  type: WarmupMovementType
  reps?: number
  durationSeconds?: number
  perDirection?: boolean
  instructions?: string
}

export interface WarmupPhase {
  id: string
  name: string
  durationMinutes: string
  movements: WarmupMovement[]
}
