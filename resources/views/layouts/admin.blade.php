import React from 'react';
import { Link, usePage } from '@inertiajs/react'; // <-- Modul ini harus terinstal dengan benar
import { Menu, LogOut, LayoutDashboard, Users, Package, CreditCard, Network, FileText } from 'lucide-react';

/**
 * Komponen AdminLayout berfungsi sebagai tata letak utama (sidebar + header)
 * untuk semua halaman di area Admin.
 * * @param {object} props - Properti komponen
 * @param {React.ReactNode} props.children - Konten halaman yang akan di-render di area utama
 * @param {string} props.title - Judul halaman saat ini
 */
export default function AdminLayout({ children, title }) {
    // Mengambil user object dari Inertia props jika Anda menggunakan middleware 'auth'
    // Menggunakan usePage().props untuk mengakses data yang dikirim dari Laravel
    const { auth } = usePage().props;
    // Asumsi user adalah bagian dari props (e.g., dari AuthServiceProvider atau handleInertiaRequests)
    const user = auth?.user; 

    // Daftar link navigasi
    const navItems = [
        // Menggunakan route() helper yang disediakan Laravel/Inertia
        { href: route('admin.dashboard'), icon: LayoutDashboard, label: 'Dashboard' },
        { href: '#', icon: Users, label: 'Pelanggan' },
        { href: '#', icon: Package, label: 'Paket Internet' },
        { href: '#', icon: CreditCard, label: 'Pembayaran' },
        { href: '#', icon: Network, label: 'Jaringan' },
        { href: '#', icon: FileText, label: 'Log Aktivitas' },
    ];
    
    // Sub-komponen untuk Link Navigasi
    const NavLink = ({ href, icon: Icon, label }) => {
        // Cek apakah link saat ini aktif
        // Perlu dipastikan bahwa fungsi route().current() tersedia (dari ziggy)
        // Jika tidak, kode ini perlu sedikit dimodifikasi
        const isActive = route().current(href);
        
        const baseClasses = "flex items-center space-x-3 p-3 rounded-lg transition-colors";
        const activeClasses = "bg-primary text-primary-foreground font-semibold shadow-md";
        const defaultClasses = "hover:bg-accent hover:text-accent-foreground text-muted-foreground";

        return (
            <Link 
                href={href} 
                className={`${baseClasses} ${isActive ? activeClasses : defaultClasses}`}
            >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar (Navigasi) */}
            {/* Styling responsif: sidebar disembunyikan di mobile, muncul di md ke atas */}
            <nav className="w-64 flex-shrink-0 bg-card border-r border-border p-4 sticky top-0 h-screen hidden md:block shadow-lg z-20">
                <div className="flex justify-center items-center h-16 border-b border-border mb-6">
                    <h1 className="text-xl font-bold text-primary">WiFian Admin</h1>
                </div>

                <div className="space-y-2">
                    {navItems.map((item, index) => (
                        <NavLink key={index} {...item} />
                    ))}
                </div>

                {/* Bagian Logout di bawah sidebar */}
                <div className="mt-auto pt-6 border-t border-border absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-sm mb-2 text-center text-foreground/70">
                        Masuk sebagai: **{user?.name || 'Admin'}**
                    </div>
                    {/* Logout Button */}
                    <Link
                        href={route('admin.logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors shadow-lg"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </Link>
                </div>
            </nav>

            {/* Konten Utama (Header + Main Content) */}
            <div className="flex-grow flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between h-16 bg-card border-b border-border px-6 shadow-md sticky top-0 z-10">
                    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                    
                    {/* Placeholder untuk mobile menu (Hamburger icon) */}
                    <button className="md:hidden text-foreground hover:text-primary transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    {/* User Info (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Selamat Datang, **{user?.name || 'Admin'}**</span>
                    </div>
                </header>

                {/* Area Konten Utama */}
                <main className="p-6 flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
}
