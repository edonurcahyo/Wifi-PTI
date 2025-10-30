<?php
// app/Http/Controllers/Customer/CustomerProfileController.php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Pelanggan;

class CustomerProfileController extends Controller
{
    public function edit(Request $request)
    {
        $pelanggan = Pelanggan::with('paket')
            ->where('id_pelanggan', Auth::guard('customer')->id())
            ->first();

        if (!$pelanggan) {
            return redirect()->route('customer.login');
        }

        return Inertia::render('Customer/Profile/Edit', [
            'pelanggan' => [
                'id_pelanggan' => $pelanggan->id_pelanggan,
                'nama_pelanggan' => $pelanggan->nama_pelanggan,
                'email' => $pelanggan->email,
                'no_hp' => $pelanggan->no_hp,
                'alamat' => $pelanggan->alamat,
                'status_aktif' => (bool) $pelanggan->status_aktif,
                'paket' => $pelanggan->paket ? [
                    'nama_paket' => $pelanggan->paket->nama_paket,
                    'kecepatan' => $pelanggan->paket->kecepatan,
                    'harga' => $pelanggan->paket->harga,
                ] : null
            ]
        ]);
    }

    public function update(Request $request)
    {
        $pelangganId = Auth::guard('customer')->id();

        $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:pelanggan,email,' . $pelangganId . ',id_pelanggan',
            'no_hp' => 'required|string|max:15',
            'alamat' => 'required|string|max:500',
        ]);

        // Update menggunakan query builder
        DB::table('pelanggan')
            ->where('id_pelanggan', $pelangganId)
            ->update([
                'nama_pelanggan' => $request->nama_pelanggan,
                'email' => $request->email,
                'no_hp' => $request->no_hp,
                'alamat' => $request->alamat,
            ]);

        return redirect()->route('customer.profile.edit')
            ->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request)
    {
        $pelangganId = Auth::guard('customer')->id();

        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Cek password saat ini
        $currentPassword = DB::table('pelanggan')
            ->where('id_pelanggan', $pelangganId)
            ->value('password');

        if (!Hash::check($request->current_password, $currentPassword)) {
            return back()->withErrors([
                'current_password' => 'Password saat ini tidak sesuai.'
            ]);
        }

        // Update password
        DB::table('pelanggan')
            ->where('id_pelanggan', $pelangganId)
            ->update([
                'password' => Hash::make($request->password),
            ]);

        return redirect()->route('customer.profile.edit')
            ->with('success', 'Password berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $pelangganId = Auth::guard('customer')->id();

        $request->validate([
            'password' => ['required', function ($attribute, $value, $fail) use ($pelangganId) {
                $currentPassword = DB::table('pelanggan')
                    ->where('id_pelanggan', $pelangganId)
                    ->value('password');
                
                if (!Hash::check($value, $currentPassword)) {
                    $fail('Password yang dimasukkan tidak sesuai.');
                }
            }],
        ]);

        Auth::guard('customer')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Delete akun
        DB::table('pelanggan')
            ->where('id_pelanggan', $pelangganId)
            ->delete();

        return redirect()->route('home')
            ->with('success', 'Akun berhasil dihapus.');
    }
}