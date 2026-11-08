const PASCAL = /^[A-Z][A-Za-z0-9]*$/

const unwrapExport = (statement) =>
  statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportDefaultDeclaration' ? statement.declaration : statement

const isFunction = (node) => node?.type === 'ArrowFunctionExpression' || node?.type === 'FunctionExpression'

/** Компоненты в константах: стрелочные функции и функциональные выражения. */
const variableComponents = (declaration) =>
  declaration.declarations
    .filter((declarator) => declarator.id.type === 'Identifier' && PASCAL.test(declarator.id.name) && isFunction(declarator.init))
    .map((declarator) => ({ name: declarator.id.name, fn: declarator.init }))

/** Компоненты верхнего уровня файла: объявления функций и функции в константах. */
function topLevelComponents(program) {
  return program.body.flatMap((statement) => {
    const declaration = unwrapExport(statement)
    if (declaration?.type === 'FunctionDeclaration' && declaration.id && PASCAL.test(declaration.id.name)) {
      return [{ name: declaration.id.name, fn: declaration }]
    }
    return declaration?.type === 'VariableDeclaration' ? variableComponents(declaration) : []
  })
}

/** Объявления интерфейсов и псевдонимов типов в файле по имени. */
function typeDeclarations(program) {
  const found = new Map()
  for (const statement of program.body) {
    const declaration = unwrapExport(statement)
    if (declaration?.type === 'TSInterfaceDeclaration' || declaration?.type === 'TSTypeAliasDeclaration') {
      found.set(declaration.id.name, declaration.type)
    }
  }
  return found
}

/**
 * Пропсы компонента описываются интерфейсом в том же файле,
 * чтобы у каждого свойства была документация.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const componentPropsInterface = {
  meta: {
    type: 'problem',
    docs: { description: 'Пропсы компонента описываются интерфейсом с документацией' },
    schema: [],
    messages: {
      missing: 'Опишите пропсы компонента «{{component}}» интерфейсом «{{component}}Props» в этом файле.',
      inline: 'Не описывайте пропсы компонента «{{component}}» прямо в параметрах: вынесите их в интерфейс «{{component}}Props».',
      alias: 'Пропсы «{{type}}» описываются через interface, а не type.',
      notInFile: 'Интерфейс пропсов «{{type}}» объявите в файле компонента.',
    },
  },
  create(context) {
    return {
      Program(program) {
        const types = typeDeclarations(program)
        for (const { name, fn } of topLevelComponents(program)) {
          const [param] = fn.params
          if (!param) continue
          const annotation = param.typeAnnotation?.typeAnnotation
          const report = (messageId, data) => {
            context.report({ node: param, messageId, data: { component: name, ...data } })
          }
          if (!annotation) {
            report('missing')
          } else if (annotation.type !== 'TSTypeReference' || annotation.typeName.type !== 'Identifier') {
            report('inline')
          } else {
            const type = annotation.typeName.name
            const kind = types.get(type)
            if (!type.endsWith('Props')) report('missing')
            else if (kind === 'TSTypeAliasDeclaration') report('alias', { type })
            else if (kind === undefined) report('notInFile', { type })
          }
        }
      },
    }
  },
}
