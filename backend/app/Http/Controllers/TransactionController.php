<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    /**
     *
     */
    public function index(Request $request): JsonResponse
    {
        // Handle auth verification.
        $user = User::findOrFail($request->all()['id']);
        /* $transactions = $user->transactions; */
        return response()->json($user->transactions);
    }


    /**
     *
     */
    public function show(): array
    {
        return [];
    }

    /**
     *
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|integer', // eventually handle this by tying to auth user instead of as a param
            'type' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date', // eventually add specific format [Rule::date()->format(ideal timestamp)]
        ]);

        try {
            $transaction = Transaction::create($data);
        } catch (Exception $error) {
            Log::error('Failed to create transaction: ' . $error->getMessage());
            /* throw new Exception('Store error: ' . $error); */
            return response()->json(['error' => 'Failed to save transaction'], 500);
        }
        return response()->json(['id' => $transaction->id]);
    }

    /**
     *
     */
    public function update(): array
    {
        return [];
    }

    /**
     *
     */
    public function destroy(): array
    {
        return [];
    }
}
