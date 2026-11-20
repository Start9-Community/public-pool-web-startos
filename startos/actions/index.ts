import { sdk } from '../sdk'
import { resetUiPassword } from './resetUiPassword'

export const actions = sdk.Actions.of().addAction(resetUiPassword)
