import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Auth/Layouts/AdminLayouts';
import { 
    PlusCircle, 
    Edit, 
    Trash2, 
    Search, 
    Filter, 
    Download, 
    CheckCircle, 
    XCircle, 
    Clock, 
    DollarSign, 
    Receipt, 
    Calendar,
    X,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Minus,
    ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Index = ({ auth, pembayaran, stats, success }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    
    // STATE UNTUK MODAL PREVIEW
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBukti, setSelectedBukti] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imageLoading, setImageLoading] = useState(true);
    
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
    
    // Keyboard shortcuts untuk modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (modalOpen && selectedBukti) {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case '+':
                    case '=':
                        if (!e.ctrlKey) {
                            e.preventDefault();
                            handleZoomIn();
                        }
                        break;
                    case '-':
                        e.preventDefault();
                        handleZoomOut();
                        break;
                    case '0':
                        e.preventDefault();
                        handleResetZoom();
                        break;
                    case 'd':
                    case 'D':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            // Trigger download
                            const link = document.createElement('a');
                            link.href = selectedBukti;
                            link.download = 'bukti_pembayaran_' + new Date().getTime();
                            link.click();
                        }
                        break;
                }
            }
        };

        if (modalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [modalOpen, zoomLevel, selectedBukti]);

    // Fungsi zoom
    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
    };

    const handleResetZoom = () => {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    // Fungsi drag untuk gambar yang di-zoom
    const handleMouseDown = (e) => {
        if (zoomLevel > 1 && !selectedBukti.toLowerCase().endsWith('.pdf')) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoomLevel > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Double click untuk toggle zoom
    const handleDoubleClick = () => {
        if (!selectedBukti.toLowerCase().endsWith('.pdf')) {
            if (zoomLevel === 1) {
                setZoomLevel(2);
            } else {
                handleResetZoom();
            }
        }
    };

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

    // Fungsi untuk URL bukti
   const getBuktiUrl = (buktiPath, buktiUrl) => {
        // Prioritaskan URL yang sudah lengkap dari accessor
        if (buktiUrl && (buktiUrl.startsWith('http://') || buktiUrl.startsWith('https://'))) {
            console.log('Using bukti_url from accessor:', buktiUrl);
            return buktiUrl;
        }
        
        // Fallback ke path lama
        if (!buktiPath) {
            return null;
        }
        
        console.log('Using bukti_bayar path:', buktiPath);
        
        // Jika sudah URL lengkap
        if (buktiPath.startsWith('http://') || buktiPath.startsWith('https://')) {
            return buktiPath;
        }
        
        // Jika hanya nama file
        if (buktiPath && !buktiPath.includes('/')) {
            return `/storage/bukti_pembayaran/${buktiPath}`;
        }
        
        // Jika ada prefix storage/
        if (buktiPath.startsWith('storage/')) {
            return `/${buktiPath}`;
        }
        
        // Default
        return `/storage/${buktiPath.replace('public/', '')}`;
    };


    // Fungsi untuk buka modal preview
    const openBuktiModal = (buktiPath, buktiUrl = null) => {
        const url = getBuktiUrl(buktiPath, buktiUrl);
        console.log('Opening modal with URL:', url);
        setSelectedBukti(url);
        setModalOpen(true);
        setImageLoading(true);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };
    // Fungsi untuk tutup modal
    const closeModal = () => {
        setModalOpen(false);
        setTimeout(() => {
            setSelectedBukti(null);
            setImageLoading(true);
            setZoomLevel(1);
            setPosition({ x: 0, y: 0 });
        }, 300);
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
        const today = new Date();
        setMonthFilter((today.getMonth() + 1).toString().padStart(2, '0'));
        setYearFilter(today.getFullYear().toString());
        
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

    // Filter data secara lokal
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
            
            {/* MODAL PREVIEW BUKTI - IMPROVED */}
            {modalOpen && selectedBukti && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-95 p-4"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-300 dark:border-gray-600">
                        {/* Header Modal dengan Controls */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Receipt className="w-5 h-5" />
                                    Preview Bukti Pembayaran
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Shortcut: 
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono mx-1">ESC</kbd> tutup • 
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono mx-1">+/-</kbd> zoom • 
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono mx-1">0</kbd> reset • 
                                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono mx-1">Double Click</kbd> toggle
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* Zoom Controls untuk gambar */}
                                {!selectedBukti.toLowerCase().endsWith('.pdf') && (
                                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                        <button
                                            onClick={handleZoomOut}
                                            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Zoom Out (-)"
                                            disabled={zoomLevel <= 0.5}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        
                                        <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded">
                                            <span className="text-sm font-mono text-gray-700 dark:text-gray-300 font-bold min-w-[50px] inline-block text-center">
                                                {Math.round(zoomLevel * 100)}%
                                            </span>
                                        </div>
                                        
                                        <button
                                            onClick={handleZoomIn}
                                            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Zoom In (+)"
                                            disabled={zoomLevel >= 3}
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                        
                                        {zoomLevel !== 1 && (
                                            <button
                                                onClick={handleResetZoom}
                                                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded ml-1"
                                                title="Reset Zoom (0)"
                                            >
                                                <Maximize2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )}
                                
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                                    title="Tutup (ESC)"
                                >
                                    <X className="w-6 h-6" />
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Tutup (ESC)
                                    </span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Content Area */}
                        <div className="p-6 overflow-auto max-h-[80vh] flex flex-col items-center">
                            {/* Cek tipe file */}
                            {selectedBukti.toLowerCase().endsWith('.pdf') ? (
                                <div className="flex flex-col items-center w-full">
                                    <div className="relative w-full h-[65vh] border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                                        <iframe
                                            src={selectedBukti}
                                            className="w-full h-full"
                                            title="Bukti Pembayaran PDF"
                                        />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-bold">Dokumen PDF</span> - Untuk hasil terbaik, gunakan tombol Download di bawah
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            Jika PDF tidak tampil, browser Anda mungkin membutuhkan PDF viewer
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // Preview Gambar dengan Zoom & Drag
                                <div 
                                    className={`relative w-full flex flex-col items-center ${zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                                    onMouseDown={handleMouseDown}
                                    onDoubleClick={handleDoubleClick}
                                >
                                    {/* Loading Indicator */}
                                    {imageLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Memuat gambar...</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Image Container dengan Zoom */}
                                    <div 
                                        className="relative overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                                        style={{
                                            transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                                            transition: isDragging ? 'none' : 'transform 0.1s ease',
                                            transformOrigin: 'center center',
                                            maxWidth: '100%',
                                            maxHeight: '65vh'
                                        }}
                                    >
                                        <img
                                            src={selectedBukti}
                                            alt="Bukti Pembayaran"
                                            className={`max-w-full max-h-[65vh] h-auto object-contain transition-opacity duration-300 ${
                                                imageLoading ? 'opacity-0' : 'opacity-100'
                                            }`}
                                            onLoad={() => setImageLoading(false)}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/600x800/ef4444/ffffff?text=Gambar+Tidak+Dapat+Dimuat';
                                                setImageLoading(false);
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Zoom & Drag Instructions */}
                                    <div className="mt-4 text-center space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-sm">
                                            {zoomLevel > 1 ? (
                                                <>
                                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg font-medium">
                                                        Mode Zoom Aktif ({Math.round(zoomLevel * 100)}%)
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-400">•</span>
                                                    <span className="text-amber-600 dark:text-amber-400">
                                                        Drag gambar untuk melihat area lain
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-400">•</span>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Double click untuk reset
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                                                        Zoom untuk melihat detail
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-400">•</span>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Double click untuk zoom cepat
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        
                                        {zoomLevel > 1 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500 animate-pulse">
                                                💡 Tip: Gunakan tombol +/- untuk kontrol zoom yang lebih presisi
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-wrap gap-3 justify-center">
                                <a
                                    href={selectedBukti}
                                    download={`bukti_pembayaran_${new Date().getTime()}${selectedBukti.toLowerCase().endsWith('.pdf') ? '.pdf' : '.jpg'}`}
                                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    title="Download file asli"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download File Asli
                                    <span className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded-lg">
                                        {selectedBukti.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Gambar'}
                                    </span>
                                </a>
                                
                                <button
                                    onClick={() => window.open(selectedBukti, '_blank', 'noopener,noreferrer')}
                                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                                    title="Buka di tab baru"
                                >
                                    <ExternalLink className="w-5 h-5 mr-2" />
                                    Buka di Tab Baru
                                </button>
                                
                                <button
                                    onClick={closeModal}
                                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                                >
                                    <X className="w-5 h-5 mr-2" />
                                    Tutup Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Success Message */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative transition-opacity duration-300 animate-fadeIn" role="alert">
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
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-blue-700 transition duration-150 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Tambah Pembayaran
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
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
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lunas</p>
                                <p className="text-2xl font-bold text-green-600">{stats?.totalPaid || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pembayaran diverifikasi</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats?.totalPending || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Menunggu verifikasi</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
                                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Belum Bayar</p>
                                <p className="text-2xl font-bold text-red-600">{stats?.totalFailed || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Belum upload bukti</p>
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
                                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Semua Bulan</option>
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
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Semua Tahun</option>
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
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg"
                            >
                                <Filter className="h-4 w-4" />
                                Terapkan Filter
                            </button>
                            <button 
                                onClick={handleResetFilter}
                                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                                title="Reset Filter"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Filter Aktif */}
                {(searchTerm || statusFilter !== 'all' || monthFilter || yearFilter) && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                                    Filter Aktif:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {searchTerm && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-700">
                                            Pencarian: "{searchTerm}"
                                        </span>
                                    )}
                                    {statusFilter !== 'all' && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-700">
                                            Status: {statusFilter}
                                        </span>
                                    )}
                                    {monthFilter && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-700">
                                            Bulan: {getMonthName(monthFilter)}
                                        </span>
                                    )}
                                    {yearFilter && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-700">
                                            Tahun: {yearFilter}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                {filteredPembayaran?.length || 0} data ditemukan
                            </span>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Pelanggan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Jenis
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Metode
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Aksi & Bukti
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredPembayaran && filteredPembayaran.length > 0 ? (
                                    filteredPembayaran.map((bayar) => (
                                        <tr key={bayar.id_pembayaran} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150 group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {bayar.pelanggan?.nama_pelanggan}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {bayar.pelanggan?.email}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    ID: {bayar.id_pembayaran.toString().padStart(6, '0')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getJenisBadge(bayar.jenis_pembayaran)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {formatRupiah(bayar.jumlah_bayar)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getMetodeBadge(bayar.metode_bayar)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {formatDate(bayar.tanggal_pembayaran)}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(bayar.tanggal_pembayaran).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(bayar.status_bayar)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end items-center space-x-2">
                                                    {bayar.status_bayar === 'Pending' && (
                                                        <button
                                                            onClick={() => handleVerify(bayar.id_pembayaran)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg group relative"
                                                            title="Verifikasi Pembayaran"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                Verifikasi
                                                            </span>
                                                        </button>
                                                    )}
                                                    
                                                   {/* Thumbnail dan Preview */}
                                                    {bayar.bukti_bayar && (
                                                        <div className="flex items-center space-x-1">
                                                            {/* Thumbnail untuk gambar */}
                                                            {!getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url).toLowerCase().endsWith('.pdf') && (
                                                                <button
                                                                    onClick={() => openBuktiModal(bayar.bukti_bayar, bayar.bukti_bayar_url)}
                                                                    className="relative group"
                                                                    title="Lihat preview gambar"
                                                                >
                                                                    <div className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                                        <img
                                                                            src={getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url)}
                                                                            alt="Thumbnail"
                                                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = 'https://via.placeholder.com/32x32/6b7280/ffffff?text=IMG';
                                                                                console.error('Thumbnail load error for:', getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url));
                                                                            }}
                                                                            onLoad={() => console.log('Thumbnail loaded:', getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url))}
                                                                        />
                                                                    </div>
                                                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                        Preview
                                                                    </span>
                                                                </button>
                                                            )}
                                                            
                                                            <button
                                                                onClick={() => openBuktiModal(bayar.bukti_bayar, bayar.bukti_bayar_url)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg group relative"
                                                                title={getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url).toLowerCase().endsWith('.pdf') 
                                                                    ? "Lihat PDF" 
                                                                    : "Lihat Bukti Bayar"}
                                                            >
                                                                <Receipt className="w-4 h-4" />
                                                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                    {getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url).toLowerCase().endsWith('.pdf') ? "Lihat PDF" : "Lihat Bukti"}
                                                                </span>
                                                            </button>
                                                        </div>
                                                    )}
                                                    <Link
                                                        href={route('admin.pembayaran.edit', bayar.id_pembayaran)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg group relative"
                                                        title="Edit Pembayaran"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            Edit
                                                        </span>
                                                    </Link>
                                                    
                                                    <button
                                                        onClick={() => handleDelete(bayar.id_pembayaran)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg group relative"
                                                        title="Hapus Pembayaran"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            Hapus
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                                                    <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                    {searchTerm || statusFilter !== 'all' || monthFilter || yearFilter 
                                                        ? 'Tidak ada pembayaran yang sesuai' 
                                                        : 'Belum ada data pembayaran'}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                                    {searchTerm || statusFilter !== 'all' || monthFilter || yearFilter 
                                                        ? 'Coba gunakan filter yang berbeda atau reset filter.' 
                                                        : 'Mulai dengan menambahkan pembayaran baru.'}
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
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                            {pembayaran.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 mx-1 rounded-lg font-medium transition duration-150 ${
                                        link.active
                                            ? 'bg-blue-600 text-white font-semibold shadow-lg'
                                            : link.url
                                            ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                                            : 'text-gray-400 dark:text-gray-500 cursor-default'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tambahkan style untuk animasi */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </AdminLayout>
    );
};

export default Index;