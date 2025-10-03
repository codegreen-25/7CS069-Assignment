<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseStudy extends Model
{
    protected $fillable = ['title', 'description', 'created_by'];

    // A case study can have many quizzes
    public function quizzes(){ return $this->hasMany(\App\Models\Quiz::class); }


    // (optional) if you want to know which user created it
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}