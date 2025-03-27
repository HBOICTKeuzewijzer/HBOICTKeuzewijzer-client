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
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: 'src/index.html',
            },
        },
    },
})
