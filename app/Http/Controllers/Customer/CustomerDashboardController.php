<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Pelanggan;

class CustomerDashboardController extends Controller
{
    public function dashboard()
    {
        $pelanggan = Pelanggan::with('paket')
            ->where('id_pelanggan', Auth::guard('customer')->id())
            ->first();

        if (!$pelanggan) {
            return redirect()->route('customer.login');
        }

        return Inertia::render('Customer/Dashboard', [
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
}