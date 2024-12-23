import { MongoRepoEnvsModel } from '@lib/mongo-repo/mongo-repo.model'
import { IsArray, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { arrayTransformer } from '@libs/core'

export class ConfigModel implements MongoRepoEnvsModel {
  @IsString()
  MONGO_URL: string

  @IsString()
  GRPC_APP_URL: string

  @Transform(arrayTransformer)
  @IsArray()
  KAFKA_BROKERS_ARRAY: string[]

  @IsString()
  SECRET_KEY: string

  @IsString()
  DECRYPT_KEY: string
}
