import { ConfigModule, ConfigService } from '@libs/config'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { CryptoModule } from '@lib/crypto'
import { RefreshTokenService } from './refresh-token.service'
import type { TokensJwtEnvsModel } from '@lib/tokens/model/jwt.envs.model'

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: ({ env }: ConfigService<TokensJwtEnvsModel>) => {
        return {
          secret: env.REFRESH_SECRET_KEY,
          signOptions: {
            expiresIn: env.REFRESH_EXPIRATION_TIME,
          },
        }
      },
    }),
    CryptoModule,
  ],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
