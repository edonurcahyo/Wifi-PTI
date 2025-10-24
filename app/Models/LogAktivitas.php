<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    use HasFactory;

    protected $table = 'log_aktivitas';
    protected $primaryKey = 'id_log';
    public $timestamps = false;

    protected $fillable = [
        'id_admin',
        'aktivitas',
        'tanggal_log',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'id_admin');
    }
}
