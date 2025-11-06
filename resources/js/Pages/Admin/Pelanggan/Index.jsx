import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Auth/Layouts/AdminLayouts';
import { PlusCircle, Edit, Trash2, Power, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const Index = ({ auth, pelanggan, success }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const formatRupiah = (angka) => {
        if (!angka) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    const handleStatusToggle = (id_pelanggan, nama_pelanggan) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status pelanggan "${nama_pelanggan}"?`)) {
            router.post(route('admin.pelanggan.toggle-status', id_pelanggan), {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id_pelanggan, nama_pelanggan) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pelanggan "${nama_pelanggan}"?`)) {
            router.delete(route('admin.pelanggan.destroy', id_pelanggan), {
                preserveScroll: true,
            });
        }
    };

    const filteredPelanggan = pelanggan.data?.filter(p => 
        p.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.no_hp.includes(searchTerm)
    );

    return (
        <AdminLayout user={auth.user} header="Management Pelanggan">
            <Head title="Management Pelanggan" />

            <div className="space-y-6">
                {/* Success Message */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative transition-opacity duration-300" role="alert">
                        <span className="block sm:inline">{success}</span>
                    </div>
                )}
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Pelanggan</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Management data pelanggan ASTINet
                        </p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Cari pelanggan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pelanggan</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{pelanggan.total || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pelanggan Aktif</p>
                        <p className="text-2xl font-bold text-green-600">
                            {pelanggan.data?.filter(p => p.status_aktif === 'Aktif').length || 0}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Belum Berlangganan</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {pelanggan.data?.filter(p => !p.id_paket).length || 0}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nonaktif</p>
                        <p className="text-2xl font-bold text-red-600">
                            {pelanggan.data?.filter(p => p.status_aktif === 'Nonaktif').length || 0}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Pelanggan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Kontak
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Paket
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Tanggal Daftar
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredPelanggan && filteredPelanggan.length > 0 ? (
                                    filteredPelanggan.map((plg) => (
                                        <tr key={plg.id_pelanggan} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {plg.nama_pelanggan}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {plg.alamat}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">{plg.email}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{plg.no_hp}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {plg.paket ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {plg.paket.nama_paket}
                                                        </div>
                                                        <div className="text-sm text-blue-600 dark:text-blue-400">
                                                            {formatRupiah(plg.paket.harga_bulanan)}/bln
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                        Belum Berlangganan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    plg.status_aktif === 'Aktif'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                    {plg.status_aktif}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(plg.tanggal_daftar).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={route('admin.pelanggan.edit', plg.id_pelanggan)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                                                        title="Edit Pelanggan"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    
                                                    <button
                                                        onClick={() => handleStatusToggle(plg.id_pelanggan, plg.nama_pelanggan)}
                                                        className={`transition ${
                                                            plg.status_aktif === 'Aktif'
                                                                ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                                                                : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                                        }`}
                                                        title={plg.status_aktif === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleDelete(plg.id_pelanggan, plg.nama_pelanggan)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition"
                                                        title="Hapus Pelanggan"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            {searchTerm ? 'Tidak ada pelanggan yang sesuai dengan pencarian.' : 'Belum ada data pelanggan.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pelanggan.links && pelanggan.links.length > 3 && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                            {pelanggan.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
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