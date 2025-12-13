<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Post extends Model
{
    protected $guarded = [];
    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function porperty() : BelongsTo
    {
        return $this->belongsTo(Porperty::class);
    }
    public function postimage() : HasMany
    {
        return $this->hasMany(PostImage::class);
    }
}
