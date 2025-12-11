import { motion } from "framer-motion";
import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
// import Link from "next/link";
import { Link } from '@inertiajs/react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
            <a href="#home" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Home
            </a>
            <a href="#about" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              About
            </a>
            <a href="#features" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-[#38adc3] transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button className="hidden md:inline-flex bg-[#38adc3] hover:bg-[#2e9bb0] text-white" onClick={() => window.location.href = "/pelanggan/login"}>
              Sign In
            </Button>
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
                href="#home"
                className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#about"
                className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#features"
                className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-sm font-medium hover:text-[#38adc3] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Link 
                href={route('customer.login')} 
                className="inline-flex justify-center items-center h-10 px-4 py-2 
                           bg-[#38adc3] hover:bg-[#2e9bb0] text-white w-full 
                           rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#38adc3] focus:ring-offset-2"
                onClick={() => setMobileMenuOpen(false)} 
            >
                Sign In
            </Link>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-pink-50 opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-semibold text-[#38adc3] mb-4 tracking-wide uppercase"
            >
              Internet Cepat & Stabil
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Solusi Internet Cepat & Handal Bersama{" "}
              <span className="gradient-text">ASTINet</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Nikmati koneksi internet tanpa batas dengan kecepatan tinggi, uptime maksimal,
              dan layanan pelanggan 24/7. Cocok untuk rumah, bisnis, maupun kantor.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-[#38adc3] hover:bg-[#2e9bb0] text-white px-8" onClick={() => window.location.href = "#pricing"}>
                Lihat Paket
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-[#38adc3] text-[#38adc3] hover:bg-[#38adc3] hover:text-white" onClick={() => window.location.href = "/pelanggan/login"}>
                Daftar
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-12 flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38adc3] to-[#2672c6] border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold">100+</p>
                <p className="text-sm text-gray-600">Pelanggan Terpercaya</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-[#38adc3] rounded-full opacity-20 float-animation" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#e35d76] rounded-full opacity-20 bounce-slow" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-40 right-20 w-16 h-16 bg-[#2672c6] rounded-full opacity-20 float-animation" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <p className="text-sm font-semibold text-[#38adc3] mb-2 uppercase tracking-wide">
                Tentang ASTINet
              </p>
              <h2 className="text-4xl font-bold mb-6">
                Solusi Internet Cepat dan Handal
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                ASTINet hadir sebagai penyedia layanan internet (ISP) lokal yang fokus pada
                kecepatan, stabilitas, dan pelayanan terbaik. Kami memahami betapa pentingnya
                koneksi internet dalam kehidupan sehari-hari baik untuk bekerja, belajar, maupun hiburan.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Shield, text: "Jaringan stabil" },
                  { icon: Settings, text: "Paket fleksibel" },
                  { icon: Clock, text: "Support 24/7" },
                  { icon: Globe, text: "Area cakupan luas" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#38adc3]/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-[#38adc3]" />
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#38adc3]/10 to-[#2672c6]/10 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#38adc3] to-[#2672c6] flex items-center justify-center text-white font-bold text-2xl">
                  5+
                </div>
                <div>
                  <p className="font-bold">Tahun Pengalaman</p>
                  <p className="text-sm text-gray-600">Melayani dengan dedikasi</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://ext.same-assets.com/2769669130/1942010007.webp"
                  alt="About ASTINet"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#38adc3] to-[#2672c6] rounded-2xl opacity-20" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#38adc3] mb-2 uppercase">
              Fitur Unggulan
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              12 Keunggulan ASTINet
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">
              Solusi internet cepat dan stabil untuk kebutuhan rumah, bisnis, hingga komunitas Anda
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Zap,
                title: "Kecepatan Stabil 24/7",
                description: "Internet tanpa gangguan. Koneksi stabil siang dan malam untuk streaming, gaming, belajar, dan kerja online.",
              },
              {
                icon: Wifi,
                title: "Jangkauan WiFi Luas",
                description: "Sinyal kuat sampai ke seluruh ruangan. Router berkualitas menjangkau semua sudut rumah atau kantor Anda.",
              },
              {
                icon: Clock,
                title: "Support 24 Jam",
                description: "Tim ASTINet selalu siap membantu Anda kapan saja, termasuk tengah malam. Respons cepat dan ramah.",
              },
              {
                icon: Bot,
                title: "Bot CS Otomatis",
                description: "Asisten MeChat di WhatsApp siap menjawab pertanyaan otomatis soal tagihan, paket, hingga pemasangan.",
              },
              {
                icon: Activity,
                title: "Dashboard Online",
                description: "Monitoring real-time pemakaian internet, status koneksi, dan jumlah perangkat aktif lewat browser Anda.",
              },
              {
                icon: Settings,
                title: "Paket Fleksibel",
                description: "Mulai dari harian, mingguan, hingga bulanan. Pilih paket sesuai kebutuhan dan budget Anda.",
              },
              {
                icon: Lock,
                title: "Jaringan Aman",
                description: "Terhindar dari akses ilegal dan perangkat asing. Kontrol penuh koneksi hanya di tangan Anda.",
              },
              {
                icon: Network,
                title: "Manajemen Bandwidth Pintar",
                description: "Otomatis mengatur prioritas bandwidth agar koneksi tetap lancar meski banyak perangkat aktif.",
              },
              {
                icon: Zap,
                title: "Pemasangan Cepat",
                description: "Proses pemasangan cepat dan rapi oleh teknisi profesional. Bisa langsung online dalam hitungan jam.",
              },
              {
                icon: Globe,
                title: "IP Publik & Remote",
                description: "Mendukung IP statik untuk CCTV, server, game online, atau kebutuhan teknis lainnya.",
              },
              {
                icon: Smartphone,
                title: "Multi Device",
                description: "Satu koneksi bisa digunakan banyak perangkat tanpa batasan. Cocok untuk keluarga & kosan.",
              },
              {
                icon: Tv,
                title: "Kompatibel Semua Perangkat",
                description: "Kompatibel dengan Android, iPhone, laptop, Smart TV, hingga konsol game. Langsung connect tanpa ribet.",
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#38adc3] to-[#2672c6] flex items-center justify-center mb-4">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#38adc3] mb-2 uppercase">
              Layanan Kami
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold">
              Layanan Internet Terbaik
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Internet Rumah & Kos",
                description: "Layanan internet cepat, stabil, dan terjangkau untuk keluarga, pelajar, dan penghuni kos.",
              },
              {
                title: "Internet Kantor & UMKM",
                description: "Solusi koneksi untuk bisnis skala kecil hingga menengah, dengan SLA tinggi dan support cepat.",
              },
              {
                title: "RT/RW Net & Komunitas",
                description: "Infrastruktur internet skala lokal untuk perumahan, desa, dan komunitas.",
              },
              {
                title: "Pemasangan & Monitoring",
                description: "Tim ASTINet siap melakukan instalasi, upgrade, dan pengecekan jaringan secara cepat.",
              },
            ].map((service, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full border-2 border-transparent hover:border-[#38adc3] transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <Button variant="link" className="text-[#38adc3] p-0">
                      Selengkapnya <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#38adc3] mb-2 uppercase">
              Paket Internet
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold">
              Pilih Paket Terbaik Untuk Anda
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                name: "Basic",
                price: "150.000",
                speed: "20 Mbps",
                features: ["Unlimited tanpa FUP", "Support via WhatsApp", "Cocok untuk browsing & streaming"],
              },
              {
                name: "Standard",
                price: "200.000",
                speed: "30 Mbps",
                popular: true,
                features: ["Unlimited tanpa FUP", "Stabil di jam sibuk", "Tim support siap bantu", "Tanpa biaya tambahan"],
              },
              {
                name: "Premium",
                price: "250.000",
                speed: "50 Mbps",
                features: [
                  "Bandwidth stabil dan prioritas",
                  "Kunjungan teknisi gratis",
                  "Monitoring & dukungan penuh",
                  "Gratis upgrade bila tersedia",
                ],
              },
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card
                  className={`relative h-full ${
                    plan.popular
                      ? "border-2 border-[#38adc3] shadow-xl scale-105"
                      : "border shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#38adc3] to-[#2672c6] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Paling Populer
                    </div>
                  )}
                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl mb-4">{plan.name}</CardTitle>
                    <div className="mb-2">
                      <span className="text-5xl font-bold">Rp {plan.price}</span>
                      <span className="text-gray-600 ml-2">/ bulan</span>
                    </div>
                    <p className="text-[#38adc3] font-semibold">Hingga {plan.speed}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-[#38adc3] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                    <Button
                      className={`w-full mt-6 ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#38adc3] to-[#2672c6] hover:opacity-90"
                          : "bg-[#38adc3] hover:bg-[#2e9bb0]"
                      } text-white`}
                      onClick={() => {
                        Swal.fire({
                          title: "Login Dulu!",
                          text: "Harap login terlebih dahulu untuk berlangganan paket internet.",
                          icon: "warning",
                          confirmButtonText: "OK",
                          confirmButtonColor: "#38adc3",
                        }).then(() => {
                          window.location.href = "/pelanggan/login";
                        });
                      }}
                    >
                      Langganan Sekarang
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#38adc3] mb-2 uppercase">
              Testimoni
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold">
              Apa Kata Pengguna ASTINet
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Rendy Pratama",
                role: "Remote Worker",
                text: "Sejak pakai ASTINet, kerjaan online jadi lancar tanpa putus-putus. Support-nya juga responsif banget kalau ada kendala.",
              },
              {
                name: "Rahmat",
                role: "Mahasiswa",
                text: "Koneksi ASTINet di kosan saya stabil banget. Streaming, Zoom, dan game nggak pernah buffering. Mantap!",
              },
              {
                name: "Budi Santoso",
                role: "Owner Toko Online",
                text: "ASTINet bantu bisnis kecil saya tetap online. Transaksi lancar dan pelanggan puas karena WiFi toko stabil.",
              },
              {
                name: "Dewi Kurnia",
                role: "Ibu Rumah Tangga",
                text: "Customer service ASTINet cepat tanggap. Baru laporan gangguan pagi, sore langsung beres. Salut!",
              },
              {
                name: "Putri Ayu",
                role: "Teknisi IT",
                text: "Sebagai teknisi, saya tahu kualitas jaringan. Dan jujur, ASTINet jaringannya bersih dan minim masalah.",
              },
              {
                name: "Puji Astuti",
                role: "Founder Startup",
                text: "Startup kami butuh koneksi cepat & stabil. Pilihan jatuh ke ASTINet karena performanya konsisten.",
              },
            ].map((testimonial, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#38adc3] to-[#2672c6]" />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-sm font-semibold text-[#38adc3] mb-2 uppercase">
              FAQ
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold">
              Pertanyaan yang Sering Diajukan
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "Apakah ASTINet tersedia di daerah saya?",
                  a: "Silakan hubungi tim kami melalui WhatsApp atau formulir kontak untuk memastikan ketersediaan layanan di lokasi Anda. Kami terus memperluas jangkauan tiap bulannya.",
                },
                {
                  q: "Berapa biaya pemasangan baru?",
                  a: "Biaya pemasangan bervariasi tergantung area dan jenis paket. Namun umumnya mulai dari Rp100.000. Promo bebas biaya pasang juga tersedia di waktu tertentu.",
                },
                {
                  q: "Apakah semua paket ASTINet unlimited?",
                  a: "Ya, seluruh paket ASTINet bersifat unlimited tanpa FUP, sehingga Anda bisa menggunakan internet sepuasnya tanpa takut kuota habis atau kecepatan turun.",
                },
                {
                  q: "Bagaimana jika koneksi saya bermasalah?",
                  a: "Tim support ASTINet siap membantu Anda setiap hari. Cukup hubungi kami melalui WhatsApp, dan teknisi kami akan segera memeriksa kendala Anda secara remote atau onsite.",
                },
                {
                  q: "Apakah tersedia layanan untuk bisnis dan kantor?",
                  a: "Tentu! Kami menyediakan paket khusus untuk UMKM, kantor, dan lembaga pendidikan dengan kecepatan tinggi, SLA uptime, dan dukungan prioritas.",
                },
                {
                  q: "Bagaimana cara berlangganan ASTINet?",
                  a: "Anda bisa mendaftar langsung melalui website, hubungi kami via WhatsApp, atau datang ke kantor ASTINet terdekat. Prosesnya cepat dan mudah!",
                },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-white px-6 rounded-lg border">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-[#38adc3] to-[#2672c6] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6">
              Siap Beralih ke ASTINet?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90">
              Hubungi kami sekarang dan nikmati internet cepat & stabil
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-white text-[#38adc3] hover:bg-gray-100">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat WhatsApp
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                Hubungi Kami
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wifi className="h-8 w-8 text-[#38adc3]" />
                <span className="text-2xl font-bold text-white">
                  Wi<span className="gradient-text">Fi</span>an
                </span>
              </div>
              <p className="text-sm mb-4">
                Wilayut, Sukodono
                {/* <br />
                Kec. */}
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <Phone className="inline h-4 w-4 mr-2" />
                  +62 813-8255-2884
                </p>
                <p>
                  <Mail className="inline h-4 w-4 mr-2" />
                  info@ASTINet.co.id
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">ASTINet</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Layanan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Paket Internet
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Layanan Kami</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Internet Rumah & Kos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Internet Kantor & UMKM
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    RT/RW Net Komunitas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Support Teknis
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Bantuan</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Cek Area Layanan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#38adc3] transition-colors">
                    Syarat & Ketentuan
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              © Copyright <span className="font-semibold text-white">ASTINet</span> All Rights Reserved
            </p>
            <p className="mt-2">
              Designed by ASTINet | Distributed By ASTINet
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/6281382552884"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50 bounce-slow"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
