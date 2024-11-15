const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

const envFile = path.resolve(__dirname, 'envs', 'mongo.env')
let env
if (fs.existsSync(envFile)) {
  env = dotenv.config({ path: envFile }).parsed
} else {
  env = structuredClone(process.env)
}

module.exports = {
  MONGO_URL: env['MONGO_URL'],
}
