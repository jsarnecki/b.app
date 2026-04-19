<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BudgetPlansTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
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
