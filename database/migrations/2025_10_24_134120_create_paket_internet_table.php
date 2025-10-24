<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paket_internet', function (Blueprint $table) {
            $table->id('id_paket');
            $table->string('nama_paket', 50);
            $table->string('kecepatan', 20);
            $table->string('kuota', 20)->nullable();
            $table->decimal('harga_bulanan', 10, 2);
            $table->text('keterangan')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paket_internet');
    }
};
