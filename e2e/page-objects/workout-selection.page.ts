import { Page, Locator, expect } from '@playwright/test';
import { selectors } from '../helpers/selectors';

export class WorkoutSelectionPage {
  readonly page: Page;
  readonly workoutAButton: Locator;
  readonly workoutBButton: Locator;
  readonly workoutCButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.workoutAButton = page.locator(selectors.workout.workoutA);
    this.workoutBButton = page.locator(selectors.workout.workoutB);
    this.workoutCButton = page.locator(selectors.workout.workoutC);
  }

  async expectLoaded() {
    await expect(this.page.locator(selectors.workout.chooseWorkoutHeading)).toBeVisible();
    await expect(this.workoutAButton).toBeVisible();
    await expect(this.workoutBButton).toBeVisible();
    await expect(this.workoutCButton).toBeVisible();
  }

  async selectWorkout(workout: 'A' | 'B' | 'C') {
    const button = workout === 'A' ? this.workoutAButton : workout === 'B' ? this.workoutBButton : this.workoutCButton;
    await button.click();
  }
}
