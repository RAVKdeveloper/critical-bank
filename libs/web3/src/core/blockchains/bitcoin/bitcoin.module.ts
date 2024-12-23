import { ConfigModule, ConfigService } from '@libs/config'
import { Module } from '@nestjs/common'

@Module({
  imports: [ConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class BitcoinModule {}
