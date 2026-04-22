import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import stylisticPlugin from '@stylistic/eslint-plugin';
import promisePlugin from 'eslint-plugin-promise';
import pluginPlaywright from 'eslint-plugin-playwright';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.node,
            },
            parserOptions: {
                project: './tsconfig.json'
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
            jsdoc: jsdocPlugin,
            '@stylistic/ts': stylisticPlugin,
            promise: promisePlugin,
            playwright: pluginPlaywright,
            import: importPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
                },
                node: {
                    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
                },
            },
        },
        rules: {
            // ── Core JS ──
            'no-unused-vars': 'off',
            'no-empty-pattern': 'off',
            'no-trailing-spaces': 'error',
            'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
            'no-console': 'warn',
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-return-await': 'error',
            complexity: ['warn', { max: 10 }],

            // ── Prettier ──
            'prettier/prettier': ['error', { endOfLine: 'auto', tabWidth: 2, printWidth: 120 }],

            // ── Imports ──
            'sort-imports': ['error', { ignoreDeclarationSort: true }],
            'import/no-unresolved': ['error', { ignore: [String.raw`\.json$`] }],
            'import/named': 'error',
            'import/default': 'error',
            'import/no-absolute-path': 'error',
            'import/no-self-import': 'error',

            // ── TypeScript ──
            '@typescript-eslint/no-unused-vars': [
                'error', 
                { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^(error|e|err)$' }
            ],
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/require-await': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

            // ── Stylistic ──
            '@stylistic/ts/lines-between-class-members': [
                'error', 
                {
                    enforce: [
                        { blankLine: 'always', prev: 'method', next: 'method' },
                        { blankLine: 'always', prev: 'field', next: 'method' },
                    ]
                }
            ],
            '@stylistic/ts/padding-line-between-statements': [
                'error', 
                { blankLine: 'always', prev: 'import', next: 'export' },
                { blankLine: 'always', prev: 'import', next: 'class' },
            ],

            // ── Promises ──
            'promise/catch-or-return': 'error',
            'promise/no-nesting': 'warn',
            'promise/always-return': 'off',

            // ── Playwright ──
            'playwright/no-focused-test': 'error',
            'playwright/no-skipped-test': 'warn',
            'playwright/no-page-pause': 'error',
            'playwright/no-wait-for-timeout': 'warn',
            'playwright/expect-expect': ['warn', { assertFunctionNames: ['expect', '**.verify*'] }],
            'playwright/valid-expect': 'error',
            'playwright/no-force-option': 'warn',
            'playwright/no-networkidle': 'warn',
            'playwright/prefer-web-first-assertions': 'warn',
            'playwright/no-useless-await': 'warn',
            'playwright/no-standalone-expect': 'error',
        }
    },

    {
        ignores: [
            '**/*.js',
            '**/*.jsx',
            '**/*.json',
            'node_modules/**',
            'dist/**',
            '.vscode/',
            'playwright-report/**',
            'test-results/**',
        ],
    }
]