import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
// Jalur Layout yang sudah diperbaiki
import AdminLayout from '../../Auth/Layouts/AdminLayouts'; 
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import moment from 'moment'; // Sekarang sudah terinstal melalui npm

// Catatan: Prop 'success' berasal dari flash message Laravel
const Index = ({ auth, packages, success }) => {
    
    // Fungsi untuk memformat harga ke Rupiah
    const formatRupiah = (angka) => {
        if (!angka) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    // Logika untuk menangani penghapusan
    const handleDelete = (id_paket, nama_paket) => {
        if (confirm(`Apakah Anda yakin ingin menghapus paket "${nama_paket}"? Aksi ini TIDAK DAPAT dibatalkan.`)) {
            // Mengirim request DELETE ke route admin.packages.destroy
            router.delete(route('admin.packages.destroy', id_paket), {
                preserveScroll: true,
                onError: (errors) => {
                    // Gunakan modal UI custom di lingkungan production, tapi alert untuk debugging cepat
                    alert('Gagal menghapus paket. Mungkin paket ini masih terhubung dengan data pelanggan lain.');
                }
            });
        }
    };


    return (
        <AdminLayout user={auth.user} header="Daftar Paket Internet">
            <Head title="Manajemen Paket" />

            <div className="space-y-6">
                
                {/* Notifikasi Sukses/Error (Mengambil dari flash session) */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative transition-opacity duration-300" role="alert">
                        <span className="block sm:inline">{success}</span>
                    </div>
                )}
                
                {/* Header dan Tombol Tambah */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Paket</h2>
                    <Link
                        href={route('admin.packages.create')} // Route ke halaman Tambah Paket
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-blue-700 transition duration-150"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Tambah Paket
                    </Link>
                </div>

                {/* Tabel Data Paket */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Nama Paket
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Kecepatan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Kuota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Harga Bulanan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Dibuat
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {packages.data.length > 0 ? (
                                    packages.data.map((pkg) => (
                                        <tr key={pkg.id_paket} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {pkg.nama_paket}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {pkg.kecepatan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {pkg.kuota || 'Tidak Terbatas'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold dark:text-blue-400">
                                                {formatRupiah(pkg.harga_bulanan)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {/* Menggunakan moment.js untuk format tanggal */}
                                                {moment(pkg.created_at).format('DD MMM YYYY')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {/* Link ke Halaman Edit (admin.packages.edit) */}
                                                    <Link
                                                        href={route('admin.packages.edit', pkg.id_paket)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                                                        title="Edit Paket"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    
                                                    {/* Tombol Hapus (Menggunakan fungsi handleDelete) */}
                                                    <button
                                                        onClick={() => handleDelete(pkg.id_paket, pkg.nama_paket)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition"
                                                        title="Hapus Paket"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            Belum ada data paket internet yang tersedia. Silakan tambahkan satu paket.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links (Jika data lebih dari 10) */}
                    {packages.links.length > 3 && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                            {packages.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'} // Pastikan url ada
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 mx-1 rounded-lg text-sm transition duration-150 ${
                                        link.active
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : link.url
                                            ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                                            : 'text-gray-400 dark:text-gray-500 cursor-default'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
