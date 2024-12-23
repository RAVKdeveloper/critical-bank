import { Decimal } from 'decimal.js'
import { Web3Address } from '../common'

export interface SendTokenDto {
  readonly tokenAddress: Web3Address
  readonly abi: any
  readonly tokenName: string
  readonly privateKey: string
  readonly toAddress: Web3Address
  readonly amount: Decimal
  readonly addressFrom: Web3Address
}

export interface ResponseSendTokenDto {
  readonly txHash: string
  readonly tokenName: string
  readonly addressFrom: Web3Address
  readonly addressTo: Web3Address
  readonly fee: Decimal
  readonly amount: Decimal
}
