export type MovementMode = 'reps' | 'timed'
export type SideHandling = 'none' | 'per-direction' | 'per-side'

export interface GuidedMovementItem {
  id: string
  name: string
  mode: MovementMode
  reps?: number
  durationSeconds?: number
  sideHandling: SideHandling
  instructions?: string
}

export interface GuidedFlowPhase {
  id: string
  name: string
  items: GuidedMovementItem[]
}
