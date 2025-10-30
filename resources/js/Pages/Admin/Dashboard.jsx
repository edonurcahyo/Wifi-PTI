import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../Auth/Layouts/AdminLayouts"; 
import { Users, DollarSign, Globe, Activity } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl border border-slate-200 dark:border-slate-700">
        <div className={`flex items-center justify-between p-3 rounded-full ${color}/10 w-12 h-12 mb-4`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
);

const Dashboard = ({ auth }) => {
    const stats = [
        { title: 'Total Pelanggan', value: '1,245', icon: Users, color: 'text-indigo-500 bg-indigo-500' },
        { title: 'Pendapatan Bulan Ini', value: 'Rp 250 Jt', icon: DollarSign, color: 'text-green-500 bg-green-500' },
        { title: 'Jaringan Aktif', value: '98%', icon: Globe, color: 'text-blue-500 bg-blue-500' },
        { title: 'Log Aktivitas Baru', value: '34', icon: Activity, color: 'text-yellow-500 bg-yellow-500' },
    ];

    return (
        <AdminLayout user={auth.user} header="Dashboard Utama Admin">
            <Head title="Dashboard" />
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ringkasan Operasional</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Selamat datang, {auth.user?.name || 'Administrator'}. Di sini Anda dapat memantau status sistem dan performa keuangan secara ringkas.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>Paket Terlaris:</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">FiberHome 50 Mbps</span>
                            </li>
                            <li className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>Pelanggan Baru Bulan Ini:</span>
                                <span className="font-semibold">35</span>
                            </li>
                            <li className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>Tagihan Belum Lunas:</span>
                                <span className="font-semibold text-red-600">Rp 12 Jt</span>
                            </li>
                        </ul>
                        <div className="mt-6 flex space-x-3">
                            <Link 
                                href={route('admin.paket.index')}
                                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                            >
                                Kelola Paket
                            </Link>
                            <Link 
                                href="#"
                                className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                Laporan
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Log Aktivitas Terbaru</h2>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center text-gray-700 dark:text-gray-300">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                                Pelanggan Budi diaktifkan (01:10 PM)
                            </li>
                            <li className="flex items-center text-gray-700 dark:text-gray-300">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                                Paket FiberHome 30 Mbps diupdate (12:45 PM)
                            </li>
                            <li className="flex items-center text-gray-700 dark:text-gray-300">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></span>
                                Pembayaran ID#401 status Pending (10:00 AM)
                            </li>
                            <li className="flex items-center text-gray-700 dark:text-gray-300">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                                Admin Rudi berhasil login (08:00 AM)
                            </li>
                        </ul>
                        <button className="mt-6 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition">
                            Lihat Semua Log
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;