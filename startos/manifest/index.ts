import { setupManifest } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'public-pool-web',
  title: "Public Pool's Web",
  license: 'MIT',
  packageRepo: 'https://github.com/martinbarilik/public-pool-web',
  upstreamRepo: 'https://github.com/martinbarilik/public-pool-web-startos',
  marketingUrl: 'https://github.com/martinbarilik/public-pool-web',
  donationUrl: 'https://github.com/martinbarilik/public-pool-web#donate',
  description: { short, long },
  volumes: ['db'],
  images: {
    'public-pool-web': {
      source: { dockerTag: 'martinbarilik/public-pool-web:0.2.0' },
      arch: ['x86_64', 'aarch64'],
    },
    sidekiq: {
      source: { dockerTag: 'martinbarilik/public-pool-web:0.2.0' },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: { dockerTag: 'postgres:18.4' },
      arch: ['x86_64', 'aarch64'],
    },
    valkey: {
      source: { dockerTag: 'valkey/valkey:8-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    'public-pool': {
      optional: false,
      description: i18n('Public Pool is required to run this application.'),
      metadata: {
        title: 'Public Pool',
        icon: 'https://raw.githubusercontent.com/Start9Labs/public-pool-startos/refs/heads/master/icon.svg',
      },
    },
  },
})
