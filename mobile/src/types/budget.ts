import { Category } from './category';

export interface BudgetPlanEnvelope {
  id: number;
  budget_plan_id: number;
  category_id: number;
  amount: number;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface BudgetPlan {
  id: number;
  user_id: number;
  name: string;
  period_type: string;
  total_amount: number;
  starts_at: string;
  ends_at: string | null;
  surplus_pool: number;
  deficit_pool: number;
  created_at: string;
  updated_at: string;
  plan_envelopes: BudgetPlanEnvelope[];
}

export interface BudgetPeriod {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface PeriodEnvelope {
  id: number;
  category_id: number;
  category_name: string;
  allocated_amount: number;
  carried_over: number | null;
  spent: number;
  remaining: number;
}

export interface ActivePeriodResponse {
  period: BudgetPeriod;
  envelopes: PeriodEnvelope[];
}

export interface CreateBudgetPlanPayload {
  name: string;
  total_amount: number;
  starts_at: string;
  envelopes: { category_id: number; amount: number }[];
}
