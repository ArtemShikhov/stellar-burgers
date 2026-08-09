import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Импорты API функций, например:
// import { getUserData, updateUserProfile } from '../../utils/burger-api';
import { TUser } from '../../utils/types'; // Предполагаемый тип пользователя

// Пример асинхронного thunk для получения данных пользователя
// export const fetchUserData = createAsyncThunk(
//   'user/fetchData',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getUserData();
//       return response.user;
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Ошибка получения данных');
//     }
//   }
// );

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean; // Флаг, показывающий, была ли проверка авторизации
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false, // Изначально проверка не пройдена
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Редьюсер для установки флага проверки авторизации (например, после проверки токена)
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    // Редьюсер для установки данных пользователя
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    // Редьюсер для сброса данных пользователя при выходе
    logout: (state) => {
      state.user = null;
      state.isAuthChecked = false;
    }
  }
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchUserData.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<TUser>) => {
  //       state.loading = false;
  //       state.user = action.payload;
  //       state.isAuthChecked = true; // Устанавливаем флаг, если данные успешно получены
  //     })
  //     .addCase(fetchUserData.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload as string || 'Ошибка получения данных';
  //       state.isAuthChecked = true; // Устанавливаем флаг, даже при ошибке, чтобы прекратить ожидание
  //     });
  // },
});

export const { setAuthChecked, setUser, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
