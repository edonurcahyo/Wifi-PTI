import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../Auth/Layouts/AdminLayouts"; 
import { 
    Users, 
    DollarSign, 
    Globe, 
    Activity, 
    AlertCircle,
    CheckCircle,
    Info,
    XCircle,
    TrendingUp,
    Package,
    Clock,
    BarChart3,
    UserPlus,
    AlertTriangle,
    RefreshCw
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, description, loading }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center justify-center p-3 rounded-full ${color} bg-opacity-10 w-12 h-12`}>
                        {loading ? (
                            <RefreshCw className={`w-6 h-6 ${color} animate-spin`} />
                        ) : (
                            <Icon className={`w-6 h-6 ${color}`} />
                        )}
                    </div>
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
                {loading ? (
                    <div className="h-10 mt-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                )}
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{description}</p>
                )}
            </div>
        </div>
    </div>
);

const LogItem = ({ log }) => {
    const getIcon = (status) => {
        const icons = {
            'success': CheckCircle,
            'info': Info,
            'warning': AlertCircle,
            'danger': XCircle,
            'secondary': Info,
        };
        const IconComponent = icons[status] || Info;
        return <IconComponent className="w-4 h-4" />;
    };

    const getStatusColor = (status) => {
        const colors = {
            'success': 'bg-green-100 text-green-800 border-green-200',
            'info': 'bg-blue-100 text-blue-800 border-blue-200',
            'warning': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'danger': 'bg-red-100 text-red-800 border-red-200',
            'secondary': 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getIconColor = (status) => {
        const colors = {
            'success': 'text-green-600',
            'info': 'text-blue-600',
            'warning': 'text-yellow-600',
            'danger': 'text-red-600',
            'secondary': 'text-gray-600',
        };
        return colors[status] || 'text-gray-600';
    };

    return (
        <li className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(log.status)} border`}>
                <div className={getIconColor(log.status)}>
                    {getIcon(log.status)}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{log.aktivitas}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="mr-2 font-medium">{log.admin}</span>
                    <span>•</span>
                    <span className="ml-2">{log.waktu}</span>
                </div>
            </div>
        </li>
    );
};

const PaketItem = ({ paket, index }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
        <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-100 text-gray-800' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                <span className="font-bold">#{index + 1}</span>
            </div>
            <div className="ml-3">
                <div className="font-medium text-gray-900 dark:text-white">{paket.nama}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{paket.kecepatan}</div>
            </div>
        </div>
        <div className="text-right">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">{paket.jumlahPelanggan}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{paket.persentase}%</div>
        </div>
    </div>
);

