<?php

namespace App\Http\Controllers;

use App\Models\CaseStudy;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Flag;
use Illuminate\Http\Request;
use App\Models\AttemptItem;

class CatalogController extends Controller
{
    // List case studies + their quizzes (id only)
    public function index() {
        // Return case studies with an array of quiz ids (no titles needed)
        $caseStudies = CaseStudy::select('id','title','description')
            ->with(['quizzes:id,case_study_id'])
            ->get();

        // Map quizzes to just {id}
        $data = $caseStudies->map(function($cs){
            return [
                'id' => $cs->id,
                'title' => $cs->title,
                'description' => $cs->description,
                'quizzes' => $cs->quizzes->map(fn($q)=> ['id'=>$q->id])->values(),
                'quizzes_count' => $cs->quizzes->count(),
            ];
        });

        return response()->json($data);
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

public function singleQuestion(\Illuminate\Http\Request $req, $quizId)
{
    $index = (int) $req->query('index', 0);
    $attemptId = $req->query('attemptId');

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

    $flagged = Flag::where('user_id', $req->user()->id ?? null)
        ->where('question_id', $q->id)
        ->exists();

    $prevChosen = null;
    if ($attemptId) {
        $prevChosen = AttemptItem::where('attempt_id', $attemptId)
            ->where('question_id', $q->id)
            ->value('chosen_answer_id');
    }

    return response()->json([
        'id'        => $q->id,
        'order_index' => $q->order_index,
        'stem'      => $q->stem,
        'answers'   => $q->answers->map(fn($a)=>['id'=>$a->id, 'text'=>$a->text])->values(),
        'flagged'   => $flagged,
        'previouslyChosenAnswerId' => $prevChosen,
        'total'     => $total,      // optional convenience for the client
        'index'     => $index       // echo back
    ]);
}
}

