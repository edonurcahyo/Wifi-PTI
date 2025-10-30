<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PaketInternet;
use Illuminate\Database\Eloquent\ModelNotFoundException; 
use Exception; 

class PaketInternetController extends Controller
{
    /**
     * Menampilkan daftar semua Paket Internet. (admin.paket.index)
     */
    public function index()
    {
        try {
            // ✅ PERBAIKI: Ganti variable $packages menjadi $pakets
            $pakets = PaketInternet::orderBy('nama_paket')->paginate(10);
        } catch (Exception $e) {
            return redirect()->route('admin.dashboard')->with('error', 'Gagal memuat daftar paket: ' . $e->getMessage());
        }

        // ✅ PERBAIKI: Ganti 'packages' menjadi 'pakets' dan path component
        return Inertia::render('Admin/Paket/Index', [
            'pakets' => $pakets,
            'success' => session('success'), // ✅ PERBAIKI: 'success' bukan 'successMessage'
        ]);
    }

    /**
     * Menampilkan form untuk membuat Paket baru. (admin.paket.create)
     */
    public function create()
    {
        // ✅ PERBAIKI: Path component
        return Inertia::render('Admin/Paket/Create');
    }

    /**
     * Menyimpan Paket baru ke database. (admin.paket.store)
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_paket' => 'required|string|max:50|unique:paket_internet,nama_paket',
            'kecepatan' => 'required|string|max:20',
            'kuota' => 'nullable|string|max:20',
            'harga_bulanan' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ], [
            'nama_paket.required' => 'Nama Paket wajib diisi.',
            'nama_paket.unique' => 'Nama Paket ini sudah terdaftar.',
            'kecepatan.required' => 'Kecepatan wajib diisi.',
            'harga_bulanan.required' => 'Harga Bulanan wajib diisi.',
            'harga_bulanan.numeric' => 'Harga Bulanan harus berupa angka.',
        ]);

        try {
            PaketInternet::create($validatedData);
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Gagal menyimpan paket baru: ' . $e->getMessage());
        }

        // ✅ PERBAIKI: Route name
        return redirect()->route('admin.paket.index')->with('success', 'Paket baru berhasil ditambahkan: ' . $validatedData['nama_paket']);
    }
    
    /**
     * Menampilkan form untuk mengedit Paket. (admin.paket.edit)
     */
    public function edit($id_paket) 
    {
        try {
            // ✅ PERBAIKI: Ganti variable $package menjadi $paket
            $paket = PaketInternet::findOrFail($id_paket);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.paket.index')->with('error', 'Paket tidak ditemukan.');
        } catch (Exception $e) {
            return redirect()->route('admin.paket.index')->with('error', 'Terjadi error saat memuat data edit: ' . $e->getMessage());
        }

        // ✅ PERBAIKI: Path component dan variable
        return Inertia::render('Admin/Paket/Edit', [
            'paket' => $paket,
        ]);
    }
    
    /**
     * Memperbarui Paket di database. (admin.paket.update)
     */
    public function update(Request $request, $id_paket) 
    {
        $validatedData = $request->validate([
            'nama_paket' => 'required|string|max:50|unique:paket_internet,nama_paket,' . $id_paket . ',id_paket', 
            'kecepatan' => 'required|string|max:20',
            'kuota' => 'nullable|string|max:20',
            'harga_bulanan' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ], [
            'nama_paket.required' => 'Nama Paket wajib diisi.',
            'nama_paket.unique' => 'Nama Paket ini sudah terdaftar.',
            'kecepatan.required' => 'Kecepatan wajib diisi.',
            'harga_bulanan.required' => 'Harga Bulanan wajib diisi.',
        ]);
        
        try {
            // ✅ PERBAIKI: Ganti variable $package menjadi $paket
            $paket = PaketInternet::findOrFail($id_paket);
            $paket->update($validatedData);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.paket.index')->with('error', 'Paket yang akan diperbarui tidak ditemukan.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui paket: ' . $e->getMessage());
        }

        // ✅ PERBAIKI: Route name
        return redirect()->route('admin.paket.index')->with('success', 'Paket berhasil diperbarui!');
    }
    
    /**
     * Menghapus Paket dari database. (admin.paket.destroy)
     */
    public function destroy($id_paket) 
    {
        try {
            // ✅ PERBAIKI: Ganti variable $package menjadi $paket
            $paket = PaketInternet::findOrFail($id_paket);
            $paket->delete();
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.paket.index')->with('error', 'Paket yang akan dihapus tidak ditemukan.');
        } catch (Exception $e) {
            return redirect()->route('admin.paket.index')->with('error', 'Gagal menghapus paket: ' . $e->getMessage());
        }

        // ✅ PERBAIKI: Route name
        return redirect()->route('admin.paket.index')->with('success', 'Paket berhasil dihapus!');
    }
}