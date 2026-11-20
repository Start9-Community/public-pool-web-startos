import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.0:5',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.2 or later. The web UI now requires a password. After updating, run Create UI Password and sign in with the username admin and the password it shows. Each install also now has its own secret key.',
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. La interfaz web ahora requiere una contraseña. Después de actualizar, ejecuta Crear contraseña de la interfaz e inicia sesión con el usuario admin y la contraseña que muestra. Además, cada instalación tiene ahora su propia clave secreta.',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. Die Weboberfläche verlangt jetzt ein Passwort. Führe nach dem Update UI-Passwort erstellen aus und melde dich mit dem Benutzernamen admin und dem angezeigten Passwort an. Außerdem hat jede Installation jetzt ihren eigenen geheimen Schlüssel.',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. Interfejs webowy wymaga teraz hasła. Po aktualizacji uruchom Utwórz hasło interfejsu i zaloguj się jako admin hasłem, które zostanie wyświetlone. Każda instalacja ma teraz także własny klucz tajny.',
    fr_FR:
      "Nécessite StartOS 0.4.2 ou une version ultérieure. L'interface web demande désormais un mot de passe. Après la mise à jour, lancez Créer le mot de passe de l'interface et connectez-vous avec le nom d'utilisateur admin et le mot de passe affiché. Chaque installation dispose aussi désormais de sa propre clé secrète.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
