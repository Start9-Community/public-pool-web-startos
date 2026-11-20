export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  "Starting Public Pool's Web!": 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,
  Database: 4,
  'Waiting for PostgreSQL to be ready': 5,
  'PostgreSQL is ready': 6,
  'Sidekiq is running': 10,
  'Sidekiq is not running': 11,

  // interfaces.ts
  'Web UI': 7,
  "The web interface of Public Pool's Web": 8,
  // dependencies.ts
  'Public Pool is required to run this application.': 9,

  // actions/resetUiPassword.ts
  'Reset UI Password': 12,
  'Create UI Password': 13,
  'Generate a new password for the web UI': 14,
  'Generate the password for the web UI': 15,
  'Replaces the current web UI password.': 16,
  'Web UI Credentials': 17,
  'Sign in to the web UI with these credentials. Save the password to a password manager.': 18,
  Username: 19,
  Password: 20,

  // init/taskUiPassword.ts
  'Create a password to sign in to the web UI': 21,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
