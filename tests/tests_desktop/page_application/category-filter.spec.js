import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Фильтр категории "Недвижимость"', async ({ page }) => {
  await page.goto('https://cerulean-praline-8e5aa6.netlify.app/');

  // Категория недвижимость
  const categorySelect = page.locator('label:has-text("Категория") + select');
  await categorySelect.selectOption({ value: '1' });

  await page.waitForTimeout(2000);

  // В заголовках есть недвижимость
  const titles = await page.locator('h3[class*="_card__title_"]').all();
  const firstTwenty = titles.slice(0, 20);
  for (const title of firstTwenty) {
    const text = await title.innerText();
    expect(text).toContain('Недвижимость');
  }
});