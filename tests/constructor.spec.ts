import { test, expect, Page } from '@playwright/test';
import path from 'path';

/**
 * Интеграционные тесты страницы конструктора бургера.
 * Все запросы к бэкенду подменяются моками из tests/hars,
 * поэтому тесты не зависят от реального сервера.
 */

const INGREDIENTS_HAR = path.join(__dirname, 'hars/ingredients.har');
const USER_HAR = path.join(__dirname, 'hars/user.har');
const ORDER_HAR = path.join(__dirname, 'hars/order.har');

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const SECOND_MAIN_NAME = 'Мясо бессмертных моллюсков Protostomia';

/**
 * Подставляет фейковые токены авторизации в localStorage и cookie,
 * подключает HAR-моки для всех запросов к бэкенду и открывает
 * страницу конструктора бургера.
 */
const setupPage = async (page: Page) => {
  // Моки бэкенда: каждый HAR ограничен своим эндпоинтом через url-фильтр,
  // чтобы не перехватывать запросы друг друга.
  await page.routeFromHAR(INGREDIENTS_HAR, {
    url: '**/ingredients',
    update: false
  });
  await page.routeFromHAR(USER_HAR, {
    url: '**/auth/user',
    update: false
  });
  await page.routeFromHAR(ORDER_HAR, {
    url: '**/orders',
    update: false
  });

  // Фейковые токены авторизации подставляются до захода на страницу,
  // чтобы приложение сразу считало пользователя авторизованным.
  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    document.cookie = 'accessToken=fake-access-token; path=/';
  });

  await page.goto('/');
  await expect(page.getByText('Соберите бургер')).toBeVisible();
};

test.describe('Конструктор бургера: добавление ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('добавление булки из списка ингредиентов в конструктор', async ({
    page
  }) => {
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: BUN_NAME });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    // Булка появляется и сверху, и снизу конструктора — проверяем текст
    // именно внутри выделенных контейнеров булки, а не по всей странице,
    // чтобы тест не мог случайно пройти из-за совпадения текста в другом месте.
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      `${BUN_NAME} (верх)`
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      `${BUN_NAME} (низ)`
    );
    await expect(page.getByText('Выберите булки')).toHaveCount(0);
  });

  test('добавление начинки из списка ингредиентов в конструктор', async ({
    page
  }) => {
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: MAIN_NAME });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    const constructorElements = page.getByTestId('constructor-ingredient');
    await expect(constructorElements).toHaveCount(1);
    await expect(constructorElements.first()).toContainText(MAIN_NAME);
    await expect(page.getByText('Выберите начинку')).toHaveCount(0);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('открытие модального окна с описанием выбранного ингредиента', async ({
    page
  }) => {
    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: BUN_NAME });
    await bunCard.getByText(BUN_NAME).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    // В модалке отображаются данные именно того ингредиента, по которому кликнули
    await expect(page.getByTestId('ingredient-details-name')).toHaveText(
      BUN_NAME
    );
    await expect(page).toHaveURL(/\/ingredients\//);
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: BUN_NAME });
    await bunCard.getByText(BUN_NAME).click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: MAIN_NAME });
    await mainCard.getByText(MAIN_NAME).click();

    await expect(page.getByTestId('modal')).toBeVisible();

    // Оверлей растянут на весь экран, но его геометрический центр совпадает
    // с центром самой модалки (она поверх оверлея). Кликаем в угол оверлея,
    // где модального окна точно нет — иначе клик "проваливается" в диалог.
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('сборка бургера и успешное оформление заказа', async ({ page }) => {
    // Собираем бургер: булка + две начинки
    await page
      .getByTestId('ingredient-card')
      .filter({ hasText: BUN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByTestId('ingredient-card')
      .filter({ hasText: MAIN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByTestId('ingredient-card')
      .filter({ hasText: SECOND_MAIN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.getByTestId('constructor-ingredient')).toHaveCount(2);

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    // В моке заказа зашит номер 12345 — проверяем, что модалка показала именно его
    await expect(page.getByTestId('order-number')).toHaveText('12345');

    // Закрываем модальное окно заказа
    await page.getByTestId('modal-close-button').click();
    await expect(page.getByTestId('modal')).toHaveCount(0);

    // Конструктор должен быть пуст после успешного создания заказа
    await expect(page.getByTestId('constructor-bun-top')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-bottom')).toHaveCount(0);
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.getByTestId('constructor-ingredient')).toHaveCount(0);
  });
});
