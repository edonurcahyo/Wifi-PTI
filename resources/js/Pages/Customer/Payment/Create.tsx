import { useForm } from "@inertiajs/react";
import { DollarSign, CreditCard, Calendar, FileText, AlertCircle, CheckCircle, Wallet, Banknote, QrCode, Receipt } from "lucide-react";
import { useState, useEffect } from "react";

interface CreateProps {
    pelanggan: {
        nama_pelanggan: string;
        paket?: {
            nama_paket: string;
            harga_bulanan: number;
            kecepatan?: string;
        } | null;
    };
    paketAktif?: {
        nama_paket: string;
        harga_bulanan: number;
        kecepatan?: string;
    } | null;
}

export default function Create({ pelanggan, paketAktif }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        jenis_pembayaran: "Bulanan",
        metode_bayar: "Transfer",
        jumlah_bayar: paketAktif?.harga_bulanan ?? 0,
        keterangan: "",
    });

    const [hargaInstalasi, setHargaInstalasi] = useState(250000);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("customer.payment.store"));
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(angka);
    };

    // Update jumlah bayar berdasarkan jenis pembayaran
    useEffect(() => {
        if (data.jenis_pembayaran === "Bulanan" && paketAktif) {
            setData("jumlah_bayar", paketAktif.harga_bulanan);
        } else if (data.jenis_pembayaran === "Instalasi") {
            setData("jumlah_bayar", hargaInstalasi);
        }
    }, [data.jenis_pembayaran]);

    const metodeBayarOptions = [
        { value: "Transfer", label: "Transfer Bank", icon: Banknote, color: "text-blue-600", bgColor: "bg-blue-100" },
        { value: "QRIS", label: "QRIS", icon: QrCode, color: "text-green-600", bgColor: "bg-green-100" },
        { value: "Tunai", label: "Tunai", icon: Wallet, color: "text-purple-600", bgColor: "bg-purple-100" },
    ];

    const jenisPembayaranOptions = [
        { 
            value: "Bulanan", 
            label: "Tagihan Bulanan", 
            description: "Pembayaran paket internet rutin bulanan",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        { 
            value: "Instalasi", 
            label: "Biaya Instalasi", 
            description: "Biaya pemasangan pertama",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Buat Pembayaran Baru</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Buat tagihan pembayaran untuk paket internet Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                <div className="flex items-center">
                                    <CreditCard className="w-6 h-6 text-white mr-3" />
                                    <h2 className="text-lg font-semibold text-white">Form Pembayaran</h2>
                                </div>
                                <p className="text-blue-100 text-sm mt-1">Isi detail pembayaran Anda</p>
                            </div>

                            <form onSubmit={submit} className="p-6 space-y-6">
                                {/* Jenis Pembayaran */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Receipt className="w-4 h-4" />
                                            Jenis Pembayaran
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {jenisPembayaranOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setData("jenis_pembayaran", option.value)}
                                                className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                                                    data.jenis_pembayaran === option.value
                                                        ? `${option.bgColor} border-${option.color.split('-')[1]}-500 dark:border-${option.color.split('-')[1]}-400`
                                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <option.icon className={`w-5 h-5 mr-3 ${option.color}`} />
                                                        <div>
                                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                                {option.label}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {option.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {data.jenis_pembayaran === option.value && (
                                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.jenis_pembayaran && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.jenis_pembayaran}</p>
                                    )}
                                </div>

                                {/* Metode Bayar */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            Metode Pembayaran
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {metodeBayarOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setData("metode_bayar", option.value)}
                                                className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                                                    data.metode_bayar === option.value
                                                        ? `${option.bgColor} border-${option.color.split('-')[1]}-500 dark:border-${option.color.split('-')[1]}-400`
                                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <option.icon className={`w-8 h-8 mb-2 ${option.color}`} />
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {option.label}
                                                    </div>
                                                    {data.metode_bayar === option.value && (
                                                        <div className="mt-2 w-3 h-3 rounded-full bg-blue-500"></div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.metode_bayar && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.metode_bayar}</p>
                                    )}
                                </div>

                                {/* Jumlah Bayar */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            Jumlah Pembayaran
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">Rp</span>
                                        </div>
                                        <input
                                            type="number"
                                            className={`w-full pl-12 pr-4 py-3 text-lg font-semibold border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                                errors.jumlah_bayar
                                                    ? 'border-red-500 dark:border-red-500'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white`}
                                            value={data.jumlah_bayar}
                                            onChange={(e) => setData("jumlah_bayar", Number(e.target.value))}
                                            // readOnly={data.jenis_pembayaran === "Bulanan" && paketAktif}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">IDR</span>
                                        </div>
                                    </div>
                                    {errors.jumlah_bayar && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.jumlah_bayar}</p>
                                    )}
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {data.jenis_pembayaran === "Bulanan" && paketAktif ? (
                                            <span className="flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2 text-blue-500" />
                                                Jumlah sesuai dengan harga paket bulanan
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2 text-green-500" />
                                                Biaya standar instalasi
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Keterangan */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Keterangan (Opsional)
                                        </div>
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                                        rows={3}
                                        value={data.keterangan}
                                        onChange={(e) => setData("keterangan", e.target.value)}
                                        placeholder={`Tambahkan catatan untuk pembayaran ${data.jenis_pembayaran.toLowerCase()}...`}
                                    />
                                    {errors.keterangan && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.keterangan}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] ${
                                        processing ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                            Memproses...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 mr-3" />
                                            Buat Tagihan Pembayaran
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Summary & Info */}
                    <div className="space-y-6">
                        {/* Customer Info Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                                Informasi Pelanggan
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Nama</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {pelanggan.nama_pelanggan}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Paket Aktif</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {pelanggan.paket?.nama_paket || "Belum berlangganan"}
                                    </span>
                                </div>
                                
                                {pelanggan.paket?.kecepatan && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Kecepatan</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                            {pelanggan.paket.kecepatan}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Summary Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                                Ringkasan Pembayaran
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Jenis</span>
                                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                                        data.jenis_pembayaran === "Bulanan"
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    }`}>
                                        {data.jenis_pembayaran}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Metode</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {metodeBayarOptions.find(m => m.value === data.metode_bayar)?.label}
                                    </span>
                                </div>
                                
                                <div className="pt-3 border-t border-blue-100 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Total Bayar</span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {formatRupiah(data.jumlah_bayar)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Payment Timeline */}
                            <div className="mt-6 pt-4 border-t border-blue-100 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Proses Pembayaran
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Buat Tagihan</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-3">
                                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Upload Bukti</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-3">
                                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Verifikasi Admin</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                                        Informasi Penting
                                    </h4>
                                    <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                                        <li>• Tagihan akan dibuat dengan status "Pending"</li>
                                        <li>• Upload bukti pembayaran setelah tagihan dibuat</li>
                                        <li>• Admin akan memverifikasi pembayaran Anda</li>
                                        <li>• Hubungi customer service jika ada kendala</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}