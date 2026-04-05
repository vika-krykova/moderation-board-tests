import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Проверка работы фильтра "Диапазон цен"', async ({ page }) => {
  await page.goto('https://cerulean-praline-8e5aa6.netlify.app');

  const minPriceInput = page.locator('input._filters__input_1iunh_20[placeholder="От"]');
  const maxPriceInput = page.locator('input._filters__input_1iunh_20[placeholder="До"]');

  // очистка и ввод чисел
  await minPriceInput.clear();
  await maxPriceInput.clear();
  await minPriceInput.fill('1000');
  await maxPriceInput.fill('3000');

  // Ожидание
  await page.waitForLoadState('networkidle');

  // Карточки объявлений
  const cards = page.locator('._card_15fhn_2');
  const count = await cards.count();

  // Проверка цен
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const priceElement = card.locator('[class*="_card__price_"]').first();
    const priceText = await priceElement.textContent();
    const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

    expect(price, `Цена объявления ${i + 1} (${price} руб.) вне диапазона`)
      .toBeGreaterThanOrEqual(1000);
    expect(price, `Цена объявления ${i + 1} (${price} руб.) вне диапазона`)
      .toBeLessThanOrEqual(3000);
  }
});