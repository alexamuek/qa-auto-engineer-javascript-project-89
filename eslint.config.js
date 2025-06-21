import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'
import pluginVitest from 'eslint-plugin-vitest'

export default defineConfig([
  stylistic.configs.recommended,
  { files: ['src/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: { 'react': pluginReact,
      '@stylistic': stylistic },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...stylistic.configs.customize({
        indent: 2,
        quotes: 'single',
        semi: true,
      }).rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },
  {
    files: ['__tests__/*.{spec,test}.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        window: 'readonly',
        document: 'readonly',
        ...pluginVitest.environments.env.globals,
      },
    },
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  pluginReact.configs.flat.recommended,
  { settings: {
    react: {
      version: 'detect',
    },
  },
  },
])
