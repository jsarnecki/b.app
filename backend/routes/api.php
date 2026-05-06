<?php

use App\Http\Controllers\BudgetPeriodController;
use App\Http\Controllers\BudgetPlanController;
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

Route::apiResource('/transactions', TransactionController::class);
Route::apiResource('/categories', CategoryController::class);

Route::get('/budget_plans', [BudgetPlanController::class, 'index']);
Route::post('/budget_plans', [BudgetPlanController::class, 'store']);
Route::get('/budget_plans/{plan}', [BudgetPlanController::class, 'show']);
Route::get('/budget_plans/{plan}/active_period', [BudgetPeriodController::class, 'activePeriod']);
Route::post('/budget_periods/{period}/close', [BudgetPeriodController::class, 'close']);
