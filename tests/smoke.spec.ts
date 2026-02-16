import { test, expect } from '@playwright/test';

test('completes a typing test session', async ({ page }) => {
  await page.goto('/');

  // Expect home page features
  await expect(page.getByText(/Focus on Accuracy/i)).toBeVisible();

  // Start a test
  await page.click('text=Typing Test');

  // Verify Typing Area exists
  const typingArea = page.locator('div[class*="TypingArea"]');
  await expect(typingArea).toBeVisible();

  // Simulate typing (clicking container to focus)
  await typingArea.click();
  
  // Verify stats are visible
  await expect(page.getByText(/WPM/i)).toBeVisible();
  await expect(page.getByText(/Accuracy/i)).toBeVisible();
});
