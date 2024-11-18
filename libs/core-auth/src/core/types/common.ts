import type { UUID } from '@libs/core'

export interface BaseAuthUser {
  readonly userId: UUID
}

export interface BaseAuthPayloadToToken {
  readonly userId: UUID
}
