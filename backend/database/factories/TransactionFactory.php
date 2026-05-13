<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
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
            'type' => 'expense',
            'category_id'  => Category::factory(),
            'amount' => $this->faker->randomFloat(2, 1, 250),
            'description' => $this->faker->realTextBetween(2, 10),
            'transaction_date' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
        ];
    }
}
