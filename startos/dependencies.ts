import { i18n } from './i18n'
import { sdk } from './sdk'

const publicPool = sdk.Dependency.required('public-pool', {
  description: i18n('Public Pool is required to run this application.'),
  metadata: {
    title: 'Public Pool',
    icon: 'https://raw.githubusercontent.com/Start9Labs/public-pool-startos/refs/heads/master/icon.svg',
  },
  versionRange: '>=0.2.5:20',
  kind: 'running',
  healthChecks: ['stratum', 'ui'],
})

export const dependencies = sdk.Dependencies.of().addDependency(publicPool)
