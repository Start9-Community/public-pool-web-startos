import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.0:3',
  releaseNotes: {
    en_US:
      'Finds Public Pool over the StartOS internal bridge instead of the retired hostname form, and follows it if its port ever moves. The old name no longer resolves between services, so the dashboard could be left with nothing to display.',
    es_ES:
      'Localiza Public Pool a través del puente interno de StartOS en lugar del formato de nombre de host retirado, y lo sigue si su puerto cambia. El nombre antiguo ya no se resuelve entre servicios, por lo que el panel podía quedarse sin nada que mostrar.',
    de_DE:
      'Findet Public Pool über die interne StartOS-Bridge statt über die ausgemusterte Hostnamen-Form und folgt ihm, falls sich sein Port ändert. Der alte Name wird zwischen Diensten nicht mehr aufgelöst, wodurch das Dashboard ohne anzuzeigende Daten dastehen konnte.',
    pl_PL:
      'Odnajduje Public Pool przez wewnętrzny mostek StartOS zamiast wycofanej formy nazwy hosta i podąża za nim, gdy zmieni się jego port. Stara nazwa nie jest już rozwiązywana między usługami, przez co panel mógł nie mieć czego wyświetlać.',
    fr_FR:
      "Trouve Public Pool via le pont interne de StartOS plutôt que par la forme de nom d'hôte retirée, et le suit si son port change. L'ancien nom ne se résout plus entre services, ce qui pouvait laisser le tableau de bord sans rien à afficher.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
