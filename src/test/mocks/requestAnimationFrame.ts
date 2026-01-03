import { vi } from 'vitest'

export function createRAFMock() {
  let frameId = 0
  const callbacks: Map<number, FrameRequestCallback> = new Map()
  let currentTime = 0

  const requestAnimationFrame = vi.fn((callback: FrameRequestCallback): number => {
    frameId++
    callbacks.set(frameId, callback)
    return frameId
  })

  const cancelAnimationFrame = vi.fn((id: number): void => {
    callbacks.delete(id)
  })

  // Run a single animation frame with given timestamp
  const runFrame = (timestamp?: number) => {
    const time = timestamp ?? currentTime
    currentTime = time
    const currentCallbacks = Array.from(callbacks.entries())
    callbacks.clear()
    currentCallbacks.forEach(([, cb]) => cb(time))
  }

  // Run multiple frames advancing time by interval
  const runFrames = (count: number, intervalMs: number = 16) => {
    for (let i = 0; i < count; i++) {
      currentTime += intervalMs
      runFrame(currentTime)
    }
  }

  // Advance time and run frame
  const advanceTime = (ms: number) => {
    currentTime += ms
    runFrame(currentTime)
  }

  return {
    requestAnimationFrame,
    cancelAnimationFrame,
    runFrame,
    runFrames,
    advanceTime,
    callbacks,
    getCurrentTime: () => currentTime,
    setCurrentTime: (time: number) => { currentTime = time },
  }
}

export function mockRequestAnimationFrame() {
  const raf = createRAFMock()

  vi.stubGlobal('requestAnimationFrame', raf.requestAnimationFrame)
  vi.stubGlobal('cancelAnimationFrame', raf.cancelAnimationFrame)

  return raf
}
