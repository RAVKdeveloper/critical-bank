import { ConfigModule } from '@libs/config'
import { Module } from '@nestjs/common'

import { EthService } from './eth.service'

@Module({
  imports: [ConfigModule],
  providers: [EthService],
  exports: [EthService],
})
export class EthModule {}
