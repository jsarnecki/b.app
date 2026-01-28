<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function () {
    return response()->json([
        'message' => 'Hello from Laravel!',
        'timestamp' => now()
    ]);
});

Route::post('/create_transaction', [TransactionController::class, 'store']);
Route::get('/get_transactions', [TransactionController::class, 'index']);
