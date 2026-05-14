<?php

namespace Database\Seeders;

use App\Models\BudgetPeriod;
use App\Models\BudgetPlan;
/* use Illuminate\Database\Console\Seeds\WithoutModelEvents; */
use App\Models\BudgetPlanEnvelope;
use App\Models\Envelope;
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

        // TODO: we need to set up legit budget plan seeder/factory that we can feed a number of months of how long it's been going until now
        BudgetPeriod::factory()
            /* ->for($plan) */
            ->create([
                'budget_plan_id' => $plan->id
            ]);

        $budgetPeriod = BudgetPeriod::factory()->first()
            /* ->for($plan) */
            ->create([
                'budget_plan_id' => $plan->id
            ]);

        Envelope::factory()->create([
            'budget_period_id' => $budgetPeriod->id
        ]);
    }
}
