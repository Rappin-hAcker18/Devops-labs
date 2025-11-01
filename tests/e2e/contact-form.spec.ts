import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('shows prefilled plan and handles successful submission', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/contact?plan=premium');

    await expect(
      page.getByRole('heading', { name: /let’s build your cloud talent pipeline/i })
    ).toBeVisible();

    const planSelect = page.locator('select[name="interestedPlan"]');
    await expect(planSelect).toHaveValue('Premium (Elite)');

    await page.fill('#fullName', 'Jordan Test');
    await page.fill('#email', 'jordan@example.com');
    await page.fill('#company', 'Urban Tech Collective');
    await planSelect.selectOption('Premium (Elite)');
    await page.selectOption('select[name="teamSize"]', '10-49');
    await page.selectOption('select[name="timeline"]', 'ASAP');
    await page.fill('#message', 'Looking to upskill a cohort this fall.');

    await page.getByRole('button', { name: /send message/i }).click();

    await expect(
      page.getByText(/thanks for reaching out/i)
    ).toBeVisible();
  });
});
