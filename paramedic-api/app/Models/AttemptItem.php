<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttemptItem extends Model
{
    protected $fillable = ['attempt_id','question_id','chosen_answer_id','is_correct'];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(Attempt::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function chosenAnswer(): BelongsTo
    {
        return $this->belongsTo(Answer::class, 'chosen_answer_id');
    }
}

