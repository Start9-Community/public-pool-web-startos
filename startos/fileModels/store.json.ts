import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  // Write-once: the cluster is initialized with it, so regenerating makes the
  // existing data unopenable rather than rotating a credential.
  postgresPassword: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.db, subpath: 'store.json' },
  shape,
)
