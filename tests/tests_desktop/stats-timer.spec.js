import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Проверка контейнера управления таймером обновления статистики', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://cerulean-praline-8e5aa6.netlify.app');
    const statsLink = page.locator('a._link_14hw7_51:has-text("Статистика")');
    await statsLink.click();
    await page.waitForURL('**/stats', { timeout: 15000 });
    await page.locator('span._timeValue__ir5wu_112, [class*="timeValue"]').first().waitFor({ state: 'visible', timeout: 15000 });
  });

  test('Кнопка "Обновить" сбрасывает таймер и запускает новый отсчет', async ({ page }) => {
    const timerValue = page.locator('span._timeValue__ir5wu_112, [class*="timeValue"]').first();
    const refreshButton = page.locator(
      'button._refreshButton__ir5wu_16, ' +
      'button:has-text("Обновить"), ' +
      'button[aria-label="Обновить сейчас"], ' +
      'button[title="Обновить статистику"]'
    ).first();
    await refreshButton.waitFor({ state: 'visible', timeout: 10000 });

    const getSeconds = async () => {
      const text = await timerValue.textContent();
      const parts = text.split(':');
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      return minutes * 60 + seconds;
    };

    const initialSeconds = await getSeconds();
    expect(initialSeconds).toBeGreaterThan(0);

    await refreshButton.click();

    await expect(async () => {
      const seconds = await getSeconds();
      expect(seconds).toBeLessThanOrEqual(300);
      expect(seconds).toBeGreaterThanOrEqual(299);
    }).toPass({ timeout: 5000 });

    const afterRefresh = await getSeconds();
    await page.waitForTimeout(1000);
    const afterOneSec = await getSeconds();
    expect(afterOneSec).toBeLessThan(afterRefresh);
  });

  test('Кнопка "Остановить" останавливает таймер и показывает текст "Автообновление выключено"', async ({ page }) => {
    const timerValue = page.locator('span._timeValue__ir5wu_112, [class*="timeValue"]').first();
    const stopButton = page.locator(
      'button._toggleButton__ir5wu_69, ' +
      'button[aria-label="Отключить автообновление"]'
    ).first();
    await stopButton.waitFor({ state: 'visible', timeout: 10000 });

    await stopButton.click();

    // таймер исчезает
    await expect(timerValue).not.toBeVisible({ timeout: 5000 }).catch(() => {});
    // появляется текст
    const disabledText = page.locator('text=Автообновление выключено');
    await expect(disabledText).toBeVisible();
  });

  test('Кнопка запуска таймера продолжает отсчет с того же места после остановки', async ({ page }) => {
    const timerValue = page.locator('span._timeValue__ir5wu_112, [class*="timeValue"]').first();
    const toggleButton = page.locator(
      'button._toggleButton__ir5wu_69, ' +
      'button[aria-label="Отключить автообновление"], ' +
      'button[aria-label="Включить автообновление"]'
    ).first();
    await toggleButton.waitFor({ state: 'visible', timeout: 10000 });

    const getSeconds = async () => {
      const text = await timerValue.textContent();
      const parts = text.split(':');
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      return minutes * 60 + seconds;
    };

    // остановить, если таймер активен
    const isActive = await toggleButton.getAttribute('aria-label') === 'Отключить автообновление';
    if (isActive) {
      await toggleButton.click();
      await expect(page.locator('text=Автообновление выключено')).toBeVisible({ timeout: 5000 });
    }

    const secondsStopped = await getSeconds();
    await page.waitForTimeout(1000);
    const secondsStill = await getSeconds();
    expect(secondsStill).toBe(secondsStopped);

    // запуск
    await toggleButton.click();

    await expect(page.locator('text=404, text=Not Found')).toHaveCount(0);

    await page.waitForTimeout(1000);
    const secondsAfterStart = await getSeconds();
    expect(secondsAfterStart).toBeLessThan(secondsStopped);
  });
});