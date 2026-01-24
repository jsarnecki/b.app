<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('type', 255);
            $table->string('category', 255);
            $table->decimal('amount', 10, 2);
            $table->string('description')->nullable();
            $table->date('transaction_date');
            $table->timestampsTz();

            $table->foreign('user_id')->references('id')->on('users');
            $table->index(['user_id', 'transaction_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
