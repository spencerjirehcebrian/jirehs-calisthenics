import type { WarmupMovement, WarmupPhase, CooldownStretch } from '@/types'
import type { GuidedMovementItem, GuidedFlowPhase, SideHandling } from '@/types/guided-flow'

/**
 * Normalizes a warm-up movement to a GuidedMovementItem
 */
export function normalizeWarmupMovement(movement: WarmupMovement): GuidedMovementItem {
  return {
    id: movement.id,
    name: movement.name,
    mode: movement.type === 'timed' ? 'timed' : 'reps',
    reps: movement.reps,
    durationSeconds: movement.durationSeconds,
    sideHandling: movement.perDirection ? 'per-direction' : 'none',
    instructions: movement.instructions
  }
}

/**
 * Normalizes a cool-down stretch to a GuidedMovementItem
 */
export function normalizeCooldownStretch(stretch: CooldownStretch): GuidedMovementItem {
  return {
    id: stretch.id,
    name: stretch.name,
    mode: stretch.type.includes('timed') ? 'timed' : 'reps',
    reps: stretch.reps,
    durationSeconds: stretch.durationSeconds,
    sideHandling: stretch.perSide ? 'per-side' : 'none',
    instructions: stretch.instructions
  }
}

/**
 * Normalizes all warm-up phases to GuidedFlowPhases
 */
export function normalizeWarmupPhases(phases: WarmupPhase[]): GuidedFlowPhase[] {
  return phases.map(phase => ({
    id: phase.id,
    name: phase.name,
    items: phase.movements.map(normalizeWarmupMovement)
  }))
}

/**
 * Gets the display label for the current side/direction
 */
export function getSideLabel(
  sideHandling: SideHandling,
  currentSide: 'first' | 'second'
): string | null {
  if (sideHandling === 'none') return null
  if (sideHandling === 'per-direction') {
    return currentSide === 'first' ? 'Clockwise' : 'Counter-clockwise'
  }
  // per-side
  return currentSide === 'first' ? 'Left Side' : 'Right Side'
}

/**
 * Calculates total movements across all phases (accounting for per-direction)
 */
export function getTotalMovementSteps(phases: GuidedFlowPhase[]): number {
  return phases.reduce((total, phase) => {
    return total + phase.items.reduce((phaseTotal, item) => {
      // Per-direction/per-side items count as 2 steps
      return phaseTotal + (item.sideHandling !== 'none' ? 2 : 1)
    }, 0)
  }, 0)
}

/**
 * Calculates completed movement steps up to current position
 */
export function getCompletedSteps(
  phases: GuidedFlowPhase[],
  currentPhaseIndex: number,
  currentMovementIndex: number,
  currentSide: 'first' | 'second' | null
): number {
  let completed = 0

  // Count all completed phases
  for (let p = 0; p < currentPhaseIndex; p++) {
    completed += phases[p].items.reduce((total, item) => {
      return total + (item.sideHandling !== 'none' ? 2 : 1)
    }, 0)
  }

  // Count completed movements in current phase
  const currentPhase = phases[currentPhaseIndex]
  if (currentPhase) {
    for (let m = 0; m < currentMovementIndex; m++) {
      const item = currentPhase.items[m]
      completed += item.sideHandling !== 'none' ? 2 : 1
    }

    // If on second side of current movement, add 1
    const currentItem = currentPhase.items[currentMovementIndex]
    if (currentItem?.sideHandling !== 'none' && currentSide === 'second') {
      completed += 1
    }
  }

  return completed
}
