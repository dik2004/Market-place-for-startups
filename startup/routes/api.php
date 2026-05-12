<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StartupController;
use App\Http\Controllers\EOIController;
use App\Http\Controllers\AIMatchController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/startups',      [StartupController::class, 'index']);
Route::get('/startups/{id}', [StartupController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::middleware('role:founder')->group(function () {
        Route::post('/startups',          [StartupController::class, 'store']);
        Route::put('/startups/{id}',      [StartupController::class, 'update']);
        Route::delete('/startups/{id}',   [StartupController::class, 'destroy']);
        Route::get('/my-startups',        [StartupController::class, 'mine']);
        Route::get('/startups/{id}/eois', [EOIController::class, 'forStartup']);
        Route::patch('/eois/{id}/status', [EOIController::class, 'updateStatus']);
    });

    Route::middleware('role:investor')->group(function () {
        Route::post('/eois',     [EOIController::class, 'store']);
        Route::get('/my-eois',   [EOIController::class, 'mine']);
        Route::post('/ai-match', [AIMatchController::class, 'match']);
    });
});