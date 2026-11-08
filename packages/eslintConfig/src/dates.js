import { DATE_SYNTAX, effectMessage } from './shared.js'

/** Temporal instead of Date in application and package code. */
export const dates = ({ files, ignores = [] }) => [
  {
    files,
    ignores,
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='React'][property.name=/^use(Layout|Insertion)?Effect$/]",
          message: effectMessage,
        },
        ...DATE_SYNTAX,
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', importNames: ['useEffect', 'useLayoutEffect', 'useInsertionEffect'], message: effectMessage },
            { name: 'lodash', message: 'Use es-toolkit or @repo/lib.' },
            { name: 'moment', message: 'Используйте Temporal.' },
            { name: 'dayjs', message: 'Используйте Temporal.' },
            { name: 'date-fns', message: 'Используйте Temporal и форматирование дат из @repo/lib.' },
          ],
          patterns: [{ group: ['date-fns/*', 'lodash/*', 'lodash-es'], message: 'Используйте Temporal, es-toolkit или @repo/lib.' }],
        },
      ],
    },
  },
]
