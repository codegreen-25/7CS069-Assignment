<?php

namespace App\Http\Controllers;

use App\Models\Flag;
use App\Models\Question;
use Illuminate\Http\Request;

class FlagController extends Controller
{
    public function index(Request $req) {
        $flags = Flag::with(['question.quiz.caseStudy'])
            ->where('user_id', $req->user()->id)
            ->latest()->get()
            ->map(fn($f) => [
                'flagId' => $f->id,
                'questionId' => $f->question_id,
                'stem' => $f->question->stem,
                'quiz' => ['id'=>$f->question->quiz->id, 'title'=>$f->question->quiz->title],
                'caseStudy' => ['id'=>$f->question->quiz->caseStudy->id, 'title'=>$f->question->quiz->caseStudy->title],
                'createdAt' => $f->created_at,
            ]);
        return response()->json($flags);
    }

    public function store(Request $req) {
        $req->validate(['question_id' => 'required|integer|exists:questions,id']);
        $flag = Flag::firstOrCreate([
            'user_id' => $req->user()->id,
            'question_id' => $req->question_id,
        ]);
        return response()->json(['ok'=>true, 'flagId'=>$flag->id], 201);
    }

    public function destroyByQuestion(Request $req, Question $question) {
        Flag::where('user_id', $req->user()->id)->where('question_id', $question->id)->delete();
        return response()->json(['ok'=>true]);
    }
}

