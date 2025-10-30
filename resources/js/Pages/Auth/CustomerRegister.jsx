import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";

const CustomerRegister = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_pelanggan: "",
        email: "",
        no_hp: "",
        alamat: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("customer.register.post"), {
            onSuccess: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex justify-center items-center p-4 sm:p-8 bg-gray-50 font-sans relative overflow-hidden transition-all duration-500">
            <Head title="Daftar Pelanggan" />

            {/* Background garis-garis dengan animasi halus */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none animate-[movebg_8s_linear_infinite]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), repeating-linear-gradient(45deg, #f0f0f0 25%, #fff 25%, #fff 75%, #f0f0f0 75%, #f0f0f0)",
                    backgroundSize: "100px 100px",
                    backgroundPosition: "0 0, 50px 50px",
                }}
            ></div>

            {/* Tambah animasi background bergerak */}
            <style>
                {`
                @keyframes movebg {
                    from { background-position: 0 0, 50px 50px; }
                    to { background-position: 100px 100px, 150px 150px; }
                }
                `}
            </style>

            {/* Konten utama */}
            <div className="max-w-4xl w-full z-10 transition-all duration-700 hover:scale-[1.01]">
                {/* Header */}
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-4xl font-light text-gray-800 mb-2 tracking-wide">
                        <b>Sign Up</b>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Daftarkan diri Anda untuk menikmati layanan internet
                        <span className="text-cyan-600 font-semibold"> ASTINet</span>.
                        Lengkapi data dengan benar agar proses aktivasi berjalan lancar.
                    </p>
                </div>

                {/* Form Container */}
                <div className="flex justify-center animate-fadeInUp">
                    <div className="w-full sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-xl p-8 sm:p-10 transform transition-all duration-500 hover:shadow-cyan-100 hover:-translate-y-1">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Register Pelanggan
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Isi data di bawah ini untuk membuat akun baru.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {[
                                {
                                    id: "nama_pelanggan",
                                    label: "Nama Lengkap",
                                    placeholder: "Nama lengkap Anda",
                                },
                                {
                                    id: "email",
                                    label: "Email",
                                    placeholder: "contoh@email.com",
                                },
                                {
                                    id: "no_hp",
                                    label: "Nomor HP",
                                    placeholder: "081234567890",
                                },
                            ].map((field) => (
                                <div key={field.id}>
                                    <label
                                        htmlFor={field.id}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        {field.label}
                                    </label>
                                    <input
                                        id={field.id}
                                        type="text"
                                        value={data[field.id]}
                                        onChange={(e) =>
                                            setData(field.id, e.target.value)
                                        }
                                        className={`block w-full rounded-lg border ${
                                            errors[field.id]
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } shadow-sm p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-cyan-400`}
                                        placeholder={field.placeholder}
                                    />
                                    {errors[field.id] && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors[field.id]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {/* Alamat */}
                            <div>
                                <label
                                    htmlFor="alamat"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Alamat
                                </label>
                                <textarea
                                    id="alamat"
                                    rows="2"
                                    value={data.alamat}
                                    onChange={(e) =>
                                        setData("alamat", e.target.value)
                                    }
                                    className={`block w-full rounded-lg border ${
                                        errors.alamat
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } shadow-sm p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-cyan-400`}
                                    placeholder="Alamat lengkap Anda"
                                ></textarea>
                                {errors.alamat && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.alamat}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className={`block w-full rounded-lg border ${
                                        errors.password
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } shadow-sm p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-cyan-400`}
                                    placeholder="Minimal 6 karakter"
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Konfirmasi Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    className={`block w-full rounded-lg border ${
                                        errors.password_confirmation
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } shadow-sm p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-cyan-400`}
                                    placeholder="Ulangi password"
                                />
                                {errors.password_confirmation && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Tombol Register dengan animasi hover */}
                            <button
                                type="submit"
                                className={`w-full inline-flex justify-center items-center px-4 py-3 bg-cyan-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest shadow-md transform transition-all duration-200 hover:scale-[1.02] hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 ${
                                    processing
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                }`}
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        Mendaftar...
                                    </span>
                                ) : (
                                    "Daftar"
                                )}
                            </button>

                            {/* Link ke Login dengan transisi halus */}
                            <p className="text-center text-sm text-gray-600 mt-5 animate-fadeIn">
                                Sudah punya akun?{" "}
                                <Link
                                    href={route("customer.login")}
                                    className="text-cyan-600 hover:text-cyan-800 font-semibold transition-all duration-200 hover:underline"
                                >
                                    Login di sini
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegister;
