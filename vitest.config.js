import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
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
})
