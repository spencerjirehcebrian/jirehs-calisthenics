/**
 * Centralized selector strategies for E2E tests.
 * Since no data-testid attributes exist, we use role-based and text-based selectors.
 */

export const selectors = {
  // Generic helpers
  button: (text: string) => `role=button[name="${text}"]`,
  buttonContains: (text: string) => `role=button[name*="${text}"]`,
  heading: (text: string) => `role=heading[name="${text}"]`,
  link: (text: string) => `role=link[name="${text}"]`,
  checkbox: (text: string) => `role=checkbox[name*="${text}"]`,
  radio: (text: string) => `role=radio[name="${text}"]`,
  ariaLabel: (label: string) => `[aria-label="${label}"]`,
  ariaLabelContains: (text: string) => `[aria-label*="${text}"]`,
  text: (text: string) => `text="${text}"`,
  textContains: (text: string) => `text=${text}`,

  // App navigation buttons
  app: {
    title: 'role=heading[name="Jireh\'s Calisthenics"]',
    startWorkoutButton: 'role=button[name="Start Workout"]',
    exerciseLibraryButton: 'role=button[name="Exercise Library"]',
    settingsButton: 'role=button[name="Settings"]',
    backButton: 'role=button[name="Back"]',
    doneButton: 'role=button[name="Done"]',
    skipWarmupButton: 'role=button[name="Skip Warm-up"]',
    skipCooldownButton: 'role=button[name="Skip Cool-down"]',
    skipToCooldownButton: 'role=button[name="Skip to Cool-down"]',
    doneStartRestButton: 'role=button[name="Done - Start Rest"]',
  },

  // Workout selection
  workout: {
    workoutA: 'button:has-text("Workout A")',
    workoutB: 'button:has-text("Workout B")',
    workoutC: 'button:has-text("Workout C")',
    chooseWorkoutHeading: 'text="Choose Your Workout"',
  },

  // Interaction components
  interactions: {
    repCounter: '[aria-label*="Current reps"]',
    tapToContinue: '[aria-label="Tap or press Enter to continue to next exercise"]',
    tapToStart: '[aria-label="Tap or press Enter to start timer"]',
    holdToSkip: '[aria-label*="Hold for"]',
    holdToSkipKeepHolding: '[aria-label*="Skipping"]',
  },

  // Timer displays
  timers: {
    restLabel: 'text="Rest"',
    overResting: '[role="alert"]:has-text("Over-resting")',
    holdLabel: 'text="Hold..."',
    done: 'text="Done!"',
  },

  // Session summary
  summary: {
    workoutComplete: 'text="Workout Complete"',
    totalDuration: 'text="Total Duration"',
    skipped: 'text="Skipped"',
    completed: 'text="Completed"',
  },

  // Settings page
  settings: {
    heading: 'role=heading[name="Settings"]',
    deloadCheckbox: 'label:has-text("Deload Week") input[type="checkbox"]',
    holdCountdown2: 'label:has-text("2 seconds")',
    holdCountdown3: 'label:has-text("3 seconds")',
    audioCueRestCountdown: 'label:has-text("Rest timer countdown (10s warning)")',
    audioCueRestComplete: 'label:has-text("Rest timer complete")',
    audioCueSetComplete: 'label:has-text("Set complete")',
  },

  // Exercise library
  library: {
    heading: 'role=heading[name="Exercise Library"]',
    categoryAll: 'role=button[name="All"]',
    categoryPush: 'role=button[name="push"]',
    categoryPull: 'role=button[name="pull"]',
    categoryCore: 'role=button[name="core"]',
    categoryLegs: 'role=button[name="legs"]',
    practiceButton: 'role=button[name="Practice This Exercise"]',
  },

  // Progress indicators
  progress: {
    pairSet: /Pair \d+\/\d+ - Set \d+\/\d+/,
    deloadBadge: 'text="Deload"',
    stepProgress: /\d+ of \d+/,
  },
};
