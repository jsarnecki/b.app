<?php

namespace Tests\Feature;

use App\Models\BudgetPeriod;
use App\Models\BudgetPlan;
use App\Models\BudgetPlanEnvelope;
use App\Models\User;
use App\Services\BudgetPeriodService;
use Carbon\Carbon;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BudgetPlansTest extends TestCase
{
    use RefreshDatabase;

    private $budgetPeriodService;
    private User $user;

    public function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow();
        $this->budgetPeriodService = app(BudgetPeriodService::class);
        /* $this->user = User::factory()->create(['id' => 1]); //TODO: auth */
    }

    /**
     * Tests with null previous end date.
     */
    public function testGeneratePeriodNoPreviousEndDate(): void
    {
        $plan = BudgetPlan::factory()->create([
            /* 'user_id' => $this->user->id, */
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
        $plan = BudgetPlan::factory()->create([
            'starts_at' => Carbon::now()->subMonths(2)->format('Y-m-d'),
            'ends_at'   => null,
        ]);

        BudgetPlanEnvelope::factory()
            ->count(3)
            ->for($plan)
            ->create();

        $periodOne = $this->budgetPeriodService->generatePeriod($plan, null);

        // Generate next period with previous period's end_date.
        $periodTwo = $this->budgetPeriodService->generatePeriod($plan, $periodOne->end_date);

        // New period is tied to the BudgetPlan.
        $this->assertSame($plan->id, $periodTwo->budget_plan_id);

        // periodTwo start date is the day after periodTwo's end_date.
        $this->assertTrue(Carbon::parse($periodOne->end_date)->isBefore(Carbon::parse($periodTwo->start_date)));

        // periodTwo's end date is end of the same month as it starts.
        $this->assertTrue(Carbon::parse($periodTwo->start_date)->endOfMonth()->isSameDay(Carbon::parse($periodTwo->end_date)));

        // periodOne and periodTwo have all 3 envelopes associated to them.
        $this->assertDatabaseCount('envelopes', 6);
        $this->assertDatabaseHas('envelopes', [
            'budget_period_id' => $periodOne->id
        ]);
        $this->assertDatabaseHas('envelopes', [
            'budget_period_id' => $periodTwo->id
        ]);
    }

    /**
     * Tests when new period would exceed the plan's ends_at
     */
    public function testGeneratePeriodExceedingPlanEnd(): void
    {
        // Plan started last month, ends this month.
        $plan = BudgetPlan::factory()->create([
            'starts_at' => Carbon::now()->subMonth()->format('Y-m-d'),
            'ends_at'   =>  Carbon::now()->endOfMonth()->format('Y-m-d'),
        ]);

        $this->assertThrows(
            // previousPeriodEndDate was end of this month, and the next start would be next month, so should throw exception.
            fn() => $this->budgetPeriodService->generatePeriod($plan, Carbon::now()->endOfMonth()),
            RuntimeException::class,
            "Period start date can't be after plan ends_at." // TODO replace with trans('error') eventually.
        );

        // Assert DB does not have next month period with this plan.
        $this->assertDatabaseMissing('budget_periods', [
            'start_date' => Carbon::now()->addMonthNoOverflow()->startOfMonth()->format('Y-m-d'),
            'budget_plan_id' => $plan->id
        ]);
    }

    /**
     * Test the budget plan is created.
     */
    public function testBudgetPlanStores(): void
    {
        // Test will fail without having a user with id 1 in db.
        // TODO: auth update
        User::factory()->create(['id' => 1]);

        $envelopeCount = 3;
        $envelopes = BudgetPlanEnvelope::factory()
            ->count($envelopeCount)
            ->create()
            ->toArray();

        $planStart = Carbon::now()->format('Y-m-d');
        $planName = $this->faker->words(2, true);
        $planType = 'monthly';
        $planTotal = 500;

        $budgetPlanBody = [
            'name' => $planName,
            'period_type' => $planType,
            'total_amount' => $planTotal,
            'starts_at' => $planStart,
            'ends_at' => null,
            'envelopes' => $envelopes,
        ];

        $response = $this->post('/api/budget_plans', $budgetPlanBody);
        $response->assertStatus(201);

        $budgetPlan = BudgetPlan::findOrFail($response->json()['plan']['id']);
        $budgetPeriod = BudgetPeriod::findOrFail($response->json()['period']['id']);

        // budgetPlan has planEnvelopes, and budgetPeriod has periodEnvelopes.
        $this->assertEquals($envelopeCount, $budgetPlan->planEnvelopes()->count());
        $this->assertEquals($envelopeCount, $budgetPeriod->envelopes()->count());

        $this->assertDatabaseHas('budget_periods', [
            'budget_plan_id' => $budgetPlan->id,
            'start_date' => Carbon::parse($planStart)->startOfDay(),
            'end_date' => Carbon::parse($planStart)->endOfMonth(),
            'status' => 'active' // enum? const?
        ]);

        $this->assertDatabaseHas('budget_plans', [
            'id' => $budgetPlan->id,
            'name' => $planName,
            'period_type' => $planType,
            'total_amount' => $planTotal,
            'starts_at' => $planStart,
            'ends_at' => null,
        ]);
    }

    /*
     * Failing cases for BudgetPlanStoreFails test.
     */
    public static function invalidPlanPayloads(): array
    {
        return [
            'missing name' => [
                ['total_amount' => 500, 'starts_at' => '2026-04-01', 'envelopes' => [['category_id' => 1, 'amount' => 500]]],
            ],
            'missing total_amount' => [
                ['name' => 'Test', 'starts_at' => '2026-04-01', 'envelopes' => [['category_id' => 1, 'amount' => 500]]],
            ],
            'empty envelopes array' => [
                ['name' => 'Test', 'total_amount' => 500, 'starts_at' => '2026-04-01', 'envelopes' => []],
            ],
            'invalid category_id' => [
                ['name' => 'Test', 'total_amount' => 500, 'starts_at' => '2026-04-01', 'envelopes' => [['category_id' => 99999, 'amount' => 500]]],
            ],
            'ends_at before starts_at' => [
                ['name' => 'Test', 'total_amount' => 500, 'starts_at' => '2026-04-01', 'ends_at' => '2026-03-01', 'envelopes' => [['category_id' => 1, 'amount' => 500]]],
            ],
        ];
    }

    /**
     * Test budget plan creation failed.
     */
    #[DataProvider('invalidPlanPayloads')]
    public function testBudgetPlanStoreFails(array $payload): void
    {
        $this->postJson('/api/budget_plans', $payload)->assertStatus(422);
    }

    /**
     * Test fetching the active period.
     */
    public function testFetchActivePeriod(): void
    {
        $this->assertTrue(true);
        //TODO: implement when auth in place
        //
        /*     $user = User::factory()->create(); */
        /*     $plan = BudgetPlan::factory()->create([ */
        /*         'starts_at' => Carbon::now()->startOfMonth()->format('Y-m-d'), */
        /*         'ends_at'   => null, */
        /*         'user_id' => $user->id  */
        /*     ]); */
        /**/
        /*     BudgetPeriod::factory() */
        /*         ->first() */
        /*         ->for($plan) */
        /*         ->create(); */
        /**/
        /*     $response = $this->get("/api/budget_plans/{$plan->id}/active_period"); */
        /*     $response->assertOk(); */
    }

    /**
     * Test fetching active period of other user fails.
     */
    public function testFetchWrongActivePeriod(): void
    {
        $user = User::factory()->create(['id' => 100]); // TODO: update with separate users when auth in place
        $plan = BudgetPlan::factory()->create([
            'starts_at' => Carbon::now()->startOfMonth()->format('Y-m-d'),
            'ends_at'   => null,
            'user_id' => $user->id
        ]);

        BudgetPeriod::factory()
            ->first()
            ->for($plan)
            ->create();

        $response = $this->get("/api/budget_plans/{$plan->id}/active_period");
        $response->assertStatus(404);
        $this->assertEquals('Not found.', $response->json()['message']);
    }

    /**
     * Test closing budget period (currently 501) TODO: update when route implemented
     */
    public function testClosePeriod(): void
    {
        $period = BudgetPeriod::factory()->create();
        $response = $this->post("/api/budget_periods/{$period->id}/close");
        $response->assertStatus(501);
    }
}
