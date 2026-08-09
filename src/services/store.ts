import { configureStore } from '@reduxjs/toolkit';
<<<<<<< HEAD
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
=======

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = () => {}; // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
>>>>>>> 491ec180fb55cb0b9b556214cef1ba9dca534cc6
