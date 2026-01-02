<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia; // Hanya satu kali
use Illuminate\Support\Facades\Auth;
use App\Models\Pelanggan;
use App\Models\Pembayaran;
use App\Models\PaketInternet;
use Carbon\Carbon;

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

        return Inertia::render('Customer/Dashboard', [ // Perbaiki ini
            'pelanggan' => [
                'id_pelanggan' => $pelanggan->id_pelanggan,
                'nama_pelanggan' => $pelanggan->nama_pelanggan,
                'email' => $pelanggan->email,
                'no_hp' => $pelanggan->no_hp,
                'alamat' => $pelanggan->alamat,
                'status_aktif' => $pelanggan->status_aktif,
                'tanggal_berlangganan' => $pelanggan->tanggal_berlangganan,
                'tanggal_berakhir' => $pelanggan->tanggal_berakhir,
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
                        'status_tempo' => $item->status_tempo,
                        'tanggal_tempo' => $item->tanggal_tempo,
                        'periode_awal' => $item->periode_awal,
                        'periode_akhir' => $item->periode_akhir,
                        'bulan_dibayar' => $item->bulan_dibayar,
                        'bukti_bayar' => $item->bukti_bayar,
                        'keterangan' => $item->keterangan,
                        'periode_label' => $this->getPeriodeLabel($item->periode_awal, $item->periode_akhir),
                        'bulan_dibayar_label' => $item->bulan_dibayar 
                            ? Carbon::parse($item->bulan_dibayar)->translatedFormat('F Y')
                            : null,
                    ];
                })
            ],
            'paketList' => $paketList->map(function($paket) {
                return [
                    'id_paket' => $paket->id_paket,
                    'nama_paket' => $paket->nama_paket,
                    'kecepatan' => $paket->kecepatan,
                    'harga_bulanan' => $paket->harga_bulanan,
                ];
            })
        ]);
    }

    /**
     * Generate label periode
     */
    private function getPeriodeLabel($periodeAwal, $periodeAkhir)
    {
        if (!$periodeAwal || !$periodeAkhir) {
            return null;
        }
        
        $awal = Carbon::parse($periodeAwal);
        $akhir = Carbon::parse($periodeAkhir);
        
        if ($awal->month === $akhir->month && $awal->year === $akhir->year) {
            return $awal->format('d') . ' - ' . $akhir->format('d M Y');
        }
        
        return $awal->format('d M') . ' - ' . $akhir->format('d M Y');
    }
}