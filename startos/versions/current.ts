import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.2:0',
  releaseNotes: {
    en_US:
      "Requires StartOS 0.4.2 or later. Updates Public Pool's Web to 0.2.2, a security-hardening release: cross-origin redirects from the Public Pool API are rejected, detailed error pages are disabled, pool periods and port values are validated, and chart data cleanup now uses DELETE requests. Ruby is updated to 4.0.7.",
    es_ES:
      "Requiere StartOS 0.4.2 o posterior. Actualiza Public Pool's Web a 0.2.2, una versión de refuerzo de seguridad: se rechazan las redirecciones de origen cruzado de la API de Public Pool, se desactivan las páginas de error detalladas, se validan los periodos del pool y los valores de puerto, y la limpieza de datos de gráficos usa ahora peticiones DELETE. Ruby se actualiza a 4.0.7.",
    de_DE:
      "Erfordert StartOS 0.4.2 oder neuer. Aktualisiert Public Pool's Web auf 0.2.2, ein Sicherheits-Release: Cross-Origin-Weiterleitungen der Public-Pool-API werden abgelehnt, detaillierte Fehlerseiten sind deaktiviert, Pool-Zeiträume und Portwerte werden validiert, und das Bereinigen von Diagrammdaten nutzt jetzt DELETE-Anfragen. Ruby wurde auf 4.0.7 aktualisiert.",
    pl_PL:
      "Wymaga StartOS 0.4.2 lub nowszego. Aktualizuje Public Pool's Web do 0.2.2 — wydania wzmacniającego bezpieczeństwo: przekierowania cross-origin z API Public Pool są odrzucane, szczegółowe strony błędów są wyłączone, okresy puli i wartości portów są walidowane, a czyszczenie danych wykresów używa teraz żądań DELETE. Ruby zaktualizowano do 4.0.7.",
    fr_FR:
      "Nécessite StartOS 0.4.2 ou une version ultérieure. Met à jour Public Pool's Web vers 0.2.2, une version de renforcement de la sécurité : les redirections cross-origin de l'API Public Pool sont rejetées, les pages d'erreur détaillées sont désactivées, les périodes du pool et les valeurs de port sont validées, et le nettoyage des données de graphiques utilise désormais des requêtes DELETE. Ruby passe à la version 4.0.7.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
