import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/home.page';
import { SettingsPage } from '../../page-objects/settings.page';

test.describe('Settings Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should persist deload mode across page reload', async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    // Go to settings
    await homePage.goto();
    await homePage.navigateToSettings();

    // Verify deload is initially off
    expect(await settingsPage.isDeloadModeEnabled()).toBe(false);

    // Enable deload mode
    await settingsPage.toggleDeloadMode();
    expect(await settingsPage.isDeloadModeEnabled()).toBe(true);

    // Reload page
    await page.reload();

    // Navigate back to settings
    await homePage.navigateToSettings();

    // Verify setting persisted
    expect(await settingsPage.isDeloadModeEnabled()).toBe(true);
  });

  test('should persist hold countdown preference across reload', async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    await homePage.goto();
    await homePage.navigateToSettings();

    // Change to 2 seconds
    await settingsPage.setHoldCountdown(2);

    // Reload
    await page.reload();
    await homePage.navigateToSettings();

    // Verify 2 second option is selected
    const radio2 = page.locator('input[type="radio"]').first();
    await expect(radio2).toBeChecked();
  });

  test('should persist audio cue settings across reload', async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    await homePage.goto();
    await homePage.navigateToSettings();

    // Toggle off rest countdown warning (use exact text from the app)
    const wasEnabled = await settingsPage.isAudioCueEnabled('Rest timer countdown');
    await settingsPage.toggleAudioCue('Rest timer countdown');
    const isNowEnabled = await settingsPage.isAudioCueEnabled('Rest timer countdown');
    expect(isNowEnabled).toBe(!wasEnabled);

    // Reload
    await page.reload();
    await homePage.navigateToSettings();

    // Verify setting persisted
    expect(await settingsPage.isAudioCueEnabled('Rest timer countdown')).toBe(!wasEnabled);
  });

  test('should maintain settings when navigating away and back', async ({ page }) => {
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    await homePage.goto();
    await homePage.navigateToSettings();

    // Enable deload mode
    await settingsPage.toggleDeloadMode();
    expect(await settingsPage.isDeloadModeEnabled()).toBe(true);

    // Go back to home
    await settingsPage.goBack();
    await homePage.expectLoaded();

    // Go to exercise library and back
    await homePage.navigateToExerciseLibrary();
    await page.locator('role=button[name="Back"]').click();

    // Go back to settings
    await homePage.navigateToSettings();

    // Verify setting still enabled
    expect(await settingsPage.isDeloadModeEnabled()).toBe(true);
  });
});
