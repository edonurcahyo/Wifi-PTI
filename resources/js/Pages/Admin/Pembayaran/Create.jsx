import React, { useState, useEffect } from 'react'; 
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from "../../Auth/Layouts/AdminLayouts";
import { 
    ArrowLeft, Save, User, DollarSign, Calendar, 
    CreditCard, Package, Zap, Infinity, Check,
    Clock, AlertCircle, CalendarRange
} from 'lucide-react';

const Create = ({ auth, pelanggan, paketList }) => {
    const [selectedPaket, setSelectedPaket] = useState(null);
    const [selectedPelanggan, setSelectedPelanggan] = useState(null);
    
    // Tambah state untuk bulan yang akan dibayar
    const [bulanDibayar, setBulanDibayar] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        id_pelanggan: '',
        id_paket: '',
        jenis_pembayaran: 'Bulanan',
        jumlah_bayar: '',
        tanggal_pembayaran: new Date().toISOString().split('T')[0],
        periode_awal: '',
        periode_akhir: '',
        tanggal_tempo: '',
        bulan_dibayar: '',
        metode_bayar: 'Transfer',
        keterangan: '',
    });

    // Generate pilihan bulan (12 bulan ke depan)
    const generateMonthOptions = () => {
        const months = [];
        const currentDate = new Date();
        
        for (let i = 0; i < 12; i++) {
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

    // Auto-set periode dan tempo saat bulan dipilih
    useEffect(() => {
        if (bulanDibayar) {
            const date = new Date(bulanDibayar);
            
            // Periode awal: tanggal 1 bulan tersebut
            const periodeAwal = new Date(date.getFullYear(), date.getMonth(), 1)
                .toISOString().split('T')[0];
            
            // Periode akhir: tanggal terakhir bulan tersebut
            const periodeAkhir = new Date(date.getFullYear(), date.getMonth() + 1, 0)
                .toISOString().split('T')[0];
            
            // Tanggal tempo: tanggal 10 bulan tersebut
            const tanggalTempo = new Date(date.getFullYear(), date.getMonth(), 10)
                .toISOString().split('T')[0];
            
            setData({
                ...data,
                bulan_dibayar: bulanDibayar,
                periode_awal: periodeAwal,
                periode_akhir: periodeAkhir,
                tanggal_tempo: tanggalTempo
            });
        }
    }, [bulanDibayar]);

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

    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    // InputField Component (sudah ada)
    const InputField = React.memo(({ 
        id, label, type = 'text', value, error, icon: Icon, required = false, children, disabled = false,
        onChange 
    }) => {
        // ... (tetap sama)
    });

    // Handler untuk paket & jenis pembayaran (tambahkan logic untuk periode)
    const handlePaketSelect = (paket) => {
        setSelectedPaket(paket);
        if (data.jenis_pembayaran === 'Bulanan') {
            setData({ 
                ...data, 
                jumlah_bayar: paket.harga_bulanan,
                id_paket: paket.id_paket 
            });
        }
    };

    const handleJenisPembayaranChange = (jenis) => {
        const updatedData = { ...data, jenis_pembayaran: jenis };
        
        if (jenis === 'Bulanan' && selectedPaket) {
            updatedData.jumlah_bayar = selectedPaket.harga_bulanan;
            updatedData.id_paket = selectedPaket.id_paket;
            
            // Auto-set bulan dibayar ke bulan ini jika belum diisi
            if (!bulanDibayar) {
                const currentDate = new Date();
                const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                    .toISOString().split('T')[0];
                setBulanDibayar(firstDayOfMonth);
            }
        } else if (jenis === 'Instalasi') {
            updatedData.jumlah_bayar = 250000;
            updatedData.id_paket = '';
            setSelectedPaket(null);
        }
        
        setData(updatedData);
    };

    const handlePelangganChange = (pelangganId) => {
        const pelangganData = pelanggan.find(p => p.id_pelanggan == pelangganId);
        setSelectedPelanggan(pelangganData);
        
        const updatedData = { ...data, id_pelanggan: pelangganId };
        
        if (pelangganData?.paket && data.jenis_pembayaran === 'Bulanan') {
            const paketData = paketList.find(p => p.id_paket == pelangganData.id_paket);
            if (paketData) {
                setSelectedPaket(paketData);
                updatedData.jumlah_bayar = paketData.harga_bulanan;
                updatedData.id_paket = paketData.id_paket;
            }
        }
        
        setData(updatedData);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.pembayaran.store'));
    };

    const formatRupiah = (angka) => {
        if (!angka) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    return (
        <AdminLayout user={auth.user} header="Tambah Pembayaran Manual">
            <Head title="Tambah Pembayaran" />

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
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">Tambah Pembayaran Manual</h2>
                        <p className="text-green-100 text-sm">Catat pembayaran yang dilakukan secara manual</p>
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
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
                                        onClick={() => handleJenisPembayaranChange('Bulanan')}
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
                                        onClick={() => handleJenisPembayaranChange('Instalasi')}
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

                            {/* TAMBAHAN: Pilih Bulan yang Dibayar (Hanya untuk Pembayaran Bulanan) */}
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
                                        value={bulanDibayar}
                                        onChange={(e) => setBulanDibayar(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white"
                                        required
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

                            {/* Pilih Paket (Hanya untuk Pembayaran Bulanan) */}
                            {data.jenis_pembayaran === 'Bulanan' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            Pilih Paket Internet
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {paketList.map((paket) => (
                                            <button
                                                key={paket.id_paket}
                                                type="button"
                                                onClick={() => handlePaketSelect(paket)}
                                                className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                                                    selectedPaket?.id_paket === paket.id_paket
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 shadow-lg'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                                        {paket.nama_paket}
                                                    </h3>
                                                    {selectedPaket?.id_paket === paket.id_paket && (
                                                        <Check className="h-5 w-5 text-blue-500" />
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="h-4 w-4 text-yellow-500" />
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {paket.kecepatan}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Infinity className="h-4 w-4 text-green-500" />
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            {paket.kuota || 'Unlimited'}
                                                        </span>
                                                    </div>
                                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                            {formatRupiah(paket.harga_bulanan)}
                                                            <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/bulan</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {paket.keterangan && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                        {paket.keterangan}
                                                    </p>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.id_paket && <p className="text-red-500 text-sm mt-1">{errors.id_paket}</p>}
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
                                    disabled={data.jenis_pembayaran === 'Bulanan' && selectedPaket}
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

                                {/* Informasi Periode (Read-only) */}
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
                                    </div>
                                )}

                                {/* Informasi Tempo (Read-only) */}
                                {data.tanggal_tempo && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Jatuh Tempo
                                            </div>
                                        </label>
                                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                                            <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                {new Date(data.tanggal_tempo).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            {tempoInfo && (
                                                <div className={`mt-2 p-2 rounded border ${tempoInfo.borderColor} ${tempoInfo.bgColor}`}>
                                                    <p className={`text-xs font-medium ${tempoInfo.color}`}>
                                                        <AlertCircle className="inline h-3 w-3 mr-1" />
                                                        {tempoInfo.message}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

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
                                    placeholder={
                                        data.jenis_pembayaran === 'Bulanan' && selectedPaket
                                            ? `Pembayaran bulanan paket ${selectedPaket.nama_paket}...`
                                            : data.jenis_pembayaran === 'Instalasi'
                                            ? `Pembayaran instalasi ${selectedPelanggan ? `untuk ${selectedPelanggan.nama_pelanggan}` : ''}...`
                                            : 'Keterangan pembayaran...'
                                    }
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
                                    disabled={processing || !data.id_pelanggan || (data.jenis_pembayaran === 'Bulanan' && !selectedPaket)}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Create;