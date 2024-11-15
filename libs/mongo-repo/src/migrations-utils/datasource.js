/* eslint-disable */

const fs = require('fs')
const path = require('path')
const vm = require('vm')

module.exports = {
  getDatasource: async () => {
    const datasourcePath = path.resolve(process.cwd(), 'mongo.datasource.js')
    const datasource = fs.readFileSync(datasourcePath, 'utf-8')
    const script = new vm.Script(datasource)

    const context = vm.createContext({})
    context.module = {}
    context.__dirname = path.dirname(datasourcePath)
    context.require = function (moduleName) {
      return eval(`require`)(moduleName)
    }.bind({})

    return script.runInContext(context)
  },
}
