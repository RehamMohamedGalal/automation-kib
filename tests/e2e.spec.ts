
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://e-commerce-kib.netlify.app');
  const title = await page.title();
  expect(title).toBe('E-Commerce Website');
});
