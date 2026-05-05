<?php

namespace App\Http\Controllers;

use App\Models\BudgetPlan;
use App\Services\BudgetPeriodService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class BudgetPlanController extends Controller
{
    public function __construct(private BudgetPeriodService $periodService) {}

    // TODO: Handle auth verification.
    protected int $userID = 1;

    public function index(): JsonResponse
    {
        $plans = BudgetPlan::where('user_id', $this->userID)->get();

        return response()->json($plans);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                      => ['required', 'string', 'max:255'],
            'period_type'               => ['sometimes', 'in:monthly'],
            'total_amount'              => ['required', 'numeric', 'min:0'],
            'starts_at'                 => ['required', 'date'],
            'ends_at'                   => ['nullable', 'date', 'after:starts_at'],
            'envelopes'                 => ['required', 'array', 'min:1'],
            'envelopes.*.category_id'   => ['required', 'integer', 'exists:categories,id'],
            'envelopes.*.amount'        => ['required', 'numeric', 'min:0'],
            //TODO eventually have validation that all envelope amounts add up to 'total_amount'
        ]);

        try {
            $plan = BudgetPlan::create([
                'user_id'      => $this->userID,
                'name'         => $validated['name'],
                'period_type'  => $validated['period_type'] ?? 'monthly',
                'total_amount' => $validated['total_amount'],
                'starts_at'    => $validated['starts_at'],
                'ends_at'      => $validated['ends_at'] ?? null,
            ]);

            foreach ($validated['envelopes'] as $envelopeData) {
                $plan->planEnvelopes()->create([
                    'category_id' => $envelopeData['category_id'],
                    'amount'      => $envelopeData['amount'],
                ]);
            }

            $period = $this->periodService->generatePeriod($plan);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'plan'   => $plan->load('planEnvelopes'),
            'period' => $period->load('envelopes'),
        ], 201);
    }

    public function show(BudgetPlan $plan): JsonResponse
    {
        if ($plan->user_id !== $this->userID) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        return response()->json($plan->load('periods'));
    }
}
