import { vi } from 'vitest'

export function createAudioContextMock() {
  const mockGainNode = {
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      value: 1,
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }

  const mockOscillator = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    type: 'sine' as OscillatorType,
    frequency: {
      setValueAtTime: vi.fn(),
      value: 440,
    },
  }

  const mockAudioContext = {
    state: 'running' as AudioContextState,
    currentTime: 0,
    destination: {},
    createOscillator: vi.fn(() => ({ ...mockOscillator })),
    createGain: vi.fn(() => ({ ...mockGainNode })),
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    suspend: vi.fn().mockResolvedValue(undefined),
  }

  return {
    mockAudioContext,
    mockOscillator,
    mockGainNode,
  }
}

export function mockAudioContext() {
  const mocks = createAudioContextMock()

  vi.stubGlobal('AudioContext', vi.fn(() => mocks.mockAudioContext))
  vi.stubGlobal('webkitAudioContext', vi.fn(() => mocks.mockAudioContext))

  return mocks
}
