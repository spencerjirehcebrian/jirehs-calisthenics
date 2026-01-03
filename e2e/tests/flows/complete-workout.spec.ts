import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/home.page';
import { WorkoutSelectionPage } from '../../page-objects/workout-selection.page';
import { ActiveWorkoutPage } from '../../page-objects/active-workout.page';
import { SessionSummaryPage } from '../../page-objects/session-summary.page';
import { selectors } from '../../helpers/selectors';

test.describe('Complete Workout Flow', () => {
  test('should complete a quick workout flow (skip warmup and cooldown)', async ({ page }) => {
    const homePage = new HomePage(page);
    const workoutPage = new WorkoutSelectionPage(page);
    const activeWorkoutPage = new ActiveWorkoutPage(page);
    const summaryPage = new SessionSummaryPage(page);

    // Start from home
    await homePage.goto();
    await homePage.navigateToWorkoutSelection();

    // Select workout A
    await workoutPage.selectWorkout('A');

    // Skip warmup
    await page.locator(selectors.app.skipWarmupButton).click();

    // Should be in active workout
    await expect(activeWorkoutPage.exerciseName).toBeVisible();
    const exerciseName = await activeWorkoutPage.exerciseName.textContent();
    expect(exerciseName?.length).toBeGreaterThan(0);

    // Check we're not in rest state initially
    expect(await activeWorkoutPage.isInRestState()).toBe(false);

    // If it's a rep exercise, do some reps
    if (await activeWorkoutPage.repCounter.isVisible()) {
      await activeWorkoutPage.tapRepCounterTimes(5);
      expect(await activeWorkoutPage.getCurrentReps()).toBe(5);

      // Complete the exercise
      await activeWorkoutPage.doneStartRestButton.click();

      // Should now be in rest state
      expect(await activeWorkoutPage.isInRestState()).toBe(true);
    }

    // Skip to cooldown
    await activeWorkoutPage.skipToCooldown();

    // Skip cooldown
    await page.locator(selectors.app.skipCooldownButton).click();

    // Should be on summary
    await summaryPage.expectLoaded();

    // Verify warmup and cooldown show as skipped
    expect(await summaryPage.isWarmupSkipped()).toBe(true);
    expect(await summaryPage.isCooldownSkipped()).toBe(true);

    // Click Done to return home
    await summaryPage.clickDone();

    // Should be back on home
    await homePage.expectLoaded();
  });

  test('should track workout progress through pair and set indicators', async ({ page }) => {
    const homePage = new HomePage(page);
    const workoutPage = new WorkoutSelectionPage(page);
    const activeWorkoutPage = new ActiveWorkoutPage(page);

    // Navigate to active workout
    await homePage.goto();
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('A');
    await page.locator(selectors.app.skipWarmupButton).click();

    // Should show progress indicator
    // Look for pattern like "Pair 1/3 - Set 1/3"
    const progressText = await page.locator('text=/Pair \\d+\\/\\d+/').textContent();
    expect(progressText).toMatch(/Pair \d+\/\d+/);
  });

  test('should allow selecting different workouts', async ({ page }) => {
    const homePage = new HomePage(page);
    const workoutPage = new WorkoutSelectionPage(page);

    // Test Workout B
    await homePage.goto();
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('B');
    await page.locator(selectors.app.skipWarmupButton).click();

    // Verify we're in active workout (exercise name visible)
    await expect(page.locator('h1').first()).toBeVisible();

    // Test Workout C - go back to home first
    await page.goto('/');
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('C');
    await page.locator(selectors.app.skipWarmupButton).click();

    // Verify we're in active workout
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should show session timer during workout', async ({ page }) => {
    const homePage = new HomePage(page);
    const workoutPage = new WorkoutSelectionPage(page);

    await homePage.goto();
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('A');
    await page.locator(selectors.app.skipWarmupButton).click();

    // Session timer should be visible - look for the timer container with aria-live
    // The timer shows "0:XX" format initially
    const timerElement = page.locator('[aria-live="polite"]').first();
    await expect(timerElement).toBeVisible();
  });
});
