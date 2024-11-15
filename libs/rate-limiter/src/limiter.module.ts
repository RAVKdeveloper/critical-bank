import { DynamicModule, Module } from '@nestjs/common';
import { RateLimiterService } from './service/leaky-bucket.service';
import { RateLimiterModuleParams } from './types/module.types';

@Module({})
export class RateLimiterModule {
    public static forRoot(params: RateLimiterModuleParams): DynamicModule {
        return {
            module: RateLimiterModule,
            providers: [
                {
                    provide: 'RATE_LIMIT_CONFIG',
                    useValue: params,
                },
                RateLimiterService,
            ],
            exports: [RateLimiterService],
        };
    }
}
