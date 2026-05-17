<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Envelope extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_period_id',
        'category_id',
        'allocated_amount',
        'carried_over',
    ];

    protected $casts = [
        'allocated_amount' => 'float',
        'carried_over'     => 'float',
    ];

    public function period(): BelongsTo
    {
        return $this->belongsTo(BudgetPeriod::class, 'budget_period_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
