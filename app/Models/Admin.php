<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // admin juga bisa login
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'admin';
    protected $primaryKey = 'id_admin';
    public $timestamps = false;

    protected $fillable = [
        'nama_admin',
        'username',
        'password',
        'tanggal_bergabung',
    ];

    protected $hidden = ['password'];

    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class, 'id_admin');
    }
}
