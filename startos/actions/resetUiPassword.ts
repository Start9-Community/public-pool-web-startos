import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { uiUsername } from '../utils'

export const resetUiPassword = sdk.Action.withoutInput(
  // id
  'reset-ui-password',

  // metadata
  async ({ effects }) => {
    const isSet = !!(await storeJson.read((s) => s.uiPassword).const(effects))
    return {
      name: isSet ? i18n('Reset UI Password') : i18n('Create UI Password'),
      description: isSet
        ? i18n('Generate a new password for the web UI')
        : i18n('Generate the password for the web UI'),
      warning: isSet ? i18n('Replaces the current web UI password.') : null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const uiPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 22,
    })
    await storeJson.merge(effects, { uiPassword })

    return {
      version: '1',
      title: i18n('Web UI Credentials'),
      message: i18n(
        'Sign in to the web UI with these credentials. Save the password to a password manager.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: uiUsername,
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: uiPassword,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
