import path from 'node:path'

const PASCAL = /^[A-Z][a-zA-Z0-9]*$/
const CAMEL = /^[a-z][a-zA-Z0-9]*$/
const ALLOWED_FOLDERS = new Set(['screens', '@x', 'generated'])

/**
 * Enforces the project file structure:
 * - components: `ComponentName/ComponentName.tsx` (+ `.story.tsx`, `.test.tsx`, `screens/`);
 * - helpers in `lib`: `fnHelper/fnHelper.ts` (+ `.test.ts`);
 * - `.ts` files are camelCase, `.tsx` files are PascalCase components;
 * - folders are camelCase, PascalCase only for component folders.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const fileStructure = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce component and helper folder encapsulation and naming' },
    schema: [
      {
        type: 'object',
        properties: {
          root: { type: 'string' },
          /** Treat every file under the root as a helper (`packages/lib`). */
          helpers: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      componentName: 'Component files are PascalCase: rename "{{file}}" (e.g. "{{suggestion}}").',
      componentFolder: 'Encapsulate components in a folder: move "{{file}}" to "{{name}}/{{name}}{{suffix}}".',
      moduleName: 'Non-component files are camelCase: rename "{{file}}".',
      helperFolder: 'Encapsulate helpers in a folder: move "{{file}}" to "{{name}}/{{name}}{{suffix}}".',
      folderName: 'Folder "{{folder}}" must be camelCase (PascalCase is reserved for component folders).',
    },
  },
  create(context) {
    const filename = context.filename
    const rootMarker = `${path.sep}${context.options[0]?.root ?? 'src'}${path.sep}`
    const rootIndex = filename.lastIndexOf(rootMarker)
    if (rootIndex === -1) return {}

    const relative = filename.slice(rootIndex + rootMarker.length)
    const segments = relative.split(path.sep)
    const file = segments.at(-1) ?? ''
    const folders = segments.slice(0, -1)
    const parent = folders.at(-1)
    const match = /^([^.]+)((?:\.[a-z]+)*)\.(tsx?|jsx?)$/.exec(file)
    if (!match) return {}
    const [, name = '', middle = '', ext] = match
    const suffix = `${middle}.${ext ?? ''}`
    const report = (messageId, data) => {
      context.report({ loc: { line: 1, column: 0 }, messageId, data })
    }

    const checkFolders = () => {
      for (const [index, folder] of folders.entries()) {
        const isComponentFolder = index === folders.length - 1 && folder === name && ext === 'tsx'
        const valid = ALLOWED_FOLDERS.has(folder) || CAMEL.test(folder) || (isComponentFolder && PASCAL.test(folder))
        if (!valid) report('folderName', { folder })
      }
    }

    const checkComponent = () => {
      if (!PASCAL.test(name)) {
        report('componentName', { file, suggestion: `${name.charAt(0).toUpperCase()}${name.slice(1)}${suffix}` })
      } else if (parent !== name) {
        report('componentFolder', { file, name, suffix })
      }
    }

    const checkModule = () => {
      if (!CAMEL.test(name)) {
        report('moduleName', { file })
        return
      }
      const inLib = folders.includes('lib') || context.options[0]?.helpers === true
      if (inLib && parent !== name) report('helperFolder', { file, name, suffix })
    }

    return {
      Program() {
        checkFolders()
        if (name === 'index') return
        if (ext === 'tsx') checkComponent()
        else checkModule()
      },
    }
  },
}
