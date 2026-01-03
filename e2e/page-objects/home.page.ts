import { Page, Locator, expect } from '@playwright/test';
import { selectors } from '../helpers/selectors';

export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly startWorkoutButton: Locator;
  readonly exerciseLibraryButton: Locator;
  readonly settingsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(selectors.app.title);
    this.startWorkoutButton = page.locator(selectors.app.startWorkoutButton);
    this.exerciseLibraryButton = page.locator(selectors.app.exerciseLibraryButton);
    this.settingsButton = page.locator(selectors.app.settingsButton);
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectLoaded() {
    await expect(this.title).toBeVisible();
    await expect(this.startWorkoutButton).toBeVisible();
    await expect(this.exerciseLibraryButton).toBeVisible();
    await expect(this.settingsButton).toBeVisible();
  }

  async navigateToWorkoutSelection() {
    await this.startWorkoutButton.click();
    await this.page.waitForSelector(selectors.workout.chooseWorkoutHeading);
  }

  async navigateToExerciseLibrary() {
    await this.exerciseLibraryButton.click();
    await this.page.waitForSelector(selectors.library.heading);
  }

  async navigateToSettings() {
    await this.settingsButton.click();
    await this.page.waitForSelector(selectors.settings.heading);
  }
}
