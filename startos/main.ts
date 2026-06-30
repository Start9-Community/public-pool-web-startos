import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  postgresPort,
  uiPort,
  postgresUser,
  postgresDb,
  redisUrl,
  masterKey,
  donateBtcAddress,
  donateLnAddress,
  publicPoolHost,
  publicPoolPort,
} from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n("Starting Public Pool's Web!"))

  // Read stored configuration
  const postgresPassword = await storeJson
    .read((s) => s.postgresPassword)
    .const(effects)

  const databaseUrl = `postgresql://${postgresUser}:${postgresPassword}@127.0.0.1:${postgresPort}/${postgresDb}`

  // Create PostgreSQL subcontainer
  const postgresSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: '/var/lib/postgresql',
      readonly: false,
    }),
    'postgres-sub',
  )

  const valkeySub = await sdk.SubContainer.of(
    effects,
    { imageId: 'valkey' },
    null,
    'valkey-sub',
  )

  return sdk.Daemons.of(effects)
    .addDaemon('db', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
        env: {
          POSTGRES_USER: postgresUser,
          POSTGRES_PASSWORD: postgresPassword ?? '',
          POSTGRES_DB: postgresDb,
        },
      },
      ready: {
        display: i18n('Database'),
        fn: async () => {
          const { exitCode } = await postgresSub.exec([
            'pg_isready',
            '-U',
            postgresUser,
            '-d',
            postgresDb,
            '-h',
            '127.0.0.1',
          ])

          if (exitCode !== 0) {
            return {
              result: 'loading',
              message: i18n('Waiting for PostgreSQL to be ready'),
            }
          }
          return {
            result: 'success',
            message: i18n('PostgreSQL is ready'),
          }
        },
      },
      requires: [],
    })
    .addDaemon('valkey', {
      subcontainer: valkeySub,
      exec: {
        command: [
          'valkey-server',
          '--save',
          '',
          '--appendonly',
          'no',
          '--bind',
          '127.0.0.1',
        ],
      },
      ready: {
        display: null,
        fn: async () => {
          const res = await valkeySub.exec([
            'valkey-cli',
            '-h',
            '127.0.0.1',
            'ping',
          ])
          return res.stdout.toString().trim() === 'PONG'
            ? { message: '', result: 'success' }
            : { message: res.stdout.toString().trim(), result: 'failure' }
        },
      },
      requires: [],
    })
    .addDaemon('public-pool-web', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'public-pool-web' },
        sdk.Mounts.of(),
        'public-pool-web-sub',
      ),
      exec: {
        command: sdk.useEntrypoint(['./bin/thrust', './bin/rails', 'server']),
        env: {
          PUBLIC_POOL_HOST: publicPoolHost,
          PUBLIC_POOL_PORT: String(publicPoolPort),
          RAILS_MASTER_KEY: masterKey,
          DATABASE_URL: databaseUrl,
          REDIS_URL: redisUrl,
          DONATE_BTC_ADDRESS: donateBtcAddress,
          DONATE_LN_ADDRESS: donateLnAddress,
          THRUSTER_HTTP_PORT: String(uiPort),
          THRUSTER_TARGET_PORT: '3001',
        },
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          }),
      },
      requires: ['db', 'valkey'],
    })
    .addDaemon('sidekiq', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'sidekiq' },
        sdk.Mounts.of(),
        'sidekiq-sub',
      ),
      exec: {
        command: ['bundle', 'exec', 'sidekiq'],
        env: {
          PUBLIC_POOL_HOST: publicPoolHost,
          PUBLIC_POOL_PORT: String(publicPoolPort),
          RAILS_MASTER_KEY: masterKey,
          REDIS_URL: redisUrl,
          DATABASE_URL: databaseUrl,
          DONATE_BTC_ADDRESS: donateBtcAddress,
          DONATE_LN_ADDRESS: donateLnAddress,
        },
      },
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('Sidekiq is running'),
            errorMessage: i18n('Sidekiq is not running'),
          }),
      },
      requires: ['db', 'valkey', 'public-pool-web'],
    })
})
