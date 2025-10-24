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
     * Menampilkan daftar semua Paket Internet. (admin.packages.index)
     */
    public function index()
    {
        try {
            // Mengambil data dengan pagination
            $packages = PaketInternet::orderBy('nama_paket')->paginate(10);
        } catch (Exception $e) {
            return redirect()->route('admin.dashboard')->with('error', 'Gagal memuat daftar paket: ' . $e->getMessage());
        }

        return Inertia::render('Admin/Package/Index', [
            'packages' => $packages,
            'successMessage' => session('success'),
        ]);
    }

    /**
     * Menampilkan form untuk membuat Paket baru. (admin.packages.create)
     */
    public function create()
    {
        return Inertia::render('Admin/Package/Create');
    }

    /**
     * Menyimpan Paket baru ke database. (admin.packages.store)
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            // unique:nama_tabel,nama_kolom
            'nama_paket' => 'required|string|max:50|unique:paket_internet,nama_paket',
            'kecepatan' => 'required|string|max:20',
            'kuota' => 'nullable|string|max:20',
            'harga_bulanan' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ], [
            // Pesan validasi Bahasa Indonesia
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

        return redirect()->route('admin.packages.index')->with('success', 'Paket baru berhasil ditambahkan: ' . $validatedData['nama_paket']);
    }
    
    /**
     * Menampilkan form untuk mengedit Paket. (admin.packages.edit)
     */
    public function edit($id_paket) 
    {
        try {
            $package = PaketInternet::findOrFail($id_paket);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.packages.index')->with('error', 'Paket tidak ditemukan.');
        } catch (Exception $e) {
            return redirect()->route('admin.packages.index')->with('error', 'Terjadi error saat memuat data edit: ' . $e->getMessage());
        }

        return Inertia::render('Admin/Package/Edit', [
            'package' => $package,
        ]);
    }
    
    /**
     * Memperbarui Paket di database. (admin.packages.update)
     */
    public function update(Request $request, $id_paket) 
    {
        $validatedData = $request->validate([
            // unique:nama_tabel,nama_kolom,id_yang_diabaikan,primary_key
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
            $package = PaketInternet::findOrFail($id_paket);
            $package->update($validatedData);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.packages.index')->with('error', 'Paket yang akan diperbarui tidak ditemukan.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui paket: ' . $e->getMessage());
        }

        return redirect()->route('admin.packages.index')->with('success', 'Paket berhasil diperbarui!');
    }
    
    /**
     * Menghapus Paket dari database. (admin.packages.destroy)
     */
    public function destroy($id_paket) 
    {
        try {
            $package = PaketInternet::findOrFail($id_paket);
            $package->delete();
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.packages.index')->with('error', 'Paket yang akan dihapus tidak ditemukan.');
        } catch (Exception $e) {
            return redirect()->route('admin.packages.index')->with('error', 'Gagal menghapus paket: ' . $e->getMessage());
        }

        return redirect()->route('admin.packages.index')->with('success', 'Paket berhasil dihapus!');
    }
}