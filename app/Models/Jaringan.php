<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jaringan extends Model
{
    use HasFactory;

    protected $table = 'jaringan';
    protected $primaryKey = 'id_jaringan';
    public $timestamps = false;

    protected $fillable = [
        'lokasi_node',
        'jenis_perangkat',
        'ip_address',
        'status',
        'tanggal_update',
    ];
}
