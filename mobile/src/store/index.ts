import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transactionsSlice';
import categoriesReducer from './slices/categoriesSlice';
import budgetReducer from './slices/budgetSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    categories: categoriesReducer,
    budget: budgetReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
