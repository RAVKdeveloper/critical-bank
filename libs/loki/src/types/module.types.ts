import { ModuleMetadata, Provider, Type } from '@nestjs/common';

/**
 * Represents the configuration options for the GrafanaModule.
 *
 * @interface GrafanaModuleOptions
 */
export interface GrafanaModuleOptions {
    /**
     * The URL of the Loki instance endpoint.
     */
    lokiEndpoint: string;
}

export interface GrafanaModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useExisting?: Type<GrafanaModuleOptions>;
    useClass?: Type<GrafanaModuleOptions>;
    useFactory?: (...args: Array<any>) => Promise<GrafanaModuleOptions> | GrafanaModuleOptions;
    inject?: Array<any>;
    extraProviders?: Array<Provider>;
}
