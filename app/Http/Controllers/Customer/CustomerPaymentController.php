<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Pembayaran;
use App\Models\Pelanggan;
use App\Models\PaketInternet;
use Inertia\Inertia;
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

        return Inertia::render('Customer/Payment/Create', [
            'pelanggan' => [
                'nama_pelanggan' => $pelanggan->nama_pelanggan,
                'paket' => $paketAktif ? [
                    'nama_paket' => $paketAktif->nama_paket,
                    'harga_bulanan' => $paketAktif->harga_bulanan,
                ] : null
            ],
            'paketAktif' => $paketAktif,
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
        ]);

        $pelanggan = Pelanggan::where('id_pelanggan', Auth::guard('customer')->id())->firstOrFail();

        // Buat pembayaran dengan status Pending
        $pembayaran = Pembayaran::create([
            'id_pelanggan' => $pelanggan->id_pelanggan,
            'id_paket' => $pelanggan->id_paket,
            'jenis_pembayaran' => $validated['jenis_pembayaran'],
            'jumlah_bayar' => $validated['jumlah_bayar'],
            'tanggal_pembayaran' => now(),
            'metode_bayar' => $validated['metode_bayar'],
            'status_bayar' => 'Pending',
            'bukti_bayar' => null,
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

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