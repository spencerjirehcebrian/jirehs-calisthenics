import { vi } from 'vitest'

export function createLocalStorageMock() {
  const store: Record<string, string> = {}

  const localStorageMock = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    get length() {
      return Object.keys(store).length
    },
  }

  return { store, localStorageMock }
}

export function mockLocalStorage() {
  const { store, localStorageMock } = createLocalStorageMock()
  vi.stubGlobal('localStorage', localStorageMock)
  return { store, localStorageMock }
}
