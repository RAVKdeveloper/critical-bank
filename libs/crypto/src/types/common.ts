export type HashEncoding = 'base58' | 'base64' | 'hex' | 'binary' | 'utf-8'
export type OtherLibEncoding = 'base58' | 'utf-8'

export interface ReturnSaltAndPepper {
  readonly salt: string
  readonly pepper: string
}
