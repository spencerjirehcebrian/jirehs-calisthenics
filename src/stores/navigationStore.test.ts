import { describe, it, expect, beforeEach } from 'vitest'
import { useNavigationStore } from './navigationStore'

describe('navigationStore', () => {
  beforeEach(() => {
    // Reset to initial state
    useNavigationStore.setState({
      currentScreen: 'home',
      previousScreen: null,
    })
  })

  describe('initial state', () => {
    it('should start at home screen', () => {
      expect(useNavigationStore.getState().currentScreen).toBe('home')
    })

    it('should have null previousScreen', () => {
      expect(useNavigationStore.getState().previousScreen).toBeNull()
    })
  })

  describe('navigate', () => {
    it('should update currentScreen', () => {
      useNavigationStore.getState().navigate('settings')
      expect(useNavigationStore.getState().currentScreen).toBe('settings')
    })

    it('should store previous screen for back navigation', () => {
      useNavigationStore.getState().navigate('settings')
      expect(useNavigationStore.getState().previousScreen).toBe('home')
    })

    it('should track navigation history through multiple navigations', () => {
      useNavigationStore.getState().navigate('workout-selection')
      useNavigationStore.getState().navigate('warmup')

      expect(useNavigationStore.getState().currentScreen).toBe('warmup')
      expect(useNavigationStore.getState().previousScreen).toBe('workout-selection')
    })
  })

  describe('goBack', () => {
    it('should navigate to previousScreen when available', () => {
      useNavigationStore.getState().navigate('settings')
      useNavigationStore.getState().goBack()

      expect(useNavigationStore.getState().currentScreen).toBe('home')
    })

    it('should clear previousScreen after going back', () => {
      useNavigationStore.getState().navigate('settings')
      useNavigationStore.getState().goBack()

      expect(useNavigationStore.getState().previousScreen).toBeNull()
    })

    it('should do nothing when previousScreen is null', () => {
      const initialScreen = useNavigationStore.getState().currentScreen
      useNavigationStore.getState().goBack()

      expect(useNavigationStore.getState().currentScreen).toBe(initialScreen)
    })

    it('should prevent double back by clearing previousScreen', () => {
      useNavigationStore.getState().navigate('workout-selection')
      useNavigationStore.getState().navigate('warmup')
      useNavigationStore.getState().goBack()

      // First goBack works
      expect(useNavigationStore.getState().currentScreen).toBe('workout-selection')

      // Second goBack should not change screen (previousScreen is null)
      useNavigationStore.getState().goBack()
      expect(useNavigationStore.getState().currentScreen).toBe('workout-selection')
    })
  })
})
