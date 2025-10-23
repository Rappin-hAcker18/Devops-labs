import { test, expect } from '@playwright/test';

test.describe('CloudCrew Academy - Course Functionality', () => {
  test('course content is accessible', async ({ page }) => {
    await page.goto('/courses/aws-fundamentals');
    
    // Wait for course content to load
    await expect(page.getByText(/aws cloud fundamentals/i)).toBeVisible();
    
    // Check for course modules
    await expect(page.locator('[data-testid="course-module"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check for lessons within modules
    await expect(page.getByText(/lesson/i)).toBeVisible();
  });

  test('video player functionality', async ({ page }) => {
    await page.goto('/courses/aws-fundamentals');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for video player or lesson content
    const videoPlayer = page.locator('[data-testid="lesson-player"]');
    const lessonContent = page.locator('[data-testid="lesson-content"]');
    
    // Check if either video player or lesson content is present
    const hasVideoPlayer = await videoPlayer.count() > 0;
    const hasLessonContent = await lessonContent.count() > 0;
    
    expect(hasVideoPlayer || hasLessonContent).toBeTruthy();
  });

  test('course progress tracking', async ({ page }) => {
    await page.goto('/courses/aws-fundamentals');
    
    // Check for progress indicators
    const progressElements = page.locator('[data-progress], .progress, [class*="progress"]');
    
    // Should have some progress tracking elements
    await expect(progressElements.first()).toBeVisible({ timeout: 5000 });
  });

  test('analytics tracking works', async ({ page }) => {
    // Listen for analytics requests
    const analyticsRequests = [];
    page.on('request', request => {
      if (request.url().includes('/api/analytics')) {
        analyticsRequests.push(request);
      }
    });

    await page.goto('/courses/aws-fundamentals');
    
    // Wait a bit for analytics to fire
    await page.waitForTimeout(2000);
    
    // Should have sent analytics events
    expect(analyticsRequests.length).toBeGreaterThan(0);
  });
});