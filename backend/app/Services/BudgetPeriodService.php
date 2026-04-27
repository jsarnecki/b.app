<?php

namespace App\Services;

use App\Models\BudgetPeriod;
use App\Models\BudgetPlan;
use App\Models\Envelope;
use Carbon\Carbon;
use RuntimeException;

class BudgetPeriodService
{
    /**
     * Generate a new period for a plan and seed its envelopes from plan defaults (planEnvelopes).
     *
     * Period 1: starts on plan->starts_at, ends on the last day of that month.
     *
     * Subsequent periods: start on the 1st of the month following $previousPeriodEndDate,
     * end on the last day of that month.
     *
     * Note: calendar month boundaries are assumed throughout.
     *
     * @throws RuntimeException if the new period would start after plans->ends_at
     */
    public function generatePeriod(BudgetPlan $plan, ?Carbon $previousPeriodEndDate = null): BudgetPeriod
    {
        if (is_null($previousPeriodEndDate)) {
            // If first period of new plan use current date, otherwise first day of next month.
            $startDate = Carbon::parse($plan->starts_at)->startOfDay();
        } else {
            $startDate = $previousPeriodEndDate->copy()->addMonthNoOverflow()->startOfMonth();
        }

        $endDate = $startDate->copy()->endOfMonth();

        if (!is_null($plan->ends_at) && $startDate->gt(Carbon::parse($plan->ends_at))) {
            throw new RuntimeException(
                /* trans('error.plan_start_exceeds_end') */ // TODO add to errors file.
                "Period start date can't be after plan ends_at."
            );
        }

        $period = BudgetPeriod::create([
            'budget_plan_id' => $plan->id,
            'start_date'     => $startDate->toDateString(),
            'end_date'       => $endDate->toDateString(),
            'status'         => 'active',
        ]);

        // Envelopes are created for this period from the template (PlanEnvelopes) under the assumption the user hasn't customized this period's envelopes.
        $plan->planEnvelopes()->get()->each(function ($planEnvelope) use ($period) {
            Envelope::create([
                'budget_period_id' => $period->id,
                'category_id'      => $planEnvelope->category_id,
                'allocated_amount' => $planEnvelope->amount,
                'carried_over'     => null,
            ]);
        });

        return $period;
    }

    /**
     * Close a period and activate or generate the next one.
     *
     * Surplus/deficit pool mutation is deferred to a future story.
     * Inter-envelope transfers and carry-over logic are also deferred.
     *
     * @throws RuntimeException if the new period would start after plans->ends_at
     */
    public function closePeriod(BudgetPeriod $period): void
    {
        $period->update(['status' => 'closed']);

        // TODO (end-of-period story): calculate surplus/deficit per envelope,
        // update plan->surplus_pool and plan->deficit_pool, handle carry-over.

        $this->generatePeriod($period->plan, Carbon::parse($period->end_date));
    }
}
