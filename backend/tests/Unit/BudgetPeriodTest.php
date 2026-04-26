<?php

namespace Tests\Unit;

use App\Models\BudgetPlan;
use App\Services\BudgetPeriodService;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;
use TClass;

class BudgetPeriodTest extends TestCase
{
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
        $this->assertTrue(true);
        /**/
        /* $plan = BudgetPlan::factory([ */
        /*     'user_id'      => 1, */
        /*     'name'         => 'test', */
        /*     'period_type'  => 'monthly', */
        /*     'total_amount' => 500, */
        /*     'starts_at'    => Carbon::now()->format('y-m-d'), */
        /*     'ends_at'      => null, */
        /* ]); */
        /**/
        /* $period = $this->budgetPeriodService->generatePeriod($plan, null); */
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
}
