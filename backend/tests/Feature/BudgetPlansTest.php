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
        $plan = BudgetPlan::factory()->create([
            'starts_at' => Carbon::now()->format('Y-m-d'),
            'ends_at'   => null,
        ]);

        BudgetPlanEnvelope::factory()
            ->count(3)
            ->for($plan)
            ->create();

        $period = $this->budgetPeriodService->generatePeriod($plan, null);

        // New period is tied to the BudgetPlan.
        $this->assertSame($plan->id, $period->budget_plan_id);

        // Period start date is same as BudgetPlan's (when null passed).
        $this->assertTrue(Carbon::parse($plan->starts_at)->isSameDay(Carbon::parse($period->start_date)));

        // Period's end date is end of the same month as it starts.
        $this->assertTrue(Carbon::parse($period->start_date)->endOfMonth()->isSameDay(Carbon::parse($period->end_date)));

        // Period had all 3 envelopes associated to it.
        $this->assertDatabaseCount('envelopes', 3);
        $this->assertDatabaseHas('envelopes', [
            'budget_period_id' => $period->id
        ]);
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
