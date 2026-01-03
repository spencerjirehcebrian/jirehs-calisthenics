import { describe, it, expect } from 'vitest'
import {
  normalizeWarmupMovement,
  normalizeCooldownStretch,
  normalizeWarmupPhases,
  getSideLabel,
  getTotalMovementSteps,
  getCompletedSteps,
} from './guidedFlow'
import type { WarmupMovement, WarmupPhase, CooldownStretch } from '@/types'
import type { GuidedFlowPhase } from '@/types/guided-flow'

describe('normalizeWarmupMovement', () => {
  it('should normalize timed movement with correct mode', () => {
    const movement: WarmupMovement = {
      id: 'test-1',
      name: 'Jumping Jacks',
      type: 'timed',
      durationSeconds: 60,
      perDirection: false,
    }

    const result = normalizeWarmupMovement(movement)

    expect(result.mode).toBe('timed')
    expect(result.durationSeconds).toBe(60)
  })

  it('should normalize reps movement with correct mode', () => {
    const movement: WarmupMovement = {
      id: 'test-2',
      name: 'Shoulder Circles',
      type: 'reps',
      reps: 10,
      perDirection: false,
    }

    const result = normalizeWarmupMovement(movement)

    expect(result.mode).toBe('reps')
    expect(result.reps).toBe(10)
  })

  it('should set sideHandling to per-direction when perDirection is true', () => {
    const movement: WarmupMovement = {
      id: 'test-3',
      name: 'Hip Circles',
      type: 'reps',
      reps: 10,
      perDirection: true,
    }

    const result = normalizeWarmupMovement(movement)

    expect(result.sideHandling).toBe('per-direction')
  })

  it('should set sideHandling to none when perDirection is false', () => {
    const movement: WarmupMovement = {
      id: 'test-4',
      name: 'Cat-Cow',
      type: 'reps',
      reps: 8,
      perDirection: false,
    }

    const result = normalizeWarmupMovement(movement)

    expect(result.sideHandling).toBe('none')
  })

  it('should preserve id, name, and instructions', () => {
    const movement: WarmupMovement = {
      id: 'test-5',
      name: 'Wrist Circles',
      type: 'reps',
      reps: 10,
      instructions: 'Rotate slowly in each direction',
    }

    const result = normalizeWarmupMovement(movement)

    expect(result.id).toBe('test-5')
    expect(result.name).toBe('Wrist Circles')
    expect(result.instructions).toBe('Rotate slowly in each direction')
  })
})

describe('normalizeCooldownStretch', () => {
  it('should normalize timed stretch', () => {
    const stretch: CooldownStretch = {
      id: 'stretch-1',
      name: 'Wrist Flexor Stretch',
      type: 'timed',
      durationSeconds: 30,
    }

    const result = normalizeCooldownStretch(stretch)

    expect(result.mode).toBe('timed')
    expect(result.durationSeconds).toBe(30)
    expect(result.sideHandling).toBe('none')
  })

  it('should normalize reps stretch', () => {
    const stretch: CooldownStretch = {
      id: 'stretch-2',
      name: 'Cat-Cow',
      type: 'reps',
      reps: 10,
    }

    const result = normalizeCooldownStretch(stretch)

    expect(result.mode).toBe('reps')
    expect(result.reps).toBe(10)
  })

  it('should set sideHandling to per-side when perSide is true', () => {
    const stretch: CooldownStretch = {
      id: 'stretch-3',
      name: 'Pigeon Stretch',
      type: 'timed-per-side',
      durationSeconds: 45,
      perSide: true,
    }

    const result = normalizeCooldownStretch(stretch)

    expect(result.sideHandling).toBe('per-side')
  })

  it('should detect timed mode from type containing "timed"', () => {
    const stretch: CooldownStretch = {
      id: 'stretch-4',
      name: 'Cross-arm Shoulder Stretch',
      type: 'timed-per-side',
      durationSeconds: 30,
      perSide: true,
    }

    const result = normalizeCooldownStretch(stretch)

    expect(result.mode).toBe('timed')
  })

  it('should set mode to reps for reps-per-side type', () => {
    const stretch: CooldownStretch = {
      id: 'stretch-5',
      name: 'Thread the Needle',
      type: 'reps-per-side',
      reps: 10,
      perSide: true,
    }

    const result = normalizeCooldownStretch(stretch)

    expect(result.mode).toBe('reps')
    expect(result.sideHandling).toBe('per-side')
  })
})

describe('normalizeWarmupPhases', () => {
  it('should normalize all phases and their movements', () => {
    const phases: WarmupPhase[] = [
      {
        id: 'phase-1',
        name: 'Heart Rate Elevation',
        durationMinutes: '2-3',
        movements: [
          {
            id: 'mov-1',
            name: 'Jumping Jacks',
            type: 'reps',
            reps: 50,
          },
        ],
      },
      {
        id: 'phase-2',
        name: 'Joint Circles',
        durationMinutes: '2-3',
        movements: [
          {
            id: 'mov-2',
            name: 'Hip Circles',
            type: 'reps',
            reps: 10,
            perDirection: true,
          },
        ],
      },
    ]

    const result = normalizeWarmupPhases(phases)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('phase-1')
    expect(result[0].name).toBe('Heart Rate Elevation')
    expect(result[0].items).toHaveLength(1)
    expect(result[0].items[0].mode).toBe('reps')

    expect(result[1].items[0].sideHandling).toBe('per-direction')
  })
})

