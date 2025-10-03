<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
   
    public function show(Question $question)
    {
        $question->load([
            'answers:id,question_id,text', 
            'quiz:id,case_study_id,title',
            'quiz.caseStudy:id,title'
        ]);

        return response()->json([
            'id'   => $question->id,
            'stem' => $question->stem,
            'quiz' => [
                'id'    => $question->quiz->id,
                'title' => $question->quiz->title,
                'caseStudy' => [
                    'id'    => $question->quiz->caseStudy->id,
                    'title' => $question->quiz->caseStudy->title,
                ],
            ],
            'answers' => $question->answers->map(fn($a) => [
                'id'   => $a->id,
                'text' => $a->text,
            ]),
        ]);
    }

  
    public function check(Request $request, Question $question)
    {
        $validated = $request->validate([
            'answer_id' => 'required|integer|exists:answers,id',
        ]);

        $answerId = (int) $validated['answer_id'];

        $chosen = Answer::where('id', $answerId)
            ->where('question_id', $question->id)
            ->first();

        if (!$chosen) {
            return response()->json([
                'message' => 'Answer does not belong to this question.'
            ], 422);
        }

        $correct = Answer::where('question_id', $question->id)
            ->where('is_correct', 1)
            ->first();

        if (!$correct) {
            return response()->json([
                'message' => 'No correct answer is set for this question.'
            ], 422);
        }

        $isCorrect = $chosen->id === $correct->id;

        return response()->json([
            'correct'             => $isCorrect,
            'correctAnswerId'     => $correct->id,
            'correctAnswerText'   => $correct->text,
            'chosenAnswerId'      => $chosen->id,
            'chosenAnswerText'    => $chosen->text,
            // only include if your table actually has this column; otherwise leave null
            'explanation'         => $question->explanation ?? null,
        ]);
    }
}
