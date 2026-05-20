import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { BudgetPlan, ActivePeriodResponse } from '../../types/budget';
import { RootState } from '../index';
import { fetchBudgetPlans, createBudgetPlan, fetchActivePeriod } from '../../api/endpoints/budgetApi';

const budgetPlanAdapter = createEntityAdapter<BudgetPlan>();

interface BudgetExtraState {
  plansStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  plansError: string | null;
  activePeriod: ActivePeriodResponse | null;
  activePeriodStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  activePeriodError: string | null;
}

const initialState = budgetPlanAdapter.getInitialState<BudgetExtraState>({
  plansStatus: 'idle',
  plansError: null,
  activePeriod: null,
  activePeriodStatus: 'idle',
  activePeriodError: null,
});

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    resetActivePeriod(state) {
      state.activePeriod = null;
      state.activePeriodStatus = 'idle';
      state.activePeriodError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBudgetPlans
      .addCase(fetchBudgetPlans.pending, (state) => {
        state.plansStatus = 'loading';
        state.plansError = null;
      })
      .addCase(fetchBudgetPlans.fulfilled, (state, action) => {
        state.plansStatus = 'succeeded';
        budgetPlanAdapter.setAll(state, action.payload);
      })
      .addCase(fetchBudgetPlans.rejected, (state, action) => {
        state.plansStatus = 'failed';
        state.plansError = action.payload as string;
      })

      // createBudgetPlan
      .addCase(createBudgetPlan.fulfilled, (state, action) => {
        budgetPlanAdapter.addOne(state, action.payload);
        state.plansStatus = 'succeeded';
      })
      .addCase(createBudgetPlan.rejected, (state, action) => {
        state.plansError = action.payload as string;
      })

      // fetchActivePeriod
      .addCase(fetchActivePeriod.pending, (state) => {
        state.activePeriodStatus = 'loading';
        state.activePeriodError = null;
      })
      .addCase(fetchActivePeriod.fulfilled, (state, action) => {
        state.activePeriodStatus = 'succeeded';
        state.activePeriod = action.payload;
      })
      .addCase(fetchActivePeriod.rejected, (state, action) => {
        state.activePeriodStatus = 'failed';
        state.activePeriodError = action.payload as string;
      });
  },
});

export const { resetActivePeriod } = budgetSlice.actions;

export const {
  selectAll: selectAllBudgetPlans,
  selectById: selectBudgetPlanById,
} = budgetPlanAdapter.getSelectors((state: RootState) => state.budget);

export const selectPlansStatus = (state: RootState) => state.budget.plansStatus;
export const selectActivePeriod = (state: RootState) => state.budget.activePeriod;
export const selectActivePeriodStatus = (state: RootState) => state.budget.activePeriodStatus;

export default budgetSlice.reducer;
