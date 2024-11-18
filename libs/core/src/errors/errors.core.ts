export const HTTP_STATUS_ALREADY_REPORT = 208

export type ErrorOptions = {
  payload?: Record<string, unknown>
  message?: string
  status?: number
}

export class BaseError<E> {
  error: E
  status: number
  message?: string
  payload?: Record<string, unknown>

  constructor(error: E, options?: ErrorOptions) {
    this.error = error
    this.payload = options?.payload
    this.message = options?.message
    this.status = options?.status ?? 200
  }

  public toJSON() {
    return JSON.stringify({
      error: this.error,
      message: this.message,
      status: this.status,
      payload: typeof this.payload === 'object' ? JSON.stringify(this.payload) : this.payload,
    })
  }
}

export function isError<T, E, BE extends BaseError<E>>(value: T | BE): value is BE {
  return value instanceof BaseError
}

export function isBaseErrorString(be: BaseError<unknown>): be is BaseError<string> {
  return typeof be.error === 'string'
}
