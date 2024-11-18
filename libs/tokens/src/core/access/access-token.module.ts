import { ConfigModule, ConfigService } from '@libs/config'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { CryptoModule } from '@lib/crypto'
import { AccessTokenService } from './access-token.service'
import { RefreshTokenModule } from '../refresh/refresh-token.module'
import type { TokensJwtEnvsModel } from '@lib/tokens/model/jwt.envs.model'

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: ({ env }: ConfigService<TokensJwtEnvsModel>) => {
        return {
          secret: env.ACCESS_SECRET_KEY,
          signOptions: {
            expiresIn: env.ACCESS_EXPIRATION_TIME,
          },
        }
      },
    }),
    CryptoModule,
    RefreshTokenModule,
  ],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
