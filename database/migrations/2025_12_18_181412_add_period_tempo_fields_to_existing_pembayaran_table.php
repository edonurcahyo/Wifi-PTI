<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            // Tambah kolom periode setelah tanggal_pembayaran
            $table->date('periode_awal')->nullable()->after('tanggal_pembayaran');
            $table->date('periode_akhir')->nullable()->after('periode_awal');
            $table->date('tanggal_tempo')->nullable()->after('periode_akhir');
            $table->date('bulan_dibayar')->nullable()->after('tanggal_tempo');
            
            // Tambah status tempo setelah status_bayar
            $table->enum('status_tempo', ['Tepat Waktu', 'Terlambat', 'Belum Jatuh Tempo'])
                  ->default('Belum Jatuh Tempo')
                  ->after('status_bayar');
            
            // Tambah catatan tempo setelah keterangan
            $table->text('catatan_tempo')->nullable()->after('keterangan');
        });
    }

    public function down(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->dropColumn([
                'periode_awal',
                'periode_akhir',
                'tanggal_tempo',
                'bulan_dibayar',
                'status_tempo',
                'catatan_tempo'
            ]);
        });
    }
};