describe('getSideLabel', () => {
  it('should return null for sideHandling "none"', () => {
    expect(getSideLabel('none', 'first')).toBeNull()
    expect(getSideLabel('none', 'second')).toBeNull()
  })

  it('should return "Clockwise" for per-direction first side', () => {
    expect(getSideLabel('per-direction', 'first')).toBe('Clockwise')
  })

  it('should return "Counter-clockwise" for per-direction second side', () => {
    expect(getSideLabel('per-direction', 'second')).toBe('Counter-clockwise')
  })

  it('should return "Left Side" for per-side first side', () => {
    expect(getSideLabel('per-side', 'first')).toBe('Left Side')
  })

  it('should return "Right Side" for per-side second side', () => {
    expect(getSideLabel('per-side', 'second')).toBe('Right Side')
  })
})

describe('getTotalMovementSteps', () => {
  it('should count single-side items as 1 step', () => {
    const phases: GuidedFlowPhase[] = [
      {
        id: 'phase-1',
        name: 'Test Phase',
        items: [
          { id: '1', name: 'Item 1', mode: 'reps', reps: 10, sideHandling: 'none' },
          { id: '2', name: 'Item 2', mode: 'reps', reps: 10, sideHandling: 'none' },
        ],
      },
    ]

    expect(getTotalMovementSteps(phases)).toBe(2)
  })

  it('should count per-direction items as 2 steps', () => {
    const phases: GuidedFlowPhase[] = [
      {
        id: 'phase-1',
        name: 'Test Phase',
        items: [
          { id: '1', name: 'Hip Circles', mode: 'reps', reps: 10, sideHandling: 'per-direction' },
        ],
      },
    ]

    expect(getTotalMovementSteps(phases)).toBe(2)
  })

  it('should count per-side items as 2 steps', () => {
    const phases: GuidedFlowPhase[] = [
      {
        id: 'phase-1',
        name: 'Test Phase',
        items: [
          { id: '1', name: 'Pigeon Stretch', mode: 'timed', durationSeconds: 45, sideHandling: 'per-side' },
        ],
      },
    ]

    expect(getTotalMovementSteps(phases)).toBe(2)
  })

  it('should sum steps across multiple phases', () => {
    const phases: GuidedFlowPhase[] = [
      {
        id: 'phase-1',
        name: 'Phase 1',
        items: [
          { id: '1', name: 'Item 1', mode: 'reps', reps: 10, sideHandling: 'none' },
          { id: '2', name: 'Item 2', mode: 'reps', reps: 10, sideHandling: 'per-direction' },
        ],
      },
      {
        id: 'phase-2',
        name: 'Phase 2',
        items: [
          { id: '3', name: 'Item 3', mode: 'timed', durationSeconds: 30, sideHandling: 'per-side' },
        ],
      },
    ]

    // 1 + 2 + 2 = 5
    expect(getTotalMovementSteps(phases)).toBe(5)
  })

  it('should return 0 for empty phases', () => {
    expect(getTotalMovementSteps([])).toBe(0)
  })

  it('should return 0 for phases with no items', () => {
    const phases: GuidedFlowPhase[] = [
      { id: 'phase-1', name: 'Empty Phase', items: [] },
    ]

    expect(getTotalMovementSteps(phases)).toBe(0)
  })
})

describe('getCompletedSteps', () => {
  const phases: GuidedFlowPhase[] = [
    {
      id: 'phase-1',
      name: 'Phase 1',
      items: [
        { id: '1', name: 'Item 1', mode: 'reps', reps: 10, sideHandling: 'none' },
        { id: '2', name: 'Item 2', mode: 'reps', reps: 10, sideHandling: 'per-direction' },
      ],
    },
    {
      id: 'phase-2',
      name: 'Phase 2',
      items: [
        { id: '3', name: 'Item 3', mode: 'timed', durationSeconds: 30, sideHandling: 'per-side' },
        { id: '4', name: 'Item 4', mode: 'reps', reps: 5, sideHandling: 'none' },
      ],
    },
  ]

  it('should return 0 at start of first phase', () => {
    expect(getCompletedSteps(phases, 0, 0, null)).toBe(0)
  })

  it('should return 0 at start of first phase on first side', () => {
    expect(getCompletedSteps(phases, 0, 0, 'first')).toBe(0)
  })

  it('should count completed movements in current phase', () => {
    // First movement completed (1 step), now on second movement
    expect(getCompletedSteps(phases, 0, 1, 'first')).toBe(1)
  })

  it('should add 1 when on second side of current movement', () => {
    // Second movement (per-direction), on second side
    expect(getCompletedSteps(phases, 0, 1, 'second')).toBe(2)
  })

  it('should count completed phases correctly', () => {
    // Phase 1 complete (1 + 2 = 3 steps), now at start of phase 2
    expect(getCompletedSteps(phases, 1, 0, 'first')).toBe(3)
  })

  it('should handle progress within second phase', () => {
    // Phase 1 complete (3 steps) + first item of phase 2 on second side
    expect(getCompletedSteps(phases, 1, 0, 'second')).toBe(4)
  })

  it('should handle mixed single/dual-side movements', () => {
    // Phase 1 complete (3) + Phase 2 first item complete (2) + on second item
    expect(getCompletedSteps(phases, 1, 1, null)).toBe(5)
  })

  it('should handle empty current phase gracefully', () => {
    const emptyPhases: GuidedFlowPhase[] = [
      { id: 'phase-1', name: 'Empty', items: [] },
    ]

    expect(getCompletedSteps(emptyPhases, 0, 0, null)).toBe(0)
  })
})
