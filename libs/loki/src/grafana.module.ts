import { HttpModule } from '@nestjs/axios'
import { DynamicModule, Module, Provider } from '@nestjs/common'
import { GrafanaModuleAsyncOptions, GrafanaModuleOptions } from './types/module.types'
import { LokiService } from './loki.service'
import { LokiHttpExceptionFilter } from './filters/loki.filter'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
})
export class GrafanaModule {
  static forRoot(params: GrafanaModuleOptions): DynamicModule {
    return {
      module: GrafanaModule,
      providers: [
        {
          provide: 'GRAFANA_CONFIG',
          useValue: params,
        },
        LokiService,
        LokiHttpExceptionFilter,
      ],
      exports: [LokiService, LokiHttpExceptionFilter],
    }
  }

  static forRootAsync(options: GrafanaModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options)

    return {
      module: GrafanaModule,
      imports: options.imports || [],
      providers: [
        ...asyncProviders,
        LokiService,
        LokiHttpExceptionFilter,
        ...(options.extraProviders || []),
      ],
      exports: [LokiService, LokiHttpExceptionFilter],
    }
  }

  private static createAsyncProviders(options: GrafanaModuleAsyncOptions): Array<Provider> {
    if (options.useFactory) {
      return [
        {
          provide: 'GRAFANA_CONFIG',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ]
    }

    if (options.useClass) {
      return [
        {
          provide: 'GRAFANA_CONFIG',
          useFactory: async (optionsFactory: GrafanaModuleOptions) => optionsFactory,
          inject: [options.useClass],
        },
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ]
    }

    if (options.useExisting) {
      return [
        {
          provide: 'GRAFANA_CONFIG',
          useFactory: async (optionsFactory: GrafanaModuleOptions) => optionsFactory,
          inject: [options.useExisting],
        },
      ]
    }

    throw new Error('Invalid async options')
  }
}
