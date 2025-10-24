<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminAuthController; // Diimpor dari App\Http\Controllers
use App\Http\Controllers\Admin\PaketInternetController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Rute ini dimuat oleh RouteServiceProvider. Ini mencakup rute publik, 
| autentikasi pengguna, dan autentikasi admin.
|
*/

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

require __DIR__.'/auth.php';


// ----------------------------------------
// --- 2. ADMIN PANEL ROUTES ---
// ----------------------------------------

Route::prefix('admin')->group(function () {

    // ADMIN LOGIN FORM: Mengganti Blade ke Inertia Render
    Route::get('login', function () {
        return Inertia::render('AdminLogin'); // Merender komponen React AdminLogin.jsx
    })->name('admin.login.form');

    Route::post('login', [AdminAuthController::class, 'login'])
        ->name('admin.login.post');

    Route::post('logout', [AdminAuthController::class, 'logout'])
        ->middleware('auth:admin') 
        ->name('admin.logout');
});


Route::middleware('auth:admin')->prefix('admin')->group(function () {
    
    Route::get('dashboard', function () {
        return Inertia::render('AdminDashboard'); 
    })->name('admin.dashboard'); 

    Route::resource('packages', PaketInternetController::class)
        ->parameters(['packages' => 'id_paket']) 
        ->names('admin.packages');
});