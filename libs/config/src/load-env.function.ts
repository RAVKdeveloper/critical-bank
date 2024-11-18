import { config, parse } from 'dotenv'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'

export function loadEnvironment<TEnv>(ConfigModel: new () => TEnv) {
  const isDev = process.env.NODE_ENV === 'development'
  const includeInApp = process.env['ENV_FILE_PATH'] ?? ''
  const devEnvPath = join(process.cwd(), includeInApp, `${process.env['APP']}.env`)
  const env = isDev ? parse(readFileSync(devEnvPath)) : (process.env as Partial<TEnv>)
  const config = plainToClass(ConfigModel, env) as Record<string, unknown>
  const envValidation = validateSync(config)
  if (envValidation.length > 0) {
    throw new Error(
      `Error while parsing configuration` +
        `${envValidation}\nActual env:\n${JSON.stringify(env, null, 4)}`,
    )
  }

  return config as TEnv
}
