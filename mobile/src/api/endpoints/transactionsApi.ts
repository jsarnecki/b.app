import { createAsyncThunk } from '@reduxjs/toolkit';
import { getJson, postJson, deleteJson } from '../api';
import { invalidateTags } from '../../store/invalidation';
import type { Transaction, CreateTransactionPayload } from '../../types/transaction';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('transactions') as Transaction[];
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to fetch transactions');
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addOne',
  async (payload: CreateTransactionPayload, { rejectWithValue, dispatch }) => {
    try {
      const transaction = await postJson('transactions', payload) as Transaction;
      dispatch(invalidateTags(['Transactions']));
      return transaction;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to add transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteOne',
  async (id: number, { rejectWithValue, dispatch }) => {
    dispatch({ type: 'transactions/removeOne', payload: id });
    try {
      await deleteJson(`transactions/${id}`);
      dispatch(invalidateTags(['Transactions']));
    } catch (err: any) {
      dispatch(fetchTransactions());
      return rejectWithValue(err.message ?? 'Failed to delete transaction');
    }
  }
);
