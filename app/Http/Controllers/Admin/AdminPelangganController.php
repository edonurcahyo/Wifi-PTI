<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pelanggan;
use App\Models\PaketInternet;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminPelangganController extends Controller
{
    /**
     * Menampilkan daftar semua pelanggan
     */
    public function index()
    {
        $pelanggan = Pelanggan::with('paket')
            ->orderBy('nama_pelanggan')
            ->paginate(10);

        return Inertia::render('Admin/Pelanggan/Index', [
            'pelanggan' => $pelanggan,
            'success' => session('success'),
        ]);
    }

    /**
     * Menampilkan form edit pelanggan
     */
    public function edit($id_pelanggan)
    {
        $pelanggan = Pelanggan::with('paket')->findOrFail($id_pelanggan);
        $paket = PaketInternet::orderBy('nama_paket')->get();

        return Inertia::render('Admin/Pelanggan/Edit', [
            'pelanggan' => $pelanggan,
            'paketList' => $paket,
        ]);
    }

    /**
     * Update data pelanggan
     */
    public function update(Request $request, $id_pelanggan)
    {
        $pelanggan = Pelanggan::findOrFail($id_pelanggan);

        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:100',
            'email' => [
                'required',
                'email',
                Rule::unique('pelanggan')->ignore($pelanggan->id_pelanggan, 'id_pelanggan')
            ],
            'no_hp' => [
                'required',
                'string',
                'max:15',
                Rule::unique('pelanggan')->ignore($pelanggan->id_pelanggan, 'id_pelanggan')
            ],
            'alamat' => 'required|string|max:500',
            'id_paket' => 'nullable|exists:paket_internet,id_paket',
            'status_aktif' => 'required|in:Aktif,Nonaktif',
        ]);

        $pelanggan->update($validated);

        return redirect()->route('admin.pelanggan.index')
            ->with('success', 'Data pelanggan berhasil diperbarui!');
    }

    /**
     * Nonaktifkan/aktifkan pelanggan
     */
    public function toggleStatus($id_pelanggan)
    {
        $pelanggan = Pelanggan::findOrFail($id_pelanggan);
        
        $pelanggan->status_aktif = $pelanggan->status_aktif === 'Aktif' ? 'Nonaktif' : 'Aktif';
        $pelanggan->save();

        $status = $pelanggan->status_aktif === 'Aktif' ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()
            ->with('success', "Pelanggan {$pelanggan->nama_pelanggan} berhasil {$status}!");
    }

    /**
     * Hapus pelanggan
     */
    public function destroy($id_pelanggan)
    {
        $pelanggan = Pelanggan::findOrFail($id_pelanggan);
        $nama_pelanggan = $pelanggan->nama_pelanggan;
        
        $pelanggan->delete();

        return redirect()->route('admin.pelanggan.index')
            ->with('success', "Pelanggan {$nama_pelanggan} berhasil dihapus!");
    }
}