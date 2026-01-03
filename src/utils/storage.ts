import { createJSONStorage, type StateStorage } from 'zustand/middleware'

// In-memory fallback when localStorage is unavailable
const memoryStorage: Map<string, string> = new Map()

let storageAvailable: boolean | null = null

function isStorageAvailable(): boolean {
  if (storageAvailable !== null) return storageAvailable

  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    storageAvailable = true
    return true
  } catch {
    storageAvailable = false
    return false
  }
}

export function safeGetItem(key: string): string | null {
  if (!isStorageAvailable()) {
    return memoryStorage.get(key) ?? null
  }

  try {
    return localStorage.getItem(key)
  } catch {
    return memoryStorage.get(key) ?? null
  }
}

export function safeSetItem(key: string, value: string): void {
  // Always update memory storage as backup
  memoryStorage.set(key, value)

  if (!isStorageAvailable()) {
    return
  }

  try {
    localStorage.setItem(key, value)
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn('localStorage quota exceeded, using in-memory storage')
      } else if (error.name === 'SecurityError') {
        console.warn('localStorage blocked by security settings, using in-memory storage')
      }
    }
  }
}

export function safeRemoveItem(key: string): void {
  memoryStorage.delete(key)

  if (!isStorageAvailable()) {
    return
  }

  try {
    localStorage.removeItem(key)
  } catch {
    // Silently fail - item is removed from memory storage at least
  }
}

// Base storage that handles localStorage errors gracefully
const baseStorage: StateStorage = {
  getItem: safeGetItem,
  setItem: safeSetItem,
  removeItem: safeRemoveItem
}

// Zustand-compatible storage with JSON serialization
export const safeStorage = createJSONStorage(() => baseStorage)
