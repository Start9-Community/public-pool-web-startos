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
  // manifest.ts
  'Public Pool is required to run this application.': 9,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
