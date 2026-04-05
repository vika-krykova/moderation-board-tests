import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Переключение темной и светлой темы на мобильной версии', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://cerulean-praline-8e5aa6.netlify.app/');

  const themeButton = page.locator('button[class*="_themeToggle_"]');
  await expect(themeButton).toBeVisible({ timeout: 5000 });

  const getTheme = async () => await page.getAttribute('html', 'data-theme');
  const initialTheme = await getTheme();
  console.log(`Начальная тема: ${initialTheme}`);

  // Первый клик
  await themeButton.click();
  await page.waitForTimeout(500);
  const afterFirst = await getTheme();
  expect(afterFirst).not.toBe(initialTheme);
  console.log(`После первого клика: ${afterFirst}`);

  // Второй клик
  await themeButton.click(); 
  await page.waitForTimeout(500);
  const afterSecond = await getTheme();
  expect(afterSecond).toBe(initialTheme);
  console.log(`После второго клика: ${afterSecond}`);
});