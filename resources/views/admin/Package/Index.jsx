import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
// Sesuaikan path import AdminLayout Anda di sini
import AdminLayout from '@/Layouts/AdminLayout'; 
import { Plus } from 'lucide-react'; 

const Index = ({ auth, packages, successMessage }) => {
    const { delete: destroy } = useForm();
    
    // Fungsi untuk memicu penghapusan data
    const handleDelete = (pkg) => {
        if (confirm(`Apakah Anda yakin ingin menghapus paket "${pkg.nama_paket}"?`)) {
            // Menggunakan id_paket sebagai parameter route
            destroy(route('admin.packages.destroy', pkg.id_paket));
        }
    };

    return (
        <AdminLayout user={auth.user} header="Manajemen Paket Internet">
            <Head title="Daftar Paket" />

            {/* Pesan Sukses */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Paket Internet</h2>
                    <Link
                        href={route('admin.packages.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Paket Baru
                    </Link>
                </div>

                {/* Tabel Daftar Paket */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Paket</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kecepatan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kuota</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Harga Bulanan</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Memastikan packages.data ada karena menggunakan pagination */}
                            {packages.data && packages.data.map((pkg) => (
                                <tr key={pkg.id_paket} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {pkg.nama_paket}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {pkg.kecepatan}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {pkg.kuota}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold dark:text-green-400">
                                        Rp {new Intl.NumberFormat('id-ID').format(pkg.harga_bulanan)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <Link 
                                            href={route('admin.packages.edit', pkg.id_paket)} 
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(pkg)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {packages.links && packages.links.length > 3 && (
                    <div className="mt-4">
                        <div className="flex justify-center">
                            {packages.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-2 text-sm leading-4 border rounded mx-1 ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    </div>
                )}

                {(!packages.data || packages.data.length === 0) && (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
                        Belum ada data paket yang tersedia. Klik "Tambah Paket Baru" untuk memulai.
                    </p>
                )}
            </div>
        </AdminLayout>
    );
};

export default Index;