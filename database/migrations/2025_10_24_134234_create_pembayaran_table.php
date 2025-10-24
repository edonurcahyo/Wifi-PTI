<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id('id_pembayaran');
            $table->unsignedBigInteger('id_pelanggan');
            $table->enum('jenis_pembayaran', ['Instalasi', 'Bulanan']);
            $table->date('tanggal_pembayaran');
            $table->decimal('jumlah_bayar', 10, 2);
            $table->enum('metode_bayar', ['Transfer', 'QRIS', 'Tunai']);
            $table->enum('status_bayar', ['Lunas', 'Belum Bayar', 'Pending'])->default('Pending');
            $table->string('bukti_bayar', 255)->nullable();

            $table->foreign('id_pelanggan')->references('id_pelanggan')->on('pelanggan')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
