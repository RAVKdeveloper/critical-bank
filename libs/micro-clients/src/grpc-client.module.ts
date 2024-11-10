import { join } from 'path'
import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { ClientsModule, Transport, ClientsModuleOptions } from '@nestjs/microservices'

import type { GrpcModuleParams } from './dto/grpc-params.dto'

@Global()
@Module({})
export class GrpcClientModule {
  static register(params: GrpcModuleParams | GrpcModuleParams[]): DynamicModule {
    if (!Array.isArray(params)) {
      return {
        module: GrpcClientModule,
        imports: [
          ClientsModule.register([
            {
              name: params.serviceName,
              transport: Transport.GRPC,
              options: {
                package: params.package,
                protoPath: join(__dirname, params.protoPath),
                url: params.url,
              },
            },
          ]),
        ],
        exports: [ClientsModule],
      }
    } else {
      const clients = params.map(param => ({
        name: param.serviceName,
        transport: Transport.GRPC,
        options: {
          package: param.package,
          protoPath: join(__dirname, param.protoPath),
          url: param.url,
        },
      }))

      return {
        module: GrpcClientModule,
        imports: [ClientsModule.register(clients as ClientsModuleOptions)],
        exports: [ClientsModule],
      }
    }
  }

  static registerAsync(params: {
    useFactory: (...args: any[]) => Promise<GrpcModuleParams> | GrpcModuleParams
    inject?: any[]
  }): DynamicModule {
    const asyncProviders = this.createAsyncProvider(params)

    return {
      module: GrpcClientModule,
      imports: [ClientsModule],
      providers: asyncProviders,
      exports: [ClientsModule],
    }
  }

  private static createAsyncProvider(params: {
    useFactory: (...args: any[]) => Promise<GrpcModuleParams> | GrpcModuleParams
    inject?: any[]
  }): Provider[] {
    return [
      {
        provide: 'GRPC_MODULE_PARAMS',
        useFactory: params.useFactory,
        inject: params.inject || [],
      },
      {
        provide: 'GRPC_MODULE_PARAMS',
        useFactory: async (params: GrpcModuleParams) => {
          return [
            {
              name: params.serviceName,
              transport: Transport.GRPC,
              options: {
                package: params.package,
                protoPath: join(__dirname, params.protoPath),
                url: params.url,
              },
            },
          ]
        },
        inject: ['GRPC_MODULE_PARAMS'],
      },
    ]
  }
}
