import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchTransactions, addTransaction } from '../../api/endpoints/transactionsApi';
import { invalidateTags } from '../invalidation';
import type { Transaction } from '../../types/transaction';
import type { RootState } from '../index';

const transactionsAdapter = createEntityAdapter<Transaction>();

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState({
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
  }),
  reducers: {
    removeOne(state, action) {
      transactionsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        transactionsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        transactionsAdapter.addOne(state, action.payload);
      })
      .addCase(addTransaction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(invalidateTags, (state, action) => {
        if (action.payload.includes('Transactions')) {
          state.status = 'idle';
        }
      });
  },
});

export const {
  selectAll: selectAllTransactions,
  selectById: selectTransactionById,
  selectIds: selectTransactionIds,
} = transactionsAdapter.getSelectors((state: RootState) => state.transactions);

export default transactionsSlice.reducer;
