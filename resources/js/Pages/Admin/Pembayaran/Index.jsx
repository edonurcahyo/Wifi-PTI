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
    ExternalLink,
    FileText,
    FileDown,
    AlertCircle 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Import library untuk export PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    
    // STATE UNTUK EXPORT PDF
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const tableRef = useRef(null);
    
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

    // FUNGSI UNTUK EXPORT KE PDF
    const exportToPDF = async () => {
        try {
            setIsExporting(true);
            setExportProgress(10);
            
            // Data untuk PDF
            const filteredData = filteredPembayaran || [];
            const totalAmount = stats?.totalAmount || 0;
            const totalPaid = stats?.totalPaid || 0;
            const totalPending = stats?.totalPending || 0;
            const totalFailed = stats?.totalFailed || 0;
            const currentDate = new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            setExportProgress(20);
            
            // Buat PDF dengan orientasi landscape
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            
            // Tentukan warna untuk PDF
            const primaryColor = [0, 51, 102]; // Biru gelap
            const secondaryColor = [240, 240, 240]; // Abu-abu muda
            const accentColor = [0, 102, 204]; // Biru terang
            
            // Halaman 1: Cover/Laporan Ringkasan
            pdf.setFillColor(...primaryColor);
            pdf.rect(0, 0, 297, 210, 'F'); // Background biru
            
            // Logo atau judul
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(28);
            pdf.setFont('helvetica', 'bold');
            pdf.text('LAPORAN PEMBAYARAN', 148, 50, null, null, 'center');
            
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Sistem Manajemen Pembayaran', 148, 65, null, null, 'center');
            
            // Info periode
            pdf.setFontSize(14);
            const periodText = monthFilter && yearFilter 
                ? `Periode: ${getMonthName(monthFilter)} ${yearFilter}`
                : 'Periode: Semua Data';
            pdf.text(periodText, 148, 85, null, null, 'center');
            
            // Tanggal cetak
            pdf.setFontSize(12);
            pdf.text(`Dicetak pada: ${currentDate}`, 148, 100, null, null, 'center');
            
            // Stats ringkasan
            pdf.setFontSize(18);
            pdf.text('RINGKASAN STATISTIK', 148, 120, null, null, 'center');
            
            // Box stats
            const statsY = 140;
            const statsWidth = 60;
            const statsHeight = 30;
            const statsGap = 20;
            
            // Total Pendapatan
            pdf.setFillColor(...accentColor);
            pdf.roundedRect(30, statsY, statsWidth, statsHeight, 3, 3, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            pdf.text('TOTAL PENDAPATAN', 60, statsY + 10, null, null, 'center');
            pdf.setFontSize(14);
            pdf.text(formatRupiahForPDF(totalAmount), 60, statsY + 22, null, null, 'center');
            
            // Lunas
            pdf.setFillColor(46, 204, 113); // Hijau
            pdf.roundedRect(30 + statsWidth + statsGap, statsY, statsWidth, statsHeight, 3, 3, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            pdf.text('LUNAS', 60 + statsWidth + statsGap, statsY + 10, null, null, 'center');
            pdf.setFontSize(14);
            pdf.text(totalPaid.toString(), 60 + statsWidth + statsGap, statsY + 22, null, null, 'center');
            
            // Pending
            pdf.setFillColor(241, 196, 15); // Kuning
            pdf.roundedRect(30 + (statsWidth + statsGap) * 2, statsY, statsWidth, statsHeight, 3, 3, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            pdf.text('PENDING', 60 + (statsWidth + statsGap) * 2, statsY + 10, null, null, 'center');
            pdf.setFontSize(14);
            pdf.text(totalPending.toString(), 60 + (statsWidth + statsGap) * 2, statsY + 22, null, null, 'center');
            
            // Belum Bayar
            pdf.setFillColor(231, 76, 60); // Merah
            pdf.roundedRect(30 + (statsWidth + statsGap) * 3, statsY, statsWidth, statsHeight, 3, 3, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            pdf.text('BELUM BAYAR', 60 + (statsWidth + statsGap) * 3, statsY + 10, null, null, 'center');
            pdf.setFontSize(14);
            pdf.text(totalFailed.toString(), 60 + (statsWidth + statsGap) * 3, statsY + 22, null, null, 'center');
            
            // Footer halaman 1
            pdf.setTextColor(200, 200, 200);
            pdf.setFontSize(10);
            pdf.text('Halaman 1 dari Laporan Pembayaran', 148, 195, null, null, 'center');
            
            setExportProgress(40);
            
            // Halaman 2: Daftar Pembayaran
            pdf.addPage();
            
            // Header halaman 2
            pdf.setFillColor(...secondaryColor);
            pdf.rect(0, 0, 297, 25, 'F');
            pdf.setTextColor(...primaryColor);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text('DAFTAR DETAIL PEMBAYARAN', 20, 15);
            
            // Info filter jika ada
            let filterInfo = '';
            if (searchTerm) filterInfo += `Pencarian: "${searchTerm}" `;
            if (statusFilter !== 'all') filterInfo += `Status: ${statusFilter} `;
            if (monthFilter) filterInfo += `Bulan: ${getMonthName(monthFilter)} `;
            if (yearFilter) filterInfo += `Tahun: ${yearFilter}`;
            
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(filterInfo || 'Semua Data', 20, 25);
            
            // Tabel header
            const tableTop = 35;
            const colWidths = [40, 40, 40, 25, 30, 25, 30]; // Total 250mm
            const colPositions = [20];
            for (let i = 1; i < colWidths.length; i++) {
                colPositions.push(colPositions[i-1] + colWidths[i-1] + 5);
            }
            
            // Header tabel
            pdf.setFillColor(...primaryColor);
            pdf.rect(20, tableTop, 250, 10, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            
            const headers = ['ID', 'PELANGGAN', 'JENIS', 'JUMLAH', 'METODE', 'TANGGAL', 'STATUS'];
            headers.forEach((header, i) => {
                pdf.text(header, colPositions[i] + 2, tableTop + 7);
            });
            
            setExportProgress(60);
            
            // Data tabel
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            
            let currentY = tableTop + 15;
            const rowHeight = 8;
            
            filteredData.forEach((item, index) => {
                // Jika halaman penuh, buat halaman baru
                if (currentY > 180) {
                    pdf.addPage();
                    currentY = 35;
                    
                    // Header halaman baru
                    pdf.setFillColor(...secondaryColor);
                    pdf.rect(0, 0, 297, 25, 'F');
                    pdf.setTextColor(...primaryColor);
                    pdf.setFontSize(18);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text('DAFTAR DETAIL PEMBAYARAN (Lanjutan)', 20, 15);
                    
                    // Header tabel
                    pdf.setFillColor(...primaryColor);
                    pdf.rect(20, currentY - 10, 250, 10, 'F');
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'bold');
                    headers.forEach((header, i) => {
                        pdf.text(header, colPositions[i] + 2, currentY - 3);
                    });
                    
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(0, 0, 0);
                    currentY += 10;
                }
                
                // Warna baris bergantian
                if (index % 2 === 0) {
                    pdf.setFillColor(245, 245, 245);
                    pdf.rect(20, currentY - 5, 250, rowHeight, 'F');
                }
                
                // Data
                pdf.setFontSize(8);
                
                // ID
                pdf.text(item.id_pembayaran.toString().padStart(6, '0'), colPositions[0], currentY);
                
                // Nama Pelanggan (dipotong jika terlalu panjang)
                const customerName = item.pelanggan?.nama_pelanggan || '-';
                pdf.text(customerName.substring(0, 20) + (customerName.length > 20 ? '...' : ''), colPositions[1], currentY);
                
                // Jenis
                pdf.text(item.jenis_pembayaran || '-', colPositions[2], currentY);
                
                // Jumlah
                pdf.text(formatRupiahForPDF(item.jumlah_bayar || 0), colPositions[3], currentY);
                
                // Metode
                pdf.text(item.metode_bayar || '-', colPositions[4], currentY);
                
                // Tanggal
                const date = new Date(item.tanggal_pembayaran);
                const formattedDate = date.toLocaleDateString('id-ID');
                pdf.text(formattedDate, colPositions[5], currentY);
                
                // Status dengan warna
                const status = item.status_bayar || '-';
                const statusColors = {
                    'Lunas': [46, 204, 113],
                    'Pending': [241, 196, 15],
                    'Belum Bayar': [231, 76, 60]
                };
                
                pdf.setFillColor(...(statusColors[status] || [200, 200, 200]));
                const statusWidth = pdf.getTextWidth(status) + 4;
                pdf.roundedRect(colPositions[6], currentY - 3, statusWidth, 4, 2, 2, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.text(status, colPositions[6] + 2, currentY);
                pdf.setTextColor(0, 0, 0);
                
                currentY += rowHeight;
                
                // Update progress
                setExportProgress(60 + Math.floor((index / filteredData.length) * 30));
            });
            
            setExportProgress(95);
            
            // Halaman 3: Ringkasan dan Tanda Tangan (opsional)
            pdf.addPage();
            
            // Header halaman 3
            pdf.setFillColor(...secondaryColor);
            pdf.rect(0, 0, 297, 25, 'F');
            pdf.setTextColor(...primaryColor);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text('RINGKASAN DAN PENUTUP', 20, 15);
            
            // Ringkasan data
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            
            let summaryY = 40;
            const summaryLineHeight = 15;
            
            pdf.setFont('helvetica', 'bold');
            pdf.text('RINGKASAN LAPORAN', 20, summaryY);
            pdf.setFont('helvetica', 'normal');
            
            summaryY += summaryLineHeight;
            pdf.text(`Jumlah Total Data: ${filteredData.length} pembayaran`, 30, summaryY);
            
            summaryY += summaryLineHeight;
            pdf.text(`Total Pendapatan: ${formatRupiahForPDF(totalAmount)}`, 30, summaryY);
            
            summaryY += summaryLineHeight;
            pdf.text(`Rata-rata per Pembayaran: ${formatRupiahForPDF(totalAmount / Math.max(filteredData.length, 1))}`, 30, summaryY);
            
            summaryY += summaryLineHeight;
            const paidPercentage = filteredData.length > 0 ? 
                ((totalPaid / filteredData.length) * 100).toFixed(1) : 0;
            pdf.text(`Persentase Lunas: ${paidPercentage}%`, 30, summaryY);
            
            // Distribusi metode pembayaran
            summaryY += summaryLineHeight * 2;
            pdf.setFont('helvetica', 'bold');
            pdf.text('DISTRIBUSI METODE PEMBAYARAN', 20, summaryY);
            pdf.setFont('helvetica', 'normal');
            
            const methodCounts = {};
            filteredData.forEach(item => {
                const method = item.metode_bayar || 'Tidak Diketahui';
                methodCounts[method] = (methodCounts[method] || 0) + 1;
            });
            
            Object.entries(methodCounts).forEach(([method, count], index) => {
                summaryY += summaryLineHeight;
                const percentage = ((count / filteredData.length) * 100).toFixed(1);
                pdf.text(`${method}: ${count} (${percentage}%)`, 30, summaryY);
            });
            
            // Tanda tangan
            const signatureY = 160;
            pdf.setFontSize(11);
            pdf.text('Mengetahui,', 230, signatureY);
            pdf.text('Admin Sistem', 230, signatureY + 20);
            
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            pdf.text('Laporan ini dibuat secara otomatis oleh sistem', 148, 200, null, null, 'center');
            pdf.text(`Halaman 3 dari 3`, 148, 205, null, null, 'center');
            
            // Generate nama file
            const fileName = `laporan_pembayaran_${monthFilter || 'semua'}_${yearFilter || 'semua'}_${new Date().getTime()}.pdf`;
            
            setExportProgress(100);
            
            // Simpan PDF
            pdf.save(fileName);
            
            setIsExporting(false);
            
            // Reset progress setelah 2 detik
            setTimeout(() => setExportProgress(0), 2000);
            
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Terjadi kesalahan saat mengexport PDF. Silakan coba lagi.');
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    // Export Tabel sebagai Gambar (Alternatif)
    const exportTableAsImage = async () => {
        try {
            setIsExporting(true);
            setExportProgress(10);
            
            if (!tableRef.current) {
                alert('Tabel tidak ditemukan');
                setIsExporting(false);
                return;
            }
            
            setExportProgress(30);
            
            // Capture tabel
            const canvas = await html2canvas(tableRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                onclone: (clonedDoc) => {
                    // Hide pagination if exists
                    const pagination = clonedDoc.querySelector('.pagination');
                    if (pagination) {
                        pagination.style.display = 'none';
                    }
                }
            });
            
            setExportProgress(70);
            
            // Konversi ke PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            
            // Hitung dimensi
            const imgWidth = 280;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add image to PDF
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            
            // Add header
            const currentDate = new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Laporan Pembayaran - Dicetak: ${currentDate}`, 10, 5);
            
            // Add page number
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.text(`Halaman ${i} dari ${pageCount}`, 280, 200, null, null, 'right');
            }
            
            setExportProgress(90);
            
            // Save PDF
            const fileName = `tabel_pembayaran_${new Date().getTime()}.pdf`;
            pdf.save(fileName);
            
            setExportProgress(100);
            
            // Reset
            setTimeout(() => {
                setIsExporting(false);
                setExportProgress(0);
            }, 2000);
            
        } catch (error) {
            console.error('Error exporting table:', error);
            alert('Terjadi kesalahan saat mengexport tabel');
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    // Format Rupiah untuk PDF (tanpa simbol)
    const formatRupiahForPDF = (angka) => {
        if (!angka) return 'Rp 0';
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(angka);
    };

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
            return buktiUrl;
        }
        
        // Fallback ke path lama
        if (!buktiPath) {
            return null;
        }
        
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

    // Generate array tahun untuk dropdown
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
            
            {/* MODAL LOADING EXPORT */}
            {isExporting && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Membuat Laporan PDF...
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                Sedang memproses data dan menghasilkan laporan. Harap tunggu.
                            </p>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                                    style={{ width: `${exportProgress}%` }}
                                ></div>
                            </div>
                            
                            <div className="flex justify-between w-full text-sm text-gray-500 dark:text-gray-400">
                                <span>Memulai...</span>
                                <span className="font-bold">{exportProgress}%</span>
                                <span>Selesai</span>
                            </div>
                            
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-6 text-center">
                                Jangan tutup halaman ini selama proses export berlangsung.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PREVIEW BUKTI */}
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
                    <div className="flex flex-wrap gap-2">
                        {/* Export Button Group */}
                        <div className="relative group">
                            <button
                                onClick={exportToPDF}
                                disabled={isExporting || !filteredPembayaran || filteredPembayaran.length === 0}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:from-green-700 hover:to-green-800 transition duration-150 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                title="Export data ke PDF"
                            >
                                {isExporting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FileDown className="w-5 h-5 mr-2" />
                                        Export PDF
                                    </>
                                )}
                            </button>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                Export semua data ke PDF
                            </div>
                        </div>
                        
                        <button
                            onClick={exportTableAsImage}
                            disabled={isExporting || !filteredPembayaran || filteredPembayaran.length === 0}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:from-purple-700 hover:to-purple-800 transition duration-150 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            title="Export tabel sebagai gambar"
                        >
                            <FileText className="w-5 h-5 mr-2" />
                            Export Tabel
                        </button>
                        
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
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                    {filteredPembayaran?.length || 0} data ditemukan
                                </span>
                                <button
                                    onClick={exportToPDF}
                                    disabled={isExporting || !filteredPembayaran || filteredPembayaran.length === 0}
                                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Export data dengan filter ini"
                                >
                                    {isExporting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <FileDown className="w-3 h-3 mr-1" />
                                            Export PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div ref={tableRef} className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Pelanggan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Periode
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Bulan Dibayar
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
                                        Status & Tempo
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
                                            {/* Kolom 1: Pelanggan */}
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
                                            
                                            {/* Kolom 2: Periode */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {bayar.periode_label ? (
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {bayar.periode_label}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-400 dark:text-gray-500">
                                                        -
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Kolom 3: Bulan Dibayar */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {bayar.bulan_dibayar_label ? (
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {bayar.bulan_dibayar_label}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-400 dark:text-gray-500">
                                                        -
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Kolom 4: Jenis */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getJenisBadge(bayar.jenis_pembayaran)}
                                            </td>
                                            
                                            {/* Kolom 5: Jumlah */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {formatRupiah(bayar.jumlah_bayar)}
                                                </div>
                                            </td>
                                            
                                            {/* Kolom 6: Metode */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getMetodeBadge(bayar.metode_bayar)}
                                            </td>
                                            
                                            {/* Kolom 7: Tanggal */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {formatDate(bayar.tanggal_pembayaran)}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(bayar.tanggal_pembayaran).toLocaleTimeString('id-ID', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </div>
                                                {bayar.tanggal_tempo && (
                                                    <div className="text-xs mt-1">
                                                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            bayar.status_tempo === 'Tepat Waktu' 
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                : bayar.status_tempo === 'Terlambat'
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        }`}>
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            Tempo: {formatDate(bayar.tanggal_tempo)}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Kolom 8: Status & Tempo */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(bayar.status_bayar)}
                                                
                                                {/* Status Tempo */}
                                                {bayar.status_tempo && bayar.status_tempo !== 'Belum Jatuh Tempo' && (
                                                    <div className="mt-1">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            bayar.status_tempo === 'Tepat Waktu' 
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                                        }`}>
                                                            {bayar.status_tempo === 'Tepat Waktu' ? (
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                            ) : (
                                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                            )}
                                                            {bayar.status_tempo}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {/* Selisih Hari */}
                                                {bayar.selisih_hari_tempo && (
                                                    <div className="mt-1 text-xs">
                                                        {bayar.selisih_hari_tempo > 0 ? (
                                                            <span className="text-green-600 dark:text-green-400">
                                                                +{bayar.selisih_hari_tempo} hari lebih awal
                                                            </span>
                                                        ) : bayar.selisih_hari_tempo < 0 ? (
                                                            <span className="text-red-600 dark:text-red-400">
                                                                {Math.abs(bayar.selisih_hari_tempo)} hari terlambat
                                                            </span>
                                                        ) : (
                                                            <span className="text-blue-600 dark:text-blue-400">
                                                                Tepat pada hari H
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Kolom 9: Aksi */}
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
                                                            {!getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url)?.toLowerCase().endsWith('.pdf') && (
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
                                                                            }}
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
                                                                title={getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url)?.toLowerCase().endsWith('.pdf') 
                                                                    ? "Lihat PDF" 
                                                                    : "Lihat Bukti Bayar"}
                                                            >
                                                                <Receipt className="w-4 h-4" />
                                                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                    {getBuktiUrl(bayar.bukti_bayar, bayar.bukti_bayar_url)?.toLowerCase().endsWith('.pdf') ? "Lihat PDF" : "Lihat Bukti"}
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
                                        <td colSpan="9" className="px-6 py-12 text-center">
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
                
                {/* Export Information */}
                {filteredPembayaran && filteredPembayaran.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                        Ekspor Data Tersedia
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        Export {filteredPembayaran.length} data pembayaran ke format PDF
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={exportToPDF}
                                    disabled={isExporting}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isExporting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FileDown className="h-4 w-4 mr-2" />
                                            Export Laporan Lengkap
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={exportTableAsImage}
                                    disabled={isExporting}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Export Tabel Saja
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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