<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BudgetPlan>
 */
class BudgetPlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => 'annual budget',
            'period_type' => 'monthly',
            'total_amount' => 500,
            'starts_at' => Carbon::now()->format('Y-m-d'),
            'ends_at' => null,
            'surplus_pool' => 0,
            'deficit_pool' => 0,
        ];
    }
}
