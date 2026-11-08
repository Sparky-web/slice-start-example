/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies make modules impossible to reason about in isolation.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'packages-do-not-import-apps',
      severity: 'error',
      comment: 'Shared packages must not depend on application code.',
      from: { path: '^packages/' },
      to: { path: '^apps/' },
    },
    {
      name: 'no-prisma-outside-shared-db',
      severity: 'error',
      comment: 'Use the prisma client from ~/shared/db.',
      from: { path: '^apps/[^/]+/src/', pathNot: '^apps/[^/]+/src/shared/db/' },
      to: { path: '(^|/)(shared/db/generated|node_modules/@prisma/client)/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: ['node_modules', 'dist', '\\.output', 'routeTree\\.gen\\.ts', 'generated/', 'storybook-static'] },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'apps/web/tsconfig.json' },
    enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import', 'require', 'node', 'default', 'types'] },
  },
}
