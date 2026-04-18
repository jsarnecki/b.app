<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_plan_envelopes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_plan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_plan_envelopes');
    }
};
