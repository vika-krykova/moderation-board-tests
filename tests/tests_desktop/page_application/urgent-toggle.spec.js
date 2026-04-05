import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Проверка тогла "Только срочные"', async ({ page }) => {
  await page.goto('https://cerulean-praline-8e5aa6.netlify.app');

  // Включение тогла
  await page.getByText('Только срочные').click();

  // Обновление объявлений
  await page.waitForLoadState('networkidle');

  // Карточки на 1 странице
  const cards = page.locator('._card_15fhn_2');
  const count = await cards.count();

  // У каждой карточки отметка "Срочно"
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const urgentBadge = card.locator('.__card__priority_15fh');
    await expect(urgentBadge, `Объявление ${i + 1} не имеет пометки "Срочно"`).toBeVisible({ timeout: 1000 });
  }
});