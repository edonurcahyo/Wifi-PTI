<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Pembayaran;
use App\Models\Pelanggan;
use App\Models\PaketInternet;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class CustomerPaymentController extends Controller
{
        /**
     * Menampilkan form pembayaran/pembuatan tagihan
     */
    public function create()
    {
        $pelanggan = Pelanggan::with('paket')
            ->where('id_pelanggan', Auth::guard('customer')->id())
            ->firstOrFail();

        // Ambil paket aktif pelanggan untuk biaya bulanan
        $paketAktif = $pelanggan->paket;

        // Generate pilihan bulan (6 bulan ke depan termasuk bulan ini)
        $bulanOptions = $this->generateMonthOptions();

        // Ambil bulan yang sudah dibayar
        $bulanSudahDibayar = Pembayaran::where('id_pelanggan', $pelanggan->id_pelanggan)
            ->where('jenis_pembayaran', 'Bulanan')
            ->where('status_bayar', 'Lunas')
            ->whereNotNull('bulan_dibayar')
            ->pluck('bulan_dibayar')
            ->map(function ($date) {
                return Carbon::parse($date)->format('Y-m');
            })
            ->toArray();

        return Inertia::render('Customer/Payment/Create', [
            'pelanggan' => [
                'nama_pelanggan' => $pelanggan->nama_pelanggan,
                'paket' => $paketAktif ? [
                    'nama_paket' => $paketAktif->nama_paket,
                    'harga_bulanan' => $paketAktif->harga_bulanan,
                ] : null
            ],
            'paketAktif' => $paketAktif,
            'bulanOptions' => $bulanOptions,
            'bulanSudahDibayar' => $bulanSudahDibayar,
        ]);
    }

    /**
     * Menyimpan pembayaran baru (buat tagihan)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis_pembayaran' => 'required|in:Instalasi,Bulanan',
            'metode_bayar' => 'required|in:Transfer,QRIS,Tunai',
            'jumlah_bayar' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string|max:500',
            'bulan_dibayar' => 'nullable|date_format:Y-m|required_if:jenis_pembayaran,Bulanan',
        ]);

        $pelanggan = Pelanggan::where('id_pelanggan', Auth::guard('customer')->id())->firstOrFail();

        // Validasi untuk pembayaran bulanan
        if ($validated['jenis_pembayaran'] === 'Bulanan') {
            // Cek apakah bulan sudah dibayar
            $sudahDibayar = Pembayaran::where('id_pelanggan', $pelanggan->id_pelanggan)
                ->where('jenis_pembayaran', 'Bulanan')
                ->where('status_bayar', 'Lunas')
                ->whereYear('bulan_dibayar', date('Y', strtotime($validated['bulan_dibayar'] . '-01')))
                ->whereMonth('bulan_dibayar', date('m', strtotime($validated['bulan_dibayar'] . '-01')))
                ->exists();

            if ($sudahDibayar) {
                return back()->withErrors([
                    'bulan_dibayar' => 'Pembayaran untuk bulan ini sudah lunas.'
                ]);
            }
        }

        // Siapkan data pembayaran
        $dataPembayaran = [
            'id_pelanggan' => $pelanggan->id_pelanggan,
            'id_paket' => $pelanggan->id_paket,
            'jenis_pembayaran' => $validated['jenis_pembayaran'],
            'jumlah_bayar' => $validated['jumlah_bayar'],
            'tanggal_pembayaran' => now(),
            'metode_bayar' => $validated['metode_bayar'],
            'status_bayar' => 'Pending',
            'bukti_bayar' => null,
            'keterangan' => $validated['keterangan'] ?? null,
        ];

        // Tambahkan bulan_dibayar jika jenis pembayaran adalah Bulanan
        if ($validated['jenis_pembayaran'] === 'Bulanan' && isset($validated['bulan_dibayar'])) {
            $dataPembayaran['bulan_dibayar'] = $validated['bulan_dibayar'] . '-01';
            
            // Set periode otomatis berdasarkan bulan
            $bulan = Carbon::parse($dataPembayaran['bulan_dibayar']);
            $dataPembayaran['periode_awal'] = $bulan->copy()->startOfMonth();
            $dataPembayaran['periode_akhir'] = $bulan->copy()->endOfMonth();
            $dataPembayaran['tanggal_tempo'] = $bulan->copy()->day(10);
        }

        // Buat pembayaran
        $pembayaran = Pembayaran::create($dataPembayaran);

        return redirect()->route('customer.payment.upload', $pembayaran->id_pembayaran)
            ->with('success', 'Tagihan berhasil dibuat. Silakan upload bukti pembayaran.');
    }

    /**
     * Menampilkan form upload bukti pembayaran
     */
    public function showUploadForm($id_pembayaran)
    {
        $pembayaran = Pembayaran::with('pelanggan')
            ->where('id_pembayaran', $id_pembayaran)
            ->where('id_pelanggan', Auth::guard('customer')->id())
            ->firstOrFail();

        return Inertia::render('Customer/Payment/Upload', [
            'pembayaran' => $pembayaran,
        ]);
    }

    /**
     * Generate pilihan bulan untuk dropdown
     */
    private function generateMonthOptions()
    {
        $bulanIndo = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        $options = [];
        $currentDate = Carbon::now();
        
        // Generate 6 bulan ke depan termasuk bulan ini
        for ($i = 0; $i < 6; $i++) {
            $date = $currentDate->copy()->addMonths($i);
            $year = $date->year;
            $month = $date->month;
            $monthName = $bulanIndo[$month - 1];
            
            $options[] = [
                'value' => $date->format('Y-m'),
                'label' => "{$monthName} {$year}",
                'is_current' => $i === 0,
                'is_past' => $date->format('Y-m') < $currentDate->format('Y-m'),
            ];
        }

        return $options;
    }

    /**
     * Upload bukti pembayaran
     */
    
    public function uploadProof(Request $request, $id_pembayaran)
    {
        $request->validate([
            'bukti_bayar' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048',
                'dimensions:min_width=300,min_height=300,max_width=2000,max_height=2000'
            ],
        ]);

        $pembayaran = Pembayaran::where('id_pembayaran', $id_pembayaran)
            ->where('id_pelanggan', Auth::guard('customer')->id())
            ->whereIn('status_bayar', ['Pending', 'Belum Bayar']) // Hanya bisa upload jika status tertentu
            ->firstOrFail();

        // Hapus bukti lama jika ada
        if ($pembayaran->bukti_bayar) {
            Storage::delete('public/bukti_pembayaran/' . $pembayaran->bukti_bayar);
        }

        // Upload file baru
        $file = $request->file('bukti_bayar');
        $fileName = time() . '_' . $pembayaran->id_pembayaran . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('public/bukti_pembayaran', $fileName);

        // Update pembayaran
        $pembayaran->update([
            'bukti_bayar' => $fileName,
            'status_bayar' => 'Pending', // Tetap pending sampai diverifikasi admin
        ]);

        return redirect()->route('customer.dashboard')
            ->with('success', 'Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.');
    }

    /**
     * Riwayat pembayaran customer
     */
    public function history()
    {
        $pembayaran = Pembayaran::with('paket')
            ->where('id_pelanggan', Auth::guard('customer')->id())
            ->orderBy('tanggal_pembayaran', 'desc')
            ->paginate(10);

        return Inertia::render('Customer/Payment/History', [
            'pembayaran' => $pembayaran,
        ]);
    }
}