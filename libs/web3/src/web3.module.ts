import { Module } from '@nestjs/common'

import { Web3Service } from './core/web3.service'
import { EthModule, SolModule, TronChainModule } from './core/blockchains'

@Module({
  imports: [EthModule, SolModule, TronChainModule],
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module {}
