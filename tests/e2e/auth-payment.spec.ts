import { test, expect } from '@playwright/test';

test.describe('CloudCrew Academy - Authentication Flow', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    await expect(page.getByText(/sign in/i)).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('signup page loads correctly', async ({ page }) => {
    await page.goto('/signup');
    
    // Check for signup form elements
    await expect(page.getByText(/create account/i)).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');
    
    // Should either redirect to login or show login prompt
    // Check if we're on login page OR if there's an auth prompt
    const isOnLoginPage = page.url().includes('/login');
    const hasAuthPrompt = await page.getByText(/sign in/i).isVisible();
    
    expect(isOnLoginPage || hasAuthPrompt).toBeTruthy();
  });
});

test.describe('CloudCrew Academy - Payment Flow', () => {
  test('pricing page displays tiers', async ({ page }) => {
    await page.goto('/pricing');
    
    // Check for pricing tiers
    await expect(page.getByText(/free/i)).toBeVisible();
    await expect(page.getByText(/standard/i)).toBeVisible();
    await expect(page.getByText(/premium/i)).toBeVisible();
  });

  test('checkout page functionality', async ({ page }) => {
    await page.goto('/checkout');
    
    // Check if checkout page loads (might require authentication)
    // This is a basic smoke test
    await expect(page).toHaveURL('/checkout');
  });
});