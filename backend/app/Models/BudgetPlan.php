<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetPlan extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'period_type',
        'total_amount',
        'starts_at',
        'ends_at',
        'surplus_pool',
        'deficit_pool',
    ];

    protected $casts = [
        'starts_at'    => 'date:Y-m-d',
        'ends_at'      => 'date:Y-m-d',
        'total_amount' => 'decimal:2',
        'surplus_pool' => 'decimal:2',
        'deficit_pool' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function planEnvelopes(): HasMany
    {
        return $this->hasMany(BudgetPlanEnvelope::class);
    }

    public function periods(): HasMany
    {
        return $this->hasMany(BudgetPeriod::class);
    }
}
