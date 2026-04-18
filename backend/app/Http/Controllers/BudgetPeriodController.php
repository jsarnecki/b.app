<?php

namespace App\Http\Controllers;

use App\Models\BudgetPlan;
use App\Models\BudgetPeriod;
use App\Services\BudgetPeriodService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class BudgetPeriodController extends Controller
{
    public function __construct(private BudgetPeriodService $periodService) {}

    // TODO: Handle auth verification.
    protected int $userID = 1;

    public function activePeriod(BudgetPlan $plan): JsonResponse
    {
        if ($plan->user_id !== $this->userID) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $period = $plan->periods()->where('status', 'active')->first();

        if (!$period) {
            return response()->json(['message' => 'No active period found.'], 404);
        }

        $envelopes = $period->envelopes()->with('category')->get()->map(function ($envelope) use ($period) {
            // Sum amount of all transactions with envelope's category_id.
            $spent = DB::table('transactions')
                ->where('category_id', $envelope->category_id)
                ->whereBetween('transaction_date', [
                    $period->start_date->toDateString(),
                    $period->end_date->toDateString(),
                ])
                ->sum('amount');

            return [
                'id'               => $envelope->id,
                'category_id'      => $envelope->category_id,
                'category_name'    => $envelope->category?->name,
                'allocated_amount' => $envelope->allocated_amount,
                'carried_over'     => $envelope->carried_over,
                'spent'            => round((float) $spent, 2),
                'remaining'        => round((float) $envelope->allocated_amount - (float) $spent, 2),
            ];
        });

        return response()->json([
            'period'    => [
                'id'         => $period->id,
                'start_date' => $period->start_date->toDateString(),
                'end_date'   => $period->end_date->toDateString(),
                'status'     => $period->status,
            ],
            'envelopes' => $envelopes,
        ]);
    }

    public function close(BudgetPeriod $period): JsonResponse
    {
        // TODO (end-of-period story): implement surplus/deficit handling,
        // carry-over options, and inter-envelope transfers before enabling this.
        // Will call budgetPeriodService->closePeriod($period)
        return response()->json([
            'message' => 'Period close is not yet implemented.',
        ], 501);
    }
}
