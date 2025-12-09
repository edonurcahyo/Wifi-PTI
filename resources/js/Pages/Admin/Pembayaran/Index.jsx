import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Auth/Layouts/AdminLayouts';
import { PlusCircle, Edit, Trash2, Search, Filter, Download, CheckCircle, XCircle, Clock, DollarSign, Receipt, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const Index = ({ auth, pembayaran, stats, success }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    
    // Inisialisasi bulan dan tahun saat ini
    useEffect(() => {
        const today = new Date();
        if (!monthFilter) {
            setMonthFilter((today.getMonth() + 1).toString().padStart(2, '0'));
        }
        if (!yearFilter) {
            setYearFilter(today.getFullYear().toString());
        }
    }, []);
    
    const formatRupiah = (angka) => {
        if (!angka) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Generate array bulan untuk dropdown
    const months = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    // Generate array tahun untuk dropdown (3 tahun ke belakang dan 1 tahun ke depan)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - 2 + i;
        return { value: year.toString(), label: year.toString() };
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Pending': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
            'Lunas': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
            'Belum Bayar': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
        };
        
        const config = statusConfig[status] || statusConfig.Pending;
        const IconComponent = config.icon;
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {status}
            </span>
        );
    };

    const getMetodeBadge = (metode) => {
        const metodeConfig = {
            'Transfer': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'QRIS': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'Tunai': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${metodeConfig[metode] || metodeConfig.Transfer}`}>
                {metode}
            </span>
        );
    };

    const getJenisBadge = (jenis) => {
        const jenisConfig = {
            'Instalasi': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            'Bulanan': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jenisConfig[jenis] || jenisConfig.Bulanan}`}>
                {jenis}
            </span>
        );
    };

    const handleVerify = (id_pembayaran) => {
        if (confirm(`Verifikasi pembayaran ini?`)) {
            router.post(route('admin.pembayaran.verify', id_pembayaran), {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id_pembayaran) => {
        if (confirm(`Hapus pembayaran ini?`)) {
            router.delete(route('admin.pembayaran.destroy', id_pembayaran), {
                preserveScroll: true,
            });
        }
    };

    const handleFilterChange = () => {
        const params = {};
        
        if (searchTerm) params.search = searchTerm;
        if (statusFilter !== 'all') params.status = statusFilter;
        if (monthFilter) params.month = monthFilter;
        if (yearFilter) params.year = yearFilter;
        
        router.get(route('admin.pembayaran.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setMonthFilter((new Date().getMonth() + 1).toString().padStart(2, '0'));
        setYearFilter(new Date().getFullYear().toString());
        
        router.get(route('admin.pembayaran.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Fungsi untuk mendapatkan nama bulan dari angka
    const getMonthName = (monthNumber) => {
        const month = months.find(m => m.value === monthNumber);
        return month ? month.label : 'Bulan tidak valid';
    };

    // Filter data secara lokal (opsional, atau gunakan filter dari backend)
    const filteredPembayaran = pembayaran.data?.filter(p => {
        const matchesSearch = 
            p.pelanggan?.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.pelanggan?.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || p.status_bayar === statusFilter;
        
        // Filter berdasarkan bulan dan tahun
        let matchesDate = true;
        if (monthFilter && yearFilter) {
            const paymentDate = new Date(p.tanggal_pembayaran);
            const paymentMonth = (paymentDate.getMonth() + 1).toString().padStart(2, '0');
            const paymentYear = paymentDate.getFullYear().toString();
            matchesDate = paymentMonth === monthFilter && paymentYear === yearFilter;
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <AdminLayout user={auth.user} header="Management Pembayaran">
            <Head title="Management Pembayaran" />

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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Pembayaran</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Management transaksi pembayaran pelanggan
                            {monthFilter && yearFilter && (
                                <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                                    - Periode: {getMonthName(monthFilter)} {yearFilter}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.pembayaran.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-blue-700 transition duration-150"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Tambah Pembayaran
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pendapatan</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatRupiah(stats?.totalAmount || 0)}
                                </p>
                                {monthFilter && yearFilter && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {getMonthName(monthFilter)} {yearFilter}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lunas</p>
                                <p className="text-2xl font-bold text-green-600">{stats?.totalPaid || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats?.totalPending || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
                                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Belum Bayar</p>
                                <p className="text-2xl font-bold text-red-600">{stats?.totalFailed || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Cari nama pelanggan atau email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">Semua Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Lunas">Lunas</option>
                                <option value="Belum Bayar">Belum Bayar</option>
                            </select>
                        </div>
                        
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <select
                                    value={monthFilter}
                                    onChange={(e) => setMonthFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex-1">
                                <select
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    {years.map((year) => (
                                        <option key={year.value} value={year.value}>
                                            {year.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={handleFilterChange}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                Terapkan Filter
                            </button>
                            <button 
                                onClick={handleResetFilter}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title="Reset Filter"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Filter */}
                {(searchTerm || statusFilter !== 'all' || monthFilter || yearFilter) && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            Menampilkan data dengan filter:
                            {searchTerm && <span className="font-semibold ml-1">Pencarian: "{searchTerm}"</span>}
                            {statusFilter !== 'all' && <span className="font-semibold ml-2">Status: {statusFilter}</span>}
                            {monthFilter && yearFilter && (
                                <span className="font-semibold ml-2">
                                    Periode: {getMonthName(monthFilter)} {yearFilter}
                                </span>
                            )}
                        </p>
                    </div>
                )}

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
                                        Jenis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Metode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredPembayaran && filteredPembayaran.length > 0 ? (
                                    filteredPembayaran.map((bayar) => (
                                        <tr key={bayar.id_pembayaran} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {bayar.pelanggan?.nama_pelanggan}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {bayar.pelanggan?.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getJenisBadge(bayar.jenis_pembayaran)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatRupiah(bayar.jumlah_bayar)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getMetodeBadge(bayar.metode_bayar)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(bayar.tanggal_pembayaran)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(bayar.status_bayar)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {bayar.status_bayar === 'Pending' && (
                                                        <button
                                                            onClick={() => handleVerify(bayar.id_pembayaran)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition"
                                                            title="Verifikasi Pembayaran"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    
                                                    {bayar.bukti_bayar && (
                                                        <a
                                                            href={`/storage/${bayar.bukti_bayar}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                                            title="Lihat Bukti Bayar"
                                                        >
                                                            <Receipt className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    
                                                    <Link
                                                        href={route('admin.pembayaran.edit', bayar.id_pembayaran)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                                                        title="Edit Pembayaran"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    
                                                    <button
                                                        onClick={() => handleDelete(bayar.id_pembayaran)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition"
                                                        title="Hapus Pembayaran"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            {searchTerm || statusFilter !== 'all' || monthFilter || yearFilter 
                                                ? 'Tidak ada pembayaran yang sesuai dengan filter.' 
                                                : 'Belum ada data pembayaran.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pembayaran.links && pembayaran.links.length > 3 && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                            {pembayaran.links.map((link, index) => (
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