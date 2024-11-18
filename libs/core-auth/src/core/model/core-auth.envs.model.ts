export interface CoreAuthEnvsModel {
  readonly AUTH_REDIS_HOST: string
  readonly AUTH_REDIS_PORT: number
  readonly REFRESH_TOKENS_CACHE_TTL: number
}