const Dashboard = ({ auth, stats, ringkasan, logTerbaru, chartData, topPaket }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Statistik cards dengan data real
    const statCards = [
        { 
            title: 'Total Pelanggan Aktif', 
            value: stats?.totalPelanggan || '0', 
            icon: Users, 
            color: 'text-indigo-500',
            description: 'Pelanggan dengan status aktif',
            loading: !stats
        },
        { 
            title: 'Pendapatan Bulan Ini', 
            value: stats?.pendapatanBulanIni || 'Rp 0', 
            icon: DollarSign, 
            color: 'text-green-500',
            description: 'Total pembayaran lunas bulan ini',
            loading: !stats
        },
        { 
            title: 'Jaringan Aktif', 
            value: stats?.jaringanAktif || '0%', 
            icon: Globe, 
            color: 'text-blue-500',
            description: 'Persentase pelanggan aktif',
            loading: !stats
        },
        { 
            title: 'Pembayaran Pending', 
            value: stats?.pembayaranPending || '0', 
            icon: AlertTriangle, 
            color: 'text-yellow-500',
            description: 'Menunggu verifikasi',
            loading: !stats
        },
    ];

    // Fungsi untuk refresh data
    const refreshData = () => {
        setIsRefreshing(true);
        window.location.reload();
    };

    // Format currency helper
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'Rp 0';
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
    };

    // Format tanggal
    const formatDate = () => {
        return new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Tampilkan loading jika data belum tersedia
    if (!stats || !ringkasan) {
        return (
            <AdminLayout user={auth.user} header="Dashboard Utama Admin">
                <Head title="Dashboard Admin" />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Memuat data dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout user={auth.user} header="Dashboard Utama Admin">
            <Head title="Dashboard Admin" />
            
            {/* Header dengan refresh button */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Selamat datang, {auth.user?.nama_admin || 'Administrator'}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {formatDate()}
                    </p>
                </div>
                <button
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition w-full sm:w-auto"
                >
                    {isRefreshing ? (
                        <>
                            <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Memperbarui...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                            Refresh Data
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
                
                {/* Charts dan Ringkasan */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart Pendapatan dan Ringkasan */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chart Pendapatan */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <BarChart3 className="w-5 h-5 mr-2" />
                                    Trend Pendapatan 6 Bulan Terakhir
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Dalam Rupiah
                                </span>
                            </div>
                            
                            {chartData?.pendapatanPerBulan && chartData.pendapatanPerBulan.length > 0 ? (
                                <>
                                    <div className="h-64 flex items-end space-x-1 md:space-x-2">
                                        {chartData.pendapatanPerBulan.map((item, index) => {
                                            const maxPendapatan = Math.max(...chartData.pendapatanPerBulan.map(p => p.pendapatan));
                                            const heightPercentage = maxPendapatan > 0 
                                                ? (item.pendapatan / maxPendapatan) * 100 
                                                : 0;
                                            
                                            return (
                                                <div key={index} className="flex flex-col items-center flex-1">
                                                    <div 
                                                        className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                                                        style={{ 
                                                            height: `${Math.max(20, heightPercentage)}%`,
                                                            minHeight: '20px'
                                                        }}
                                                        title={`${item.bulan_full} ${item.tahun}: ${item.formatted}`}
                                                    >
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                                            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                                {item.formatted}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {item.bulan}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Legend */}
                                    <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-gradient-to-t from-green-500 to-green-300 rounded mr-2"></div>
                                            <span>Pendapatan Bulanan</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-64 flex items-center justify-center">
                                    <div className="text-center">
                                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400">Tidak ada data pendapatan</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ringkasan Operasional */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Ringkasan Operasional
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Paket Terlaris</div>
                                                <div className="font-semibold text-blue-600 dark:text-blue-400">
                                                    {ringkasan.paketTerlaris}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
                                                <AlertTriangle className="w-5 h-5" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Tagihan Belum Lunas</div>
                                                <div className="font-semibold text-red-600">
                                                    {ringkasan.tagihanBelumLunas}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                                                <UserPlus className="w-5 h-5" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Pelanggan Baru</div>
                                                <div className="font-semibold">
                                                    {ringkasan.pelangganBaruBulanIni} bulan ini
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Pembayaran Terlambat</div>
                                                <div className="font-semibold text-yellow-600">
                                                    {ringkasan.pembayaranTerlambat || 0} transaksi
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link 
                                    href={route('admin.paket.index')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Kelola Paket
                                </Link>
                                <Link 
                                    href={route('admin.pelanggan.index')}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Lihat Pelanggan
                                </Link>
                                <Link 
                                    href={route('admin.pembayaran.index')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                                >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Pembayaran
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Log Aktivitas & Top Paket */}
                    <div className="space-y-6">
                        {/* Log Aktivitas */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <Activity className="w-5 h-5 mr-2" />
                                    Log Aktivitas Terbaru
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {stats.logAktivitasHariIni || 0} hari ini
                                </span>
                            </div>
                            
                            {logTerbaru && logTerbaru.length > 0 ? (
                                <>
                                    <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                        {logTerbaru.map((log, index) => (
                                            <LogItem key={index} log={log} />
                                        ))}
                                    </ul>
                                    <Link 
                                        href="#"
                                        className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                    >
                                        Lihat Semua Log Aktivitas →
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <Info className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">Tidak ada aktivitas hari ini</p>
                                </div>
                            )}
                        </div>

                        {/* Top Paket */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Paket Terpopuler
                            </h2>
                            
                            {topPaket && topPaket.length > 0 ? (
                                <>
                                    <div className="space-y-3">
                                        {topPaket.map((paket, index) => (
                                            <PaketItem key={paket.id} paket={paket} index={index} />
                                        ))}
                                    </div>
                                    <Link 
                                        href={route('admin.paket.index')}
                                        className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                    >
                                        Kelola Semua Paket →
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">Tidak ada data paket</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                            <h3 className="text-lg font-bold mb-4">Statistik Cepat</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span>Pelanggan Aktif</span>
                                    <span className="font-bold">{stats.totalPelanggan}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Pendapatan Bulan Ini</span>
                                    <span className="font-bold">{stats.pendapatanBulanIni}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Jaringan Aktif</span>
                                    <span className="font-bold">{stats.jaringanAktif}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Pending</span>
                                    <span className="font-bold">{stats.pembayaranPending}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;