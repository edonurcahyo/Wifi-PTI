import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from "../../Auth/Layouts/AdminLayouts";
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Package, Shield } from 'lucide-react';

const Edit = ({ auth, pelanggan, paketList }) => {
    const { data, setData, put, processing, errors } = useForm({
        nama_pelanggan: pelanggan.nama_pelanggan || '',
        email: pelanggan.email || '',
        no_hp: pelanggan.no_hp || '',
        alamat: pelanggan.alamat || '',
        id_paket: pelanggan.id_paket || '',
        status_aktif: pelanggan.status_aktif || 'Aktif',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.pelanggan.update', pelanggan.id_pelanggan));
    };

    const InputField = ({ id, label, type = 'text', value, error, icon: Icon, required = false, children }) => (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label} {required && <span className="text-red-500">*</span>}
                </div>
            </label>
            {children || (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => setData(id, e.target.value)}
                    className={`mt-1 block w-full rounded-lg border ${
                        error 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white`}
                    required={required}
                />
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );

    return (
        <AdminLayout user={auth.user} header={`Edit Pelanggan: ${pelanggan.nama_pelanggan}`}>
            <Head title="Edit Pelanggan" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <div className="flex items-center mb-6">
                    <Link
                        href={route('admin.pelanggan.index')} 
                        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 dark:text-blue-400 dark:hover:text-blue-300"
                        preserveScroll
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Daftar Pelanggan
                    </Link>
                </div>
                
                {/* Edit Form */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">Edit Data Pelanggan</h2>
                        <p className="text-blue-100 text-sm">Perbarui informasi pelanggan</p>
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Pelanggan */}
                                <InputField
                                    id="nama_pelanggan"
                                    label="Nama Lengkap"
                                    value={data.nama_pelanggan}
                                    error={errors.nama_pelanggan}
                                    icon={User}
                                    required
                                />

                                {/* Email */}
                                <InputField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    error={errors.email}
                                    icon={Mail}
                                    required
                                />

                                {/* No HP */}
                                <InputField
                                    id="no_hp"
                                    label="No. HP"
                                    value={data.no_hp}
                                    error={errors.no_hp}
                                    icon={Phone}
                                    required
                                />

                                {/* Paket Internet */}
                                <div className="mb-6">
                                    <label htmlFor="id_paket" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            Paket Internet
                                        </div>
                                    </label>
                                    <select
                                        id="id_paket"
                                        value={data.id_paket}
                                        onChange={(e) => setData('id_paket', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Pilih Paket...</option>
                                        {paketList.map((paket) => (
                                            <option key={paket.id_paket} value={paket.id_paket}>
                                                {paket.nama_paket} - {paket.kecepatan} - Rp {paket.harga_bulanan?.toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_paket && <p className="text-red-500 text-sm mt-1">{errors.id_paket}</p>}
                                </div>

                                {/* Status */}
                                <div className="mb-6">
                                    <label htmlFor="status_aktif" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Status Akun
                                        </div>
                                    </label>
                                    <select
                                        id="status_aktif"
                                        value={data.status_aktif}
                                        onChange={(e) => setData('status_aktif', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="Aktif">Aktif</option>
                                        <option value="Nonaktif">Nonaktif</option>
                                    </select>
                                    {errors.status_aktif && <p className="text-red-500 text-sm mt-1">{errors.status_aktif}</p>}
                                </div>
                            </div>

                            {/* Alamat */}
                            <InputField
                                id="alamat"
                                label="Alamat"
                                value={data.alamat}
                                error={errors.alamat}
                                icon={MapPin}
                                required
                            >
                                <textarea
                                    id="alamat"
                                    rows={4}
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border ${
                                        errors.alamat 
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    } shadow-sm px-4 py-3 transition duration-150 dark:bg-gray-700 dark:text-white resize-none`}
                                    required
                                />
                            </InputField>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('admin.pelanggan.index')}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Edit;