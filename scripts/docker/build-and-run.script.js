const { execSync } = require('node:child_process')

const name = process.argv[2]
let isRun = process.argv[3] ?? false

if (isRun && isRun !== '-r') {
  throw new Error('Invalid arg! Expect -r')
}

if (!name) {
  throw new Error('Name is not exist!')
}

const buildStr = `docker build -f ./apps/${name}/docker/${name.toLowerCase()}.Dockerfile -t ravkdeveloper/critical-bank-${name}:latest .`
const runStr = `docker compose -f ./apps/${name}/docker/${name}.docker-compose.yml --env-file ./envs/${name}.env up -d`

execSync(`${buildStr}${isRun ? ` && ${runStr}` : ''}`, {
  stdio: 'inherit',
  encoding: 'utf-8',
})
