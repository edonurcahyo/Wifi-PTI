<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';
    protected $primaryKey = 'id_pembayaran';
    
    protected $fillable = [
        'id_pelanggan',
        'id_paket', 
        'jenis_pembayaran',
        'tanggal_pembayaran',
        'periode_awal',
        'periode_akhir',
        'tanggal_tempo',
        'bulan_dibayar',
        'jumlah_bayar',
        'metode_bayar',
        'status_bayar',
        'status_tempo',
        'bukti_bayar',
        'keterangan',
        'catatan_tempo',
    ];

    protected $appends = [
        'bukti_bayar_url', 
        'bukti_exists',
        'periode_label',
        'status_tempo_badge',
        'selisih_hari_tempo',
        'bulan_dibayar_label'
    ];

    protected $casts = [
        'tanggal_pembayaran' => 'date',
        'periode_awal' => 'date',
        'periode_akhir' => 'date',
        'tanggal_tempo' => 'date',
        'bulan_dibayar' => 'date',
        'jumlah_bayar' => 'decimal:2',
    ];

    // ============ RELASI ============
    
    /**
     * RELASI: Pembayaran ke Pelanggan
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id_pelanggan');
    }

    /**
     * RELASI: Pembayaran ke PaketInternet
     */
    public function paket()
    {
        return $this->belongsTo(PaketInternet::class, 'id_paket', 'id_paket');
    }

    // ============ ACCESSORS ============
    
    /**
     * Accessor untuk URL bukti bayar
     */
    public function getBuktiBayarUrlAttribute()
    {
        if (!$this->bukti_bayar) {
            return null;
        }
        
        return asset('storage/bukti_pembayaran/' . $this->bukti_bayar);
    }

    /**
     * Accessor untuk cek apakah file bukti exists
     */
    public function getBuktiExistsAttribute()
    {
        if (!$this->bukti_bayar) {
            return false;
        }
        
        $path = 'public/bukti_pembayaran/' . $this->bukti_bayar;
        return Storage::exists($path);
    }

    /**
     * Accessor untuk label periode
     */
    public function getPeriodeLabelAttribute()
    {
        if (!$this->periode_awal || !$this->periode_akhir) {
            return null;
        }
        
        $awal = Carbon::parse($this->periode_awal);
        $akhir = Carbon::parse($this->periode_akhir);
        
        if ($awal->month === $akhir->month && $awal->year === $akhir->year) {
            return $awal->format('d') . ' - ' . $akhir->format('d M Y');
        }
        
        return $awal->format('d M') . ' - ' . $akhir->format('d M Y');
    }

    /**
     * Accessor untuk status tempo badge
     */
    public function getStatusTempoBadgeAttribute()
    {
        $status = $this->status_tempo;
        
        $badges = [
            'Tepat Waktu' => 'success',
            'Terlambat' => 'danger',
            'Belum Jatuh Tempo' => 'warning'
        ];
        
        return $badges[$status] ?? 'secondary';
    }

    /**
     * Accessor untuk selisih hari tempo
     */
    public function getSelisihHariTempoAttribute()
    {
        if (!$this->tanggal_tempo || !$this->tanggal_pembayaran) {
            return null;
        }
        
        $tanggalTempo = Carbon::parse($this->tanggal_tempo);
        $tanggalBayar = Carbon::parse($this->tanggal_pembayaran);
        
        if ($tanggalBayar->lessThanOrEqualTo($tanggalTempo)) {
            return $tanggalBayar->diffInDays($tanggalTempo, false) + 1;
        }
        
        return $tanggalBayar->diffInDays($tanggalTempo, false);
    }

    /**
     * Accessor untuk label bulan dibayar
     */
    public function getBulanDibayarLabelAttribute()
    {
        if (!$this->bulan_dibayar) {
            return null;
        }
        
        $bulan = Carbon::parse($this->bulan_dibayar);
        
        $bulanIndo = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        return $bulanIndo[$bulan->month - 1] . ' ' . $bulan->year;
    }

    // ============ SCOPES ============
    
    /**
     * Scope untuk pembayaran bulan tertentu
     */
    public function scopeForMonth($query, $month, $year = null)
    {
        if (!$year) {
            $year = date('Y');
        }
        
        return $query->whereYear('bulan_dibayar', $year)
                     ->whereMonth('bulan_dibayar', $month);
    }

    /**
     * Scope untuk pembayaran tepat waktu
     */
    public function scopeOnTime($query)
    {
        return $query->where('status_tempo', 'Tepat Waktu');
    }

    /**
     * Scope untuk pembayaran terlambat
     */
    public function scopeLate($query)
    {
        return $query->where('status_tempo', 'Terlambat');
    }

    // ============ METHODS ============
    
    /**
     * Update status tempo berdasarkan tanggal pembayaran dan tempo
     */
    public function updateTempoStatus()
    {
        if (!$this->tanggal_tempo || !$this->tanggal_pembayaran) {
            return;
        }
        
        $tanggalTempo = Carbon::parse($this->tanggal_tempo);
        $tanggalBayar = Carbon::parse($this->tanggal_pembayaran);
        
        if ($this->status_bayar !== 'Lunas') {
            $this->status_tempo = 'Belum Jatuh Tempo';
        } elseif ($tanggalBayar->lessThanOrEqualTo($tanggalTempo)) {
            $this->status_tempo = 'Tepat Waktu';
        } else {
            $this->status_tempo = 'Terlambat';
        }
        
        $this->save();
    }

    /**
     * Set periode otomatis berdasarkan bulan dibayar
     */
    public function setAutoPeriod()
    {
        if (!$this->bulan_dibayar) {
            return;
        }
        
        $bulan = Carbon::parse($this->bulan_dibayar);
        
        $this->periode_awal = $bulan->copy()->startOfMonth();
        $this->periode_akhir = $bulan->copy()->endOfMonth();
        $this->tanggal_tempo = $bulan->copy()->day(10);
    }
}