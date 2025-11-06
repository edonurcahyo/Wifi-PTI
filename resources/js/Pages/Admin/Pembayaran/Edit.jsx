import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from "../../Auth/Layouts/AdminLayouts";
import { ArrowLeft, Save, User, DollarSign, Calendar, CreditCard, Check } from 'lucide-react';

const Edit = ({ auth, pembayaran, pelanggan }) => {
    const [selectedPelanggan, setSelectedPelanggan] = useState(null);
    
    const { data, setData, put, processing, errors } = useForm({
        id_pelanggan: pembayaran.id_pelanggan || '',
        jenis_pembayaran: pembayaran.jenis_pembayaran || 'Bulanan',
        jumlah_bayar: pembayaran.jumlah_bayar || '',
        tanggal_pembayaran: pembayaran.tanggal_pembayaran ? pembayaran.tanggal_pembayaran.split('T')[0] : new Date().toISOString().split('T')[0],
        metode_bayar: pembayaran.metode_bayar || 'Transfer',
        status_bayar: pembayaran.status_bayar || 'Pending',
    });

    // ✅ INITIALIZE DATA SAAT COMPONENT MOUNT
    useEffect(() => {
        // Set selected pelanggan
        if (pembayaran.id_pelanggan) {
            const pelangganData = pelanggan.find(p => p.id_pelanggan == pembayaran.id_pelanggan);
            setSelectedPelanggan(pelangganData);
        }
    }, [pembayaran, pelanggan]);

    // ✅ HANDLER UNTUK INPUT CHANGE
    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    const handlePelangganChange = (pelangganId) => {
        const pelangganData = pelanggan.find(p => p.id_pelanggan == pelangganId);
        setSelectedPelanggan(pelangganData);
        setData('id_pelanggan', pelangganId);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.pembayaran.update', pembayaran.id_pembayaran));
    };

    const formatRupiah = (angka) => {
        if (!angka) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    // ✅ INPUTFIELD COMPONENT
    const InputField = React.memo(({ 
        id, label, type = 'text', value, error, icon: Icon, required = false, disabled = false,
        onChange 
    }) => {
        return (
            <div className="mb-6">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label} {required && <span className="text-red-500">*</span>}
                    </div>
                </label>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`mt-1 block w-full rounded-lg border ${
                        error 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white ${
                        disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                    }`}
                    required={required}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        );
    });

    return (
        <AdminLayout user={auth.user} header="Edit Pembayaran">
            <Head title="Edit Pembayaran" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center mb-6">
                    <Link
                        href={route('admin.pembayaran.index')} 
                        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 dark:text-blue-400 dark:hover:text-blue-300"
                        preserveScroll
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Daftar Pembayaran
                    </Link>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">Edit Pembayaran</h2>
                        <p className="text-yellow-100 text-sm">Update data pembayaran</p>
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Informasi Pembayaran Saat Ini */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                                    Informasi Pembayaran Saat Ini
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">ID Pembayaran:</span>
                                        <p className="font-medium text-gray-900 dark:text-white">#{pembayaran.id_pembayaran}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            pembayaran.status_bayar === 'Lunas' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : pembayaran.status_bayar === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                            {pembayaran.status_bayar}
                                        </span>
                                    </div>
                                    {pembayaran.created_at && (
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Dibuat:</span>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {new Date(pembayaran.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    )}
                                    {pembayaran.updated_at && (
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-400">Terakhir Update:</span>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {new Date(pembayaran.updated_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pilih Pelanggan */}
                            <div className="mb-6">
                                <label htmlFor="id_pelanggan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Pilih Pelanggan
                                    </div>
                                </label>
                                <select
                                    id="id_pelanggan"
                                    value={data.id_pelanggan}
                                    onChange={(e) => handlePelangganChange(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="">Pilih Pelanggan...</option>
                                    {pelanggan.map((plg) => (
                                        <option key={plg.id_pelanggan} value={plg.id_pelanggan}>
                                            {plg.nama_pelanggan} - {plg.email} 
                                            {plg.paket ? ` (${plg.paket.nama_paket})` : ' (Belum berlangganan)'}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_pelanggan && <p className="text-red-500 text-sm mt-1">{errors.id_pelanggan}</p>}
                            </div>

                            {/* Jenis Pembayaran */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Jenis Pembayaran
                                    </div>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setData('jenis_pembayaran', 'Bulanan')}
                                        className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                                            data.jenis_pembayaran === 'Bulanan'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900 dark:text-white">Bulanan</span>
                                            {data.jenis_pembayaran === 'Bulanan' && (
                                                <Check className="h-5 w-5 text-blue-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Pembayaran paket internet bulanan
                                        </p>
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setData('jenis_pembayaran', 'Instalasi')}
                                        className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                                            data.jenis_pembayaran === 'Instalasi'
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900 dark:text-white">Instalasi</span>
                                            {data.jenis_pembayaran === 'Instalasi' && (
                                                <Check className="h-5 w-5 text-green-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Biaya pemasangan pertama
                                        </p>
                                    </button>
                                </div>
                                {errors.jenis_pembayaran && <p className="text-red-500 text-sm mt-1">{errors.jenis_pembayaran}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Jumlah Bayar */}
                                <InputField
                                    id="jumlah_bayar"
                                    label="Jumlah Bayar"
                                    type="number"
                                    value={data.jumlah_bayar}
                                    error={errors.jumlah_bayar}
                                    icon={DollarSign}
                                    required
                                    onChange={(e) => handleInputChange('jumlah_bayar', e.target.value)}
                                />

                                {/* Tanggal Bayar */}
                                <InputField
                                    id="tanggal_pembayaran"
                                    label="Tanggal Pembayaran"
                                    type="date"
                                    value={data.tanggal_pembayaran}
                                    error={errors.tanggal_pembayaran}
                                    icon={Calendar}
                                    required
                                    onChange={(e) => handleInputChange('tanggal_pembayaran', e.target.value)}
                                />

                                {/* Metode Bayar */}
                                <div className="mb-6">
                                    <label htmlFor="metode_bayar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Metode Pembayaran
                                        </div>
                                    </label>
                                    <select
                                        id="metode_bayar"
                                        value={data.metode_bayar}
                                        onChange={(e) => handleInputChange('metode_bayar', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="Transfer">Transfer Bank</option>
                                        <option value="QRIS">QRIS</option>
                                        <option value="Tunai">Tunai</option>
                                    </select>
                                    {errors.metode_bayar && <p className="text-red-500 text-sm mt-1">{errors.metode_bayar}</p>}
                                </div>

                                {/* Status Bayar */}
                                <div className="mb-6">
                                    <label htmlFor="status_bayar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4" />
                                            Status Pembayaran
                                        </div>
                                    </label>
                                    <select
                                        id="status_bayar"
                                        value={data.status_bayar}
                                        onChange={(e) => handleInputChange('status_bayar', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Lunas">Lunas</option>
                                        <option value="Belum Bayar">Belum Bayar</option>
                                    </select>
                                    {errors.status_bayar && <p className="text-red-500 text-sm mt-1">{errors.status_bayar}</p>}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('admin.pembayaran.index')}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || !data.id_pelanggan}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-yellow-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Update Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Edit;