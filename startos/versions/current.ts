import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.0:0',
  releaseNotes: {
    en_US: `
    Initial release, first version of Public Pool's Web on StartOS.

    - using docker's domain names instead of IP addresses
    - block height in pool info
    - worker's temperature ( with worker's ip address setting)
    - donation page
    - tons of bug fixes, cleanups and improvements
    - PostgreSQL 18.4
    - Redis replaced by Valkey ( without persisted data, irrelevant for this app )
    - Rails 8.1, Ruby 4.0.5
    `,
    es_ES: `
    Versión inicial, primera versión de Public Pool's Web en StartOS.

    - uso de nombres de dominio de Docker en lugar de direcciones IP
    - altura de bloque en la información del pool
    - temperatura del worker ( con configuración de dirección IP del worker )
    - página de donaciones
    - numerosas correcciones de errores, limpiezas y mejoras
    - PostgreSQL 18.4
    - Redis reemplazado por Valkey ( sin datos persistidos, irrelevante para esta app )
    - Rails 8.1, Ruby 4.0.5
    `,
    de_DE: `
    Erstveröffentlichung, erste Version von Public Pool's Web auf StartOS.

    - Verwendung von Docker-Domainnamen statt IP-Adressen
    - Blockhöhe in den Pool-Informationen
    - Worker-Temperatur ( mit Einstellung der Worker-IP-Adresse )
    - Spendenseite
    - zahlreiche Fehlerbehebungen, Aufräumarbeiten und Verbesserungen
    - PostgreSQL 18.4
    - Redis ersetzt durch Valkey ( ohne persistierte Daten, für diese App irrelevant )
    - Rails 8.1, Ruby 4.0.5
    `,
    pl_PL: `
    Pierwsze wydanie, pierwsza wersja Public Pool's Web na StartOS.

    - używanie nazw domenowych Dockera zamiast adresów IP
    - wysokość bloku w informacjach o puli
    - temperatura workera ( z ustawieniem adresu IP workera )
    - strona donacji
    - liczne poprawki błędów, porządkowanie i ulepszenia
    - PostgreSQL 18.4
    - Redis zastąpiony przez Valkey ( bez utrwalonych danych, nieistotne dla tej aplikacji )
    - Rails 8.1, Ruby 4.0.5
    `,
    fr_FR: `
    Version initiale, première version de Public Pool's Web sur StartOS.

    - utilisation des noms de domaine Docker plutôt que des adresses IP
    - hauteur de bloc dans les informations du pool
    - température du worker ( avec paramètre d'adresse IP du worker )
    - page de donation
    - nombreuses corrections de bugs, nettoyages et améliorations
    - PostgreSQL 18.4
    - Redis remplacé par Valkey ( sans données persistées, sans importance pour cette app )
    - Rails 8.1, Ruby 4.0.5
    `,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
