<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attempt extends Model
{
    protected $fillable = [
        'user_id','quiz_id','started_at','submitted_at',
        'score','total','percentage'
    ];

    protected $dates = ['started_at','submitted_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function attemptItems(): HasMany
    {
        return $this->hasMany(AttemptItem::class);
    }

    public function item(): HasMany{
        return $this->hasMany(AttemptItem::class);
    }
}
