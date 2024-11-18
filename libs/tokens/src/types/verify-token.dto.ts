export interface ReturnVerifyRefreshToken<T> {
  readonly data: T
}

export interface ReturnVerifyAccessToken<T> extends ReturnVerifyRefreshToken<T> {
  readonly refreshHash?: string
  readonly isLight: boolean
}
