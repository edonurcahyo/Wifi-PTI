<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel admin.
     */
    public function run(): void
    {
        Admin::create([
            'nama_admin' => 'Super Admin',
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'tanggal_bergabung' => now(),
        ]);
    }
}
