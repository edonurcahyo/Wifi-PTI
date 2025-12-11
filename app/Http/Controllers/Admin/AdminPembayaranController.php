<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pembayaran;
use App\Models\Pelanggan;
use App\Models\PaketInternet;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class AdminPembayaranController extends Controller
{
    /**
     * Menampilkan daftar semua pembayaran
     */
    public function index(Request $request)
    {
        // Query dasar dengan relasi
        $query = Pembayaran::with(['pelanggan', 'pelanggan.paket'])
            ->orderBy('tanggal_pembayaran', 'desc');
        
        // Filter berdasarkan bulan dan tahun
        if ($request->has('month') && $request->has('year')) {
            $month = $request->month;
            $year = $request->year;
            
            $query->whereMonth('tanggal_pembayaran', $month)
                  ->whereYear('tanggal_pembayaran', $year);
        } elseif ($request->has('year')) {
            $query->whereYear('tanggal_pembayaran', $request->year);
        } elseif ($request->has('month')) {
            $query->whereMonth('tanggal_pembayaran', $request->month)
                  ->whereYear('tanggal_pembayaran', date('Y'));
        }
        
        // Filter berdasarkan status
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status_bayar', $request->status);
        }
        
        // Filter berdasarkan pencarian
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('pelanggan', function ($q) use ($search) {
                $q->where('nama_pelanggan', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $pembayaran = $query->paginate(15);
        
        // TAMBAHKAN: Append bukti_bayar_url ke setiap item
        $pembayaran->getCollection()->transform(function ($item) {
            $item->bukti_bayar_url = $item->getBuktiBayarUrlAttribute();
            return $item;
        });
        
        // Hitung statistik - dengan filter yang sama
        $statsQuery = Pembayaran::query();
        
        // Terapkan filter yang sama untuk statistik
        if ($request->has('month') && $request->has('year')) {
            $statsQuery->whereMonth('tanggal_pembayaran', $request->month)
                      ->whereYear('tanggal_pembayaran', $request->year);
        } elseif ($request->has('year')) {
            $statsQuery->whereYear('tanggal_pembayaran', $request->year);
        } elseif ($request->has('month')) {
            $statsQuery->whereMonth('tanggal_pembayaran', $request->month)
                      ->whereYear('tanggal_pembayaran', date('Y'));
        }
        
        if ($request->has('status') && $request->status != 'all') {
            $statsQuery->where('status_bayar', $request->status);
        }
        
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $statsQuery->whereHas('pelanggan', function ($q) use ($search) {
                $q->where('nama_pelanggan', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $totalPending = (clone $statsQuery)->where('status_bayar', 'Pending')->count();
        $totalPaid = (clone $statsQuery)->where('status_bayar', 'Lunas')->count();
        $totalFailed = (clone $statsQuery)->where('status_bayar', 'Belum Bayar')->count();
        $totalAmount = (clone $statsQuery)->where('status_bayar', 'Lunas')->sum('jumlah_bayar');
        
        return Inertia::render('Admin/Pembayaran/Index', [
            'pembayaran' => $pembayaran,
            'stats' => [
                'totalPending' => $totalPending,
                'totalPaid' => $totalPaid,
                'totalFailed' => $totalFailed,
                'totalAmount' => $totalAmount,
            ],
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'month' => $request->month ?? date('m'),
                'year' => $request->year ?? date('Y'),
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

        // UPDATE PELANGGAN: Jika pembayaran lunas untuk paket, update paket pelanggan
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

        // TAMBAHKAN: Append bukti_bayar_url
        $pembayaran->bukti_bayar_url = $pembayaran->getBuktiBayarUrlAttribute();

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

        // UPDATE PELANGGAN: Jika status berubah menjadi Lunas dan ada id_paket
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

        // UPDATE PELANGGAN: Jika pembayaran diverifikasi dan ada paket
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
        
        // Hapus file bukti bayar jika ada
        if ($pembayaran->bukti_bayar) {
            $path = 'public/bukti_pembayaran/' . $pembayaran->bukti_bayar;
            if (Storage::exists($path)) {
                Storage::delete($path);
            }
        }
        
        $pembayaran->delete();

        return redirect()->route('admin.pembayaran.index')
            ->with('success', "Pembayaran berhasil dihapus!");
    }

    /**
     * METHOD BARU: Update paket pelanggan ketika pembayaran lunas
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

    /**
     * METHOD BARU: View/Download bukti pembayaran
     */
    public function viewBukti($id_pembayaran)
    {
        $pembayaran = Pembayaran::findOrFail($id_pembayaran);
        
        if (!$pembayaran->bukti_bayar) {
            abort(404, 'Bukti pembayaran tidak ditemukan');
        }
        
        $path = 'public/bukti_pembayaran/' . $pembayaran->bukti_bayar;
        
        if (!Storage::exists($path)) {
            abort(404, 'File bukti pembayaran tidak ditemukan di storage');
        }
        
        return response()->file(storage_path('app/' . $path));
    }

    /**
     * METHOD BARU: Download bukti pembayaran
     */
    public function downloadBukti($id_pembayaran)
    {
        $pembayaran = Pembayaran::findOrFail($id_pembayaran);
        
        if (!$pembayaran->bukti_bayar) {
            abort(404, 'Bukti pembayaran tidak ditemukan');
        }
        
        $path = 'public/bukti_pembayaran/' . $pembayaran->bukti_bayar;
        
        if (!Storage::exists($path)) {
            abort(404, 'File bukti pembayaran tidak ditemukan di storage');
        }
        
        return Storage::download($path, 'bukti_pembayaran_' . $pembayaran->id_pembayaran . '.' . pathinfo($pembayaran->bukti_bayar, PATHINFO_EXTENSION));
    }
}