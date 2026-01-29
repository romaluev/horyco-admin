module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: ['**/*.d.ts'],
  rules: {
    // ============================================
    // NAMING CONVENTIONS (relaxed)
    // ============================================
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],

    // ============================================
    // IMPORT ORGANIZATION (relaxed)
    // ============================================
    'import/order': 'off',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',

    // ============================================
    // TYPESCRIPT STRICTNESS (relaxed)
    // ============================================
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    // ============================================
    // ANTI-AI-MISTAKE RULES (disabled - too noisy)
    // ============================================
    'no-magic-numbers': 'off',
    'no-warning-comments': 'off',

    // ============================================
    // CODE COMPLEXITY LIMITS (relaxed)
    // ============================================
    'max-lines-per-function': 'off',
    'max-lines': 'off',
    complexity: 'off',
    'max-depth': 'off',
    'max-params': 'off',
    'max-nested-callbacks': 'off',

    // ============================================
    // REACT RULES
    // ============================================
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/no-danger': 'off',
    'react/self-closing-comp': 'warn',
    'react/jsx-boolean-value': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-no-useless-fragment': 'warn',

    // ============================================
    // REACT HOOKS
    // ============================================
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ============================================
    // GENERAL CODE QUALITY
    // ============================================
    'no-console': 'off',
    'no-debugger': 'error',
    'prefer-const': 'warn',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
    'no-else-return': 'off',
    'prefer-template': 'off',
    'prefer-arrow-callback': 'off',
    'no-nested-ternary': 'off',
    'no-useless-concat': 'warn',
    'no-useless-return': 'warn',
    'no-lone-blocks': 'warn',
    'no-empty': 'warn',
    'no-throw-literal': 'warn',

    // ============================================
    // ACCESSIBILITY (relaxed)
    // ============================================
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/anchor-has-content': 'warn',
  },

  overrides: [
    {
      files: ['src/routes/**/*.tsx', '*.config.ts', '*.config.js'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
