import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/home.page';
import { WorkoutSelectionPage } from '../../page-objects/workout-selection.page';
import { ActiveWorkoutPage } from '../../page-objects/active-workout.page';
import { SessionSummaryPage } from '../../page-objects/session-summary.page';
import { selectors } from '../../helpers/selectors';

test.describe('Warmup Skip Flow', () => {
  test('should skip warmup and go directly to strength phase', async ({ page }) => {
    const homePage = new HomePage(page);
    const workoutPage = new WorkoutSelectionPage(page);

    await homePage.goto();
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('A');

    // Should see warmup screen with skip button
    await expect(page.locator(selectors.app.skipWarmupButton)).toBeVisible();

    // Skip warmup
    await page.locator(selectors.app.skipWarmupButton).click();

    // Should now be in active workout (showing first exercise)
    const exerciseName = page.locator('h1').first();
    await expect(exerciseName).toBeVisible();

    // Should NOT show warmup-related content
    await expect(page.locator(selectors.app.skipWarmupButton)).not.toBeVisible();
  });

  test('should record warmup as skipped in session summary', async ({ page }) => {
    const homePage = new HomePage(page);
    const workoutPage = new WorkoutSelectionPage(page);
    const activeWorkoutPage = new ActiveWorkoutPage(page);
    const summaryPage = new SessionSummaryPage(page);

    // Quick path through workout
    await homePage.goto();
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('A');

    // Skip warmup
    await page.locator(selectors.app.skipWarmupButton).click();

    // Skip to cooldown
    await activeWorkoutPage.skipToCooldown();

    // Skip cooldown
    await page.locator(selectors.app.skipCooldownButton).click();

    // Check summary
    await summaryPage.expectLoaded();
    expect(await summaryPage.isWarmupSkipped()).toBe(true);
  });

  test('should allow starting warmup flow normally', async ({ page }) => {
    const homePage = new HomePage(page);
    const workoutPage = new WorkoutSelectionPage(page);

    await homePage.goto();
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('A');

    // Should see warmup content (phase indicator or movement name)
    // Look for warmup-related text like phase name or first movement
    const warmupContent = page.locator('text=/Phase|Warm-up|jumping jacks|Heart Rate/i').first();
    await expect(warmupContent).toBeVisible();

    // Skip button should still be available
    await expect(page.locator(selectors.app.skipWarmupButton)).toBeVisible();
  });

  test('should show warmup progress indicator', async ({ page }) => {
    const homePage = new HomePage(page);
    const workoutPage = new WorkoutSelectionPage(page);

    await homePage.goto();
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('A');

    // Look for progress indicator (e.g., "1 of 20")
    const progressIndicator = page.locator('text=/\\d+ of \\d+/');
    await expect(progressIndicator).toBeVisible();
  });
});
