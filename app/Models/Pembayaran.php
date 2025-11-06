<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected $casts = [
        'tanggal_pembayaran' => 'date',
        'jumlah_bayar' => 'decimal:2',
    ];

    /**
     * Relasi ke model Pelanggan
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan');
    }

    /**
     * Relasi ke model PaketInternet
     */
    public function paket()
    {
        return $this->belongsTo(PaketInternet::class, 'id_paket');
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
}