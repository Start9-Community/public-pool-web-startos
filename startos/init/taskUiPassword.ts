import { resetUiPassword } from '../actions/resetUiPassword'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const taskUiPassword = sdk.setupOnInit(async (effects) => {
  if (await storeJson.read((s) => s.uiPassword).const(effects)) return

  await sdk.action.createOwnTask(effects, resetUiPassword, 'important', {
    reason: i18n('Create a password to sign in to the web UI'),
  })
})
