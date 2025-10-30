// resources/js/Pages/Customer/Profile/Edit.tsx
import React from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

interface Pelanggan {
  id_pelanggan: number;
  nama_pelanggan: string;
  email: string;
  no_hp: string;
  alamat: string;
  status_aktif: boolean;
  paket?: {
    nama_paket: string;
    kecepatan: string;
    harga: number;
  };
}

interface Props {
  pelanggan: Pelanggan;
}

export default function ProfileEdit({ pelanggan }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    nama_pelanggan: pelanggan.nama_pelanggan || '',
    email: pelanggan.email || '',
    no_hp: pelanggan.no_hp || '',
    alamat: pelanggan.alamat || '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/pelanggan/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Profil
          </h1>
          <p className="text-gray-600 mt-2">Kelola informasi profil Anda</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {pelanggan.nama_pelanggan.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{pelanggan.nama_pelanggan}</h2>
              <p className="text-gray-500 text-sm">{pelanggan.email}</p>
            </div>
          </div>
          <Link 
            href="/pelanggan/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </Link>
        </div>
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Informasi Profil</h3>
            <p className="text-blue-100 text-sm">Perbarui data pribadi Anda</p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={data.nama_pelanggan}
                    onChange={e => setData('nama_pelanggan', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.nama_pelanggan && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.nama_pelanggan}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="email@contoh.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* No. HP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    No. HP
                  </label>
                  <input
                    type="text"
                    value={data.no_hp}
                    onChange={e => setData('no_hp', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="081234567890"
                  />
                  {errors.no_hp && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.no_hp}
                    </p>
                  )}
                </div>

                {/* Alamat */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Alamat
                  </label>
                  <textarea
                    value={data.alamat}
                    onChange={e => setData('alamat', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 resize-none"
                    placeholder="Masukkan alamat lengkap"
                  />
                  {errors.alamat && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.alamat}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <Link 
                  href="/pelanggan/dashboard" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${pelanggan.status_aktif ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                Status: {pelanggan.status_aktif ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            {pelanggan.paket && (
              <div className="text-sm text-gray-600">
                Paket: <span className="font-semibold text-blue-600">{pelanggan.paket.nama_paket}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}