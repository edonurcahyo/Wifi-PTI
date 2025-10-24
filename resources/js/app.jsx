import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
// Hapus import resolvePageComponent
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

// Definisikan pages secara manual menggunakan import.meta.glob
const pages = import.meta.glob('./Pages/**/*.tsx'); // Fokus HANYA pada .tsx dulu

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    
    // Gunakan resolver manual
    resolve: (name) => {
        const path = `./Pages/${name}.tsx`; // Cari .tsx secara eksplisit
        if (!pages[path]) {
            // Jika tidak ditemukan, coba cari .jsx (fallback)
            const jsxPath = `./Pages/${name}.jsx`;
            const jsxPages = import.meta.glob('./Pages/**/*.jsx');
            if (jsxPages[jsxPath]) {
                return jsxPages[jsxPath]();
            }
            // Jika masih tidak ada, lempar error
            throw new Error(`Page component "${name}" not found.`);
        }
        return pages[path](); // Kembalikan promise komponen
    },
    
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
