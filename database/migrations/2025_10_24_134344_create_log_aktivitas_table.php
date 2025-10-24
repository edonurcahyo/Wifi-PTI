<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('log_aktivitas', function (Blueprint $table) {
            $table->id('id_log');
            $table->unsignedBigInteger('id_admin');
            $table->text('aktivitas');
            $table->timestamp('tanggal_log')->useCurrent();

            $table->foreign('id_admin')->references('id_admin')->on('admin')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
    }
};
