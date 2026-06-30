import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  'public-pool': {
    kind: 'running',
    versionRange: '>=0.2.5:0',
    healthChecks: ['stratum', 'ui'],
  },
}))
