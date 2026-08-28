import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  selectConstructorItems
} from '../constructorSlice';
import { createOrder } from '../orderSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

/**
 * Тесты редьюсера слайса `burgerConstructor`.
 * Проверяем поведение как чистой функции для неизвестного экшена
 * и для каждого из поддерживаемых экшенов, включая экшен
 * createOrder.fulfilled из соседнего слайса заказа.
 */
describe('constructorSlice reducer', () => {
  const bun: TIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'img',
    image_large: 'img_large',
    image_mobile: 'img_mobile'
  };

  const main1: TIngredient = {
    _id: 'main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'img',
    image_large: 'img_large',
    image_mobile: 'img_mobile'
  };

  const main2: TIngredient = {
    _id: 'main-2',
    name: 'Мясо бессмертных моллюсков Protostomia',
    type: 'main',
    proteins: 433,
    fat: 44,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: 'img',
    image_large: 'img_large',
    image_mobile: 'img_mobile'
  };

  it('должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('не должен менять состояние при неизвестном экшене', () => {
    const initialState = {
      bun: { ...bun, id: 'bun-instance-id' },
      ingredients: []
    };

    const state = reducer(initialState, { type: 'SOME/UNKNOWN_ACTION' });

    expect(state).toEqual(initialState);
  });

  it('addIngredient должен добавлять булку в поле bun с сгенерированным уникальным id', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun).not.toBeNull();
    expect(state.bun?._id).toBe(bun._id);
    expect(typeof state.bun?.id).toBe('string');
    expect(state.bun?.id.length).toBeGreaterThan(0);
    expect(state.ingredients).toHaveLength(0);
  });

  it('addIngredient должен добавлять начинку в конец массива ingredients с уникальным id', () => {
    let state = reducer(undefined, addIngredient(main1));
    state = reducer(state, addIngredient(main2));

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]._id).toBe(main1._id);
    expect(state.ingredients[1]._id).toBe(main2._id);
    // id у разных добавленных ингредиентов должны различаться
    expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
  });

  it('removeIngredient должен удалять ингредиент по его конструкторскому id', () => {
    let state = reducer(undefined, addIngredient(main1));
    state = reducer(state, addIngredient(main2));
    const idToRemove = state.ingredients[0].id;

    state = reducer(state, removeIngredient(idToRemove));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(main2._id);
  });

  it('moveIngredient должен менять местами два соседних ингредиента при direction "down"', () => {
    let state = reducer(undefined, addIngredient(main1));
    state = reducer(state, addIngredient(main2));

    state = reducer(state, moveIngredient({ index: 0, direction: 'down' }));

    expect(state.ingredients[0]._id).toBe(main2._id);
    expect(state.ingredients[1]._id).toBe(main1._id);
  });

  it('moveIngredient должен менять местами два соседних ингредиента при direction "up"', () => {
    let state = reducer(undefined, addIngredient(main1));
    state = reducer(state, addIngredient(main2));

    state = reducer(state, moveIngredient({ index: 1, direction: 'up' }));

    expect(state.ingredients[0]._id).toBe(main2._id);
    expect(state.ingredients[1]._id).toBe(main1._id);
  });

  it('moveIngredient не должен ничего менять при выходе индекса за границы массива', () => {
    let state = reducer(undefined, addIngredient(main1));
    state = reducer(state, addIngredient(main2));

    const stateAfter = reducer(
      state,
      moveIngredient({ index: 0, direction: 'up' })
    );

    expect(stateAfter).toEqual(state);
  });

  it('resetConstructor должен очищать булку и список ингредиентов', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, addIngredient(main1));

    state = reducer(state, resetConstructor());

    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  it('createOrder.fulfilled (экшен из orderSlice) должен очищать конструктор после успешного заказа', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, addIngredient(main1));

    const mockNewOrder = {
      _id: 'order-id',
      status: 'done',
      name: 'Space бургер',
      owner: {
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 12345,
      price: bun.price * 2 + main1.price
    };

    const action = createOrder.fulfilled(
      { success: true, name: mockNewOrder.name, order: mockNewOrder },
      'requestId',
      [bun._id, main1._id, bun._id]
    );

    state = reducer(state, action);

    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  it('селектор selectConstructorItems должен возвращать актуальное состояние конструктора', () => {
    const constructorState = {
      bun,
      ingredients: [{ ...main1, id: 'x' } as TConstructorIngredient]
    };
    const rootState = { burgerConstructor: constructorState } as any;

    expect(selectConstructorItems(rootState)).toEqual(constructorState);
  });
});
