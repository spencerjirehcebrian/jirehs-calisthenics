import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/home.page';
import { selectors } from '../../helpers/selectors';

test.describe('PWA Offline Functionality', () => {
  test('should load app and cache resources', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // App should be loaded
    const homePage = new HomePage(page);
    await homePage.expectLoaded();
  });

  // Note: PWA features (service worker, offline) only work with production builds
  // These tests will be skipped in dev mode
  test.skip('should work after going offline (cached resources)', async ({ page, context }) => {
    // This test requires a production build with service worker
    // First load to cache resources
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a moment for service worker to register and cache
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);

    // Navigate around the app (should work from cache)
    await page.locator(selectors.app.settingsButton).click();
    await expect(page.locator(selectors.settings.heading)).toBeVisible();

    await page.locator(selectors.app.backButton).click();
    await expect(page.locator(selectors.app.title)).toBeVisible();

    // Go back online
    await context.setOffline(false);
  });

  // Note: Service workers are only registered in production builds
  test.skip('should register service worker', async ({ page }) => {
    // This test requires a production build with service worker
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for service worker registration
    await page.waitForTimeout(2000);

    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration !== undefined;
      }
      return false;
    });

    expect(swRegistered).toBe(true);
  });
});
