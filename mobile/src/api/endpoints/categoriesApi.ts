import { createAsyncThunk } from '@reduxjs/toolkit';
import { getJson, postJson, deleteJson } from '../api';
import { invalidateTags } from '../../store/invalidation';
import type { AppDispatch } from '../../store';
import type { Category } from '../../types/category';

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson('api/categories') as Category[];
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to fetch categories');
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/add',
  async (name: string, { rejectWithValue, dispatch }) => {
    try {
      const category = await postJson('api/categories', { name }) as Category;
      dispatch(invalidateTags(['Categories']));
      return category;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to add category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: number, { rejectWithValue, dispatch }) => {
    dispatch({ type: 'categories/removeOne', payload: id }); // optimistic
    try {
      await deleteJson(`api/categories/${id}`);
      dispatch(invalidateTags(['Categories']));
    } catch (err: any) {
      dispatch(fetchCategories()); // rollback
      return rejectWithValue(err.message ?? 'Failed to delete category');
    }
  }
);
