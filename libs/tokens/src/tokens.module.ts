import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { ConfigModule, ConfigService } from '@libs/config'
import { CryptoModule } from '@lib/crypto'

import { TokensService } from './core/tokens.service'
import { AccessTokenModule } from './core/access/access-token.module'
import { RefreshTokenModule } from './core/refresh/refresh-token.module'

@Module({
  imports: [ConfigModule, AccessTokenModule, RefreshTokenModule, CryptoModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
