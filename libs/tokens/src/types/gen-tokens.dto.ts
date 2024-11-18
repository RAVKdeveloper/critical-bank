export interface GenTokensPairDto<T> {
  readonly data: T
}

export interface GenAccessTokenDto<T> {
  readonly data: T
  readonly refreshToken: string
}

export interface GenRefreshTokenDto<T> {
  readonly data: T
}

export interface ReturnTokensPair {
  readonly accessToken: string
  readonly refreshToken: string
}

export interface AccessTokenData<T> {
  readonly data: T
  readonly refreshHash?: string
  readonly isLight: boolean
}

export interface RefreshTokenData<T> {
  readonly data: T
}
