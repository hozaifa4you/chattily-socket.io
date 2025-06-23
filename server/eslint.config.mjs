import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default defineConfig([
   {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      plugins: { js },
      extends: ['js/recommended'],
   },
   {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      languageOptions: { globals: globals.browser },
      rules: {
         'no-console': ['warn', { allow: ['warn', 'error'] }],
         '@typescript-eslint/no-unused-vars': 'warn',
      },
   },
   tseslint.configs.recommended,
   eslintConfigPrettier,
   eslintPluginPrettier,
]);
