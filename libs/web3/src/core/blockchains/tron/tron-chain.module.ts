import { Module } from '@nestjs/common'

import { ConfigModule } from '@libs/config'

import { TronChainService } from './tron-chain.service'

@Module({
  imports: [ConfigModule],
  providers: [TronChainService],
  exports: [TronChainService],
})
export class TronChainModule {}
