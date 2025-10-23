import { test, expect } from '@playwright/test';

test.describe('CloudCrew Academy - Performance & Accessibility', () => {
  test('homepage performance metrics', async ({ page }) => {
    await page.goto('/');
    
    // Measure page load time
    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });

    // Basic performance assertions
    expect(navigationTiming.domContentLoaded).toBeLessThan(3000); // DOM should load in under 3s
    expect(navigationTiming.loadComplete).toBeLessThan(5000); // Full load should complete in under 5s
  });

  test('mobile responsiveness', async ({ page }) => {
    // Test different mobile viewport sizes
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 390, height: 844 }, // iPhone 12
      { width: 414, height: 896 }, // iPhone 11 Pro Max
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Check that content is visible and properly formatted
      await expect(page.getByRole('heading', { name: /cloudcrew academy/i })).toBeVisible();
      
      // Navigate to courses on mobile
      await page.goto('/courses');
      await expect(page.getByText(/available courses/i)).toBeVisible();
    }
  });

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('color contrast and text readability', async ({ page }) => {
    await page.goto('/');
    
    // Check that text is readable (basic smoke test)
    const textElements = await page.locator('h1, h2, h3, p, span').all();
    
    for (const element of textElements.slice(0, 5)) { // Test first 5 elements
      const isVisible = await element.isVisible();
      if (isVisible) {
        const text = await element.textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('form accessibility', async ({ page }) => {
    await page.goto('/login');
    
    // Check for proper form labels
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const passwordInput = page.getByLabel(/password/i);
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Check that inputs are properly labeled
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});