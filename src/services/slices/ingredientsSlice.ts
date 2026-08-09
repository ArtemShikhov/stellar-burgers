import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Импортируйте функцию запроса из вашего API файла
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types'; // Типы могут быть уже заданы

// Асинхронный thunk для получения ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки');
    }
  }
);

// Определение типа состояния
interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

// Создание слайса
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  }
});

// Создание селекторов вне слайса
export const selectItems = (state: { ingredients: typeof initialState }) => state.ingredients.items;
export const selectLoading = (state: { ingredients: typeof initialState }) => state.ingredients.loading;
export const selectError = (state: { ingredients: typeof initialState }) => state.ingredients.error;

export default ingredientsSlice.reducer;
