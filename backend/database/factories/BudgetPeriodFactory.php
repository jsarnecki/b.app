<?php

namespace Database\Factories;

use App\Models\BudgetPlan;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BudgetPeriod>
 */
class BudgetPeriodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'budget_plan_id' => BudgetPlan::factory(),
            'start_date',
            'end_date',
            'status',
        ];
    }

    /**
     * The first period in a budget plan.
     */
    public function first(): static
    {
        $thisMonth = Carbon::now()->startOfMonth();
        $plan = BudgetPlan::factory()->create([
            'starts_at' => $thisMonth->format('Y-m-d'),
            'ends_at' => null
        ]);

        return $this->state(fn() => [
            'budget_plan_id' => $plan->id,
            'start_date' => $thisMonth->format('Y-m-d'),
            'end_date' => $thisMonth->endOfMonth()->format('Y-m-d'),
            'status' => 'active'
        ]);
    }
}
