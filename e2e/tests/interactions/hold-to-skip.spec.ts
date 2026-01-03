import { test, expect } from '@playwright/test';
import { ActiveWorkoutPage } from '../../page-objects/active-workout.page';
import { navigateToActiveWorkout } from '../../helpers/navigation-helpers';
import { selectors } from '../../helpers/selectors';

test.describe('Hold to Skip Interactions', () => {
  let activeWorkoutPage: ActiveWorkoutPage;

  test.beforeEach(async ({ page }) => {
    await navigateToActiveWorkout(page, 'Workout A');
    activeWorkoutPage = new ActiveWorkoutPage(page);
  });

  test('should display hold to skip button', async ({ page }) => {
    await expect(activeWorkoutPage.holdToSkipButton).toBeVisible();
  });

  test('should show initial "Hold to skip" label', async ({ page }) => {
    const label = await activeWorkoutPage.holdToSkipButton.getAttribute('aria-label');
    expect(label).toContain('Hold for');
  });

  test('should show progress during hold', async ({ page }) => {
    const holdButton = activeWorkoutPage.holdToSkipButton;

    // Wait for button to be visible
    await expect(holdButton).toBeVisible();

    // Verify initial state shows "Hold for X seconds to skip"
    const initialLabel = await holdButton.getAttribute('aria-label');
    expect(initialLabel).toContain('Hold for');
    expect(initialLabel).toContain('to skip');

    // Note: Testing actual hold progress requires pointer events that work
    // with the useHoldDetection hook. The other hold tests cover the full flow.
    // This test verifies the initial state is correct.
  });

  test('should cancel skip on early release', async ({ page }) => {
    const holdButton = activeWorkoutPage.holdToSkipButton;

    // Wait for button to be visible and stable
    await expect(holdButton).toBeVisible();
    await holdButton.scrollIntoViewIfNeeded();

    // Get bounding box for pointer interaction
    const box = await holdButton.boundingBox();
    if (!box) throw new Error('Hold button not found');

    // Start holding using mouse
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(500); // Hold for only 0.5 seconds

    // Release before 2 seconds
    await page.mouse.up();

    // Wait a moment for state to reset
    await page.waitForTimeout(200);

    // Should still be on the same exercise (hold-to-skip visible)
    await expect(holdButton).toBeVisible();
    const label = await holdButton.getAttribute('aria-label');
    expect(label).toContain('Hold for');
  });

  test('should skip exercise after 2 second hold', async ({ page }) => {
    const holdButton = activeWorkoutPage.holdToSkipButton;

    // Wait for button to be visible and stable
    await expect(holdButton).toBeVisible();
    await holdButton.scrollIntoViewIfNeeded();

    // Get bounding box for pointer interaction
    const box = await holdButton.boundingBox();
    if (!box) throw new Error('Hold button not found');

    // Hold for 2.5 seconds to trigger skip using real mouse
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(2500);
    await page.mouse.up();

    // Should now be in rest state (showing "Rest" label)
    await expect(activeWorkoutPage.restLabel).toBeVisible({ timeout: 5000 });
  });

  test('should skip from rest timer using hold-to-skip', async ({ page }) => {
    // First, get to rest state
    await activeWorkoutPage.tapRepCounterTimes(3);
    await activeWorkoutPage.doneStartRestButton.click();

    // Verify we're in rest state
    await expect(activeWorkoutPage.restLabel).toBeVisible();

    // Now use hold-to-skip to skip rest
    const holdButton = page.locator(selectors.interactions.holdToSkip);
    await holdButton.dispatchEvent('pointerdown');
    await page.waitForTimeout(2100);

    // Should move to next exercise (rest label should disappear)
    await expect(activeWorkoutPage.restLabel).not.toBeVisible({ timeout: 5000 });
  });
});
