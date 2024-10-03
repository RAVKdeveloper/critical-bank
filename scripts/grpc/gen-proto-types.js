const { execSync } = require('node:child_process')

const protoPath = process.argv[2]
execSync(
  `protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./libs/grpc-types/src --ts_proto_opt=nestJs=true ./proto/${protoPath}`,
  {
    stdio: 'inherit',
    encoding: 'utf-8',
  },
)
