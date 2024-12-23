import { Decimal } from 'decimal.js'
import { Web3Address } from '../common'

export interface GetBalanceDto {
  readonly address: Web3Address
}

export interface ResponseGetBalance {
  readonly balance: Decimal
}
