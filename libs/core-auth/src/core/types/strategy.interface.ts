import { JwtToken } from '@libs/core'

export interface Strategy<T extends Record<string, any>> {
  validate: <Payload>(token: JwtToken, params: T) => Promise<Payload>
}
