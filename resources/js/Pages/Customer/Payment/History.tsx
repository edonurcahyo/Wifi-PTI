import { Calendar, CreditCard, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Download, Eye, Receipt } from "lucide-react";
import { useState } from "react";

interface PembayaranItem {
    id_pembayaran: number;
    tanggal_pembayaran: string;
    jenis_pembayaran: string;
    jumlah_bayar: number;
    status_bayar: string;
    metode_bayar?: string;
    keterangan?: string;
    bukti_bayar?: string;
    created_at?: string;
}

interface HistoryProps {
    pembayaran: {
        data: PembayaranItem[];
        current_page?: number;
        last_page?: number;
        total?: number;
        from?: number;
        to?: number;
        links?: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function History({ pembayaran }: HistoryProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const formatRupiah = (angka: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(angka);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Lunas':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Lunas
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            case 'Belum Bayar':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Belum Bayar
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                        {status}
                    </span>
                );
        }
    };

    const getJenisBadge = (jenis: string) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                jenis === 'Bulanan' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            }`}>
                {jenis}
            </span>
        );
    };

    const getMetodeBadge = (metode: string) => {
        const metodeConfig: Record<string, {color: string, bgColor: string}> = {
            'Transfer': { color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
            'QRIS': { color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
            'Tunai': { color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        };
        
        const config = metodeConfig[metode] || metodeConfig.Transfer;
        
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${config.bgColor} ${config.color}`}>
                {metode}
            </span>
        );
    };

    // Filter dan sort data
    const filteredData = pembayaran.data
        .filter(p => {
            const matchesSearch = 
                p.jenis_pembayaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.status_bayar.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === "all" || p.status_bayar === statusFilter;
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.tanggal_pembayaran).getTime() - new Date(a.tanggal_pembayaran).getTime();
            } else if (sortBy === "oldest") {
                return new Date(a.tanggal_pembayaran).getTime() - new Date(b.tanggal_pembayaran).getTime();
            } else if (sortBy === "highest") {
                return b.jumlah_bayar - a.jumlah_bayar;
            } else {
                return a.jumlah_bayar - b.jumlah_bayar;
            }
        });

    const totalLunas = pembayaran.data.filter(p => p.status_bayar === 'Lunas').length;
    const totalPending = pembayaran.data.filter(p => p.status_bayar === 'Pending').length;
    const totalBelumBayar = pembayaran.data.filter(p => p.status_bayar === 'Belum Bayar').length;
    const totalAmount = pembayaran.data
        .filter(p => p.status_bayar === 'Lunas')
        .reduce((sum, p) => sum + p.jumlah_bayar, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Riwayat Pembayaran</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Lacak semua transaksi pembayaran Anda
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transaksi</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {pembayaran.data.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lunas</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {totalLunas}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {totalPending}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Dibayar</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatRupiah(totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Cari jenis atau status..."
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
                                <option value="Lunas">Lunas</option>
                                <option value="Pending">Pending</option>
                                <option value="Belum Bayar">Belum Bayar</option>
                            </select>
                        </div>
                        
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="newest">Terbaru</option>
                                <option value="oldest">Terlama</option>
                                <option value="highest">Jumlah Tertinggi</option>
                                <option value="lowest">Jumlah Terendah</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Daftar Transaksi
                            </h3>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Menampilkan {filteredData.length} dari {pembayaran.data.length} transaksi
                            </span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Tanggal
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Transaksi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredData.length > 0 ? (
                                    filteredData.map((p) => (
                                        <tr key={p.id_pembayaran} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {formatDate(p.tanggal_pembayaran)}
                                                </div>
                                                {p.created_at && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDateTime(p.created_at)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        {getJenisBadge(p.jenis_pembayaran)}
                                                        {p.metode_bayar && getMetodeBadge(p.metode_bayar)}
                                                    </div>
                                                    {p.keterangan && (
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                                            {p.keterangan}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {formatRupiah(p.jumlah_bayar)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(p.status_bayar)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {p.bukti_bayar && (
                                                        <a 
                                                            href={`/storage/${p.bukti_bayar}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                            title="Lihat Bukti"
                                                        >
                                                            <Receipt className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <CreditCard className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                    Tidak ada transaksi
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {searchTerm || statusFilter !== "all" 
                                                        ? "Tidak ada transaksi yang sesuai dengan filter" 
                                                        : "Belum ada riwayat pembayaran"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pembayaran.links && pembayaran.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    Menampilkan <span className="font-medium">{pembayaran.from}</span> sampai{' '}
                                    <span className="font-medium">{pembayaran.to}</span> dari{' '}
                                    <span className="font-medium">{pembayaran.total}</span> transaksi
                                </div>
                                <div className="flex gap-1">
                                    {pembayaran.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white font-medium'
                                                    : link.url
                                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                                                    : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                                    Informasi Status Pembayaran
                                </h4>
                                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                                    <li className="flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-2" />
                                        <span><strong>Lunas:</strong> Pembayaran sudah diverifikasi dan diterima</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Clock className="w-3 h-3 mr-2" />
                                        <span><strong>Pending:</strong> Menunggu verifikasi admin</span>
                                    </li>
                                    <li className="flex items-center">
                                        <XCircle className="w-3 h-3 mr-2" />
                                        <span><strong>Belum Bayar:</strong> Tagihan belum dibayar</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                        <div className="flex items-start">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                                    Total Pembayaran Sukses
                                </h4>
                                <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                                    {formatRupiah(totalAmount)}
                                </div>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    Total pembayaran yang sudah diverifikasi dan diterima
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}