import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Home, Package, Users, LogOut, DollarSign, Settings } from 'lucide-react';

const AdminLayout = ({ user, header, children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    const userName = user?.nama_admin || user?.name || 'Administrator'; 

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: Home, current: url === '/admin/dashboard' },
        { name: 'Paket Internet', href: route('admin.paket.index'), icon: Package, current: url.startsWith('/admin/paket') }, 
        { name: 'Pelanggan', href: route('admin.pelanggan.index'), icon: Users, current: url.startsWith('/admin/pelanggan') },
        { name: 'Pembayaran', href: route('admin.pembayaran.index'), icon: DollarSign, current: url.startsWith('/admin/pembayaran') },
        { name: 'Pengaturan', href: route('admin.settings.index'), icon: Settings, current: url.startsWith('/admin/settings') },
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-xl transform ${
                    sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-0 ease-in'
                } transition duration-200 lg:relative lg:translate-x-0 lg:transition-none`}
            >
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ASTINet ADMIN
                    </span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150 ${
                                item.current ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700' : ''
                            }`}
                        >
                            <item.icon className={`h-5 w-5 mr-3 ${item.current ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        as="button"
                        method="post"
                        href={route('admin.logout')}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/40 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition duration-150"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Overlay untuk Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header/Navbar */}
                <header className="flex items-center justify-between h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 shadow-md">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-500 dark:text-gray-300 focus:outline-none lg:hidden mr-4"
                        >
                            {sidebarOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {header}
                        </h1>
                    </div>
                    
                    {/* Info User */}
                    <div className="text-sm text-gray-700 dark:text-gray-200">
                        Admin: <span className="font-medium text-blue-600 dark:text-blue-400">{userName}</span>
                    </div>
                </header>

                {/* Konten Utama */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;