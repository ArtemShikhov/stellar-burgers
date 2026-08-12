import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => orderBurgerApi(ingredientIds)
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  orderByNumber: TOrder | null;
  orderByNumberLoading: boolean;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
  orderByNumber: null,
  orderByNumberLoading: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderModalData: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderError: (state) => state.error,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectOrderByNumberLoading: (state) => state.orderByNumberLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = {
          ...action.payload.order,
          ingredients: action.meta.arg
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось создать заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderByNumberLoading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumberLoading = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.orderByNumberLoading = false;
      });
  }
});

export const { resetOrderModalData } = orderSlice.actions;

export const {
  selectOrderRequest,
  selectOrderModalData,
  selectOrderError,
  selectOrderByNumber,
  selectOrderByNumberLoading
} = orderSlice.selectors;

export default orderSlice.reducer;
