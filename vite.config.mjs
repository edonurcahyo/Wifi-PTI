import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

// Impor konfigurasi PostCSS Anda secara eksplisit
// import postcssConfig from './postcss.config.js'; 

export default defineConfig({
    // Tambahkan blok server untuk mengatasi masalah EACCES/Port
    server: {
        port: 3000, 
        host: 'localhost', 
    },
    
    // css: {
    //     // Paksa Vite menggunakan PostCSS config yang sudah kita perbaiki
    //     postcss: postcssConfig,
    // },
    
    plugins: [
        react(), 
        laravel({
            input: [
                'resources/css/app.css', // <-- HARUS ADA DI SINI
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
    ],
    
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
});
