import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
    ],
  },
  // Config para arquivos .js (sem type-checking)
  {
    files: ['**/*.js', '**/*.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
  },
  // Config para arquivos .ts (com type-checking)
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettier
);