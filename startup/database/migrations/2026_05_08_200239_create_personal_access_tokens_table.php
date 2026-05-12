<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    protected $connection = 'mongodb';

    public function up(): void
    {
        // MongoDB creates collections automatically
    }

    public function down(): void
    {
        //
    }
};