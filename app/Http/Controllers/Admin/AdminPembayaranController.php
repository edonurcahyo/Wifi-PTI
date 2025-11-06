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

        $paketList = PaketInternet::orderBy('harga_bulanan')->get(); // ✅ AMBIL SEMUA PAKET DARI DB

        return Inertia::render('Admin/Pembayaran/Create', [
            'pelanggan' => $pelanggan,
            'paketList' => $paketList, // ✅ KIRIM DATA PAKET KE FRONTEND
        ]);
    }

    /**
     * Menyimpan pembayaran manual
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_pelanggan' => 'required|exists:pelanggan,id_pelanggan',
            'id_paket' => 'required|exists:paket_internet,id_paket', // ✅ VALIDASI PAKET
            'jenis_pembayaran' => 'required|in:Instalasi,Bulanan',
            'jumlah_bayar' => 'required|numeric|min:0',
            'tanggal_pembayaran' => 'required|date',
            'metode_bayar' => 'required|in:Transfer,QRIS,Tunai',
            'keterangan' => 'nullable|string|max:500',
        ]);

        Pembayaran::create([
            'id_pelanggan' => $validated['id_pelanggan'],
            'jenis_pembayaran' => $validated['jenis_pembayaran'],
            'jumlah_bayar' => $validated['jumlah_bayar'],
            'tanggal_pembayaran' => $validated['tanggal_pembayaran'],
            'metode_bayar' => $validated['metode_bayar'],
            'status_bayar' => 'Lunas',
            'bukti_bayar' => null,
        ]);

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Pembayaran berhasil dicatat!');
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
            'status_bayar' => 'Lunas', // ✅ SESUAIKAN
            'tanggal_pembayaran' => now(), // Update tanggal saat diverifikasi
        ]);

        return redirect()->back()
            ->with('success', "Pembayaran berhasil diverifikasi!");
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
}