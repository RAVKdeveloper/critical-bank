const { execSync } = require('node:child_process')

execSync(
  `migrate --migrations-dir=\"./libs/mongo-repo/src/migrations\" --compiler=\"ts:./libs/mongo-repo/src/migrations-utils/ts-compiler.js\" --store=\"./libs/mongo-repo/src/migrations-utils/storage.js\" down`,
  {
    stdio: 'inherit',
    encoding: 'utf-8',
  },
)
