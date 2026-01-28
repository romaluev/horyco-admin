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
  rules: {
    // ============================================
    // NAMING CONVENTIONS
    // ============================================
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'should', 'can', 'did', 'will', 'was'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],

    // ============================================
    // IMPORT ORGANIZATION
    // ============================================
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'type',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@tanstack/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/shared/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/entities/**',
            group: 'internal',
          },
          {
            pattern: '@/features/**',
            group: 'internal',
          },
          {
            pattern: '@/widgets/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',

    // ============================================
    // TYPESCRIPT STRICTNESS
    // ============================================
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      },
    ],
    '@typescript-eslint/array-type': ['error', { default: 'array' }],

    // ============================================
    // ANTI-AI-MISTAKE RULES
    // ============================================
    'no-magic-numbers': [
      'warn',
      {
        ignore: [-1, 0, 1, 2],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
      },
    ],
    'no-warning-comments': [
      'warn',
      {
        terms: ['todo', 'fixme', 'hack', 'xxx', 'note'],
        location: 'anywhere',
      },
    ],

    // ============================================
    // CODE COMPLEXITY LIMITS
    // ============================================
    'max-lines-per-function': [
      'warn',
      {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-lines': [
      'warn',
      {
        max: 200,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    complexity: ['warn', 10],
    'max-depth': ['error', 3],
    'max-params': ['warn', 4],
    'max-nested-callbacks': ['error', 3],

    // ============================================
    // REACT RULES
    // ============================================
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/no-danger': 'warn',
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-spacing': ['error', 'never'],
    'react/jsx-no-useless-fragment': 'error',

    // ============================================
    // REACT HOOKS
    // ============================================
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ============================================
    // GENERAL CODE QUALITY
    // ============================================
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
    'no-else-return': 'error',
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error',
    'no-nested-ternary': 'warn',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-lone-blocks': 'error',
    'no-empty': 'error',
    'no-throw-literal': 'error',

    // ============================================
    // ACCESSIBILITY
    // ============================================
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
  },

  overrides: [
    {
      files: [
        'src/routes/**/*.tsx',
        '*.config.ts',
        '*.config.js',
      ],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['*.config.ts', '*.config.js', '**/types.ts'],
      rules: {
        'max-lines': 'off',
        'no-magic-numbers': 'off',
      },
    },
  ],
}
