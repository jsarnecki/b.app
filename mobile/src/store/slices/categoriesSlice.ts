import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Category } from '../../types/category';
import { invalidateTags } from '../invalidation';
import { RootState } from '..';
import { addCategory, fetchCategories } from '../../api/endpoints/categoriesApi';

const categoriesAdapter = createEntityAdapter<Category>();

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: categoriesAdapter.getInitialState({
    fetchStatus: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    mutating: false,
    error: null as string | null,
  }),
  reducers: {
    removeOne(state, action) {
      categoriesAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        categoriesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addCategory.pending, (state) => {
        state.mutating = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.mutating = false;
        categoriesAdapter.addOne(state, action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload as string;
      })
      .addCase(invalidateTags, (state, action) => {
        if (action.payload.includes('Categories')) {
          state.fetchStatus = 'idle';
        }
      });
  },
});

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
} = categoriesAdapter.getSelectors((state: RootState) => state.categories);

export default categoriesSlice.reducer;
