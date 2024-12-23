import { Decimal } from 'decimal.js'
import { SupportChains, Web3Address } from '../common'

export interface GetUserTxsDto {
  readonly limit?: number
  readonly address: Web3Address
  readonly offset?: number
}

export interface ResponseTxDto {
  readonly txHash: string
  readonly addressFrom: Web3Address
  readonly addressTo: Web3Address
  readonly amount: Decimal
  readonly timestamp: number
  readonly contract?: string
  readonly network: SupportChains
  readonly fee: Decimal
}

export type ResponseAllUserTxsDto = Array<ResponseTxDto>
