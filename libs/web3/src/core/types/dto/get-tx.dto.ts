import { Decimal } from 'decimal.js'
import { Web3Address } from '../common'

export interface GetTxByHashDto {
  readonly txHash: string
}

export interface ResponseTxByHashDto {
  readonly txHash: string
  readonly addressTo: Web3Address
  readonly addressFrom: Web3Address
  readonly amount: Decimal
  readonly fee: Decimal
  readonly contract?: string
  readonly data?: string
  readonly timestamp?: number
  readonly blockNumber: bigint
}
