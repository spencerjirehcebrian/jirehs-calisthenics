import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/home.page';
import { SettingsPage } from '../../page-objects/settings.page';
import { WorkoutSelectionPage } from '../../page-objects/workout-selection.page';
import { ActiveWorkoutPage } from '../../page-objects/active-workout.page';
import { selectors } from '../../helpers/selectors';
import { navigateToActiveWorkout } from '../../helpers/navigation-helpers';

test.describe('Deload Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show deload badge in workout when enabled', async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);
    const workoutPage = new WorkoutSelectionPage(page);
    const activeWorkoutPage = new ActiveWorkoutPage(page);

    // Enable deload mode in settings
    await homePage.goto();
    await homePage.navigateToSettings();
    await settingsPage.toggleDeloadMode();
    expect(await settingsPage.isDeloadModeEnabled()).toBe(true);

    // Navigate to workout
    await settingsPage.goBack();
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('A');
    await page.locator(selectors.app.skipWarmupButton).click();

    // Should show deload indicator
    await expect(activeWorkoutPage.deloadBadge).toBeVisible();
  });

  test('should NOT show deload badge when deload mode is off', async ({ page }) => {
    const activeWorkoutPage = new ActiveWorkoutPage(page);

    // Start workout without enabling deload (default off)
    await navigateToActiveWorkout(page, 'Workout A');

    // Should NOT show deload indicator
    await expect(activeWorkoutPage.deloadBadge).not.toBeVisible();
  });

  test('should show 2 sets in progress indicator when deload enabled', async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);
    const workoutPage = new WorkoutSelectionPage(page);

    // Enable deload mode
    await homePage.goto();
    await homePage.navigateToSettings();
    await settingsPage.toggleDeloadMode();
    await settingsPage.goBack();

    // Start workout
    await homePage.navigateToWorkoutSelection();
    await workoutPage.selectWorkout('A');
    await page.locator(selectors.app.skipWarmupButton).click();

    // Progress should show "Set X/2" (deload = 2 sets)
    const progressText = await page.locator('text=/Set \\d+\\/2/').textContent();
    expect(progressText).toMatch(/Set \d+\/2/);
  });

  test('should show 3 sets in progress indicator when deload disabled', async ({ page }) => {
    // Start workout (deload off by default)
    await navigateToActiveWorkout(page, 'Workout A');

    // Progress should show "Set X/3" (normal = 3 sets)
    const progressText = await page.locator('text=/Set \\d+\\/3/').textContent();
    expect(progressText).toMatch(/Set \d+\/3/);
  });

  test('should toggle deload mode on and off', async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    await homePage.goto();
    await homePage.navigateToSettings();

    // Initially off
    expect(await settingsPage.isDeloadModeEnabled()).toBe(false);

    // Toggle on
    await settingsPage.toggleDeloadMode();
    expect(await settingsPage.isDeloadModeEnabled()).toBe(true);

    // Toggle off
    await settingsPage.toggleDeloadMode();
    expect(await settingsPage.isDeloadModeEnabled()).toBe(false);
  });
});
