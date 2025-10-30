<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    /**
     * Tampilkan form login admin (React via Inertia)
     */
    public function create()
    {
        return Inertia::render('Auth/AdminLogin', [
            'status' => session('status'),
        ]);
    }

    /**
     * Proses login admin
     */
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('username', 'password');

        // Proses autentikasi dengan guard admin
        if (Auth::guard('admin')->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors([
            'username' => 'Username atau password salah!',
        ])->onlyInput('username');
    }

    /**
     * Logout admin
     */
    public function destroy(Request $request)
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
