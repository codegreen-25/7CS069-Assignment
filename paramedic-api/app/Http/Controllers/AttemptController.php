<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\AttemptItem;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttemptController extends Controller
{
    public function create(\Illuminate\Http\Request $req) {
    $data = $req->validate([
        'quizId' => 'required|integer|exists:quizzes,id'
    ]);

    $quizId = (int) $data['quizId'];

    // Reuse latest in-progress attempt
    $existing = Attempt::where('user_id', $req->user()->id)
        ->where('quiz_id', $quizId)
        ->whereNull('submitted_at')
        ->latest('created_at')
        ->first();

    if ($existing) {
        return response()->json(['attemptId' => $existing->id]);
    }

    $attempt = Attempt::create([
        'user_id' => $req->user()->id,
        'quiz_id' => $quizId,
    ]);

    return response()->json(['attemptId' => $attempt->id]);
}

public function saveAnswer(Request $req, $attemptId)
{
    // Validate payload
    $data = $req->validate([
        'questionId'      => ['required','integer'],
        'chosenAnswerId'  => ['nullable','integer'],  
    ]);

    // Fetch the attempt, ensure it belongs to the user and is not submitted
    /** @var Attempt $attempt */
    $attempt = Attempt::where('id', $attemptId)
        ->where('user_id', $req->user()->id)
        ->whereNull('submitted_at')
        ->firstOrFail();

    // Ensure the question belongs to this attempt's quiz
    $question = Question::where('id', $data['questionId'])
        ->where('quiz_id', $attempt->quiz_id)
        ->firstOrFail();

    // Ensure chosenAnswerId is an answer for this question
    if (!empty($data['chosenAnswerId'])) {
        $valid = \DB::table('answers')
            ->where('id', $data['chosenAnswerId'])
            ->where('question_id', $question->id)
            ->exists();
        if (!$valid) {
            return response()->json(['message' => 'Invalid answer for this question'], 422);
        }
    }

    // Upsert attempt item
    $item = AttemptItem::updateOrCreate(
        ['attempt_id' => $attempt->id, 'question_id' => $question->id],
        ['chosen_answer_id' => $data['chosenAnswerId'] ?? null]
    );

    return response()->json([
        'ok' => true,
        'attemptItemId' => $item->id,
    ]);
}

public function submit(Request $req, $id)
{
    /** @var Attempt $attempt */
    $attempt = Attempt::where('id', $id)
        ->where('user_id', $req->user()->id)
        ->firstOrFail();

    // Total questions in this quiz
    $total = Question::where('quiz_id', $attempt->quiz_id)->count();

    // Count answered items (chosen_answer_id not null)
    $answered = AttemptItem::where('attempt_id', $attempt->id)
        ->whereNotNull('chosen_answer_id')
        ->count();

    if ($answered < $total) {
        // List which are missing
        $allQ = Question::where('quiz_id', $attempt->quiz_id)->pluck('id')->all();
        $answeredQ = AttemptItem::where('attempt_id', $attempt->id)
                        ->whereNotNull('chosen_answer_id')
                        ->pluck('question_id')
                        ->all();
        $missing = array_values(array_diff($allQ, $answeredQ));

        return response()->json([
            'message' => 'Please answer all questions before submitting.',
            'missing_question_ids' => $missing,
            'answered' => $answered,
            'total' => $total,
        ], 422);
    }

    // Calculate score
    $correctCount = AttemptItem::where('attempt_id', $attempt->id)
        ->whereHas('chosenAnswer', function ($q) {
            $q->where('is_correct', true);
        })
        ->count();

    $percentage = $total > 0 ? round(($correctCount / $total) * 100) : 0;

    // Mark as submitted
    $attempt->submitted_at = now();
    $attempt->score = $correctCount;
    $attempt->total = $total;
    $attempt->percentage = $percentage;
    $attempt->save();

    // Build review payload
  // Load everything we need, including answer text and correctness
        $items = AttemptItem::where('attempt_id', $attempt->id)
            ->with([
                'question:id,stem,explanation',
                'question.answers:id,question_id,text,is_correct',
                'chosenAnswer:id,question_id,text',
            ])
            ->get();

        $review = $items->map(function ($it) {
            // Find the correct answer model (may be null if data incomplete)
            $correctAnswer = $it->question->answers->firstWhere('is_correct', true);

            return [
                'questionId'         => $it->question_id,
                'stem'               => $it->question->stem,
                'chosenAnswerId'     => $it->chosen_answer_id,
                'chosenAnswerText'   => optional($it->chosenAnswer)->text,
                'correctAnswerId'    => optional($correctAnswer)->id,
                'correctAnswerText'  => optional($correctAnswer)->text,
                'explanation'        => $it->question->explanation,
            ];
        })->values();


    return response()->json([
        'score'       => $correctCount,
        'total'       => $total,
        'percentage'  => $percentage,
        'review'      => $review,
    ]);
}


    public function mine(\Illuminate\Http\Request $req) {
    $status = $req->query('status', 'completed'); // completed | in_progress | all

    $q = \App\Models\Attempt::where('user_id', $req->user()->id)
        ->with('quiz:id,title');

    if ($req->has('quizId')) {
        $q->where('quiz_id', (int) $req->query('quizId'));
    }

    if ($status === 'completed') {
        $q->whereNotNull('submitted_at');
    } elseif ($status === 'in_progress') {
        $q->whereNull('submitted_at');
    }

    return $q->orderByDesc('submitted_at')
             ->orderByDesc('created_at')
             ->get();
}
}

