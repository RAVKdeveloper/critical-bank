import { NestFactory } from '@nestjs/core'
import { INestApplication } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { CustomValidationPipe } from '@libs/core'
import { ConfigService } from '@libs/config'

import { AppModule } from './app.module'
import { ConfigModel } from './config/config.model'
import { LokiLogger } from '@lib/loki'

const enableCorsByEnv = (app: INestApplication<unknown>, config: ConfigService<ConfigModel>) => {
  if (process.env['NODE_ENV'] === 'development') {
    app.enableCors({ origin: '*', credentials: true, optionsSuccessStatus: 200 })
  } else {
    app.enableCors({
      origin: config.env.CLIENT_URL ?? '*',
      credentials: true,
      optionsSuccessStatus: 200,
    })
  }
}

const swaggerBuilder = (app: INestApplication<unknown>) => {
  const config = new DocumentBuilder()
    .setTitle('Critical bank')
    .setDescription('Critical bank system api')
    .setVersion('1.0')
    .addCookieAuth('access_token_auth')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get<ConfigService<ConfigModel>>(ConfigService)
  app.useLogger(app.get(LokiLogger))
  app.use(cookieParser())
  app.setGlobalPrefix('api')
  enableCorsByEnv(app, config)
  swaggerBuilder(app)
  app.useGlobalPipes(new CustomValidationPipe())

  await app.listen(config.env.PORT)
}
bootstrap()
