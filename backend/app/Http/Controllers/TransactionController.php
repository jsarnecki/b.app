<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    // TODO: Handle auth verification.
    protected int $userID = 1;

    /**
     * Get all Transactions for a User.
     */
    public function index(Request $request): JsonResponse
    {
        $user = User::findOrFail($this->userID);
        return response()->json($user->transactions);
    }

    /**
     * Show a Transaction for a User.
     */
    public function show(): array
    {
        return [];
    }

    /**
     * Create a new Transaction record.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|string|max:255',
            /* 'category' => 'required|string|max:255', */
            'category_id' => 'required|integer', // I think the F/E will have the ID
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date', // eventually add specific format [Rule::date()->format(ideal timestamp)]
        ]);

        $data = [
            ...$data,
            'user_id' => $this->userID
        ];

        try {
            DB::beginTransaction();
            $transaction = Transaction::create($data);
            DB::commit();
        } catch (Exception $error) {
            DB::rollBack();
            Log::error('Failed to create transaction: ' . $error->getMessage());
            return response()->json(['message' => 'Failed to save transaction'], 500);
        }
        return response()->json(['id' => $transaction->id]);
    }

    /**
     * Update a Transaction record.
     */
    public function update(): array
    {
        return [];
    }

    /**
     * Delete a Transaction record.
     */
    public function destroy(): array
    {
        return [];
    }
}
