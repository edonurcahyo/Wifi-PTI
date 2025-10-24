<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jaringan', function (Blueprint $table) {
            $table->id('id_jaringan');
            $table->string('lokasi_node', 100);
            $table->string('jenis_perangkat', 50);
            $table->string('ip_address', 20);
            $table->enum('status', ['Aktif', 'Maintenance', 'Nonaktif'])->default('Aktif');
            $table->date('tanggal_update');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jaringan');
    }
};
