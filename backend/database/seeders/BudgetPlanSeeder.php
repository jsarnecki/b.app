<?php

namespace Database\Seeders;

use App\Models\BudgetPlan;
/* use Illuminate\Database\Console\Seeds\WithoutModelEvents; */
use App\Models\BudgetPlanEnvelope;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BudgetPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Potentially lazy, but maybe just create 2-3 full blown plans here with envelopes and periods.
        $plan = BudgetPlan::factory()->create();

        BudgetPlanEnvelope::factory()
            ->count(3)
            ->for($plan)
            ->create();
    }
}
