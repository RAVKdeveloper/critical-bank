/* eslint-disable @typescript-eslint/no-var-requires */
const { existsSync } = require('fs')
const { resolve } = require('path')
const { DataSource } = require('typeorm')
const { config } = require('dotenv')

const envFile = resolve(__dirname, 'typeorm.env')
let env
if (existsSync(envFile)) {
  env = config({ path: envFile }).parsed
} else {
  env = structuredClone(process.env)
}

function getConfig() {
  return new DataSource({
    type: 'postgres',
    host: env['DB_HOST'],
    port: +env['DB_PORT'],
    username: env['DB_USERNAME'],
    password: env['DB_PASSWORD'],
    database: env['DB_NAME'],
    migrations: [resolve(__dirname, 'libs/repository/src/migrations/*.js')],
    entities: [resolve(__dirname, 'dist/libs/repository/repository/src/entities/**/*.entity.js')],
    migrationsTableName: 'migrations',
    synchronize: false,
  })
}

module.exports = getConfig()
