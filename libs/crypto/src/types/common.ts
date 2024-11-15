export type HashEncoding = 'base58' | 'base64' | 'hex' | 'binary'
export type OtherLibEncoding = 'base58'

export interface ReturnSaltAndPepper {
  readonly salt: string
  readonly pepper: string
}
