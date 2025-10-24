import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
// Jalur yang benar dari Pages/Admin/Package/ ke Pages/Auth/Layouts/AdminLayouts
import AdminLayout from '../../../Auth/Layouts/AdminLayouts'; 
import { ArrowLeft, Save } from 'lucide-react'; 

const Edit = ({ auth, package: packageData }) => {
    // Inisialisasi useForm dengan data paket yang diterima
    const { data, setData, put, processing, errors, reset } = useForm({
        nama_paket: packageData.nama_paket || '',
        kecepatan: packageData.kecepatan || '',
        kuota: packageData.kuota || '',
        harga_bulanan: packageData.harga_bulanan || '',
        keterangan: packageData.keterangan || '',
    });

    // Reset form jika data paket berubah (untuk berjaga-jaga)
    useEffect(() => {
        reset({
            nama_paket: packageData.nama_paket || '',
            kecepatan: packageData.kecepatan || '',
            kuota: packageData.kuota || '',
            harga_bulanan: packageData.harga_bulanan || '',
            keterangan: packageData.keterangan || '',
        });
    }, [packageData]);


    // Fungsi untuk menangani submit form: menggunakan metode PUT untuk update
    const submit = (e) => {
        e.preventDefault();
        // Route untuk update data (admin.packages.update)
        // packageData.id_paket adalah Primary Key yang kita tentukan di rute
        put(route('admin.packages.update', packageData.id_paket));
    };
    
    // Komponen Input Field
    const InputField = ({ id, label, type = 'text', value, error, placeholder }) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label} {error && <span className="text-red-500 text-xs">({error})</span>}
            </label>
            <input
                id={id}
                type={type}
                name={id}
                value={value} 
                onChange={(e) => setData(id, e.target.value)}
                placeholder={placeholder}
                className={`mt-1 block w-full rounded-lg border ${
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                } shadow-sm p-3 transition duration-150`}
                disabled={processing}
            />
        </div>
    );
    
    // Komponen TextArea Field
    const TextAreaField = ({ id, label, value, error, placeholder }) => (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label} {error && <span className="text-red-500 text-xs">({error})</span>}
            </label>
            <textarea
                id={id}
                name={id}
                rows="3"
                value={value}
                onChange={(e) => setData(id, e.target.value)}
                placeholder={placeholder}
                className={`mt-1 block w-full rounded-lg border ${
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                } shadow-sm p-3 transition duration-150`}
                disabled={processing}
            />
        </div>
    );


    return (
        <AdminLayout user={auth.user} header={`Edit Paket: ${packageData.nama_paket}`}>
            <Head title="Edit Paket" />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <Link
                        href={route('admin.packages.index')} 
                        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Daftar Paket
                    </Link>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
                        Edit Data Paket Internet
                    </h2>

                    <form onSubmit={submit}>
                        <InputField
                            id="nama_paket"
                            label="Nama Paket *"
                            value={data.nama_paket}
                            error={errors.nama_paket}
                            placeholder="Contoh: FiberHome 30 Mbps"
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                id="kecepatan"
                                label="Kecepatan *"
                                value={data.kecepatan}
                                error={errors.kecepatan}
                                placeholder="Contoh: 30 Mbps"
                            />
                            
                            <InputField
                                id="kuota"
                                label="Kuota (Opsional)"
                                value={data.kuota}
                                error={errors.kuota}
                                placeholder="Contoh: Unlimited atau 100 GB"
                            />
                        </div>

                        <InputField
                            id="harga_bulanan"
                            label="Harga Bulanan (Rp) *"
                            type="number"
                            value={data.harga_bulanan}
                            error={errors.harga_bulanan}
                            placeholder="Contoh: 250000"
                        />

                        <TextAreaField
                            id="keterangan"
                            label="Keterangan (Opsional)"
                            value={data.keterangan}
                            error={errors.keterangan}
                            placeholder="Deskripsi singkat tentang kelebihan paket..."
                        />

                        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
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