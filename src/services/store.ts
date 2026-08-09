import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import { userReducer } from './slices/userSlice'; // Изменяем импорт на named export
// Импортируйте другие редьюсеры здесь

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    user: userReducer
    // Добавьте другие редьюсеры здесь
  },
  devTools: process.env.NODE_ENV !== 'production'
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;