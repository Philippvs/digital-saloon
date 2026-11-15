import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const routingFiles = ['src/routes/**/*.{ts,tsx}', 'src/router.ts', 'src/main.tsx']

export default tseslint.config(
  { ignores: ['dist', 'functions/lib', 'emulator-data'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, allowExportNames: ['useAuth'] },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@tanstack/react-router',
              message:
                'Import router APIs only from src/routes/, src/router.ts, or src/main.tsx. Pass navigation callbacks into pages/components.',
            },
          ],
          patterns: [
            {
              group: ['**/routes/**', '../routes/*', './routes/*'],
              message: 'Only router.ts and route files may import route modules.',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'location',
          message: 'Do not use window.location outside route files; navigate via route callbacks.',
        },
        {
          object: 'window',
          property: 'history',
          message: 'Do not use window.history outside route files; navigate via route callbacks.',
        },
      ],
    },
  },
  {
    files: routingFiles,
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-properties': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
)
