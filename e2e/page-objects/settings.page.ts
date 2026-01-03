import { Page, Locator, expect } from '@playwright/test';
import { selectors } from '../helpers/selectors';

export class SettingsPage {
  readonly page: Page;
  readonly backButton: Locator;
  readonly deloadCheckbox: Locator;
  readonly holdCountdown2: Locator;
  readonly holdCountdown3: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backButton = page.locator(selectors.app.backButton);
    this.deloadCheckbox = page.locator(selectors.settings.deloadCheckbox);
    this.holdCountdown2 = page.locator(selectors.settings.holdCountdown2);
    this.holdCountdown3 = page.locator(selectors.settings.holdCountdown3);
  }

  async expectLoaded() {
    await expect(this.page.locator(selectors.settings.heading)).toBeVisible();
  }

  /**
   * Toggle deload mode on/off.
   */
  async toggleDeloadMode() {
    await this.deloadCheckbox.click();
  }

  /**
   * Check if deload mode is enabled.
   */
  async isDeloadModeEnabled(): Promise<boolean> {
    return await this.deloadCheckbox.isChecked();
  }

  /**
   * Set hold countdown duration.
   */
  async setHoldCountdown(seconds: 2 | 3) {
    if (seconds === 2) {
      await this.holdCountdown2.click();
    } else {
      await this.holdCountdown3.click();
    }
  }

  /**
   * Check which hold countdown is selected.
   */
  async getHoldCountdown(): Promise<2 | 3> {
    const radio2 = this.page.locator('input[type="radio"][value="2"]');
    if (await radio2.isChecked()) {
      return 2;
    }
    return 3;
  }

  /**
   * Toggle an audio cue setting by label text.
   */
  async toggleAudioCue(labelText: string) {
    await this.page.locator(`label:has-text("${labelText}") input[type="checkbox"]`).click();
  }

  /**
   * Check if an audio cue is enabled.
   */
  async isAudioCueEnabled(labelText: string): Promise<boolean> {
    return await this.page.locator(`label:has-text("${labelText}") input[type="checkbox"]`).isChecked();
  }

  /**
   * Go back to home.
   */
  async goBack() {
    await this.backButton.click();
  }
}
