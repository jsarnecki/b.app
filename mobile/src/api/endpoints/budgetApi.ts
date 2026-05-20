import { createAsyncThunk } from '@reduxjs/toolkit';
import { getJson, postJson } from '../api';
import { ActivePeriodResponse, BudgetPlan, CreateBudgetPlanPayload } from '../../types/budget';

export const fetchBudgetPlans = createAsyncThunk<BudgetPlan[]>(
  'budget/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getJson('/api/budget_plans');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch budget plans');
    }
  }
);

export const createBudgetPlan = createAsyncThunk<BudgetPlan, CreateBudgetPlanPayload>(
  'budget/createPlan',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postJson('/api/budget_plans', payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create budget plan');
    }
  }
);

export const fetchActivePeriod = createAsyncThunk<ActivePeriodResponse, number>( // confirm return structure... 
  'budget/fetchActivePeriod',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await getJson(`/api/budget_plans/${planId}/active_period`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch active period');
    }
  }
);
