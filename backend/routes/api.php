<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Models\User;
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

Route::get('/me', fn() => User::findOrFail(1)); // Temp hard code
Route::post('/create_transaction', [TransactionController::class, 'store']);
Route::get('/get_transactions', [TransactionController::class, 'index']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
