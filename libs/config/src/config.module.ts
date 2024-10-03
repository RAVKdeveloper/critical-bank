import { DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
    static register<T extends object>(dto: T): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: 'CONFIG_OPTIONS',
                    useValue: { dto },
                },
                ConfigService,
            ],
            exports: [ConfigService],
        };
    }
}
