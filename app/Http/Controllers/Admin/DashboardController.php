<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use App\Models\Pembayaran;
use App\Models\PaketInternet;
use App\Models\LogAktivitas;
use App\Models\Admin;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard admin dengan data real
     */
    public function index()
    {
        // Data untuk statistik cards
        $stats = $this->getDashboardStats();
        
        // Data untuk ringkasan operasional
        $ringkasan = $this->getRingkasanOperasional();
        
        // Log aktivitas terbaru
        $logTerbaru = $this->getLogAktivitasTerbaru();
        
        // Data untuk chart pendapatan
        $pendapatanPerBulan = $this->getPendapatanPerBulan();
        
        // Data untuk chart pelanggan
        $pelangganPerBulan = $this->getPelangganPerBulan();
        
        // Paket dengan pelanggan terbanyak
        $topPaket = $this->getTopPaket();

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => auth('admin')->user()
            ],
            'stats' => $stats,
            'ringkasan' => $ringkasan,
            'logTerbaru' => $logTerbaru,
            'chartData' => [
                'pendapatanPerBulan' => $pendapatanPerBulan,
                'pelangganPerBulan' => $pelangganPerBulan,
            ],
            'topPaket' => $topPaket,
        ]);
    }
    
    /**
     * Mendapatkan statistik utama untuk dashboard
     */
    private function getDashboardStats()
    {
        // Total pelanggan aktif
        $totalPelanggan = Pelanggan::where('status_aktif', 'Aktif')->count();
        
        // Pendapatan bulan ini
        $bulanIni = now()->month;
        $tahunIni = now()->year;
        
        $pendapatanBulanIni = Pembayaran::where('status_bayar', 'Lunas')
            ->whereMonth('tanggal_pembayaran', $bulanIni)
            ->whereYear('tanggal_pembayaran', $tahunIni)
            ->sum('jumlah_bayar');
        
        // Persentase jaringan aktif
        $totalSemuaPelanggan = Pelanggan::count();
        $jaringanAktif = $totalSemuaPelanggan > 0 
            ? round(($totalPelanggan / $totalSemuaPelanggan) * 100, 1)
            : 0;
        
        // Log aktivitas hari ini
        $logAktivitasHariIni = LogAktivitas::whereDate('tanggal_log', now()->toDateString())
            ->count();
        
        // Pembayaran pending
        $pembayaranPending = Pembayaran::where('status_bayar', 'Pending')->count();
        
        return [
            'totalPelanggan' => $totalPelanggan,
            'pendapatanBulanIni' => 'Rp ' . number_format($pendapatanBulanIni, 0, ',', '.'),
            'jaringanAktif' => $jaringanAktif . '%',
            'logAktivitasHariIni' => $logAktivitasHariIni,
            'pembayaranPending' => $pembayaranPending,
            'raw' => [
                'pendapatanBulanIni' => $pendapatanBulanIni,
                'jaringanAktif' => $jaringanAktif,
            ]
        ];
    }
    
    /**
     * Mendapatkan ringkasan operasional
     */
    private function getRingkasanOperasional()
    {
        $bulanIni = now()->month;
        $tahunIni = now()->year;
        
        // Paket terlaris
        $paketTerlaris = PaketInternet::withCount(['pelanggan' => function($query) {
            $query->where('status_aktif', 'Aktif');
        }])
        ->orderBy('pelanggan_count', 'desc')
        ->first();
        
        // Pelanggan baru bulan ini
        $pelangganBaruBulanIni = Pelanggan::whereMonth('tanggal_daftar', $bulanIni)
            ->whereYear('tanggal_daftar', $tahunIni)
            ->count();
        
        // Tagihan belum lunas (hanya yang belum jatuh tempo)
        $tagihanBelumLunas = Pembayaran::whereIn('status_bayar', ['Pending', 'Belum Bayar'])
            ->where(function($query) {
                $query->whereNull('tanggal_tempo')
                      ->orWhereDate('tanggal_tempo', '>=', now()->toDateString());
            })
            ->sum('jumlah_bayar');
        
        // Pembayaran terlambat
        $pembayaranTerlambat = Pembayaran::where('status_tempo', 'Terlambat')
            ->where('status_bayar', 'Lunas')
            ->count();
        
        return [
            'paketTerlaris' => $paketTerlaris ? $paketTerlaris->nama_paket : 'Tidak ada data',
            'paketTerlarisDetail' => $paketTerlaris ? [
                'nama' => $paketTerlaris->nama_paket,
                'kecepatan' => $paketTerlaris->kecepatan,
                'harga' => $paketTerlaris->harga_bulanan,
                'jumlahPelanggan' => $paketTerlaris->pelanggan_count,
            ] : null,
            'pelangganBaruBulanIni' => $pelangganBaruBulanIni,
            'tagihanBelumLunas' => 'Rp ' . number_format($tagihanBelumLunas, 0, ',', '.'),
            'pembayaranTerlambat' => $pembayaranTerlambat,
        ];
    }
    
    /**
     * Mendapatkan log aktivitas terbaru
     */
    private function getLogAktivitasTerbaru()
    {
        return LogAktivitas::with('admin')
            ->orderBy('tanggal_log', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                $waktu = Carbon::parse($log->tanggal_log);
                
                // Deteksi status berdasarkan aktivitas
                $status = 'secondary';
                $aktivitasLower = strtolower($log->aktivitas);
                
                if (strpos($aktivitasLower, 'diaktifkan') !== false || 
                    strpos($aktivitasLower, 'berhasil login') !== false ||
                    strpos($aktivitasLower, 'lunas') !== false) {
                    $status = 'success';
                } elseif (strpos($aktivitasLower, 'diupdate') !== false || 
                          strpos($aktivitasLower, 'diperbarui') !== false ||
                          strpos($aktivitasLower, 'edit') !== false) {
                    $status = 'info';
                } elseif (strpos($aktivitasLower, 'pending') !== false || 
                          strpos($aktivitasLower, 'belum bayar') !== false ||
                          strpos($aktivitasLower, 'upload') !== false) {
                    $status = 'warning';
                } elseif (strpos($aktivitasLower, 'nonaktif') !== false || 
                          strpos($aktivitasLower, 'hapus') !== false ||
                          strpos($aktivitasLower, 'batal') !== false) {
                    $status = 'danger';
                }
                
                return [
                    'id' => $log->id_log,
                    'aktivitas' => $log->aktivitas,
                    'waktu' => $waktu->format('H:i'),
                    'waktu_full' => $waktu->format('d/m/Y H:i'),
                    'admin' => $log->admin ? $log->admin->nama_admin : 'System',
                    'status' => $status,
                    'icon' => $this->getLogIcon($status),
                ];
            });
    }
    
    /**
     * Mendapatkan icon berdasarkan status log
     */
    private function getLogIcon($status)
    {
        $icons = [
            'success' => 'check-circle',
            'info' => 'info',
            'warning' => 'alert-circle',
            'danger' => 'x-circle',
            'secondary' => 'circle',
        ];
        
        return $icons[$status] ?? 'circle';
    }
    
    /**
     * Mendapatkan data pendapatan per bulan untuk chart
     */
    private function getPendapatanPerBulan()
    {
        $data = [];
        $bulanSekarang = now()->month;
        $tahunSekarang = now()->year;
        
        for ($i = 5; $i >= 0; $i--) {
            $bulan = Carbon::create($tahunSekarang, $bulanSekarang, 1)->subMonths($i);
            $bulanNumber = $bulan->month;
            $tahun = $bulan->year;
            
            $pendapatan = Pembayaran::where('status_bayar', 'Lunas')
                ->whereMonth('tanggal_pembayaran', $bulanNumber)
                ->whereYear('tanggal_pembayaran', $tahun)
                ->sum('jumlah_bayar');
            
            $bulanNama = $bulan->translatedFormat('F');
            
            $data[] = [
                'bulan' => substr($bulanNama, 0, 3),
                'bulan_full' => $bulanNama,
                'pendapatan' => $pendapatan,
                'formatted' => 'Rp ' . number_format($pendapatan, 0, ',', '.'),
                'tahun' => $tahun,
                'bulan_angka' => $bulanNumber,
            ];
        }
        
        return $data;
    }
    
    /**
     * Mendapatkan data pelanggan per bulan untuk chart
     */
    private function getPelangganPerBulan()
    {
        $data = [];
        $bulanSekarang = now()->month;
        $tahunSekarang = now()->year;
        
        for ($i = 5; $i >= 0; $i--) {
            $bulan = Carbon::create($tahunSekarang, $bulanSekarang, 1)->subMonths($i);
            $bulanNumber = $bulan->month;
            $tahun = $bulan->year;
            
            $pelangganBaru = Pelanggan::whereMonth('tanggal_daftar', $bulanNumber)
                ->whereYear('tanggal_daftar', $tahun)
                ->count();
            
            $bulanNama = $bulan->translatedFormat('F');
            
            $data[] = [
                'bulan' => substr($bulanNama, 0, 3),
                'bulan_full' => $bulanNama,
                'jumlah' => $pelangganBaru,
                'tahun' => $tahun,
                'bulan_angka' => $bulanNumber,
            ];
        }
        
        return $data;
    }
    
    /**
     * Mendapatkan data paket terpopuler
     */
    private function getTopPaket()
    {
        return PaketInternet::withCount(['pelanggan' => function($query) {
            $query->where('status_aktif', 'Aktif');
        }])
        ->orderBy('pelanggan_count', 'desc')
        ->limit(3)
        ->get()
        ->map(function ($paket) {
            return [
                'id' => $paket->id_paket,
                'nama' => $paket->nama_paket,
                'kecepatan' => $paket->kecepatan,
                'harga' => 'Rp ' . number_format($paket->harga_bulanan, 0, ',', '.'),
                'jumlahPelanggan' => $paket->pelanggan_count,
                'persentase' => $paket->pelanggan_count > 0 ? round(($paket->pelanggan_count / Pelanggan::where('status_aktif', 'Aktif')->count()) * 100, 1) : 0,
            ];
        });
    }
    
    /**
     * API untuk mendapatkan data statistik real-time (AJAX)
     */
    public function getStats()
    {
        $stats = $this->getDashboardStats();
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_pelanggan' => $stats['totalPelanggan'],
                'pendapatan_bulan_ini' => $stats['raw']['pendapatanBulanIni'],
                'jaringan_aktif' => $stats['raw']['jaringanAktif'],
                'pembayaran_pending' => $stats['pembayaranPending'],
                'updated_at' => now()->format('Y-m-d H:i:s'),
            ]
        ]);
    }
}