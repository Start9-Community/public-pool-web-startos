import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  const store = await storeJson.read().once()

  await storeJson.merge(effects, {
    ...(kind === 'install' && {
      postgresPassword: utils.getDefaultString({
        charset: 'a-z,A-Z,0-9',
        len: 22,
      }),
    }),
    ...(!store?.secretKeyBase && {
      secretKeyBase: utils.getDefaultString({ charset: 'a-f,0-9', len: 128 }),
    }),
  })
})
