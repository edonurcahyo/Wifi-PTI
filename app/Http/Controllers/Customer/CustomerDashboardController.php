<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Pelanggan;
use App\Models\Pembayaran;
use App\Models\PaketInternet;

class CustomerDashboardController extends Controller
{
    public function dashboard()
    {
        $pelanggan = Pelanggan::with(['paket', 'pembayaran' => function($query) {
            $query->orderBy('tanggal_pembayaran', 'desc')->take(5);
        }])
            ->where('id_pelanggan', Auth::guard('customer')->id())
            ->first();

        if (!$pelanggan) {
            return redirect()->route('customer.login');
        }

        // Ambil semua paket untuk pilihan upgrade
        $paketList = PaketInternet::orderBy('harga_bulanan')->get();

        return Inertia::render('Customer/Dashboard', [
            'pelanggan' => [
                'id_pelanggan' => $pelanggan->id_pelanggan,
                'nama_pelanggan' => $pelanggan->nama_pelanggan,
                'email' => $pelanggan->email,
                'no_hp' => $pelanggan->no_hp,
                'alamat' => $pelanggan->alamat,
                'status_aktif' => $pelanggan->status_aktif, 
                'paket' => $pelanggan->paket ? [
                    'nama_paket' => $pelanggan->paket->nama_paket,
                    'kecepatan' => $pelanggan->paket->kecepatan,
                    'harga_bulanan' => $pelanggan->paket->harga_bulanan,
                    'id_paket' => $pelanggan->paket->id_paket,
                ] : null,
                'pembayaran_terakhir' => $pelanggan->pembayaran->map(function($item) {
                    return [
                        'id_pembayaran' => $item->id_pembayaran,
                        'jenis_pembayaran' => $item->jenis_pembayaran,
                        'tanggal_pembayaran' => $item->tanggal_pembayaran,
                        'jumlah_bayar' => $item->jumlah_bayar,
                        'metode_bayar' => $item->metode_bayar,
                        'status_bayar' => $item->status_bayar,
                        'bukti_bayar' => $item->bukti_bayar,
                        'keterangan' => $item->keterangan,
                    ];
                })
            ],
            'paketList' => $paketList
        ]);
    }
}