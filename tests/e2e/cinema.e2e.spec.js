import { test, expect } from '@playwright/test';

test('успішне бронювання місць', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/index.html');

  const seats = page.locator('.seat:not(.occupied)');
  await seats.nth(0).click();
  await seats.nth(1).click();

  await page.fill('#name', 'Іван Петренко');
  await page.fill('#phone', '0971234567');
  await page.fill('#email', 'ivan@gmail.com');

  await page.click('button');

  await expect(page.locator('#result')).toContainText('ви забронювали');
});

test('не можна забронювати без місць', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/main.html');

  await page.fill('#name', 'Іван Петренко');
  await page.fill('#phone', '0971234567');
  await page.fill('#email', 'ivan@gmail.com');

  await page.click('button');

  await expect(page.locator('#result')).toContainText('Оберіть хоча б одне місце');
});