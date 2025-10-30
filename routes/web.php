<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\PaketInternetController;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\Customer\CustomerDashboardController;
use App\Http\Controllers\Customer\CustomerProfileController;
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
    });
});