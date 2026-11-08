import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { jsdocProduct } from './jsdocProduct.js'

RuleTester.describe = describe
RuleTester.it = it

new RuleTester().run('jsdoc-product', jsdocProduct, {
  valid: [
    '/** Сохраняет черновик задачи. Пользователь не теряет текст. */\nexport const save = 1',
    '/** Данные проекта для карточки. */\nexport const project = 1',
    '/** Выгрузка списка в CSV. */\nexport const exportList = 1',
  ],
  invalid: [
    { code: '/** Saves the draft. */\nexport const save = 1', errors: [{ messageId: 'language' }] },
    { code: '/** Вызывает `save` и показывает итог. */\nexport const a = 1', errors: [{ messageId: 'code' }] },
    { code: '/** Показывает список через useQuery. */\nexport const a = 1', errors: [{ messageId: 'code' }] },
    { code: 'const total = 1\n/** Показывает total на экране. */\nexport const a = total', errors: [{ messageId: 'identifier' }] },
    { code: '/** Кнопка является главным действием. */\nexport const a = 1', errors: [{ messageId: 'bureaucratic' }] },
    { code: `/** ${'слово '.repeat(21)}. */\nexport const a = 1`, errors: [{ messageId: 'longSentence' }] },
    { code: '/**\n * Сохраняет задачу.\n * @example save()\n */\nexport const a = 1', errors: [{ messageId: 'example' }, { messageId: 'code' }] },
  ],
})
