import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Category } from '../../types/category';
import { invalidateTags } from '../invalidation';
import { RootState } from '..';
import { addCategory, fetchCategories } from '../../api/endpoints/categoriesApi';

const categoriesAdapter = createEntityAdapter<Category>();

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: categoriesAdapter.getInitialState({
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
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
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        categoriesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        categoriesAdapter.addOne(state, action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(invalidateTags, (state, action) => {
        if (action.payload.includes('Categories')) {
          state.status = 'idle';
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
