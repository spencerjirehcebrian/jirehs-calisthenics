import { test, expect } from '@playwright/test';
import { ActiveWorkoutPage } from '../../page-objects/active-workout.page';
import { navigateToActiveWorkout } from '../../helpers/navigation-helpers';
import { selectors } from '../../helpers/selectors';

test.describe('Rep Counter Interactions', () => {
  let activeWorkoutPage: ActiveWorkoutPage;

  test.beforeEach(async ({ page }) => {
    await navigateToActiveWorkout(page, 'Workout A');
    activeWorkoutPage = new ActiveWorkoutPage(page);
  });

  test('should display rep counter for rep-based exercises', async ({ page }) => {
    // First exercise in Workout A is Push-ups (rep-based)
    await expect(activeWorkoutPage.repCounter).toBeVisible();
  });

  test('should increment rep count on click', async ({ page }) => {
    const initialReps = await activeWorkoutPage.getCurrentReps();
    expect(initialReps).toBe(0);

    await activeWorkoutPage.tapRepCounter();
    expect(await activeWorkoutPage.getCurrentReps()).toBe(1);

    await activeWorkoutPage.tapRepCounter();
    expect(await activeWorkoutPage.getCurrentReps()).toBe(2);
  });

  test('should increment rep count on Enter key press', async ({ page }) => {
    // Click first to ensure focus
    await activeWorkoutPage.repCounter.click();

    // Use keyboard after clicking
    await page.keyboard.press('Enter');
    expect(await activeWorkoutPage.getCurrentReps()).toBe(2); // 1 from click, 1 from Enter

    await page.keyboard.press('Enter');
    expect(await activeWorkoutPage.getCurrentReps()).toBe(3);
  });

  test('should show target reps as reference', async ({ page }) => {
    // Look for target reps text (e.g., "Max reps" or "8-12 reps")
    const targetText = page.locator('text=/reps|Max/i');
    await expect(targetText.first()).toBeVisible();
  });

  test('should count multiple rapid taps correctly', async ({ page }) => {
    await activeWorkoutPage.tapRepCounterTimes(10);
    expect(await activeWorkoutPage.getCurrentReps()).toBe(10);
  });

  test('should have correct aria-label for accessibility', async ({ page }) => {
    await activeWorkoutPage.tapRepCounterTimes(5);

    const label = await activeWorkoutPage.repCounter.getAttribute('aria-label');
    expect(label).toContain('Current reps: 5');
    expect(label).toContain('Tap or press Enter');
  });

  test('should show Done button after counting reps', async ({ page }) => {
    await activeWorkoutPage.tapRepCounterTimes(3);
    await expect(activeWorkoutPage.doneStartRestButton).toBeVisible();
  });
});
