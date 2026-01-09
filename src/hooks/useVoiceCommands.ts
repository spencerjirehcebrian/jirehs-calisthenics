import { useEffect, useRef, useCallback } from 'react'
import { useVoiceStore } from '@/stores'
import { useVoiceRecognition } from './useVoiceRecognition'
import {
  parseTranscript,
  type CommandContext,
  type VoiceCommandType
} from '@/utils/voiceCommands'

export interface VoiceCommandHandlers {
  onNumber?: (n: number) => void
  onDone?: () => void
  onUndo?: () => void
  onReady?: () => void
  onStop?: () => void
  onSkip?: () => void
  onExtend?: () => void
}

export interface UseVoiceCommandsOptions {
  context: CommandContext
  handlers: VoiceCommandHandlers
  enabled?: boolean
}

/**
 * High-level hook for screens to receive voice commands.
 * Handles recognition lifecycle and command dispatching based on context.
 */
export function useVoiceCommands(options: UseVoiceCommandsOptions): void {
  const { context, handlers, enabled = true } = options

  const { enabled: voiceEnabled, isSupported, setLastTranscript } = useVoiceStore()

  // Track last processed transcript to avoid duplicates
  const lastProcessedRef = useRef<string>('')
  const handlersRef = useRef(handlers)

  // Keep handlers ref up to date
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  // Dispatch command to appropriate handler
  const dispatchCommand = useCallback(
    (type: VoiceCommandType, value?: number) => {
      const currentHandlers = handlersRef.current

      console.log(`[Voice] Dispatching command: ${type}`, value !== undefined ? `(${value})` : '')

      switch (type) {
        case 'number':
          currentHandlers.onNumber?.(value!)
          break
        case 'done':
          currentHandlers.onDone?.()
          break
        case 'undo':
          currentHandlers.onUndo?.()
          break
        case 'ready':
          currentHandlers.onReady?.()
          break
        case 'stop':
          currentHandlers.onStop?.()
          break
        case 'skip':
          currentHandlers.onSkip?.()
          break
        case 'extend':
          currentHandlers.onExtend?.()
          break
      }
    },
    []
  )

  // Handle recognition results
  const handleResult = useCallback(
    (transcript: string, isFinal: boolean, confidence: number) => {
      const normalizedTranscript = transcript.toLowerCase().trim()

      // Update store with last transcript for debugging
      setLastTranscript(transcript)

      // Only process final results to avoid duplicate actions
      if (!isFinal) {
        return
      }

      // Skip if we already processed this transcript
      if (normalizedTranscript === lastProcessedRef.current) {
        return
      }

      // Skip low confidence results
      if (confidence < 0.5) {
        console.log(
          `[Voice] Skipping low confidence result: "${transcript}" (${confidence})`
        )
        return
      }

      // Try to parse the transcript into a command
      const command = parseTranscript(transcript, context)

      if (command) {
        console.log(
          `[Voice] Recognized: "${transcript}" -> ${command.type}`,
          command.value !== undefined ? `(${command.value})` : ''
        )
        lastProcessedRef.current = normalizedTranscript
        dispatchCommand(command.type, command.value)
      }
    },
    [context, dispatchCommand, setLastTranscript]
  )

  // Handle recognition errors
  const handleError = useCallback((error: string) => {
    console.warn(`[Voice] Error: ${error}`)
  }, [])

  // Set up voice recognition
  const { start, stop } = useVoiceRecognition({
    onResult: handleResult,
    onError: handleError
  })

  // Start/stop recognition based on enabled state
  useEffect(() => {
    const shouldListen = enabled && voiceEnabled && isSupported

    if (shouldListen) {
      console.log(`[Voice] Starting recognition for context: ${context}`)
      start()
    } else {
      stop()
    }

    return () => {
      stop()
    }
  }, [enabled, voiceEnabled, isSupported, context, start, stop])

  // Reset last processed transcript when context changes
  useEffect(() => {
    lastProcessedRef.current = ''
  }, [context])
}

export type { CommandContext } from '@/utils/voiceCommands'
