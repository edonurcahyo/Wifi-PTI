import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from "../../Auth/Layouts/AdminLayouts";
import { ArrowLeft, Download, Printer, Mail, CheckCircle, XCircle, Clock, User, DollarSign, Calendar, CreditCard, Receipt, MapPin, Phone } from 'lucide-react';

const Show = ({ auth, pembayaran }) => {
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
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Lunas': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Pending': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Ditolak': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout user={auth.user} header={`Detail Pembayaran #${pembayaran.id_pembayaran}`}>
            <Head title={`Detail Pembayaran #${pembayaran.id_pembayaran}`} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.pembayaran.index')}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Kembali
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Detail Pembayaran
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                ID: #{pembayaran.id_pembayaran}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Cetak
                        </button>
                        <Link
                            href={`/admin/pembayaran/${pembayaran.id_pembayaran}/invoice`}
                            target="_blank"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                        </Link>
                    </div>
                </div>

                {/* Status Banner */}
                <div className={`mb-6 p-4 rounded-lg ${
                    pembayaran.status_bayar === 'Lunas' 
                        ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                        : pembayaran.status_bayar === 'Pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
                        : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {getStatusIcon(pembayaran.status_bayar)}
                            <div className="ml-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Status: {pembayaran.status_bayar}
                                </h3>
                                {pembayaran.verified_at && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Diverifikasi pada: {formatDate(pembayaran.verified_at)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            pembayaran.status_bayar === 'Lunas' 
                                ? 'bg-green-500 text-white'
                                : pembayaran.status_bayar === 'Pending'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-red-500 text-white'
                        }`}>
                            {pembayaran.status_bayar}
                        </span>
                    </div>
                </div>

                {/* Grid Informasi */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informasi Pelanggan */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informasi Pembayaran */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
                                Informasi Pembayaran
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Jumlah Pembayaran</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatRupiah(pembayaran.jumlah_bayar)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Jenis Pembayaran</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {pembayaran.jenis_pembayaran}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Metode Pembayaran</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {pembayaran.metode_bayar}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Tanggal Pembayaran</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {formatDate(pembayaran.tanggal_pembayaran)}
                                    </p>
                                </div>
                                {pembayaran.no_transaksi && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Nomor Transaksi</p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                                            {pembayaran.no_transaksi}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Informasi Pelanggan */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-green-500" />
                                Informasi Pelanggan
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-3 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {pembayaran.pelanggan?.nama_pelanggan}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Nama Lengkap</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {pembayaran.pelanggan?.email}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {pembayaran.pelanggan?.no_hp}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Telepon</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {pembayaran.pelanggan?.alamat}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Alamat</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Bukti Bayar & Aksi */}
                    <div className="space-y-6">
                        {/* Bukti Bayar */}
                        {pembayaran.bukti_bayar && (
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Receipt className="w-5 h-5 mr-2 text-purple-500" />
                                    Bukti Pembayaran
                                </h3>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <img 
                                            src={`/storage/bukti_pembayaran/${pembayaran.bukti_bayar}`}
                                            alt="Bukti Pembayaran"
                                            className="w-full h-auto max-h-64 object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Bukti+Tidak+Tersedia';
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`/storage/bukti_pembayaran/${pembayaran.bukti_bayar}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Lihat Full Size
                                        </a>
                                        <a
                                            href={`/storage/bukti_pembayaran/${pembayaran.bukti_bayar}`}
                                            download
                                            className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Aksi Admin */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Aksi Admin
                            </h3>
                            <div className="space-y-3">
                                {pembayaran.status_bayar === 'Pending' && (
                                    <>
                                        <button
                                            onClick={() => confirm('Verifikasi pembayaran ini?') && 
                                                router.post(route('admin.pembayaran.verify', pembayaran.id_pembayaran))}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Verifikasi Pembayaran
                                        </button>
                                        <button
                                            onClick={() => {
                                                const reason = prompt('Alasan penolakan:');
                                                if (reason) {
                                                    router.post(route('admin.pembayaran.reject', pembayaran.id_pembayaran), {
                                                        alasan: reason
                                                    });
                                                }
                                            }}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Tolak Pembayaran
                                        </button>
                                    </>
                                )}
                                <Link
                                    href={route('admin.pembayaran.edit', pembayaran.id_pembayaran)}
                                    className="block text-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Edit Pembayaran
                                </Link>
                            </div>
                        </div>

                        {/* Informasi Paket */}
                        {pembayaran.paket && (
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Paket Internet
                                </h3>
                                <div className="space-y-2">
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {pembayaran.paket.nama_paket}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Kecepatan: {pembayaran.paket.kecepatan}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Harga: {formatRupiah(pembayaran.paket.harga_bulanan)}/bulan
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Show;