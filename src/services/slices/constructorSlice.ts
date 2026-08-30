import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createOrder } from './orderSlice';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= state.ingredients.length) return;
      [state.ingredients[index], state.ingredients[swapWith]] = [
        state.ingredients[swapWith],
        state.ingredients[index]
      ];
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectConstructorItems: (state) => state
  },
  extraReducers: (builder) => {
    // Конструктор очищается только после положительного ответа сервера
    // на запрос создания заказа, а не при закрытии модалки вручную —
    // так пользователь не теряет собранный бургер при ошибке/ожидании.
    builder.addCase(createOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} = constructorSlice.actions;

export const { selectConstructorItems } = constructorSlice.selectors;

export default constructorSlice.reducer;
