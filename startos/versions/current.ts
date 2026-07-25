import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.0:2',
  releaseNotes: {
    en_US:
      'Migrates the package to start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later).',
    es_ES:
      'Migra el paquete a start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior).',
    de_DE:
      'Stellt das Paket auf start-sdk 2.0 um (erfordert StartOS 0.4.0-beta.10 oder neuer).',
    pl_PL:
      'Przenosi pakiet na start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego).',
    fr_FR:
      'Fait passer le paquet à start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure).',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
