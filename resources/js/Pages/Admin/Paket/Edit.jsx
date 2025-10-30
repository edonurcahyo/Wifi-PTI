import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from "../../Auth/Layouts/AdminLayouts";
import { ArrowLeft, Save } from 'lucide-react'; 

// ✅ PASTIKAN: Komponen InputField SAMA PERSIS dengan Create.jsx
const InputField = ({ id, label, type = 'text', value, error, placeholder, required = false, onChange, disabled }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
            {error && <span className="text-red-500 text-xs ml-2">({error})</span>}
        </label>
        <input
            id={id}
            type={type}
            name={id}
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-1 block w-full rounded-lg border ${
                error 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            } shadow-sm px-3 py-2 transition duration-150 dark:bg-gray-700 dark:text-white`}
            disabled={disabled}
            required={required}
        />
    </div>
);

const TextAreaField = ({ id, label, value, error, placeholder, required = false, onChange, disabled }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
            {error && <span className="text-red-500 text-xs ml-2">({error})</span>}
        </label>
        <textarea
            id={id}
            name={id}
            rows="3"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-1 block w-full rounded-lg border ${
                error 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            } shadow-sm px-3 py-2 transition duration-150 dark:bg-gray-700 dark:text-white`}
            disabled={disabled}
            required={required}
        />
    </div>
);

const Edit = ({ auth, paket }) => {
    if (!paket) {
        return (
            <AdminLayout user={auth.user} header="Paket Tidak Ditemukan">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>Paket tidak ditemukan atau data tidak tersedia.</p>
                        <Link
                            href={route('admin.paket.index')} 
                            className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                        >
                            Kembali ke Daftar Paket
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // ✅ GUNAKAN PATTERN YANG SAMA DENGAN CREATE
    const { data, setData, put, processing, errors } = useForm({
        nama_paket: paket.nama_paket || '',
        kecepatan: paket.kecepatan || '',
        kuota: paket.kuota || '',
        harga_bulanan: paket.harga_bulanan || '',
        keterangan: paket.keterangan || '',
    });

    // ✅ GUNAKAN HANDLER YANG SAMA DENGAN CREATE
    const handleInputChange = (field) => (e) => {
        if (field === 'harga_bulanan') {
            setData(field, e.target.value === '' ? '' : parseFloat(e.target.value));
        } else {
            setData(field, e.target.value);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.paket.update', paket.id_paket));
    };

    return (
        <AdminLayout user={auth.user} header={`Edit Paket: ${paket.nama_paket}`}>
            <Head title="Edit Paket" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center mb-6">
                    <Link
                        href={route('admin.paket.index')} 
                        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 dark:text-blue-400 dark:hover:text-blue-300"
                        preserveScroll
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Daftar Paket
                    </Link>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
                        Edit Data Paket Internet
                    </h2>

                    <form onSubmit={submit} className="space-y-6">
                        <InputField
                            id="nama_paket"
                            label="Nama Paket"
                            value={data.nama_paket}
                            error={errors.nama_paket}
                            placeholder="Contoh: FiberHome 30 Mbps"
                            required
                            onChange={handleInputChange('nama_paket')}
                            disabled={processing}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <InputField
                                id="kecepatan"
                                label="Kecepatan"
                                value={data.kecepatan}
                                error={errors.kecepatan}
                                placeholder="Contoh: 30 Mbps"
                                required
                                onChange={handleInputChange('kecepatan')}
                                disabled={processing}
                            />
                            
                            <InputField
                                id="kuota"
                                label="Kuota"
                                value={data.kuota}
                                error={errors.kuota}
                                placeholder="Contoh: Unlimited atau 100 GB"
                                onChange={handleInputChange('kuota')}
                                disabled={processing}
                            />
                        </div>

                        <InputField
                            id="harga_bulanan"
                            label="Harga Bulanan (Rp)"
                            type="number"
                            value={data.harga_bulanan}
                            error={errors.harga_bulanan}
                            placeholder="Contoh: 250000"
                            required
                            onChange={handleInputChange('harga_bulanan')}
                            disabled={processing}
                        />

                        <TextAreaField
                            id="keterangan"
                            label="Keterangan"
                            value={data.keterangan}
                            error={errors.keterangan}
                            placeholder="Deskripsi singkat tentang kelebihan paket..."
                            onChange={handleInputChange('keterangan')}
                            disabled={processing}
                        />

                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                                disabled={processing}
                            >
                                <Save className='w-5 h-5 mr-2' />
                                {processing ? 'Memperbarui...' : 'Update Paket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Edit;