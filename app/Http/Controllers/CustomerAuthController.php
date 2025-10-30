<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Pelanggan;
use Inertia\Inertia;

class CustomerAuthController extends Controller
{
    /** ==========================
     *  LOGIN
     *  ========================== */
    public function create()
    {
        return Inertia::render('Auth/CustomerLogin', [
            'status' => session('status'),
            'success' => session('success'), // ✅ TAMBAH INI
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginField = filter_var($request->username, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'no_hp';

        $credentials = [
            $loginField => $request->username,
            'password' => $request->password,
        ];

        // ✅ DEBUG: Cek apakah user ditemukan
        $user = Pelanggan::where($loginField, $request->username)->first();
        
        if (!$user) {
            return back()->withErrors([
                'username' => 'Email/Password tidak ditemukan.',
            ])->onlyInput('username');
        }

        // ✅ DEBUG: Cek password manual
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'username' => 'Password salah.',
            ])->onlyInput('username');
        }

        // ✅ DEBUG: Cek status aktif
        if ($user->status_aktif !== 'Aktif') {
            return back()->withErrors([
                'username' => 'Akun tidak aktif.',
            ])->onlyInput('username');
        }

        if (Auth::guard('customer')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('customer.dashboard'));
        }

        return back()->withErrors([
            'username' => 'Login gagal.',
        ])->onlyInput('username');
    }

    /** ==========================
     *  REGISTER
     *  ========================== */
    public function registerForm()
    {
        return Inertia::render('Auth/CustomerRegister');
    }

    public function register(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required|string|max:100',
            'email' => 'required|email|unique:pelanggan,email',
            'password' => 'required|min:6|confirmed',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:15|unique:pelanggan,no_hp',
        ]);

        $pelanggan = Pelanggan::create([
            'nama_pelanggan' => $request->nama_pelanggan,
            'email' => $request->email,
            'password' => $request->password,
            'alamat' => $request->alamat,
            'no_hp' => $request->no_hp,
            'tanggal_daftar' => now(),
            'status_aktif' => 'Aktif',
            'id_paket' => null,
        ]);

        if (!$pelanggan) {
            return back()->withErrors([
                'email' => 'Gagal membuat akun.',
            ]);
        }

        // ✅ REDIRECT KE LOGIN dengan pesan sukses
        return redirect()->route('customer.login')->with([
            'success' => 'Registrasi berhasil! Silakan login dengan akun Anda.'
        ]);
    }

    /** ==========================
     *  LOGOUT
     *  ========================== */
    public function destroy(Request $request)
    {
        Auth::guard('customer')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('customer.login');
    }
}