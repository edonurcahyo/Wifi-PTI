# Wifi-PTI - WiFi Management System

<p align="center">
  <a href="https://github.com/edonurcahyo/Wifi-PTI" target="_blank">
    <img src="https://laravel.com/img/logomark.min.svg" width="120" alt="Wifi-PTI Logo">
  </a>
</p>

<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel" alt="Laravel Version">
  </a>
  <a href="https://www.php.net" target="_blank">
    <img src="https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP Version">
  </a>
  <a href="https://github.com/edonurcahyo/Wifi-PTI/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/edonurcahyo/Wifi-PTI?style=for-the-badge" alt="License">
  </a>
  <a href="https://github.com/edonurcahyo/Wifi-PTI" target="_blank">
    <img src="https://img.shields.io/badge/Status-Development-yellow?style=for-the-badge" alt="Project Status">
  </a>
</p>

## 📡 Tentang Wifi-PTI

**Wifi-PTI** adalah sistem manajemen WiFi berbasis web yang dikembangkan menggunakan **Laravel 10** untuk mempermudah pengelolaan dan monitoring jaringan WiFi.

Aplikasi ini dirancang untuk memberikan solusi terpadu dalam pengelolaan jaringan WiFi dengan antarmuka yang intuitif dan fungsionalitas yang lengkap, menjadikan proses administrasi jaringan lebih **terstruktur, efisien, dan terpusat**.

---

## ✨ Fitur Utama

### 🔐 **Sistem Keamanan**
- Autentikasi pengguna dengan sistem login yang aman
- Manajemen role dan permission (Admin, Operator, User)
- Proteksi route berdasarkan hak akses

### 👤 **Manajemen Pengguna**
- CRUD data pengguna
- Profil pengguna dengan informasi lengkap
- Riwayat aktivitas pengguna
- Manajemen akses berdasarkan role

### 📶 **Manajemen WiFi**
- Pendataan dan katalogisasi titik akses WiFi
- Monitoring status jaringan secara real-time
- Pencatatan log koneksi pengguna
- Analisis penggunaan bandwidth

### 📊 **Dashboard & Laporan**
- Dashboard analitik dengan grafik interaktif
- Laporan penggunaan WiFi per periode
- Statistik pengguna aktif
- Monitoring performa jaringan

### 🛠️ **Fitur Administratif**
- Konfigurasi sistem terpusat
- Backup dan restore database
- Log system activities
- Manajemen konten dan pengaturan

---

## 🏗️ Arsitektur Teknologi

### **Backend Framework**
- [Laravel 10.x](https://laravel.com) - PHP Framework
- PHP 8.x dengan fitur-fitur terbaru

### **Frontend Stack**
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Vite](https://vitejs.dev) - Build tool modern
- JavaScript ES6+

### **Database**
- MySQL / MariaDB (Relational Database)
- Eloquent ORM untuk manajemen data

### **Tools & Libraries**
- Laravel Breeze untuk autentikasi
- Laravel Sanctum untuk API authentication (opsional)
- Laravel Excel untuk export/import data

---

## 🚀 Instalasi dan Konfigurasi

### **Prasyarat Sistem**
- PHP 8.1 atau lebih tinggi
- Composer
- Node.js & NPM
- MySQL/MariaDB
- Web server (Apache/Nginx)

### **Langkah Instalasi**

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/edonurcahyo/Wifi-PTI.git
cd Wifi-PTI
```

#### 2️⃣ Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

#### 3️⃣ Konfigurasi Environment
```bash
# Salin file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### 4️⃣ Konfigurasi Database
Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wifi_pti
DB_USERNAME=root
DB_PASSWORD=
```

#### 5️⃣ Migrasi Database
```bash
# Jalankan migrasi database
php artisan migrate

# (Opsional) Seed data dummy
php artisan db:seed
```

#### 6️⃣ Build Assets
```bash
# Development mode
npm run dev

# Production build
npm run build
```

#### 7️⃣ Jalankan Aplikasi
```bash
# Development server
php artisan serve

# Akses aplikasi di browser:
# http://localhost:8000
```

### **Konfigurasi Web Server (Produksi)**
Untuk deployment di production, pastikan:
- `APP_ENV=production`
- `APP_DEBUG=false`
- Konfigurasi web server untuk point ke `public/` directory
- Setup SSL/TLS untuk keamanan

---

## 📁 Struktur Proyek

```
Wifi-PTI/
├── app/
│   ├── Http/Controllers/
│   ├── Models/
│   ├── Providers/
│   └── ...
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── ...
├── public/
├── resources/
│   ├── views/
│   └── ...
├── routes/
├── storage/
├── tests/
├── .env.example
├── composer.json
├── package.json
└── README.md
```

---

## 🧪 Testing

```bash
# Jalankan PHPUnit tests
php artisan test

# Jalankan tests dengan coverage
php artisan test --coverage
```

---

## 📖 Dokumentasi Penggunaan

### **Login Pertama Kali**
1. Akses aplikasi melalui browser
2. Login dengan kredensial default:
   - **Admin**: `admin@pti.local` / `password`
   - **Operator**: `operator@pti.local` / `password`
3. Ganti password setelah login pertama

### **Manajemen Pengguna**
1. Navigasi ke menu "Users"
2. Tambah pengguna baru dengan role yang sesuai
3. Kelola hak akses melalui permission system

### **Manajemen WiFi**
1. Tambah titik akses WiFi melalui menu "WiFi Points"
2. Monitor status koneksi secara real-time
3. Generate laporan penggunaan

---

## 🔧 Pengembangan

### **Branch Strategy**
- `main` - Stable production branch
- `develop` - Development branch
- `feature/*` - Fitur baru
- `hotfix/*` - Perbaikan bug critical

### **Commit Convention**
```
feat:     Menambah fitur baru
fix:      Perbaikan bug
docs:     Perubahan dokumentasi
style:    Formatting, missing semi colons, etc
refactor: Refactoring code
test:     Adding tests
chore:    Maintenance
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah-langkah berikut:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---
