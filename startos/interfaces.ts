import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { uiPort, uiUsername } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiPassword = await storeJson.read((s) => s.uiPassword).const(effects)

  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  // With no password stored, the empty credential list turns every request away.
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
    proxy: {
      auth: {
        type: 'basic',
        credentials: uiPassword
          ? [{ username: uiUsername, password: uiPassword }]
          : [],
        realm: "Public Pool's Web",
      },
    },
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n("The web interface of Public Pool's Web"),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui])

  return [uiReceipt]
})
