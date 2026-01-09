import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'

// Re-export everything from testing library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'

// Custom render with providers if needed in the future
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

// Override render method
export { customRender as render }

// Helper to create mock pointer events
export function createPointerEvent(
  type: string,
  options: Partial<PointerEventInit> = {}
): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    ...options,
  })
}

// Helper to create mock keyboard events
export function createKeyboardEvent(
  type: string,
  key: string,
  options: Partial<KeyboardEventInit> = {}
): KeyboardEvent {
  return new KeyboardEvent(type, {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  })
}

// Helper to reset all stores before tests
export async function resetAllStores() {
  const { useNavigationStore } = await import('@/stores/navigationStore')
  const { useWorkoutSessionStore } = await import('@/stores/workoutSessionStore')
  const { usePracticeStore } = await import('@/stores/practiceStore')

  useNavigationStore.getState().navigate('home')
  useWorkoutSessionStore.getState().resetSession()
  usePracticeStore.getState().resetPractice()
}

// Helper to wait for next tick (useful for state updates)
export function waitForNextTick(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// Helper to advance timers and flush promises
export async function advanceTimersAndFlush(ms: number): Promise<void> {
  const { vi } = await import('vitest')
  vi.advanceTimersByTime(ms)
  await waitForNextTick()
}
