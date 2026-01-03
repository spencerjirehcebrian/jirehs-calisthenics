import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/home.page';
import { WorkoutSelectionPage } from '../../page-objects/workout-selection.page';
import { selectors } from '../../helpers/selectors';

test.describe('Navigation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should navigate to workout selection', async ({ page }) => {
    await homePage.navigateToWorkoutSelection();
    const workoutPage = new WorkoutSelectionPage(page);
    await workoutPage.expectLoaded();
  });

  test('should navigate to settings', async ({ page }) => {
    await homePage.navigateToSettings();
    await expect(page.locator(selectors.settings.heading)).toBeVisible();
  });

  test('should navigate to exercise library', async ({ page }) => {
    await homePage.navigateToExerciseLibrary();
    await expect(page.locator(selectors.library.heading)).toBeVisible();
  });

  test('should navigate back from settings to home', async ({ page }) => {
    await homePage.navigateToSettings();
    await page.locator(selectors.app.backButton).click();
    await homePage.expectLoaded();
  });

  test('should navigate back from exercise library to home', async ({ page }) => {
    await homePage.navigateToExerciseLibrary();
    await page.locator(selectors.app.backButton).click();
    await homePage.expectLoaded();
  });

  test('should show all three workout options', async ({ page }) => {
    await homePage.navigateToWorkoutSelection();
    const workoutPage = new WorkoutSelectionPage(page);
    await expect(workoutPage.workoutAButton).toBeVisible();
    await expect(workoutPage.workoutBButton).toBeVisible();
    await expect(workoutPage.workoutCButton).toBeVisible();
  });
});
