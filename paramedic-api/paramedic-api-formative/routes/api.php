<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\AttemptController;
use App\Http\Controllers\FlagController;
use App\Http\Controllers\TokenAuthController;

/*
|--------------------------------------------------------------------------
| Public authentication routes (stateless)
|--------------------------------------------------------------------------
| These return/accept a Sanctum personal access token.  No cookies or CSRF
| are required.  Front-end will send Authorization: Bearer <token>.
*/
Route::post('/auth/register', [TokenAuthController::class, 'register']);
Route::post('/auth/login',    [TokenAuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Routes that require a valid Bearer token
|--------------------------------------------------------------------------
| All quiz/flag/attempt endpoints stay behind auth:sanctum.
| The user includes  Authorization: Bearer <token>  header.
*/
Route::middleware('auth:sanctum')->group(function () {
    // logout simply deletes the current token
    Route::post('/auth/logout', [TokenAuthController::class, 'logout']);

    // user profile (optional convenience endpoint)
    Route::get('/user', fn (\Illuminate\Http\Request $request) => $request->user());

    // --- your original protected routes ---
    Route::get('/case-studies',            [CatalogController::class, 'index']);
    Route::get('/quizzes/{id}',            [CatalogController::class, 'quiz']);
    Route::get('/quizzes/{id}/question',   [CatalogController::class, 'singleQuestion']);

    Route::post('/attempts',               [AttemptController::class, 'create']);
    Route::patch('/attempts/{id}/answer',  [AttemptController::class, 'saveAnswer']);
    Route::post('/attempts/{id}/submit',   [AttemptController::class, 'submit']);
    Route::get('/attempts/mine',           [AttemptController::class, 'mine']);

    Route::post('/flags',                  [FlagController::class, 'store']);
    Route::get('/flags',                   [FlagController::class, 'index']);
    Route::delete('/flags/{question}',     [FlagController::class, 'destroyByQuestion']);
});
