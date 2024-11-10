import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { ClientsModule, Transport, ClientsModuleOptions } from '@nestjs/microservices'

import type { KafkaModuleParams } from './dto/kafka-params.dto'

@Global()
@Module({})
export class KafkaClientModule {
  static register(params: KafkaModuleParams | KafkaModuleParams[]): DynamicModule {
    if (!Array.isArray(params)) {
      return {
        module: KafkaClientModule,
        imports: [
          ClientsModule.register([
            {
              name: params.serviceName,
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: params.clientId,
                  brokers: params.brokers,
                },
                consumer: {
                  groupId: params.groupId,
                },
              },
            },
          ]),
        ],
        exports: [ClientsModule],
      }
    } else {
      const clients = params.map(param => ({
        name: param.serviceName,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: param.clientId,
            brokers: param.brokers,
          },
          consumer: {
            groupId: param.groupId,
          },
        },
      }))

      return {
        module: KafkaClientModule,
        imports: [ClientsModule.register(clients as ClientsModuleOptions)],
        exports: [ClientsModule],
      }
    }
  }

  static registerAsync(params: {
    useFactory: (...args: any[]) => Promise<KafkaModuleParams> | KafkaModuleParams
    inject?: any[]
  }): DynamicModule {
    const asyncProviders = this.createAsyncProvider(params)

    return {
      module: KafkaClientModule,
      imports: [ClientsModule],
      providers: asyncProviders,
      exports: [ClientsModule],
    }
  }

  private static createAsyncProvider(params: {
    useFactory: (...args: any[]) => Promise<KafkaModuleParams> | KafkaModuleParams
    inject?: any[]
  }): Provider[] {
    return [
      {
        provide: 'KAFKA_MODULE_PARAMS',
        useFactory: params.useFactory,
        inject: params.inject || [],
      },
      {
        provide: 'KAFKA_MODULE_PARAMS',
        useFactory: async (kafkaParams: KafkaModuleParams) => {
          return [
            {
              name: kafkaParams.serviceName,
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: kafkaParams.clientId,
                  brokers: kafkaParams.brokers,
                },
                consumer: {
                  groupId: kafkaParams.groupId,
                },
              },
            },
          ]
        },
        inject: ['KAFKA_MODULE_PARAMS'],
      },
    ]
  }
}
