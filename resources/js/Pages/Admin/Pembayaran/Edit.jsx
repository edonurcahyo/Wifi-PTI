import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from "../../Auth/Layouts/AdminLayouts";
import { 
    ArrowLeft, Save, User, DollarSign, Calendar, 
    CreditCard, Check, Clock, AlertCircle, CalendarRange
} from 'lucide-react';

const Edit = ({ auth, pembayaran, pelanggan, paketList }) => {
    const [selectedPelanggan, setSelectedPelanggan] = useState(null);
    const [selectedPaket, setSelectedPaket] = useState(null);
    
    // Generate pilihan bulan (12 bulan ke depan)
    const generateMonthOptions = () => {
        const months = [];
        const currentDate = new Date();
        
        for (let i = -6; i < 6; i++) { // 6 bulan ke belakang, 6 bulan ke depan
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const monthName = date.toLocaleDateString('id-ID', { month: 'long' });
            
            const value = `${year}-${month.toString().padStart(2, '0')}-01`;
            const label = `${monthName} ${year}`;
            
            months.push({ value, label });
        }
        
        return months;
    };

    const monthOptions = generateMonthOptions();
    
    const { data, setData, put, processing, errors } = useForm({
        id_pelanggan: pembayaran.id_pelanggan || '',
        id_paket: pembayaran.id_paket || '',
        jenis_pembayaran: pembayaran.jenis_pembayaran || 'Bulanan',
        jumlah_bayar: pembayaran.jumlah_bayar || '',
        tanggal_pembayaran: pembayaran.tanggal_pembayaran ? pembayaran.tanggal_pembayaran.split('T')[0] : new Date().toISOString().split('T')[0],
        bulan_dibayar: pembayaran.bulan_dibayar || '',
        periode_awal: pembayaran.periode_awal || '',
        periode_akhir: pembayaran.periode_akhir || '',
        tanggal_tempo: pembayaran.tanggal_tempo || '',
        metode_bayar: pembayaran.metode_bayar || 'Transfer',
        status_bayar: pembayaran.status_bayar || 'Pending',
        keterangan: pembayaran.keterangan || '',
    });

    // ✅ INITIALIZE DATA SAAT COMPONENT MOUNT
    useEffect(() => {
        // Set selected pelanggan
        if (pembayaran.id_pelanggan) {
            const pelangganData = pelanggan.find(p => p.id_pelanggan == pembayaran.id_pelanggan);
            setSelectedPelanggan(pelangganData);
            
            // Jika ada paket, set selected paket
            if (pembayaran.id_paket && paketList) {
                const paketData = paketList.find(p => p.id_paket == pembayaran.id_paket);
                setSelectedPaket(paketData);
            }
        }
    }, [pembayaran, pelanggan, paketList]);

    // Hitung status tempo
    const calculateTempoStatus = () => {
        if (!data.tanggal_tempo || !data.tanggal_pembayaran) {
            return null;
        }
        
        const tempoDate = new Date(data.tanggal_tempo);
        const bayarDate = new Date(data.tanggal_pembayaran);
        const diffTime = bayarDate - tempoDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) {
            return {
                status: 'tepat_waktu',
                message: `Dibayar ${Math.abs(diffDays)} hari sebelum tempo`,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
            };
        } else {
            return {
                status: 'terlambat',
                message: `Terlambat ${diffDays} hari dari tempo`,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200'
            };
        }
    };

    const tempoInfo = calculateTempoStatus();

    // ✅ HANDLER UNTUK INPUT CHANGE
    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    const handlePelangganChange = (pelangganId) => {
        const pelangganData = pelanggan.find(p => p.id_pelanggan == pelangganId);
        setSelectedPelanggan(pelangganData);
        setData('id_pelanggan', pelangganId);
    };

    // Handler untuk update bulan dibayar
    const handleBulanDibayarChange = (bulanDibayar) => {
        if (bulanDibayar) {
            const date = new Date(bulanDibayar);
            
            // Periode awal: tanggal 1 bulan tersebut
            const periodeAwal = new Date(date.getFullYear(), date.getMonth(), 1)
                .toISOString().split('T')[0];
            
            // Periode akhir: tanggal terakhir bulan tersebut
            const periodeAkhir = new Date(date.getFullYear(), date.getMonth() + 1, 0)
                .toISOString().split('T')[0];
            
            // Tanggal tempo: tanggal 10 bulan tersebut (jika belum ada)
            if (!data.tanggal_tempo) {
                const tanggalTempo = new Date(date.getFullYear(), date.getMonth(), 10)
                    .toISOString().split('T')[0];
                setData('tanggal_tempo', tanggalTempo);
            }
            
            setData({
                ...data,
                bulan_dibayar: bulanDibayar,
                periode_awal: periodeAwal,
                periode_akhir: periodeAkhir,
            });
        } else {
            setData({
                ...data,
                bulan_dibayar: '',
                periode_awal: '',
                periode_akhir: '',
            });
        }
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
        onChange, children 
    }) => {
        return (
            <div className="mb-6">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label} {required && <span className="text-red-500">*</span>}
                    </div>
                </label>
                {children ? children : (
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
                )}
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

                            {/* Bulan yang Dibayar (Hanya untuk Pembayaran Bulanan) */}
                            {data.jenis_pembayaran === 'Bulanan' && (
                                <div className="mb-6">
                                    <label htmlFor="bulan_dibayar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <CalendarRange className="h-4 w-4" />
                                            Bulan yang Dibayar
                                        </div>
                                    </label>
                                    <select
                                        id="bulan_dibayar"
                                        value={data.bulan_dibayar}
                                        onChange={(e) => handleBulanDibayarChange(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Pilih Bulan...</option>
                                        {monthOptions.map((month) => (
                                            <option key={month.value} value={month.value}>
                                                {month.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Pilih bulan yang akan dibayar. Periode dan tanggal tempo akan otomatis diatur.
                                    </p>
                                    {errors.bulan_dibayar && <p className="text-red-500 text-sm mt-1">{errors.bulan_dibayar}</p>}
                                </div>
                            )}

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

                                {/* Informasi Periode (Read-only jika ada) */}
                                {data.periode_awal && data.periode_akhir && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarRange className="h-4 w-4" />
                                                Rentang Periode
                                            </div>
                                        </label>
                                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                                            <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                {new Date(data.periode_awal).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })} - {new Date(data.periode_akhir).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Periode pembayaran untuk bulan yang dipilih
                                            </p>
                                        </div>
                                        {errors.periode_awal && <p className="text-red-500 text-sm mt-1">{errors.periode_awal}</p>}
                                        {errors.periode_akhir && <p className="text-red-500 text-sm mt-1">{errors.periode_akhir}</p>}
                                    </div>
                                )}

                                {/* Tanggal Tempo */}
                                <InputField
                                    id="tanggal_tempo"
                                    label="Tanggal Jatuh Tempo"
                                    type="date"
                                    value={data.tanggal_tempo}
                                    error={errors.tanggal_tempo}
                                    icon={Clock}
                                    onChange={(e) => handleInputChange('tanggal_tempo', e.target.value)}
                                >
                                    <div className="space-y-2">
                                        <input
                                            id="tanggal_tempo"
                                            type="date"
                                            value={data.tanggal_tempo}
                                            onChange={(e) => handleInputChange('tanggal_tempo', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white"
                                        />
                                        {tempoInfo && (
                                            <div className={`p-2 rounded border ${tempoInfo.borderColor} ${tempoInfo.bgColor}`}>
                                                <p className={`text-xs font-medium ${tempoInfo.color}`}>
                                                    <AlertCircle className="inline h-3 w-3 mr-1" />
                                                    {tempoInfo.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </InputField>

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

                            {/* Keterangan */}
                            <div className="mb-6">
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Keterangan
                                    </div>
                                </label>
                                <textarea
                                    id="keterangan"
                                    rows={3}
                                    value={data.keterangan}
                                    onChange={(e) => handleInputChange('keterangan', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white resize-none"
                                    placeholder="Keterangan pembayaran..."
                                />
                                {errors.keterangan && <p className="text-red-500 text-sm mt-1">{errors.keterangan}</p>}
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