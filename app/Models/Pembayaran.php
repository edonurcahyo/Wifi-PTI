<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';
    protected $primaryKey = 'id_pembayaran';
    public $timestamps = false;

    protected $fillable = [
        'id_pelanggan',
        'jenis_pembayaran',
        'tanggal_pembayaran',
        'jumlah_bayar',
        'metode_bayar',
        'status_bayar',
        'bukti_bayar',
    ];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan');
    }
}
