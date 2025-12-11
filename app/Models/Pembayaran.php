<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'jumlah_bayar',
        'metode_bayar',
        'status_bayar',
        'bukti_bayar',
        'keterangan', 
    ];

    // TAMBAHKAN: Append accessor ke JSON
    protected $appends = ['bukti_bayar_url', 'bukti_exists'];

    protected $casts = [
        'tanggal_pembayaran' => 'date',
        'jumlah_bayar' => 'decimal:2',
    ];

    /**
     * Relasi ke model Pelanggan
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id_pelanggan');
    }

    /**
     * Relasi ke model PaketInternet
     */
    public function paket()
    {
        return $this->belongsTo(PaketInternet::class, 'id_paket', 'id_paket');
    }

    /**
     * Scope untuk pembayaran pending
     */
    public function scopePending($query)
    {
        return $query->where('status_bayar', 'Pending');
    }

    /**
     * Scope untuk pembayaran lunas
     */
    public function scopePaid($query)
    {
        return $query->where('status_bayar', 'Lunas');
    }

    /**
     * Scope untuk pembayaran belum bayar
     */
    public function scopeUnpaid($query)
    {
        return $query->where('status_bayar', 'Belum Bayar');
    }

    /**
     * Cek apakah pembayaran sudah lunas
     */
    public function isPaid()
    {
        return $this->status_bayar === 'Lunas';
    }

    /**
     * Cek apakah pembayaran pending
     */
    public function isPending()
    {
        return $this->status_bayar === 'Pending';
    }

    /**
     * Accessor untuk URL bukti bayar
     */
    public function getBuktiBayarUrlAttribute()
    {
        if (!$this->bukti_bayar) {
            return null;
        }
        
        // Generate URL lengkap
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
}