import { Page, Locator, expect } from '@playwright/test';
import { selectors } from '../helpers/selectors';

export class SessionSummaryPage {
  readonly page: Page;
  readonly workoutCompleteHeading: Locator;
  readonly doneButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.workoutCompleteHeading = page.locator(selectors.summary.workoutComplete);
    this.doneButton = page.locator(selectors.app.doneButton);
  }

  async expectLoaded() {
    await expect(this.workoutCompleteHeading).toBeVisible();
    await expect(this.page.locator(selectors.summary.totalDuration)).toBeVisible();
  }

  /**
   * Check if warmup was skipped.
   */
  async isWarmupSkipped(): Promise<boolean> {
    const warmupSection = this.page.locator('text="Warm-up"').locator('..');
    const skippedBadge = warmupSection.locator('text="Skipped"');
    return await skippedBadge.isVisible();
  }

  /**
   * Check if warmup was completed.
   */
  async isWarmupCompleted(): Promise<boolean> {
    const warmupSection = this.page.locator('text="Warm-up"').locator('..');
    const completedBadge = warmupSection.locator('text="Completed"');
    return await completedBadge.isVisible();
  }

  /**
   * Check if cooldown was skipped.
   */
  async isCooldownSkipped(): Promise<boolean> {
    const cooldownSection = this.page.locator('text="Cool-down"').locator('..');
    const skippedBadge = cooldownSection.locator('text="Skipped"');
    return await skippedBadge.isVisible();
  }

  /**
   * Check if cooldown was completed.
   */
  async isCooldownCompleted(): Promise<boolean> {
    const cooldownSection = this.page.locator('text="Cool-down"').locator('..');
    const completedBadge = cooldownSection.locator('text="Completed"');
    return await completedBadge.isVisible();
  }

  /**
   * Get total duration text.
   */
  async getTotalDuration(): Promise<string | null> {
    const durationElement = this.page.locator(selectors.summary.totalDuration).locator('..').locator('p').last();
    return await durationElement.textContent();
  }

  /**
   * Get list of completed exercises.
   */
  async getCompletedExercises(): Promise<string[]> {
    const exerciseElements = this.page.locator('[class*="Exercises Completed"] >> li, h2:has-text("Exercises Completed") ~ ul li, h2:has-text("Exercises Completed") ~ div li');
    const count = await exerciseElements.count();
    const exercises: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await exerciseElements.nth(i).textContent();
      if (text) exercises.push(text);
    }
    return exercises;
  }

  /**
   * Click Done to return home.
   */
  async clickDone() {
    await this.doneButton.click();
  }
}
