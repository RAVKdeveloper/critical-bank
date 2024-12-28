import { Module } from '@nestjs/common'
import { ConfigModule as ConfigModuleLib } from '@libs/config'

import { ConfigModel } from './config.model'

@Module({
  imports: [ConfigModuleLib.register(ConfigModel)],
})
export class ConfigModule {}
