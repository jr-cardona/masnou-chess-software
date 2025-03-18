import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                timer: path.resolve(__dirname, 'timer.html')
            }
        }
    }
});
