<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     *
     */
    public function index(): array
    {
        return [];
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
        $data = $request->all();
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
