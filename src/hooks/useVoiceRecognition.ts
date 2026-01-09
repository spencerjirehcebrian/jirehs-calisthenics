import { useEffect, useRef, useCallback } from 'react'
import { useVoiceStore } from '@/stores'

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export interface UseVoiceRecognitionOptions {
  onResult: (transcript: string, isFinal: boolean, confidence: number) => void
  onError?: (error: string) => void
  onStateChange?: (isListening: boolean) => void
}

export interface UseVoiceRecognitionReturn {
  start: () => void
  stop: () => void
  isSupported: boolean
}

export function useVoiceRecognition(
  options: UseVoiceRecognitionOptions
): UseVoiceRecognitionReturn {
  const { onResult, onError, onStateChange } = options

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isListeningRef = useRef(false)
  const shouldRestartRef = useRef(false)

  const { setMicState, setAudioLevel } = useVoiceStore()

  // Check if Web Speech API is supported
  const checkSupport = useCallback(() => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  }, [])

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (!checkSupport()) return null

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognitionAPI()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      isListeningRef.current = true
      onStateChange?.(true)
      setMicState('listening')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex]
      if (result) {
        const transcript = result[0].transcript
        const confidence = result[0].confidence
        const isFinal = result.isFinal

        // Update mic state based on recognition activity
        if (isFinal) {
          setMicState('recognized')
          // Reset to listening after brief visual feedback
          setTimeout(() => {
            if (isListeningRef.current) {
              setMicState('listening')
            }
          }, 300)
        } else {
          setMicState('partial')
          // Simulate audio level from transcript length (rough approximation)
          setAudioLevel(Math.min(1, transcript.length / 20))
        }

        onResult(transcript, isFinal, confidence)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn('[Voice] Recognition error:', event.error, event.message)

      // Handle specific errors
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        useVoiceStore.getState().setPermissionStatus('denied')
        shouldRestartRef.current = false
      } else if (event.error === 'no-speech') {
        // No speech detected - not really an error, will auto-restart
        return
      } else if (event.error === 'aborted') {
        // Intentionally stopped
        return
      }

      setMicState('error')
      onError?.(event.error)

      // Reset to off after error display
      setTimeout(() => {
        setMicState('off')
      }, 1500)
    }

    recognition.onend = () => {
      isListeningRef.current = false
      onStateChange?.(false)

      // Auto-restart if we should still be listening
      if (shouldRestartRef.current && document.visibilityState === 'visible') {
        console.log('[Voice] Auto-restarting recognition')
        setTimeout(() => {
          if (shouldRestartRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch (e) {
              console.warn('[Voice] Failed to restart recognition:', e)
            }
          }
        }, 100)
      } else {
        setMicState('off')
        setAudioLevel(0)
      }
    }

    return recognition
  }, [checkSupport, onResult, onError, onStateChange, setMicState, setAudioLevel])

  // Start recognition
  const start = useCallback(() => {
    if (!checkSupport()) {
      console.warn('[Voice] Speech recognition not supported')
      return
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition()
    }

    if (recognitionRef.current && !isListeningRef.current) {
      shouldRestartRef.current = true
      try {
        recognitionRef.current.start()
        console.log('[Voice] Recognition started')
      } catch (e) {
        console.warn('[Voice] Failed to start recognition:', e)
      }
    }
  }, [checkSupport, initRecognition])

  // Stop recognition
  const stop = useCallback(() => {
    shouldRestartRef.current = false

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        console.log('[Voice] Recognition stopped')
      } catch (e) {
        console.warn('[Voice] Failed to stop recognition:', e)
      }
    }

    isListeningRef.current = false
    setMicState('off')
    setAudioLevel(0)
  }, [setMicState, setAudioLevel])

  // Handle visibility change (pause when backgrounded)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Pause recognition when app is backgrounded
        if (isListeningRef.current && recognitionRef.current) {
          console.log('[Voice] Pausing recognition (app backgrounded)')
          try {
            recognitionRef.current.stop()
          } catch {
            // Ignore errors when stopping
          }
        }
      } else if (document.visibilityState === 'visible') {
        // Resume recognition when app is focused
        if (shouldRestartRef.current && recognitionRef.current) {
          console.log('[Voice] Resuming recognition (app focused)')
          setTimeout(() => {
            if (shouldRestartRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start()
              } catch (err) {
                console.warn('[Voice] Failed to resume recognition:', err)
              }
            }
          }, 100)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // Ignore errors during cleanup
        }
        recognitionRef.current = null
      }
    }
  }, [])

  return {
    start,
    stop,
    isSupported: checkSupport()
  }
}
