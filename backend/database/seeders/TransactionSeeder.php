<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Transaction;
/* use Illuminate\Database\Console\Seeds\WithoutModelEvents; */
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Transaction::factory(3)->create();
    }
}
