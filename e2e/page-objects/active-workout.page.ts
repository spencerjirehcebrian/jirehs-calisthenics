import { Page, Locator } from '@playwright/test';
import { selectors } from '../helpers/selectors';

export class ActiveWorkoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Exercise name (first h1)
  get exerciseName(): Locator {
    return this.page.locator('h1').first();
  }

  // Rep counter
  get repCounter(): Locator {
    return this.page.locator(selectors.interactions.repCounter);
  }

  // Done - Start Rest button
  get doneStartRestButton(): Locator {
    return this.page.locator(selectors.app.doneStartRestButton);
  }

  // Skip to Cool-down button
  get skipToCooldownButton(): Locator {
    return this.page.locator(selectors.app.skipToCooldownButton);
  }

  // Hold to skip button
  get holdToSkipButton(): Locator {
    return this.page.locator(selectors.interactions.holdToSkip);
  }

  // Rest state elements
  get restLabel(): Locator {
    return this.page.locator(selectors.timers.restLabel);
  }

  get overRestingAlert(): Locator {
    return this.page.locator(selectors.timers.overResting);
  }

  get tapToContinueArea(): Locator {
    return this.page.locator(selectors.interactions.tapToContinue);
  }

  // Timed hold elements
  get tapToStartArea(): Locator {
    return this.page.locator(selectors.interactions.tapToStart);
  }

  get doneLabel(): Locator {
    return this.page.locator(selectors.timers.done);
  }

  // Deload badge
  get deloadBadge(): Locator {
    return this.page.locator(selectors.progress.deloadBadge);
  }

  /**
   * Get the current rep count from aria-label.
   */
  async getCurrentReps(): Promise<number> {
    const label = await this.repCounter.getAttribute('aria-label');
    const match = label?.match(/Current reps: (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Tap the rep counter to increment.
   */
  async tapRepCounter() {
    await this.repCounter.click();
  }

  /**
   * Tap the rep counter multiple times.
   */
  async tapRepCounterTimes(count: number) {
    for (let i = 0; i < count; i++) {
      await this.tapRepCounter();
      await this.page.waitForTimeout(50);
    }
  }

  /**
   * Complete current rep exercise by tapping reps and clicking Done.
   */
  async completeRepExercise(reps: number = 5) {
    await this.tapRepCounterTimes(reps);
    await this.doneStartRestButton.click();
  }

  /**
   * Check if currently in rest state.
   */
  async isInRestState(): Promise<boolean> {
    return await this.restLabel.isVisible();
  }

  /**
   * Check if currently showing a timed hold exercise.
   */
  async isTimedHoldExercise(): Promise<boolean> {
    return await this.tapToStartArea.isVisible();
  }

  /**
   * Tap to continue from rest.
   */
  async tapToContinue() {
    await this.tapToContinueArea.click();
  }

  /**
   * Start a timed hold by tapping.
   */
  async startTimedHold() {
    await this.tapToStartArea.click();
  }

  /**
   * Hold to skip the current activity.
   */
  async holdToSkip(duration: number = 2100) {
    await this.holdToSkipButton.dispatchEvent('pointerdown');
    await this.page.waitForTimeout(duration);
    if (await this.holdToSkipButton.isVisible()) {
      await this.holdToSkipButton.dispatchEvent('pointerup');
    }
  }

  /**
   * Skip to cooldown.
   */
  async skipToCooldown() {
    await this.skipToCooldownButton.click();
  }

  /**
   * Wait for timed hold to complete.
   */
  async waitForTimedHoldComplete(timeout: number = 60000) {
    await this.doneLabel.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if deload mode is active.
   */
  async isDeloadMode(): Promise<boolean> {
    return await this.deloadBadge.isVisible();
  }

  /**
   * Get progress text (e.g., "Pair 1/3 - Set 2/3").
   */
  async getProgressText(): Promise<string | null> {
    const progressLocator = this.page.locator(`text=${selectors.progress.pairSet}`);
    if (await progressLocator.isVisible()) {
      return await progressLocator.textContent();
    }
    return null;
  }
}
