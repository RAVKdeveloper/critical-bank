import { ContextTelegramUser } from '../telegram'
import { UUID } from './common'

export interface AppUser<WithTgId = undefined | ContextTelegramUser> {
  readonly id: UUID
  readonly tgUser: WithTgId
}
