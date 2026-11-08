import jsdoc from 'eslint-plugin-jsdoc'

import { componentPropsInterface } from './rules/componentPropsInterface.js'
import { jsdocProduct } from './rules/jsdocProduct.js'

const repoPlugin = { meta: { name: 'repo-docs' }, rules: { 'component-props-interface': componentPropsInterface, 'jsdoc-product': jsdocProduct } }

/**
 * Documentation of the public surface: every exported function, component, server function
 * and every prop is documented in Russian with the product meaning, without code.
 */
export const docs = ({ files, ignores = [] }) => [
  {
    files,
    ignores,
    plugins: { jsdoc, 'repo-docs': repoPlugin },
    settings: { jsdoc: { mode: 'typescript' } },
    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: false,
          require: { FunctionDeclaration: false },
          contexts: [
            'ExportNamedDeclaration > FunctionDeclaration',
            "ExportNamedDeclaration[declaration.type='VariableDeclaration']",
            'ExportDefaultDeclaration',
            'TSInterfaceDeclaration[id.name=/Props$/] > TSInterfaceBody > TSPropertySignature',
          ],
          checkGetters: false,
          checkSetters: false,
        },
      ],
      'jsdoc/require-description': ['error', { contexts: ['any'] }],
      'jsdoc/no-types': 'error',
      'jsdoc/no-blank-blocks': 'error',
      'jsdoc/check-tag-names': ['error', { definedTags: [] }],
      'repo-docs/jsdoc-product': 'error',
      'repo-docs/component-props-interface': 'error',
    },
  },
]
