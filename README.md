### Требования

- Node.js 18+
- npm 9+

### Установка

## Установка и настройка

1. Клонируйте репозиторий.
2. Установите зависимости:

```bash
npm install

2. Установить браузеры Playwright:
```bash
npx playwright install

### Запуск тестов

1. Запустить все тесты:
```bash
npx playwright test

2. Запустить все тесты с открытым браузером:
```bash
npx playwright test --headed

3. Запустить конкретный файл (Фильтр цен):
```bash
npx playwright test tests/tests_desktop/price-filter.spec.js

4. Запустить файл по названию:
```bash
npx playwright test -g "Переключение темной и светлой темы на мобильной версии"

## Посмотреть отчет после выполнения:
```bash
npx playwright show-report

### Некоторые пояснения к структуре:

- `tests/` — все тесты:
  - `tests_desktop/page_application/` — тесты десктопной версии:
    - `price-filter.spec.js` — проверка фильтра диапазона цен 
    - `sort-price.spec.js` — проверка сортировки по возрастанию/убыванию
    - `urgent-toggle.spec.js` — проверка тогла «Только срочные» 
  - `tests_desktop/page_statistics/` — тесты статистики:
    - `stats-timer.spec.js` — проверка кнопок «Обновить», «Остановить», запуск таймера
  - `tests_mobile/` — тесты мобильной версии:
    - `theme-switch.spec.js` — переключение светлой/темной темы
- `BUGS.md` — список багов
- `SCREEN_BUGS.md` — баги из общего задания 1
- `TESTCASES.md` — тест-кейсы