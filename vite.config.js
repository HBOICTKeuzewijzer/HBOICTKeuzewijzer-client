import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    root: 'src',
    server: {
        port: 3000,
        historyApiFallback: true,
        cachedChecks: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@http': path.resolve(__dirname, 'src/http'),
            '@pages': path.resolve(__dirname, 'src/http/pages'),
            '@models': path.resolve(__dirname, 'src/models'),
            '@utils': path.resolve(__dirname, 'src/utils'),
        },
    },
    build: {
        outDir: '../dist',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: 'src/index.html',
            },
        },
    },
})
