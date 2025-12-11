<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\PaketInternetController;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\Customer\CustomerDashboardController;
use App\Http\Controllers\Customer\CustomerProfileController;
use App\Http\Controllers\Customer\CustomerPaymentController;
use App\Http\Controllers\Admin\AdminPelangganController;
use App\Http\Controllers\Admin\AdminPembayaranController;
use App\Http\Controllers\Admin\AdminSettingsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AdminAuthController::class, 'create'])->name('login');
        Route::post('login', [AdminAuthController::class, 'store'])->name('login.post');
    });

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AdminAuthController::class, 'destroy'])->name('logout');
        
        // Dashboard - sesuai struktur folder
        Route::get('dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');
        
        // Paket routes - sesuaikan dengan struktur folder
        Route::resource('paket', PaketInternetController::class)
            ->parameters(['paket' => 'id_paket']);

        Route::resource('pelanggan', AdminPelangganController::class)
            ->parameters(['pelanggan' => 'id_pelanggan']);

        Route::prefix('pembayaran')->name('pembayaran.')->group(function () {
            Route::get('/', [AdminPembayaranController::class, 'index'])->name('index');
            Route::get('create', [AdminPembayaranController::class, 'create'])->name('create');
            Route::post('/', [AdminPembayaranController::class, 'store'])->name('store');
            Route::get('{id_pembayaran}/edit', [AdminPembayaranController::class, 'edit'])->name('edit');
            Route::put('{id_pembayaran}', [AdminPembayaranController::class, 'update'])->name('update');
            Route::delete('{id_pembayaran}', [AdminPembayaranController::class, 'destroy'])->name('destroy');
            Route::post('{id_pembayaran}/verify', [AdminPembayaranController::class, 'verify'])->name('verify');
            
            // TAMBAHKAN ROUTE BARU UNTUK VIEW/DOWNLOAD BUKTI
            Route::get('{id_pembayaran}/view-bukti', [AdminPembayaranController::class, 'viewBukti'])->name('view.bukti');
            Route::get('{id_pembayaran}/download-bukti', [AdminPembayaranController::class, 'downloadBukti'])->name('download.bukti');
        });

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [AdminSettingsController::class, 'index'])->name('index');
            Route::put('/profile', [AdminSettingsController::class, 'updateProfile'])->name('profile.update');
            Route::post('/application', [AdminSettingsController::class, 'updateApplication'])->name('application.update');
        });
    });
});

Route::prefix('pelanggan')->name('customer.')->group(function () {
    Route::middleware('guest:customer')->group(function () {
        Route::get('login', [CustomerAuthController::class, 'create'])->name('login');
        Route::post('login', [CustomerAuthController::class, 'store'])->name('login.post');
        Route::get('register', [CustomerAuthController::class, 'registerForm'])->name('register');
        Route::post('register', [CustomerAuthController::class, 'register'])->name('register.post');
    });

    Route::post('logout', [CustomerAuthController::class, 'destroy'])
        ->middleware('auth:customer')
        ->name('logout');

    Route::middleware('auth:customer')->group(function () {
        Route::get('dashboard', [CustomerDashboardController::class, 'dashboard'])->name('dashboard');
        Route::get('profile', [CustomerProfileController::class, 'edit'])->name('profile.edit');
        Route::put('profile', [CustomerProfileController::class, 'update'])->name('profile.update');
        Route::put('profile/password', [CustomerProfileController::class, 'updatePassword'])->name('profile.password');
        Route::delete('profile', [CustomerProfileController::class, 'destroy'])->name('profile.destroy');

        Route::prefix('pembayaran')->name('payment.')->group(function () {
            Route::get('buat', [CustomerPaymentController::class, 'create'])->name('create');
            Route::post('buat', [CustomerPaymentController::class, 'store'])->name('store');
            Route::get('{id_pembayaran}/upload', [CustomerPaymentController::class, 'showUploadForm'])->name('upload');
            Route::post('{id_pembayaran}/upload', [CustomerPaymentController::class, 'uploadProof'])->name('upload.proof');
            Route::get('riwayat', [CustomerPaymentController::class, 'history'])->name('history');
        });
    });
});