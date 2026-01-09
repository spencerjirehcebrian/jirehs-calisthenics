export type VoiceCommandType =
  | 'number'
  | 'done'
  | 'undo'
  | 'ready'
  | 'stop'
  | 'skip'
  | 'extend'

export interface ParsedCommand {
  type: VoiceCommandType
  value?: number
  confidence: number
  rawTranscript: string
}

// Number words 1-20 with common mishearings
const NUMBER_WORDS: Record<string, number> = {
  // Standard words
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  // Common mishearings
  won: 1,
  to: 2,
  too: 2,
  free: 3,
  tree: 3,
  for: 4,
  fore: 4,
  sex: 6,
  ate: 8,
  // Digit strings
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
  '13': 13,
  '14': 14,
  '15': 15,
  '16': 16,
  '17': 17,
  '18': 18,
  '19': 19,
  '20': 20
}

// Command aliases grouped by command type
const COMMAND_ALIASES: Record<Exclude<VoiceCommandType, 'number'>, string[]> = {
  done: ['done', 'finished', 'complete', 'finish'],
  undo: ['undo', 'minus one', 'minus', 'back', 'oops'],
  ready: ['ready', 'start', 'go', 'begin'],
  stop: ['stop', 'cancel', 'abort', 'quit'],
  skip: ['skip', 'next'],
  extend: ['more time', 'extend', 'wait', 'more']
}

// Commands valid in each context
export type CommandContext =
  | 'repCounter'
  | 'timedHold'
  | 'rest'
  | 'guidedMovement'

const CONTEXT_COMMANDS: Record<CommandContext, VoiceCommandType[]> = {
  repCounter: ['number', 'done', 'undo'],
  timedHold: ['ready', 'stop'],
  rest: ['skip', 'extend'],
  guidedMovement: ['number', 'done', 'skip', 'ready']
}

/**
 * Check if a transcript matches any of the given aliases
 */
function matchesAliases(transcript: string, aliases: string[]): boolean {
  const normalized = transcript.toLowerCase().trim()
  return aliases.some(
    (alias) => normalized === alias || normalized.includes(alias)
  )
}

/**
 * Try to parse a number from the transcript
 */
function parseNumber(transcript: string): number | null {
  const normalized = transcript.toLowerCase().trim()
  const words = normalized.split(/\s+/)

  // Check each word for a number match
  for (const word of words) {
    if (NUMBER_WORDS[word] !== undefined) {
      return NUMBER_WORDS[word]
    }
  }

  // Also try parsing the whole transcript as a number
  const num = parseInt(normalized, 10)
  if (!isNaN(num) && num >= 1 && num <= 20) {
    return num
  }

  return null
}

/**
 * Parse a transcript into a command
 */
export function parseTranscript(
  transcript: string,
  context: CommandContext
): ParsedCommand | null {
  const normalized = transcript.toLowerCase().trim()
  if (!normalized) return null

  const validCommands = CONTEXT_COMMANDS[context]

  // Try to match number command first (most common during exercise)
  if (validCommands.includes('number')) {
    const number = parseNumber(normalized)
    if (number !== null) {
      return {
        type: 'number',
        value: number,
        confidence: 1,
        rawTranscript: transcript
      }
    }
  }

  // Try to match other commands
  for (const [command, aliases] of Object.entries(COMMAND_ALIASES)) {
    const commandType = command as Exclude<VoiceCommandType, 'number'>
    if (validCommands.includes(commandType) && matchesAliases(normalized, aliases)) {
      return {
        type: commandType,
        confidence: 1,
        rawTranscript: transcript
      }
    }
  }

  return null
}

/**
 * Get the list of valid commands for a context (for UI display)
 */
export function getContextCommands(context: CommandContext): VoiceCommandType[] {
  return CONTEXT_COMMANDS[context]
}

/**
 * Get example phrases for a command type (for UI display)
 */
export function getCommandExamples(type: VoiceCommandType): string[] {
  if (type === 'number') {
    return ['"one"', '"two"', '"three"', '...', '"twenty"']
  }
  return COMMAND_ALIASES[type].slice(0, 3).map((alias) => `"${alias}"`)
}
