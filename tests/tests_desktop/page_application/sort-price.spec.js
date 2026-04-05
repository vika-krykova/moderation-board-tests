import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Сортировка по цене (возрастание)', async ({ page }) => {
  await page.goto('https://cerulean-praline-8e5aa6.netlify.app/');

  // "Цена"
  const sortBySelect = page.locator('label:has-text("Сортировать по") + select');
  await sortBySelect.selectOption({ value: 'price' });

  // "По возрастанию"
  const orderSelect = page.locator('label:has-text("Порядок") + select');
  await orderSelect.selectOption({ label: 'По возрастанию' });

  await page.waitForTimeout(2000);

  // Сборка цен
  const priceElements = await page.locator('div[class^="card_price_"]').all();
  const prices = [];
  for (let i = 0; i < Math.min(priceElements.length, 20); i++) {
    const text = await priceElements[i].innerText();
    const price = parseInt(text.replace(/[^0-9]/g, ''), 10);
    prices.push(price);
  }

  // возрастание
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
  }
});

test('Сортировка по цене (убывание)', async ({ page }) => {
  await page.goto('https://cerulean-praline-8e5aa6.netlify.app/');

  const sortBySelect = page.locator('label:has-text("Сортировать по") + select');
  await sortBySelect.selectOption({ value: 'price' });

  const orderSelect = page.locator('label:has-text("Порядок") + select');
  await orderSelect.selectOption({ label: 'По убыванию' });

  await page.waitForTimeout(2000);

  const priceElements = await page.locator('div[class^="card_price_"]').all();
  const prices = [];
  for (let i = 0; i < Math.min(priceElements.length, 20); i++) {
    const text = await priceElements[i].innerText();
    const price = parseInt(text.replace(/[^0-9]/g, ''), 10);
    prices.push(price);
  }

  // убывание
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
  }
});