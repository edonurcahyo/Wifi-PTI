<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin', function (Blueprint $table) {
            $table->id('id_admin');
            $table->string('nama_admin', 100);
            $table->string('username', 50)->unique();
            $table->string('password');
            $table->date('tanggal_bergabung')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
};
