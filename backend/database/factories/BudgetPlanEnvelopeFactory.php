<?php

namespace Database\Factories;

use App\Models\BudgetPlan;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BudgetPlanEnvelope>
 */
class BudgetPlanEnvelopeFactory extends Factory
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
            'category_id' => Category::factory(),
            'amount' => Arr::random([100, 200, 300, 400, 500]),
        ];
    }
}
