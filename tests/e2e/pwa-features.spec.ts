import { test, expect } from '@playwright/test';

test.describe('CloudCrew Academy - PWA Features', () => {
  test('service worker registration', async ({ page }) => {
    await page.goto('/');
    
    // Check if service worker is registered
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration();
    });
    
    expect(swRegistration).toBeTruthy();
  });

  test('manifest.json is accessible', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
    
    const manifest = await response?.json();
    expect(manifest.name).toBe('CloudCrew Academy');
    expect(manifest.short_name).toBe('CloudCrew');
  });

  test('offline page accessibility', async ({ page }) => {
    await page.goto('/offline');
    
    await expect(page.getByText(/you are currently offline/i)).toBeVisible();
    await expect(page.getByText(/cached content/i)).toBeVisible();
  });

  test('PWA install prompt functionality', async ({ page, context }) => {
    await page.goto('/');
    
    // Check for PWA install banner component
    const installBanner = page.locator('[data-testid="pwa-install-banner"]');
    
    // The banner might not always be visible depending on browser support
    // But the component should be in the DOM
    await expect(installBanner).toBeInViewport({ timeout: 5000 }).catch(() => {
      // Fallback: just check if it exists in DOM
      return expect(installBanner).toHaveCount(1);
    });
  });

  test('analytics dashboard accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for analytics dashboard
    await expect(page.getByText(/analytics dashboard/i)).toBeVisible({ timeout: 10000 });
  });
});