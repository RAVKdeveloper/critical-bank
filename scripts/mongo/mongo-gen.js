const { execSync } = require('node:child_process')

execSync(
  `migrate create --template-file ./libs/mongo-repo/src/migrations-utils/template.ts --migrations-dir=\"./libs/mongo-repo/src/migrations\" --compiler=\"ts:./libs/mongo-repo/src/migrations-utils/ts-compiler.js\"`,
  {
    stdio: 'inherit',
    encoding: 'utf-8',
  },
)
