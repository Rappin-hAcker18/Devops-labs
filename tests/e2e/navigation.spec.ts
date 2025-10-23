import { test, expect } from '@playwright/test';

test.describe('CloudCrew Academy - Core Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /cloudcrew academy/i })).toBeVisible();
    
    // Check navigation elements
    await expect(page.getByRole('link', { name: /courses/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible();
    
    // Check hero section
    await expect(page.getByText(/master cloud engineering/i)).toBeVisible();
  });

  test('courses page navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Click on courses link
    await page.getByRole('link', { name: /courses/i }).click();
    
    // Verify we're on courses page
    await expect(page).toHaveURL('/courses');
    await expect(page.getByText(/available courses/i)).toBeVisible();
  });

  test('course detail page loads', async ({ page }) => {
    await page.goto('/courses/aws-fundamentals');
    
    // Check course title
    await expect(page.getByText(/aws cloud fundamentals/i)).toBeVisible();
    
    // Check course modules are visible
    await expect(page.getByText(/module/i)).toBeVisible();
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile navigation
    await expect(page.getByRole('heading', { name: /cloudcrew academy/i })).toBeVisible();
    
    // Test mobile-specific elements
    await page.goto('/courses');
    await expect(page.getByText(/available courses/i)).toBeVisible();
  });
});