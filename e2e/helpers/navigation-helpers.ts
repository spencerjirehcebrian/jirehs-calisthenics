import { Page } from '@playwright/test';
import { selectors } from './selectors';

/**
 * Navigate from home to active workout, skipping warmup.
 * Useful for tests that need to start in the middle of a workout.
 */
export async function navigateToActiveWorkout(
  page: Page,
  workout: 'Workout A' | 'Workout B' | 'Workout C' = 'Workout A'
) {
  await page.goto('/');
  await page.locator(selectors.app.startWorkoutButton).click();
  await page.locator(`button:has-text("${workout}")`).click();
  await page.locator(selectors.app.skipWarmupButton).click();
  // Wait for exercise to load
  await page.waitForSelector('h1');
}

/**
 * Navigate from home to settings page.
 */
export async function navigateToSettings(page: Page) {
  await page.goto('/');
  await page.locator(selectors.app.settingsButton).click();
  await page.waitForSelector(selectors.settings.heading);
}

/**
 * Navigate from home to exercise library.
 */
export async function navigateToExerciseLibrary(page: Page) {
  await page.goto('/');
  await page.locator(selectors.app.exerciseLibraryButton).click();
  await page.waitForSelector(selectors.library.heading);
}

/**
 * Complete current exercise by tapping reps and clicking Done.
 * Only works for rep-based exercises.
 */
export async function completeRepExercise(page: Page, reps: number = 5) {
  const repCounter = page.locator(selectors.interactions.repCounter);
  for (let i = 0; i < reps; i++) {
    await repCounter.click();
    await page.waitForTimeout(50);
  }
  await page.locator(selectors.app.doneStartRestButton).click();
}

/**
 * Skip current activity using hold-to-skip (2 second hold).
 */
export async function holdToSkip(page: Page, duration: number = 2100) {
  const holdButton = page.locator(selectors.interactions.holdToSkip);
  await holdButton.dispatchEvent('pointerdown');
  await page.waitForTimeout(duration);
  // Release if still visible (may have auto-completed)
  if (await holdButton.isVisible()) {
    await holdButton.dispatchEvent('pointerup');
  }
}

/**
 * Continue from rest timer by tapping.
 */
export async function continueFromRest(page: Page) {
  await page.locator(selectors.interactions.tapToContinue).click();
}

/**
 * Clear all app state from localStorage.
 */
export async function clearAppState(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Inject settings into localStorage before navigating.
 */
export async function injectSettings(
  page: Page,
  settings: {
    deloadMode?: boolean;
    holdCountdown?: 2 | 3;
  }
) {
  await page.addInitScript((s) => {
    const storageKey = 'jirehs-calisthenics-settings';
    const currentState = JSON.parse(localStorage.getItem(storageKey) || '{"state":{}}');
    const newState = {
      ...currentState,
      state: {
        ...currentState.state,
        ...(s.deloadMode !== undefined && { deloadMode: s.deloadMode }),
        ...(s.holdCountdown !== undefined && { holdCountdown: s.holdCountdown }),
      },
    };
    localStorage.setItem(storageKey, JSON.stringify(newState));
  }, settings);
}
