<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // karena pelanggan juga bisa login
use Illuminate\Notifications\Notifiable;

class Pelanggan extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'pelanggan';
    protected $primaryKey = 'id_pelanggan';
    public $timestamps = false;

    protected $fillable = [
        'nama_pelanggan',
        'alamat',
        'no_hp',
        'email',
        'password',
        'id_paket',
        'tanggal_daftar',
        'status_aktif',
    ];

    protected $hidden = ['password'];

    public function paket()
    {
        return $this->belongsTo(PaketInternet::class, 'id_paket');
    }

    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class, 'id_pelanggan');
    }
}
