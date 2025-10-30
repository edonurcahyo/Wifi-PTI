<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pelanggan', function (Blueprint $table) {
        $table->id('id_pelanggan');
        $table->string('nama_pelanggan', 100);
        $table->string('alamat', 255);
        $table->string('no_hp', 15);
        $table->string('email', 100)->unique();
        $table->string('password'); 
        $table->unsignedBigInteger('id_paket');
        $table->date('tanggal_daftar');
        $table->enum('status_aktif', ['Aktif', 'Nonaktif'])->default('Aktif');

        $table->foreign('id_paket')->references('id_paket')->on('paket_internet')->onDelete('cascade');
    });

    }

    public function down(): void
    {
        Schema::dropIfExists('pelanggan');
    }
};
