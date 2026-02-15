<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     *
     */
    public function index(Request $request): JsonResponse
    {
        $transactions = User::findOrFail($request->all()['id'])->transactions;
        return response()->json($transactions);
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
    public function store(Request $request): array
    {
        /* $data = $request->all(); */
        $data = $request->validate([
            'user_id' => 'required|integer', // eventually handle this by tying to auth user instead of as a param
            'type' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'amount'  => 'required|decimal:2',
            'description'  => 'nullable|string',
            'transaction_date'  => 'required|date', // eventually add specific format [Rule::date()->format(ideal timestamp)]
        ]);

        $transaction = Transaction::create([
            'user_id' => $data['user_id'],
            'type' => $data['type'],
            'category' => $data['category'],
            'amount' => $data['amount'],
            'description' => $data['description'],
            'transaction_date' => $data['transaction_date'],
        ]);

        return ['id' => $transaction->id];
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
