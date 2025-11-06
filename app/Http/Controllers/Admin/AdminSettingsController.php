<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index');
    }

    public function updateProfile(Request $request)
    {
        $user = auth('admin')->user();

        // Validasi
        $request->validate([
            'nama_admin' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:admin,username,' . $user->id_admin . ',id_admin',
            'current_password' => 'nullable',
            'new_password' => 'nullable|min:8|confirmed',
        ]);

        try {
            $updateData = [
                'nama_admin' => $request->nama_admin,
                'username' => $request->username,
            ];

            // Update password jika diisi
            if ($request->filled('current_password') && $request->filled('new_password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return back()->withErrors(['current_password' => 'Password saat ini tidak sesuai.']);
                }
                $updateData['password'] = Hash::make($request->new_password);
            }

            // Update data
            DB::table('admin')
                ->where('id_admin', $user->id_admin)
                ->update($updateData);

            return back()->with('success', 'Profil berhasil diperbarui!');

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui profil: ' . $e->getMessage());
        }
    }

    public function updateApplication(Request $request)
    {
        // Validasi sederhana
        $request->validate([
            'company_name' => 'nullable|string|max:255',
            'company_address' => 'nullable|string',
            'company_phone' => 'nullable|string|max:20',
        ]);

        return back()->with('success', 'Pengaturan aplikasi berhasil diperbarui!');
    }
}