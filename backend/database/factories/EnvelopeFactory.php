<?php

namespace Database\Factories;

use App\Models\BudgetPeriod;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Envelope>
 */
class EnvelopeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'budget_period_id' => BudgetPeriod::factory(),
            'category_id' => Category::factory(),
            'allocated_amount' => Arr::random([50, 100, 200, 300]),
            'carried_over' => null,
        ];
    }
}
