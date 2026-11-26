import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.3:0',
  releaseNotes: {
    en_US:
      "Requires StartOS 0.4.2 or later. Updates Public Pool's Web to 0.2.3. Cross-origin redirects in Axe OS API requests are rejected.",
    es_ES:
      "Requiere StartOS 0.4.2 o posterior. Actualiza Public Pool's Web a 0.2.3. Se rechazan las redirecciones de origen cruzado en las peticiones a la API de Axe OS.",
    de_DE:
      "Erfordert StartOS 0.4.2 oder neuer. Aktualisiert Public Pool's Web auf 0.2.3. Cross-Origin-Weiterleitungen in Anfragen an die Axe-OS-API werden abgelehnt.",
    pl_PL:
      "Wymaga StartOS 0.4.2 lub nowszego. Aktualizuje Public Pool's Web do 0.2.3. Przekierowania cross-origin w żądaniach do API Axe OS są odrzucane.",
    fr_FR:
      "Nécessite StartOS 0.4.2 ou une version ultérieure. Met à jour Public Pool's Web vers 0.2.3. Les redirections cross-origin dans les requêtes vers l'API Axe OS sont rejetées.",
  },
  migrations: {
    up: async ({ effects }) => { },
    down: IMPOSSIBLE,
  },
})
