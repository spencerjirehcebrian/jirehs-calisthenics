import { describe, it, expect } from 'vitest'
import { parseTranscript, getContextCommands, getCommandExamples } from './voiceCommands'

describe('voiceCommands', () => {
  describe('parseTranscript', () => {
    describe('number recognition', () => {
      it('should recognize number words', () => {
        expect(parseTranscript('one', 'repCounter')?.type).toBe('number')
        expect(parseTranscript('one', 'repCounter')?.value).toBe(1)
        expect(parseTranscript('five', 'repCounter')?.value).toBe(5)
        expect(parseTranscript('ten', 'repCounter')?.value).toBe(10)
        expect(parseTranscript('twenty', 'repCounter')?.value).toBe(20)
      })

      it('should recognize digit strings', () => {
        expect(parseTranscript('5', 'repCounter')?.value).toBe(5)
        expect(parseTranscript('15', 'repCounter')?.value).toBe(15)
      })

      it('should handle common mishearings', () => {
        expect(parseTranscript('won', 'repCounter')?.value).toBe(1)
        expect(parseTranscript('to', 'repCounter')?.value).toBe(2)
        expect(parseTranscript('too', 'repCounter')?.value).toBe(2)
        expect(parseTranscript('for', 'repCounter')?.value).toBe(4)
        expect(parseTranscript('ate', 'repCounter')?.value).toBe(8)
      })

      it('should not recognize numbers outside valid context', () => {
        // Numbers are not valid in rest context
        expect(parseTranscript('five', 'rest')).toBeNull()
      })
    })

    describe('command recognition', () => {
      it('should recognize done command and aliases', () => {
        expect(parseTranscript('done', 'repCounter')?.type).toBe('done')
        expect(parseTranscript('finished', 'repCounter')?.type).toBe('done')
        expect(parseTranscript('complete', 'repCounter')?.type).toBe('done')
      })

      it('should recognize undo command and aliases', () => {
        expect(parseTranscript('undo', 'repCounter')?.type).toBe('undo')
        expect(parseTranscript('minus', 'repCounter')?.type).toBe('undo')
        expect(parseTranscript('back', 'repCounter')?.type).toBe('undo')
        expect(parseTranscript('oops', 'repCounter')?.type).toBe('undo')
      })

      it('should recognize ready command and aliases', () => {
        expect(parseTranscript('ready', 'timedHold')?.type).toBe('ready')
        expect(parseTranscript('start', 'timedHold')?.type).toBe('ready')
        expect(parseTranscript('go', 'timedHold')?.type).toBe('ready')
      })

      it('should recognize stop command and aliases', () => {
        expect(parseTranscript('stop', 'timedHold')?.type).toBe('stop')
        expect(parseTranscript('cancel', 'timedHold')?.type).toBe('stop')
        expect(parseTranscript('abort', 'timedHold')?.type).toBe('stop')
      })

      it('should recognize skip command and aliases', () => {
        expect(parseTranscript('skip', 'rest')?.type).toBe('skip')
        expect(parseTranscript('next', 'rest')?.type).toBe('skip')
      })

      it('should recognize extend command and aliases', () => {
        expect(parseTranscript('more time', 'rest')?.type).toBe('extend')
        expect(parseTranscript('extend', 'rest')?.type).toBe('extend')
        expect(parseTranscript('wait', 'rest')?.type).toBe('extend')
      })
    })

    describe('context filtering', () => {
      it('should filter commands by context', () => {
        // undo is valid in repCounter but not in rest
        expect(parseTranscript('undo', 'repCounter')?.type).toBe('undo')
        expect(parseTranscript('undo', 'rest')).toBeNull()

        // skip is valid in rest but not in timedHold
        expect(parseTranscript('skip', 'rest')?.type).toBe('skip')
        expect(parseTranscript('skip', 'timedHold')).toBeNull()
      })
    })

    describe('case insensitivity', () => {
      it('should handle uppercase input', () => {
        expect(parseTranscript('DONE', 'repCounter')?.type).toBe('done')
        expect(parseTranscript('ONE', 'repCounter')?.value).toBe(1)
      })

      it('should handle mixed case input', () => {
        expect(parseTranscript('Ready', 'timedHold')?.type).toBe('ready')
      })
    })

    it('should return null for unrecognized transcript', () => {
      expect(parseTranscript('hello world', 'repCounter')).toBeNull()
      expect(parseTranscript('random words', 'rest')).toBeNull()
    })

    it('should return null for empty transcript', () => {
      expect(parseTranscript('', 'repCounter')).toBeNull()
      expect(parseTranscript('   ', 'repCounter')).toBeNull()
    })
  })

  describe('getContextCommands', () => {
    it('should return valid commands for repCounter', () => {
      const commands = getContextCommands('repCounter')
      expect(commands).toContain('number')
      expect(commands).toContain('done')
      expect(commands).toContain('undo')
      expect(commands).not.toContain('skip')
    })

    it('should return valid commands for timedHold', () => {
      const commands = getContextCommands('timedHold')
      expect(commands).toContain('ready')
      expect(commands).toContain('stop')
      expect(commands).not.toContain('number')
    })

    it('should return valid commands for rest', () => {
      const commands = getContextCommands('rest')
      expect(commands).toContain('skip')
      expect(commands).toContain('extend')
      expect(commands).not.toContain('done')
    })

    it('should return valid commands for guidedMovement', () => {
      const commands = getContextCommands('guidedMovement')
      expect(commands).toContain('number')
      expect(commands).toContain('done')
      expect(commands).toContain('skip')
      expect(commands).toContain('ready')
    })
  })

  describe('getCommandExamples', () => {
    it('should return examples for number command', () => {
      const examples = getCommandExamples('number')
      expect(examples.length).toBeGreaterThan(0)
      expect(examples[0]).toContain('"one"')
    })

    it('should return examples for done command', () => {
      const examples = getCommandExamples('done')
      expect(examples.length).toBeGreaterThan(0)
      expect(examples).toContain('"done"')
    })
  })
})
