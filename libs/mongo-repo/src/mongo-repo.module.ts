import { Global, Module } from '@nestjs/common'
import { MongoRepoService } from './mongo-repo.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigService } from '@libs/config'
import { MongoRepoEnvsModel } from './mongo-repo.model'
import { NotificationEntity, NotificationSchema } from './schemas'

const entities = [{ name: NotificationEntity.schemaName, schema: NotificationSchema }]

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: { env: MongoRepoEnvsModel }) => {
        return {
          uri: config.env.MONGO_URL,
          ssl: false,
        }
      },
    }),
    MongooseModule.forFeature(entities),
  ],
  providers: [MongoRepoService],
  exports: [MongoRepoService],
})
export class MongoRepoModule {}
