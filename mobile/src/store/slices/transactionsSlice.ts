import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchTransactions, addTransaction } from '../../api/endpoints/transactionsApi';
import { invalidateTags } from '../invalidation';
import type { Transaction } from '../../types/transaction';
import type { RootState } from '../index';

const transactionsAdapter = createEntityAdapter<Transaction>();

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState({
    fetchStatus: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    mutating: false,
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
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        transactionsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addTransaction.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        transactionsAdapter.addOne(state, action.payload);
        state.mutating = false;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.error = action.payload as string;
        state.mutating = false;
      })
      .addCase(invalidateTags, (state, action) => {
        if (action.payload.includes('Transactions')) {
          state.fetchStatus = 'idle';
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
