import { DynamicModule, Global, Module, OnApplicationShutdown, Provider } from '@nestjs/common'
import {
  ClientsModule,
  Transport,
  ClientsModuleOptions,
  ClientsModuleAsyncOptions,
} from '@nestjs/microservices'

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
        exports: [ClientsModule, params.serviceName],
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

  static registerAsync(options: ClientsModuleAsyncOptions[]): DynamicModule {
    return {
      module: KafkaClientModule,
      imports: [...options.map(opt => ClientsModule.registerAsync(opt))],
      exports: [ClientsModule],
    }
  }
}
