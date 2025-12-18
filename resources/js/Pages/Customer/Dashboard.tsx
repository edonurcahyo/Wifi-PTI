// resources/js/Pages/Customer/Dashboard.tsx
import React from 'react';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from '@inertiajs/react';
import Swal from "sweetalert2";

import {
  Wifi,
  Zap,
  Clock,
  Shield,
  Smartphone,
  Activity,
  Bot,
  Globe,
  Lock,
  Network,
  Settings,
  Tv,
  ChevronRight,
  Check,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Menu,
  X,
  User,
  LogOut,
  DollarSign,
  Calendar,
  Download,
  Upload,
  Heart,
  Crown,
  Rocket,
  Award,
  Target,
  BarChart3,
  ShieldCheck,
  Users,
  TrendingUp,
  Gift,
  Clock4,
  InfinityIcon,
  CreditCard,
  FileText,
  History,
  FileImage,
  AlertCircle,
  CalendarDays,
  CalendarRange,
  Timer,
  ClockAlert,
  CheckCircle2,
  XCircle,
  CalendarClock,
  TimerOff,
  TimerReset,
  Hourglass,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

interface Paket {
  nama_paket: string;
  kecepatan: string;
  harga_bulanan: number;
  id_paket: number;
}

interface Pembayaran {
  id_pembayaran: number;
  jenis_pembayaran: string;
  tanggal_pembayaran: string;
  jumlah_bayar: number;
  metode_bayar: string;
  status_bayar: string;
  status_tempo?: string;
  tanggal_tempo?: string;
  periode_awal?: string;
  periode_akhir?: string;
  bulan_dibayar?: string;
  bukti_bayar: string | null;
  keterangan: string | null;
}

interface Pelanggan {
  id_pelanggan: number;
  nama_pelanggan: string;
  email: string;
  no_hp: string;
  alamat: string;
  paket?: Paket;
  status_aktif: string;
  tanggal_berlangganan?: string;
  tanggal_berakhir?: string;
  pembayaran_terakhir: Pembayaran[];
}

interface PaketList {
  id_paket: number;
  nama_paket: string;
  kecepatan: string;
  harga_bulanan: number;
}

interface CustomerDashboardProps extends PageProps {
  pelanggan: Pelanggan;
  paketList: PaketList[];
}

export default function CustomerDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    id: number;
    type: string;
    amount: number;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const { pelanggan, paketList } = usePage<CustomerDashboardProps>().props;

  // Hitung waktu tersisa hingga tanggal berakhir
  useEffect(() => {
    if (pelanggan.tanggal_berakhir) {
      const calculateTimeLeft = () => {
        const now = new Date();
        const endDate = new Date(pelanggan.tanggal_berakhir || '');
        const difference = endDate.getTime() - now.getTime();
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };
      
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      
      return () => clearInterval(timer);
    }
  }, [pelanggan.tanggal_berakhir]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const formatRupiah = (angka: number) => {
    if (!angka) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(angka);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTempoStatusBadge = (status: string | undefined) => {
    switch(status) {
      case 'Tepat Waktu':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Tepat Waktu
          </span>
        );
      case 'Terlambat':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <ClockAlert className="w-3 h-3 mr-1" />
            Terlambat
          </span>
        );
      case 'Belum Jatuh Tempo':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Timer className="w-3 h-3 mr-1" />
            Belum Jatuh Tempo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30">
            {status || 'Belum Ditentukan'}
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch(status) {
      case 'Lunas':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Lunas
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Hourglass className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'Belum Bayar':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Belum Bayar
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30">
            {status}
          </span>
        );
    }
  };

  const handleWhatsApp = () => {
    const message = `Halo ASTINet, saya ${pelanggan.nama_pelanggan} ingin berlangganan paket internet.`;
    const phone = "6281382552884";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const openUploadModal = (paymentId: number, paymentType: string, amount: number) => {
    console.log('Opening upload modal for payment:', { paymentId, paymentType, amount });
    setSelectedPayment({ id: paymentId, type: paymentType, amount });
    setUploadModalOpen(true);
  };

  const isAktif = pelanggan.status_aktif === 'Aktif';

  const UploadPaymentModal = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [notes, setNotes] = useState("");

    const { post, processing, errors, setData, data } = useForm({
      bukti_bayar: null as File | null,
      keterangan: "",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setData("bukti_bayar", selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!data.bukti_bayar || !selectedPayment) {
        Swal.fire({
          icon: "warning",
          title: "File belum dipilih",
          text: "Silakan upload bukti pembayaran terlebih dahulu.",
          confirmButtonColor: "#38adc3",
        });
        return;
      }

      setData("keterangan", notes);

      post(route("customer.payment.upload.proof", selectedPayment.id), {
        forceFormData: true,
        preserveScroll: true,

        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Upload Berhasil!",
            text: "Bukti pembayaran berhasil diupload. Verifikasi 1–3 jam.",
            confirmButtonColor: "#38adc3",
          }).then(() => {
            handleClose();
            window.location.reload();
          });
        },

        onError: (errors) => {
          console.error("Upload errors:", errors);

          let errorMsg = "Terjadi kesalahan saat mengupload bukti pembayaran";
          if (errors.bukti_bayar) errorMsg = errors.bukti_bayar;
          else if (errors.message) errorMsg = errors.message;

          Swal.fire({
            icon: "error",
            title: "Upload Gagal",
            text: errorMsg,
            confirmButtonColor: "#d33",
          });
        },
      });
    };

    const handleClose = () => {
      setUploadModalOpen(false);
      setSelectedPayment(null);
      setPreview(null);
      setNotes("");

      setData({
        bukti_bayar: null,
        keterangan: "",
      });
    };

    if (!uploadModalOpen || !selectedPayment) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#38adc3] to-[#2672c6] p-6 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Upload Bukti Pembayaran</h2>
                <p className="text-blue-100 mt-1">Lengkapi pembayaran Anda</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                disabled={processing}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* PAYMENT INFO */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Jenis Pembayaran</p>
                    <p className="font-semibold">{selectedPayment.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jumlah</p>
                    <p className="font-bold text-lg text-blue-600">
                      {formatRupiah(selectedPayment.amount)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">ID Pembayaran</p>
                    <p className="font-mono text-gray-800">
                      #{selectedPayment.id.toString().padStart(6, "0")}
                    </p>
                  </div>
                </div>
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bukti Pembayaran (JPG, PNG, GIF - Max 2MB)
                  <span className="text-red-500 ml-1">*</span>
                </label>

                {errors.bukti_bayar && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.bukti_bayar}
                  </p>
                )}

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    data.bukti_bayar
                      ? "border-green-500 bg-green-50"
                      : errors.bukti_bayar
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-[#38adc3] hover:bg-blue-50"
                  } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    !processing &&
                    document.getElementById("file-input")?.click()
                  }
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={processing}
                  />

                  {preview ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto max-h-48 rounded-lg overflow-hidden">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-48 object-contain"
                        />
                      </div>

                      {!processing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setData("bukti_bayar", null);
                            setPreview(null);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Hapus File
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-gray-700 font-medium mb-2">
                        Klik untuk upload file
                      </p>
                      <p className="text-gray-500 text-sm">
                        Format: JPG, PNG, GIF (max 2MB)
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Minimal 300x300px, maksimal 2000x2000px
                      </p>
                    </>
                  )}
                </div>

                {data.bukti_bayar && (
                  <p className="mt-2 text-sm text-gray-600">
                    File terpilih:
                    <span className="font-medium ml-1">
                      {data.bukti_bayar.name}
                    </span>
                    <span className="ml-2 text-gray-500">
                      ({(data.bukti_bayar.size / 1024).toFixed(2)} KB)
                    </span>
                  </p>
                )}
              </div>

              {/* CATATAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Transfer via BCA tanggal 15 Januari..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#38adc3] focus:border-transparent resize-none disabled:opacity-50"
                  rows={3}
                  disabled={processing}
                />

                {errors.keterangan && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.keterangan}
                  </p>
                )}
              </div>

              {/* INSTRUKSI */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">
                      Instruksi Upload
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Foto harus jelas (nama, nominal, tanggal)</li>
                      <li>• Max size 2MB</li>
                      <li>• Format JPG/PNG/GIF</li>
                      <li>• Verifikasi 1–3 jam</li>
                      <li>• Hubungi WA support jika ada masalah</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={processing}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={!data.bukti_bayar || processing}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center ${
                    !data.bukti_bayar || processing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {processing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Upload & Verifikasi
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  const pendingPembayaran = pelanggan.pembayaran_terakhir?.find(
    p => p.status_bayar === 'Pending' && !p.bukti_bayar
  );

  const upcomingDueDate = pelanggan.pembayaran_terakhir?.find(
    p => p.status_bayar === 'Belum Bayar' || 
         (p.tanggal_tempo && new Date(p.tanggal_tempo) > new Date())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UploadPaymentModal />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Wifi className="h-8 w-8 text-[#38adc3]" />
            <span className="text-2xl font-bold">
              AS<span className="gradient-text">TIN</span>et
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#dashboard" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Dashboard
            </a>
            <a href="#paket" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Paket Saya
            </a>
            <a href="#pembayaran" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Pembayaran
            </a>
            <a href="#periode" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Periode & Tempo
            </a>
            <a href="#pilihan-paket" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Pilihan Paket
            </a>
            <a href="#fitur" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Fitur
            </a>
            <a href="#bantuan" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Bantuan
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38adc3] to-[#2672c6] flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {pelanggan.nama_pelanggan}
                </span>
              </button>

              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                >
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold text-sm">{pelanggan.nama_pelanggan}</p>
                    <p className="text-xs text-gray-500">{pelanggan.email}</p>
                  </div>
                  <Link
                    href="/pelanggan/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Profil Saya
                  </Link>
                  <Link
                    href={route('customer.payment.history')}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <History className="h-4 w-4" />
                    Riwayat Pembayaran
                  </Link>
                  <Link
                    href="/pelanggan/logout"
                    method="post"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </motion.div>
              )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

       {/* Mobile Menu */}
          {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden border-t bg-white"
              >
                <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                  <a
                    href="#dashboard"
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                  <a
                    href="#paket"
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Paket Saya
                  </a>
                  <a
                    href="#pembayaran"
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pembayaran
                  </a>
                  <a
                    href="#periode"
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Periode & Tempo
                  </a>
                  <a
                    href="#pilihan-paket"
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pilihan Paket
                  </a>
                  <a
                    href="#fitur"
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fitur
                  </a>
                  <a
                    href="#bantuan"
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Bantuan
                  </a> {/* TAG PENUTUP DITAMBAHKAN */}
                  <Link
                    href="/pelanggan/profile"
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profil Saya
                  </Link>
                  <Link
                    href={route('customer.payment.history')}
                    className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Riwayat Pembayaran
                  </Link>
                </nav>
              </motion.div>
            )}
      </header>

      {/* Hero Section - Welcome */}
      <section id="dashboard" className="relative overflow-hidden pt-20 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-pink-50 opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Selamat Datang,{" "}
              <span className="gradient-text">{pelanggan.nama_pelanggan}</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Kelola paket internet dan pembayaran Anda dengan mudah melalui dashboard ASTINet.
            </motion.p>
            
            {pendingPembayaran && (
              <motion.div 
                variants={fadeInUp}
                className="mb-6 max-w-2xl mx-auto"
              >
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-800">Pembayaran Menunggu Verifikasi</p>
                      <p className="text-sm text-yellow-700">Silakan upload bukti pembayaran untuk tagihan Anda</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openUploadModal(
                      pendingPembayaran.id_pembayaran,
                      pendingPembayaran.jenis_pembayaran,
                      pendingPembayaran.jumlah_bayar
                    )}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Upload Bukti
                  </button>
                </div>
              </motion.div>
            )}

            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-[#38adc3] hover:bg-[#2e9bb0] text-white px-8" onClick={handleWhatsApp}>
                Butuh Bantuan?
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
              <Link
                href={route('customer.payment.create')}
                className="inline-flex items-center justify-center rounded-lg text-lg font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 px-8 py-3 shadow-lg hover:shadow-xl"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Bayar Tagihan
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Paket Section dengan Periode */}
      <section id="paket" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Paket Internet Anda
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
              Informasi lengkap mengenai paket yang sedang Anda gunakan
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Card 1: Informasi Paket */}
            <Card className="border-2 border-[#38adc3] shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-8 pt-12 bg-gradient-to-r from-[#38adc3] to-[#2672c6] text-white rounded-t-lg">
                <CardTitle className="text-2xl mb-4">
                  {pelanggan.paket?.nama_paket || "Belum Berlangganan"}
                </CardTitle>
                
                <div className="mb-2">
                  <span className="text-5xl font-bold">
                    {pelanggan.paket ? (
                      formatRupiah(pelanggan.paket.harga_bulanan) 
                    ) : (
                      "Rp 0"
                    )}
                  </span>
                  <span className="text-blue-100 ml-2 text-lg">/ bulan</span>
                </div>
                
                <p className="text-blue-100 font-semibold text-lg">
                  {pelanggan.paket?.kecepatan || "0 Mbps"}
                </p>
                
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mt-4 ${
                  isAktif 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {isAktif ? '🟢 Aktif' : '🔴 Tidak Aktif'}
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Nama:</span>
                    <span className="font-semibold">{pelanggan.nama_pelanggan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="font-semibold">{pelanggan.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">No. HP:</span>
                    <span className="font-semibold">{pelanggan.no_hp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Periode Berlangganan */}
            <Card className="border-2 border-green-500 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-8 pt-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl mb-4 flex items-center justify-center gap-2">
                  <CalendarDays className="h-6 w-6" />
                  Periode Berlangganan
                </CardTitle>
                <div className="text-lg text-green-100">
                  <CalendarRange className="h-6 w-6 inline mr-2" />
                  Rentang Waktu Paket
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Mulai Berlaku:
                    </span>
                    <span className="font-semibold text-green-600">
                      {formatDate(pelanggan.tanggal_berlangganan)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Berakhir Pada:
                    </span>
                    <span className="font-semibold text-red-600">
                      {formatDate(pelanggan.tanggal_berakhir)}
                    </span>
                  </div>
                  
                  {timeLeft && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Timer className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Waktu Tersisa:</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
                          <div className="text-xs text-gray-600">Hari</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{timeLeft.hours}</div>
                          <div className="text-xs text-gray-600">Jam</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{timeLeft.minutes}</div>
                          <div className="text-xs text-gray-600">Menit</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{timeLeft.seconds}</div>
                          <div className="text-xs text-gray-600">Detik</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Aksi Cepat */}
            <Card className="border-2 border-purple-500 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-8 pt-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl mb-4">
                  Aksi Cepat
                </CardTitle>
                <div className="text-lg text-purple-100">
                  Kelola paket Anda
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-8">
                {!pelanggan.paket ? (
                  <Button
                    className="w-full bg-gradient-to-r from-[#38adc3] to-[#2672c6] hover:from-[#2e9bb0] hover:to-[#1e5fa3] text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleWhatsApp}
                  >
                    <Rocket className="mr-2 h-5 w-5" />
                    Langganan Sekarang
                  </Button>
                ) : (
                  <>
                    <Link
                      href={route('customer.payment.create')}
                      className="w-full block bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-center font-medium transition-colors"
                    >
                      Bayar Tagihan
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-[#38adc3] text-[#38adc3] hover:bg-[#38adc3] hover:text-white"
                      onClick={handleWhatsApp}
                    >
                      Upgrade Paket
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
                      onClick={handleWhatsApp}
                    >
                      Perpanjang Paket
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section Periode & Tempo */}
      <section id="periode" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Periode & Jatuh Tempo
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
              Pantau periode pembayaran dan jadwal jatuh tempo Anda
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            {/* Card Status Tempo */}
            <div className="mb-8">
              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-600" />
                    Status Pembayaran & Tempo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-green-800 mb-2">Status Paket</h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isAktif 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isAktif ? 'Aktif' : 'Tidak Aktif'}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                        <CalendarClock className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-blue-800 mb-2">Periode Aktif</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(pelanggan.tanggal_berlangganan)} - {formatDate(pelanggan.tanggal_berakhir)}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                        <ClockAlert className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-purple-800 mb-2">Status Tempo</h3>
                      {getTempoStatusBadge(
                        pelanggan.pembayaran_terakhir?.[0]?.status_tempo
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabel Jatuh Tempo */}
            <Card className="border-2 border-amber-200 shadow-lg">
              <CardHeader className="bg-amber-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-amber-600" />
                  Jadwal Jatuh Tempo Mendatang
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jatuh Tempo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pelanggan.pembayaran_terakhir && pelanggan.pembayaran_terakhir.length > 0 ? (
                        pelanggan.pembayaran_terakhir.map((pembayaran, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {pembayaran.jenis_pembayaran === 'Bulanan' ? (
                                  <Calendar className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <CreditCard className="h-4 w-4 text-green-500" />
                                )}
                                <span className="font-medium">{pembayaran.jenis_pembayaran}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {pembayaran.periode_awal && pembayaran.periode_akhir ? (
                                <div className="text-sm">
                                  <div>{formatDate(pembayaran.periode_awal)}</div>
                                  <div className="text-gray-500">s/d</div>
                                  <div>{formatDate(pembayaran.periode_akhir)}</div>
                                </div>
                              ) : pembayaran.bulan_dibayar ? (
                                <span>{formatDate(pembayaran.bulan_dibayar)}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {pembayaran.tanggal_tempo ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-amber-500" />
                                  <span className="font-medium text-amber-600">
                                    {formatDate(pembayaran.tanggal_tempo)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                {getPaymentStatusBadge(pembayaran.status_bayar)}
                                {pembayaran.status_tempo && pembayaran.status_tempo !== 'Belum Jatuh Tempo' && (
                                  <div className="mt-1">
                                    {getTempoStatusBadge(pembayaran.status_tempo)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {pembayaran.status_bayar === 'Pending' && !pembayaran.bukti_bayar ? (
                                <button
                                  onClick={() => openUploadModal(
                                    pembayaran.id_pembayaran,
                                    pembayaran.jenis_pembayaran,
                                    pembayaran.jumlah_bayar
                                  )}
                                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                  Upload Bukti
                                </button>
                              ) : pembayaran.bukti_bayar ? (
                                <a
                                  href={`/storage/bukti_pembayaran/${pembayaran.bukti_bayar}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                                >
                                  Lihat Bukti
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <CalendarClock className="w-12 h-12 text-gray-400 mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Belum ada data pembayaran
                              </h3>
                              <p className="text-gray-500">
                                Silakan buat pembayaran baru untuk melihat jadwal tempo
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Info Box */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                <div className="flex items-start">
                  <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      Panduan Periode & Tempo
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-2" />
                        <span><strong>Periode Aktif:</strong> Masa berlaku paket Anda</span>
                      </li>
                      <li className="flex items-center">
                        <ClockAlert className="w-3 h-3 mr-2" />
                        <span><strong>Jatuh Tempo:</strong> Batas waktu pembayaran</span>
                      </li>
                      <li className="flex items-center">
                        <Timer className="w-3 h-3 mr-2" />
                        <span><strong>Tepat Waktu:</strong> Bayar sebelum/sesuai tempo</span>
                      </li>
                      <li className="flex items-center">
                        <TimerOff className="w-3 h-3 mr-2" />
                        <span><strong>Terlambat:</strong> Bayar setelah tanggal tempo</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                      Tips Pembayaran Tepat Waktu
                    </h4>
                    <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                      <li>• Setel pengingat 3 hari sebelum jatuh tempo</li>
                      <li>• Gunakan fitur auto-debit jika tersedia</li>
                      <li>• Upload bukti bayar segera setelah transfer</li>
                      <li>• Perpanjang paket 7 hari sebelum berakhir</li>
                      <li>• Hubungi support jika ada kendala pembayaran</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pembayaran & Riwayat Section */}
      <section id="pembayaran" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Pembayaran & Tagihan
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
              Kelola pembayaran dan upload bukti transfer Anda
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {/* Button Buat Pembayaran Baru */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <CreditCard className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Buat Pembayaran Baru</h3>
                  <p className="text-gray-600 text-sm mb-4">Bayar tagihan bulanan atau instalasi</p>
                  <Link
                    href={route('customer.payment.create')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Bayar Sekarang
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Button Upload Bukti */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-green-200 hover:border-green-500 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Upload className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload Bukti Bayar</h3>
                  <p className="text-gray-600 text-sm mb-4">Upload bukti transfer untuk verifikasi</p>
                  
                  {pendingPembayaran && (
                    <button
                      onClick={() => openUploadModal(
                        pendingPembayaran.id_pembayaran,
                        pendingPembayaran.jenis_pembayaran,
                        pendingPembayaran.jumlah_bayar
                      )}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Upload Bukti
                    </button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Button Riwayat Pembayaran */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <History className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Riwayat Pembayaran</h3>
                  <p className="text-gray-600 text-sm mb-4">Lihat history pembayaran Anda</p>
                  <Link
                    href={route('customer.payment.history')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Lihat Riwayat
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Upcoming Due Dates */}
          {upcomingDueDate && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mt-12 max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <ClockAlert className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 text-lg">Jatuh Tempo Mendatang</h3>
                      <p className="text-amber-700">
                        {upcomingDueDate.tanggal_tempo ? (
                          <span>Jatuh tempo pada {formatDate(upcomingDueDate.tanggal_tempo)}</span>
                        ) : (
                          <span>Tagihan menunggu pembayaran</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-800">
                      {formatRupiah(upcomingDueDate.jumlah_bayar)}
                    </p>
                    <p className="text-sm text-amber-700">{upcomingDueDate.jenis_pembayaran}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={route('customer.payment.create')}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-center font-medium transition-colors"
                  >
                    Bayar Sekarang
                  </Link>
                  <button
                    onClick={() => openUploadModal(
                      upcomingDueDate.id_pembayaran,
                      upcomingDueDate.jenis_pembayaran,
                      upcomingDueDate.jumlah_bayar
                    )}
                    className="flex-1 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-2 rounded-lg text-center font-medium transition-colors"
                  >
                    Upload Bukti
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pilihan Paket Section */}
      <section id="pilihan-paket" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Pilihan Paket Lainnya
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
              Tingkatkan pengalaman internet Anda dengan paket yang lebih lengkap
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {paketList && paketList.length > 0 ? (
              paketList.map((paket, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`relative rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                    paket.nama_paket === "Standard" 
                      ? 'border-purple-500 shadow-2xl bg-gradient-to-b from-white to-purple-50' 
                      : 'border-gray-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {paket.nama_paket === "Standard" && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        ⭐ POPULER
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{paket.nama_paket}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatRupiah(paket.harga_bulanan)} 
                      </span>
                      <span className="text-gray-600">/bulan</span>
                    </div>
                    <p className="text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent from-blue-600 to-purple-600">
                      {paket.kecepatan}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Periode 30 hari</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Jatuh tempo tanggal 10</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Unlimited Quota</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Akses 24/7</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Support Teknis</span>
                    </li>
                  </ul>

                  <Button
                    className={`w-full py-3 text-lg font-semibold ${
                      paket.nama_paket === "Standard"
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white'
                    } shadow-lg hover:shadow-xl transition-all duration-300`}
                    onClick={handleWhatsApp}
                  >
                    Pilih Paket
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              ))
            ) : (
              // Fallback jika paketList tidak ada
              [1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`relative rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                    index === 1 
                      ? 'border-purple-500 shadow-2xl bg-gradient-to-b from-white to-purple-50' 
                      : 'border-gray-200 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        ⭐ POPULER
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {index === 0 ? 'Basic' : index === 1 ? 'Standard' : 'Premium'}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatRupiah(index === 0 ? 150000 : index === 1 ? 200000 : 250000)} 
                      </span>
                      <span className="text-gray-600">/bulan</span>
                    </div>
                    <p className="text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent from-blue-600 to-purple-600">
                      {index === 0 ? '20 Mbps' : index === 1 ? '30 Mbps' : '50 Mbps'}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Periode 30 hari</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Jatuh tempo tanggal 10</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Unlimited Quota</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Akses 24/7</span>
                    </li>
                  </ul>

                  <Button
                    className={`w-full py-3 text-lg font-semibold ${
                      index === 1
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white'
                    } shadow-lg hover:shadow-xl transition-all duration-300`}
                    onClick={handleWhatsApp}
                  >
                    Pilih Paket
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="bantuan" className="py-20 bg-gradient-to-r from-[#38adc3] to-[#2672c6]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6">
              Butuh Bantuan?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-blue-100 mb-8">
              Tim support kami siap membantu 24/7. Hubungi kami untuk pertanyaan teknis, pembayaran, atau informasi lainnya.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#38adc3] hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#38adc3] px-8 py-3 text-lg font-semibold"
              >
                <Phone className="mr-2 h-5 w-5" />
                (021) 1234-5678
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/6281382552884"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 z-50 bounce-slow hover:scale-110"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}