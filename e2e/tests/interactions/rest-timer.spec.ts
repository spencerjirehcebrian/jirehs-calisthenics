import { test, expect } from '@playwright/test';
import { ActiveWorkoutPage } from '../../page-objects/active-workout.page';
import { navigateToActiveWorkout } from '../../helpers/navigation-helpers';
import { selectors } from '../../helpers/selectors';

test.describe('Rest Timer Interactions', () => {
  let activeWorkoutPage: ActiveWorkoutPage;

  test.beforeEach(async ({ page }) => {
    // Navigate to workout and complete first exercise to get to rest
    await navigateToActiveWorkout(page, 'Workout A');
    activeWorkoutPage = new ActiveWorkoutPage(page);

    // Complete the first exercise (rep-based) to get to rest
    await activeWorkoutPage.tapRepCounterTimes(5);
    await activeWorkoutPage.doneStartRestButton.click();
  });

  test('should show rest timer after completing exercise', async () => {
    await expect(activeWorkoutPage.restLabel).toBeVisible();
  });

  test('should display countdown timer', async ({ page }) => {
    // Timer should show in MM:SS or SS format
    const timerDisplay = page.locator('text=/\\d+:\\d{2}|\\d+ seconds/');
    await expect(timerDisplay.first()).toBeVisible();
  });

  test('should show next exercise name during rest', async ({ page }) => {
    // Look for "Next:" or next exercise info
    const nextExercise = page.locator('text=/Next:|Squats|exercise/i');
    await expect(nextExercise.first()).toBeVisible();
  });

  test('should allow tap to continue from rest', async () => {
    // Tap to continue area should be available
    await expect(activeWorkoutPage.tapToContinueArea).toBeVisible();

    // Tap to continue
    await activeWorkoutPage.tapToContinue();

    // Should no longer be in rest state
    await expect(activeWorkoutPage.restLabel).not.toBeVisible();
  });

  test('should allow Enter key to continue from rest', async ({ page }) => {
    await activeWorkoutPage.tapToContinueArea.focus();
    await page.keyboard.press('Enter');

    // Should no longer be in rest state
    await expect(activeWorkoutPage.restLabel).not.toBeVisible();
  });

  test('should not show over-resting alert initially', async ({ page }) => {
    // The over-resting alert should NOT be visible when rest just started
    // (timer hasn't gone negative yet - it starts at 90 seconds)
    // Look for the alert text which should NOT exist initially
    const overRestingText = page.locator('text="Over-resting"');
    await expect(overRestingText).not.toBeVisible();
  });

  test('should have hold-to-skip available during rest', async ({ page }) => {
    const holdButton = page.locator(selectors.interactions.holdToSkip);
    await expect(holdButton).toBeVisible();
  });

  test('should show accessible label for rest area', async () => {
    const label = await activeWorkoutPage.tapToContinueArea.getAttribute('aria-label');
    expect(label).toContain('continue');
  });
});
