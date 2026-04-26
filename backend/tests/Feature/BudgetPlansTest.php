<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\BudgetPlan;
use App\Models\BudgetPlanEnvelope;
use App\Services\BudgetPeriodService;
use Carbon\Carbon;
use TClass;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BudgetPlansTest extends TestCase
{
    use RefreshDatabase;

    private $budgetPeriodService;

    public function setUp(): void
    {
        parent::setUp();
        $this->budgetPeriodService = app(BudgetPeriodService::class);
    }

    /**
     * Tests with null previous end date.
     */
    public function testGeneratePeriodNoPreviousEndDate(): void
    {
        /* $this->assertTrue(true); */

        /* $plan = BudgetPlan::factory([ */
        /*     'user_id'      => 1, */
        /*     'name'         => 'test', */
        /*     'period_type'  => 'monthly', */
        /*     'total_amount' => 500, */
        /*     'starts_at'    => Carbon::now()->format('y-m-d'), */
        /*     'ends_at'      => null, */
        /* ]); */

        $plan = BudgetPlan::factory()->create([
            'starts_at' => Carbon::now()->format('Y-m-d'),
            'ends_at'   => null,
        ]);

        BudgetPlanEnvelope::factory()
            ->count(3)
            ->for($plan)
            ->create();

        // create PlanEnvelopes for BudgetPlan->associate()
        /* $envelopes = BudgetPlanEnvelope::factory() */
        /*     ->count(3) */
        /*     ->for($plan) */
        /*     ->create(); */

        /* $envelopes->each(function ($envelope) use ($plan) { */
        /*     $plan->planEnvelope->associate($envelope); */
        /* }); */

        $period = $this->budgetPeriodService->generatePeriod($plan, null);
        // assert period has plan_id, ..
        $this->assertSame($plan->id, $period->budget_plan_id);
        // period start date is same as plan (when null passed) and end date is end of the month
        $this->assertSame(Carbon::parse($plan->starts_at)->startOfDay(), Carbon::parse($period->start_date)->startOfDay());
        $this->assertSame(Carbon::parse($period->start_date)->endOfMonth(), Carbon::parse($period->end_date));

        // period has envelopes associated to it period->envelope
        $this->assertDatabaseHas('envelopes', [
            'budget_period_id' => $period->id
        ]);
        $this->assertDatabaseCount('envelopes', 3);
    }


    /**
     * Tests with a previous end date.
     */
    public function testGeneratePeriodWithPreviousEndDate(): void
    {
        $this->assertTrue(true);
    }


    /**
     * Tests when new period would exceed the plan's ends_at
     */
    public function testGeneratePeriodExceedingPlanEnd(): void
    {
        $this->assertTrue(true);
    }

    /**
     * Test the budget plan is created.
     */
    public function testBudgetPlanStores(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test budget plan creation failed.
     */
    public function testBudgetPlanStoreFails(): void {}

    /**
     * Test fetching the active period.
     */
    public function testFetchActivePeriod(): void {}


    /**
     * Test fetching active period of other user fails.
     */
    public function testFetchWrongActivePeriod(): void {}


    /**
     * Test closing budget period (currently 501)
     */
    public function testClosePeriod(): void {}
}
