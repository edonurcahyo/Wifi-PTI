import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from "../../Auth/Layouts/AdminLayouts";
import { ArrowLeft } from 'lucide-react'; 

// Pindahkan komponen InputField dan TextAreaField ke luar komponen Create
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

const Create = ({ auth }) => {
    const { data, setData, post, processing, errors } = useForm({
        nama_paket: '',
        kecepatan: '',
        kuota: '',
        harga_bulanan: '',
        keterangan: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.packages.store'));
    };

    // Handler untuk input change
    const handleInputChange = (field) => (e) => {
        if (field === 'harga_bulanan') {
            setData(field, e.target.value === '' ? '' : parseFloat(e.target.value));
        } else {
            setData(field, e.target.value);
        }
    };

    return (
        <AdminLayout user={auth.user} header="Tambah Paket Baru">
            <Head title="Tambah Paket" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center mb-6">
                    <Link
                        href={route('admin.packages.index')} 
                        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 dark:text-blue-400 dark:hover:text-blue-300"
                        preserveScroll
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Daftar Paket
                    </Link>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
                        Formulir Data Paket Internet
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
                                className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </>
                                ) : 'Simpan Paket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Create;