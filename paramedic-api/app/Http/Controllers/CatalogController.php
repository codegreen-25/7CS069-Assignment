<?php

namespace App\Http\Controllers;

use App\Models\CaseStudy;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Flag;
use Illuminate\Http\Request;
use App\Models\AttemptItem;
use App\Models\Attempt;

class CatalogController extends Controller
{
    public function index() {
        $caseStudies = CaseStudy::query()
            ->select(['id','title','description'])
            ->with(['quizzes' => function ($q) {
                $q->select(['id','case_study_id','title']);
            }])
            ->get();

        return response()->json($caseStudies);
    }

    public function quiz($id) {
        $count = \App\Models\Question::where('quiz_id', $id)->count();
        $quiz  = \App\Models\Quiz::findOrFail($id);

        return response()->json([
            'id' => $quiz->id,
            'case_study_id' => $quiz->case_study_id,
            'title' => $quiz->title ?? null,
            'questions_count' => $count,
            'instructions' => $quiz->instructions ?? null,
        ]);
    }

public function singleQuestion(Request $req, $quizId)
{
    $index = (int) $req->query('index', 0);
    $attemptId = $req->query('attemptId');
    $userId    = optional($req->user())->id;

    $base = Question::where('quiz_id', $quizId)
            ->orderBy('order_index')
            ->orderBy('id');

    $total = (clone $base)->count();
    if ($total === 0) {
        return response()->json([
            'message' => 'This quiz has no questions.',
            'total'   => 0
        ], 404);
    }

    if ($index < 0 || $index >= $total) {
        return response()->json([
            'message' => 'Question index out of range.',
            'index'   => $index,
            'total'   => $total
        ], 404);
    }

    $q = (clone $base)->skip($index)->take(1)->firstOrFail();
    $q->load('answers:id,question_id,text');

    $flagged = false;
    if ($userId) {
        $flagged = Flag::where('user_id', $userId)
            ->where('question_id', $q->id)
            ->exists();
    }

    $prevChosen = null;
    if ($attemptId && $userId) {
        $attempt = Attempt::where('id', $attemptId)
            ->where('quiz_id', $quizId)
            ->where('user_id', $userId)
            ->whereNull('submitted_at')
            ->first();

        if ($attempt) {
            $prevChosen = AttemptItem::where('attempt_id', $attempt->id)
                ->where('question_id', $q->id)
                ->value('chosen_answer_id');
        }
    }

    return response()->json([
        'id'        => $q->id,
        'order_index' => $q->order_index,
        'stem'      => $q->stem,
        'answers'   => $q->answers->map(fn ($a) => ['id' => $a->id, 'text' => $a->text])->values(),
        'flagged'   => $flagged,
        'previouslyChosenAnswerId' => $prevChosen,
        'total'     => $total,
        'index'     => $index,
    ]);
}
}

