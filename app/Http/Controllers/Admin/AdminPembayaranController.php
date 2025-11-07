<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pembayaran;
use App\Models\Pelanggan;
use App\Models\PaketInternet;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminPembayaranController extends Controller
{
    /**
     * Menampilkan daftar semua pembayaran
     */
    public function index()
    {
        $pembayaran = Pembayaran::with(['pelanggan', 'pelanggan.paket'])
            ->orderBy('tanggal_pembayaran', 'desc')
            ->paginate(15);

        // Hitung statistik - SESUAIKAN DENGAN KOLOM YANG ADA
        $totalPending = Pembayaran::where('status_bayar', 'Pending')->count();
        $totalPaid = Pembayaran::where('status_bayar', 'Lunas')->count();
        $totalFailed = Pembayaran::where('status_bayar', 'Belum Bayar')->count();
        $totalAmount = Pembayaran::where('status_bayar', 'Lunas')->sum('jumlah_bayar');

        return Inertia::render('Admin/Pembayaran/Index', [
            'pembayaran' => $pembayaran,
            'stats' => [
                'totalPending' => $totalPending,
                'totalPaid' => $totalPaid,
                'totalFailed' => $totalFailed,
                'totalAmount' => $totalAmount,
            ],
            'success' => session('success'),
        ]);
    }

    /**
     * Menampilkan form tambah pembayaran manual
     */
    public function create()
    {
        $pelanggan = Pelanggan::where('status_aktif', 'Aktif')
            ->orderBy('nama_pelanggan')
            ->get();

        $paketList = PaketInternet::orderBy('harga_bulanan')->get();

        return Inertia::render('Admin/Pembayaran/Create', [
            'pelanggan' => $pelanggan,
            'paketList' => $paketList,
        ]);
    }

    /**
     * Menyimpan pembayaran manual
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_pelanggan' => 'required|exists:pelanggan,id_pelanggan',
            'id_paket' => 'required|exists:paket_internet,id_paket',
            'jenis_pembayaran' => 'required|in:Instalasi,Bulanan',
            'jumlah_bayar' => 'required|numeric|min:0',
            'tanggal_pembayaran' => 'required|date',
            'metode_bayar' => 'required|in:Transfer,QRIS,Tunai',
            'keterangan' => 'nullable|string|max:500',
        ]);

        // Buat pembayaran
        $pembayaran = Pembayaran::create([
            'id_pelanggan' => $validated['id_pelanggan'],
            'id_paket' => $validated['id_paket'],
            'jenis_pembayaran' => $validated['jenis_pembayaran'],
            'jumlah_bayar' => $validated['jumlah_bayar'],
            'tanggal_pembayaran' => $validated['tanggal_pembayaran'],
            'metode_bayar' => $validated['metode_bayar'],
            'status_bayar' => 'Lunas',
            'bukti_bayar' => null,
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        // ✅ UPDATE PELANGGAN: Jika pembayaran lunas untuk paket, update paket pelanggan
        $this->updatePaketPelanggan($validated['id_pelanggan'], $validated['id_paket']);

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Pembayaran berhasil dicatat dan paket pelanggan diperbarui!');
    }

    /**
     * Menampilkan form edit pembayaran
     */
    public function edit($id_pembayaran)
    {
        $pembayaran = Pembayaran::with('pelanggan')->findOrFail($id_pembayaran);
        $pelanggan = Pelanggan::where('status_aktif', 'Aktif')
            ->orderBy('nama_pelanggan')
            ->get();

        $paketList = PaketInternet::orderBy('harga_bulanan')->get();

        return Inertia::render('Admin/Pembayaran/Edit', [
            'pembayaran' => $pembayaran,
            'pelanggan' => $pelanggan,
            'paketList' => $paketList,
        ]);
    }

    /**
     * Update data pembayaran
     */
    public function update(Request $request, $id_pembayaran)
    {
        $pembayaran = Pembayaran::findOrFail($id_pembayaran);

        $validated = $request->validate([
            'id_pelanggan' => 'required|exists:pelanggan,id_pelanggan',
            'id_paket' => 'nullable|exists:paket_internet,id_paket', 
            'jenis_pembayaran' => 'required|in:Instalasi,Bulanan',
            'jumlah_bayar' => 'required|numeric|min:0',
            'tanggal_pembayaran' => 'required|date',
            'metode_bayar' => 'required|in:Transfer,QRIS,Tunai',
            'status_bayar' => 'required|in:Lunas,Belum Bayar,Pending',
            'keterangan' => 'nullable|string|max:500',
        ]);

        $pembayaran->update($validated);

        // ✅ UPDATE PELANGGAN: Jika status berubah menjadi Lunas dan ada id_paket
        if ($validated['status_bayar'] === 'Lunas' && $validated['id_paket']) {
            $this->updatePaketPelanggan($validated['id_pelanggan'], $validated['id_paket']);
        }

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Data pembayaran berhasil diperbarui!');
    }

    /**
     * Verifikasi pembayaran pending
     */
    public function verify($id_pembayaran)
    {
        $pembayaran = Pembayaran::findOrFail($id_pembayaran);
        
        $pembayaran->update([
            'status_bayar' => 'Lunas',
            'tanggal_pembayaran' => now(),
        ]);

        // ✅ UPDATE PELANGGAN: Jika pembayaran diverifikasi dan ada paket
        if ($pembayaran->id_paket) {
            $this->updatePaketPelanggan($pembayaran->id_pelanggan, $pembayaran->id_paket);
        }

        return redirect()->back()
            ->with('success', "Pembayaran berhasil diverifikasi dan paket pelanggan diperbarui!");
    }

    /**
     * Hapus pembayaran
     */
    public function destroy($id_pembayaran)
    {
        $pembayaran = Pembayaran::findOrFail($id_pembayaran);
        
        $pembayaran->delete();

        return redirect()->route('admin.pembayaran.index')
            ->with('success', "Pembayaran berhasil dihapus!");
    }

    /**
     * ✅ METHOD BARU: Update paket pelanggan ketika pembayaran lunas
     */
    private function updatePaketPelanggan($id_pelanggan, $id_paket)
    {
        $pelanggan = Pelanggan::find($id_pelanggan);
        
        if ($pelanggan) {
            $pelanggan->update([
                'id_paket' => $id_paket,
                'status_aktif' => 'Aktif',
            ]);
        }
    }
}