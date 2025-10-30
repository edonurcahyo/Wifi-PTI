import React, { useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";

const CustomerLogin = ({ status, errors: sessionErrors, success }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const combinedErrors = { ...errors, ...sessionErrors };

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("customer.login.post"));
    };

    return (
        <div className="min-h-screen flex justify-center items-center p-4 sm:p-8 bg-gray-50 font-sans relative overflow-hidden">
            <Head title="Sign In Pelanggan" />

            {/* Background bergaris dengan opacity */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), repeating-linear-gradient(45deg, #f0f0f0 25%, #fff 25%, #fff 75%, #f0f0f0 75%, #f0f0f0)",
                    backgroundSize: "100px 100px",
                    backgroundPosition: "0 0, 50px 50px",
                }}
            ></div>

            {/* Konten utama */}
            <div className="max-w-4xl w-full z-10">
                {/* Header halaman */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-light text-gray-800 mb-2">
                        <b>Sign In</b>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Halaman ini digunakan untuk pelanggan yang sudah terdaftar
                        agar dapat mengakses layanan dan fitur eksklusif dari{" "}
                        <span className="text-cyan-600 font-semibold">ASTINet</span>.
                    </p>
                </div>

                {/* Form container */}
                <div className="flex justify-center">
                    <div className="w-full sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-xl p-8 sm:p-10 transform transition-all duration-500 hover:shadow-cyan-100 hover:-translate-y-1">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Login Pelanggan
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Masukkan kredensial akun Anda untuk melanjutkan.
                            </p>
                        </div>

                        {/* ✅ TAMBAH: Success message setelah register */}
                        {success && (
                            <div className="mb-4 font-medium text-sm text-green-600 bg-green-100 p-3 rounded-lg border border-green-200">
                                {success}
                            </div>
                        )}

                        {/* Status session */}
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600 bg-green-100 p-3 rounded-lg border border-green-200">
                                {status}
                            </div>
                        )}

                        {/* Form login */}
                        <form onSubmit={submit}>
                            {/* Email */}
                            <div className="mb-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="contoh@gmail.com"
                                    value={data.username}
                                    className={`block w-full rounded-lg border ${
                                        combinedErrors.username
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } shadow-sm p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150`}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                />
                                {combinedErrors.username && (
                                    <div className="text-xs text-red-500 mt-2">
                                        {combinedErrors.username}
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Masukkan password Anda"
                                    value={data.password}
                                    className={`block w-full rounded-lg border ${
                                        combinedErrors.password
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } shadow-sm p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150`}
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {combinedErrors.password && (
                                    <div className="text-xs text-red-500 mt-2">
                                        {combinedErrors.password}
                                    </div>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center justify-between mb-6">
                                <label
                                    htmlFor="remember"
                                    className="flex items-center"
                                >
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:ring-cyan-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Ingat Saya
                                    </span>
                                </label>
                            </div>

                            {/* Tombol login */}
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center items-center px-4 py-3 bg-cyan-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest shadow-md hover:bg-cyan-700 active:bg-cyan-900 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition ease-in-out duration-150 disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? "Memuat..." : "Login"}
                            </button>

                            {/* Tambahan: Link ke register */}
                            <p className="text-center text-sm text-gray-600 mt-5">
                                Tidak punya akun?{" "}
                                <Link
                                    href={route("customer.register")}
                                    className="text-cyan-600 hover:text-cyan-800 font-semibold transition-all duration-200 hover:underline"
                                >
                                    Daftar di sini
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;