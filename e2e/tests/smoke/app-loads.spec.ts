import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/home.page';

test.describe('App Loading', () => {
  test('should load the home screen with all navigation buttons', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.expectLoaded();
  });

  test('should have no console errors on initial load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known benign errors (e.g., favicon 404)
    const significantErrors = errors.filter(
      (error) => !error.includes('favicon') && !error.includes('404')
    );
    expect(significantErrors).toHaveLength(0);
  });

  test('should display correct app title', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('h1');
    await expect(title).toContainText("Jireh's Calisthenics");
  });
});
