import reducer, {
  fetchIngredients,
  selectIngredientsItems,
  selectIngredientsLoading,
  selectIngredientsError
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

/**
 * Тесты редьюсера слайса `ingredients`.
 * Проверяем поведение как чистой функции: (state, action) => newState
 * для неизвестного экшена и для всех поддерживаемых экшенов,
 * включая pending/rejected/fulfilled асинхронного thunk-а.
 */
describe('ingredientsSlice reducer', () => {
  const mockIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  };

  it('должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  it('не должен менять состояние при неизвестном экшене', () => {
    const initialState = {
      items: [mockIngredient],
      isLoading: false,
      error: null
    };

    const state = reducer(initialState, { type: 'SOME/UNKNOWN_ACTION' });

    expect(state).toEqual(initialState);
  });

  it('должен установить isLoading в true и сбросить error при fetchIngredients.pending', () => {
    const initialState = {
      items: [],
      isLoading: false,
      error: 'предыдущая ошибка'
    };

    const state = reducer(
      initialState,
      fetchIngredients.pending('requestId', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранить полученные ингредиенты и снять isLoading при fetchIngredients.fulfilled', () => {
    const initialState = {
      items: [],
      isLoading: true,
      error: null
    };

    const state = reducer(
      initialState,
      fetchIngredients.fulfilled([mockIngredient], 'requestId', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual([mockIngredient]);
  });

  it('должен записать текст ошибки и снять isLoading при fetchIngredients.rejected', () => {
    const initialState = {
      items: [],
      isLoading: true,
      error: null
    };

    const action = fetchIngredients.rejected(
      new Error('Не удалось загрузить ингредиенты'),
      'requestId',
      undefined
    );

    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });

  it('селекторы должны корректно читать данные из состояния', () => {
    const rootState = {
      ingredients: {
        items: [mockIngredient],
        isLoading: true,
        error: 'ошибка'
      }
    } as any;

    expect(selectIngredientsItems(rootState)).toEqual([mockIngredient]);
    expect(selectIngredientsLoading(rootState)).toBe(true);
    expect(selectIngredientsError(rootState)).toBe('ошибка');
  });
});
