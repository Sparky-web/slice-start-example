import tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { componentPropsInterface } from './componentPropsInterface.js'

RuleTester.describe = describe
RuleTester.it = it

new RuleTester({ languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } } }).run(
  'component-props-interface',
  componentPropsInterface,
  {
    valid: [
      'interface BadgeProps { tone: string }\nexport function Badge({ tone }: BadgeProps) { return null }',
      'export function Page() { return null }',
      'interface CardProps { title: string }\nexport const Card = ({ title }: CardProps) => null',
      'const fields = withForm({ render: function Render({ form }) { return null } })',
    ],
    invalid: [
      { code: 'export function Badge({ tone }: { tone: string }) { return null }', errors: [{ messageId: 'inline' }] },
      { code: 'export function Badge(props) { return null }', errors: [{ messageId: 'missing' }] },
      { code: 'type BadgeProps = { tone: string }\nexport function Badge(p: BadgeProps) { return null }', errors: [{ messageId: 'alias' }] },
      { code: "import type { BadgeProps } from './x'\nexport function Badge(p: BadgeProps) { return null }", errors: [{ messageId: 'notInFile' }] },
    ],
  },
)
