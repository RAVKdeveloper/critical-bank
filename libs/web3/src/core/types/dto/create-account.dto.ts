import { Web3Address } from '../common'

export interface Web3ResponseCreateAccountDto {
  readonly mnemonic: string
  readonly privateKey: string
  readonly address: Web3Address
}
