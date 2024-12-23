import { ConfigModule } from '@libs/config'
import { Module } from '@nestjs/common'
import { SolService } from './sol.service'

@Module({
  imports: [ConfigModule],
  providers: [SolService],
  exports: [SolService],
})
export class SolModule {}
