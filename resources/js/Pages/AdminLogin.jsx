import React, { useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { User, Lock, LogIn } from 'lucide-react'; // Mengganti Mail dengan User icon

/**
 * Halaman Login untuk Administrator
 * Menggunakan Tailwind dan Shadcn-style untuk tampilan modern.
 */
export default function AdminLogin() {
    // Mengambil prop status dari controller (biasanya untuk pesan sukses/gagal)
    const { status } = usePage().props;

    // Menggunakan useForm untuk manajemen state form dan Inertia POST
    const { data, setData, post, processing, errors, reset } = useForm({
        // Mengubah dari 'email' menjadi 'username'
        username: '', 
        password: '',
        remember: false,
    });

    // Reset password saat komponen unmount
    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // Menggunakan route 'admin.login.post' yang Anda sebutkan
        post(route('admin.login.post')); 
    };

    return (
        // Menggunakan desain layar penuh yang berpusat
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <Head title="Admin Login" />

            <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-2xl border border-border">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">WiFian Admin Panel</h1>
                    <p className="mt-2 text-muted-foreground">Silakan login sebagai administrator.</p>
                </div>

                {/* Menampilkan pesan error dari Laravel (misalnya 'session('error')') */}
                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                {errors.username && <div className="text-destructive text-sm mt-1">{errors.username}</div>}
                
                <form onSubmit={submit} className="space-y-4">
                    {/* Input Username (Ganti Email) */}
                    <div>
                        <label className="text-sm font-medium leading-none flex items-center mb-1">
                            <User className="w-4 h-4 mr-2 text-primary" />
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={data.username}
                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.username ? 'border-destructive' : ''}`}
                            autoComplete="username"
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                        {/* Error untuk username ditampilkan di atas form */}
                        {errors.username && <div className="text-destructive text-xs mt-1 hidden"></div>} 
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="text-sm font-medium leading-none flex items-center mb-1">
                            <Lock className="w-4 h-4 mr-2 text-primary" />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.password ? 'border-destructive' : ''}`}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <div className="text-destructive text-xs mt-1">{errors.password}</div>}
                    </div>

                    {/* Checkbox Remember Me (Opsional) */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label className="ml-2 text-sm text-muted-foreground">Ingat Saya</label>
                    </div>

                    {/* Tombol Login */}
                    <button 
                        type="submit" 
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-wait"
                        disabled={processing}
                    >
                        {processing ? 'Memproses...' : (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>Login Admin</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
