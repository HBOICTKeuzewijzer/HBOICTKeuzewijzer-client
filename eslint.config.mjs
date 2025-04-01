import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'

export default defineConfig({
    files: ['src/**/*.{js,mjs,cjs}'],
    languageOptions: {
        globals: globals.browser,
    },
    plugins: { js },
    extends: ['js/recommended'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js'],
            },
            alias: {
                extensions: ['.js'],
                map: [
                    ['@', './src'],
                    ['@pages', './src/http/pages'],
                    ['@components', './src/components'],
                    ['@assets', './src/assets'],
                    ['@styles', './src/assets/styles'],
                    ['@utils', './src/utils'],
                ],
            },
        },
    },
})
