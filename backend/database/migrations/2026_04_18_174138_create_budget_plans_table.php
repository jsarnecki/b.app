<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('period_type', ['monthly'])->default('monthly');
            $table->decimal('total_amount', 10, 2);
            $table->date('starts_at');
            $table->date('ends_at')->nullable();
            $table->decimal('surplus_pool', 10, 2)->default(0.00);
            $table->decimal('deficit_pool', 10, 2)->default(0.00);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_plans');
    }
};
