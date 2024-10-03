import { DeepReadonly } from '@libs/core'
import { Inject, Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'
import { parse } from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

import { ConfigOptions } from './config.model'

@Injectable()
export class ConfigService<T extends object> {
  public readonly isDev: boolean
  public readonly env: DeepReadonly<T>

  constructor(@Inject('CONFIG_OPTIONS') private options: ConfigOptions<T>) {
    const isDev = process.env.NODE_ENV === 'development'
    const devEnvPath = join(process.cwd(), `${process.env['APP']}.env`)
    const env = isDev ? parse(readFileSync(devEnvPath)) : (process.env as Partial<T>)
    const config = plainToClass(options.dto, env) as Record<string, unknown>
    const envValidation = validateSync(config)
    if (envValidation.length > 0) {
      throw new Error(
        `Error while parsing configuration` +
          `${envValidation}\nActual env:\n${JSON.stringify(env, null, 4)}`,
      )
    }

    this.isDev = isDev
    this.env = config as T
  }
}
