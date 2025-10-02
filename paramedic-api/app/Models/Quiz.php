<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    protected $fillable = ['case_study_id','title','instructions'];

    // Each quiz belongs to a single case study
    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }

    // A quiz has many questions
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    // A quiz can have many attempts by different users
    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class);
    }
}

