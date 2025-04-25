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
                    ['@assets', './src/assets'],
                    ['@components', './src/components'],
                    ['@http', './src/http'],
                    ['@pages', './src/http/pages'],
                    ['@models', './src/models'],
                    ['@traits', './src/traits'],
                    ['@utils', './src/utils'],
                ],
            },
        },
    },
})
