<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaketInternet extends Model
{
    use HasFactory;

    protected $table = 'paket_internet';
    protected $primaryKey = 'id_paket';
    public $timestamps = false;

    protected $fillable = [
        'nama_paket',
        'kecepatan',
        'kuota',
        'harga_bulanan',
        'keterangan',
    ];

    // Relasi ke pelanggan
    public function pelanggan()
    {
        return $this->hasMany(Pelanggan::class, 'id_paket');
    }
}
