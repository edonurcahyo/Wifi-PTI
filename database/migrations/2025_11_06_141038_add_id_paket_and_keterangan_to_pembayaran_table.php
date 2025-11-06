<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->unsignedBigInteger('id_paket')->nullable()->after('id_pelanggan');
            $table->text('keterangan')->nullable()->after('bukti_bayar');
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->dropColumn(['id_paket', 'keterangan']);
            $table->dropTimestamps();
        });
    }
};