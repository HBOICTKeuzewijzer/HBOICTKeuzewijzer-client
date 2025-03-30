import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    root: 'src',
    server: {
        port: 3000,
        historyApiFallback: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@pages': path.resolve(__dirname, 'src/http/pages'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@styles': path.resolve(__dirname, 'src/assets/styles'),
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
