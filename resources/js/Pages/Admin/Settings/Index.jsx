import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from "../../Auth/Layouts/AdminLayouts";
import { Save, User, Shield, Bell, Database, Globe, CreditCard, User as UserIcon } from 'lucide-react';

const Settings = ({ auth, flash }) => {
    const { props } = usePage();
    
    // State untuk active tab
    const [activeTab, setActiveTab] = useState('profile');

    // Form untuk profile settings
    const { data: profileData, setData: setProfileData, put: updateProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        nama_admin: auth.user.nama_admin || '',
        username: auth.user.username || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // Form untuk application settings
    const { data: appData, setData: setAppData, post: updateAppSettings, processing: appProcessing, errors: appErrors } = useForm({
        company_name: 'ASTINet',
        company_address: '',
        company_phone: '',
        currency: 'IDR',
        tax_rate: 0,
        late_fee: 0,
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfile(route('admin.settings.profile.update'));
    };

    const handleAppSettingsSubmit = (e) => {
        e.preventDefault();
        updateAppSettings(route('admin.settings.application.update'));
    };

    // Input Field Component
    const InputField = ({ 
        id, label, type = 'text', value, error, icon: Icon, required = false, 
        onChange, placeholder, disabled = false 
    }) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label} {required && <span className="text-red-500">*</span>}
                </div>
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );

    return (
        <AdminLayout user={auth.user} header="Pengaturan Sistem">
            <Head title="Pengaturan" />

            <div className="max-w-6xl mx-auto">
                {/* Success Message */}
                {props.flash?.success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {props.flash.success}
                    </div>
                )}

                {props.flash?.error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {props.flash.error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">Pengaturan Sistem</h2>
                        <p className="text-purple-100 text-sm">Kelola pengaturan akun dan aplikasi</p>
                    </div>

                    <div className="p-6">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'profile'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Profil Admin
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('application')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'application'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Pengaturan Aplikasi
                                    </div>
                                </button>
                            </nav>
                        </div>

                        {/* Profile Settings Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
                                        Informasi Profil
                                    </h3>
                                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                                        Perbarui informasi profil dan username akun Anda.
                                    </p>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            id="nama_admin"
                                            label="Nama Admin"
                                            type="text"
                                            value={profileData.nama_admin}
                                            error={profileErrors.nama_admin}
                                            icon={User}
                                            required
                                            onChange={(e) => setProfileData('nama_admin', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                        />

                                        <InputField
                                            id="username"
                                            label="Username"
                                            type="text"
                                            value={profileData.username}
                                            error={profileErrors.username}
                                            icon={UserIcon}
                                            required
                                            onChange={(e) => setProfileData('username', e.target.value)}
                                            placeholder="Masukkan username"
                                        />
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                                            Ubah Password
                                        </h3>
                                        <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                                            Kosongkan field password jika tidak ingin mengubah password.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            id="current_password"
                                            label="Password Saat Ini"
                                            type="password"
                                            value={profileData.current_password}
                                            error={profileErrors.current_password}
                                            icon={Shield}
                                            onChange={(e) => setProfileData('current_password', e.target.value)}
                                            placeholder="Masukkan password saat ini"
                                        />

                                        <InputField
                                            id="new_password"
                                            label="Password Baru"
                                            type="password"
                                            value={profileData.new_password}
                                            error={profileErrors.new_password}
                                            icon={Shield}
                                            onChange={(e) => setProfileData('new_password', e.target.value)}
                                            placeholder="Masukkan password baru"
                                        />

                                        <InputField
                                            id="new_password_confirmation"
                                            label="Konfirmasi Password Baru"
                                            type="password"
                                            value={profileData.new_password_confirmation}
                                            error={profileErrors.new_password_confirmation}
                                            icon={Shield}
                                            onChange={(e) => setProfileData('new_password_confirmation', e.target.value)}
                                            placeholder="Konfirmasi password baru"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="submit"
                                            disabled={profileProcessing}
                                            className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Application Settings Tab */}
                        {activeTab === 'application' && (
                            <div className="space-y-6">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
                                        Pengaturan Aplikasi
                                    </h3>
                                    <p className="text-green-700 dark:text-green-400 text-sm">
                                        Konfigurasi pengaturan umum aplikasi ASTINet.
                                    </p>
                                </div>

                                <form onSubmit={handleAppSettingsSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            id="company_name"
                                            label="Nama Perusahaan"
                                            type="text"
                                            value={appData.company_name}
                                            error={appErrors.company_name}
                                            icon={Globe}
                                            onChange={(e) => setAppData('company_name', e.target.value)}
                                            placeholder="Nama perusahaan"
                                        />

                                        <InputField
                                            id="company_phone"
                                            label="Telepon Perusahaan"
                                            type="text"
                                            value={appData.company_phone}
                                            error={appErrors.company_phone}
                                            icon={Bell}
                                            onChange={(e) => setAppData('company_phone', e.target.value)}
                                            placeholder="Nomor telepon perusahaan"
                                        />

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4" />
                                                    Alamat Perusahaan
                                                </div>
                                            </label>
                                            <textarea
                                                value={appData.company_address}
                                                onChange={(e) => setAppData('company_address', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                placeholder="Alamat lengkap perusahaan"
                                            />
                                            {appErrors.company_address && (
                                                <p className="mt-1 text-sm text-red-600">{appErrors.company_address}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="submit"
                                            disabled={appProcessing}
                                            className="inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-lg font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {appProcessing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Information Card */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Database className="h-8 w-8 text-blue-500" />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Database</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Status: Normal</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-green-500" />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Keamanan</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Sistem Aman</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Bell className="h-8 w-8 text-yellow-500" />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifikasi</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Aktif</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;