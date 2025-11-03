import js from '@eslint/js'

const eslintConfig = [
  // js.configs.recommended,
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*/**'],
              message:
                'Import from feature internal paths is not allowed. Use public exports from feature index files instead.'
            }
          ]
        }
      ]
    }
  }
]

export default eslintConfig
