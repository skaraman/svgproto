const path = require('path')
const WorkerPlugin = require('worker-plugin')
const aliases = {
  svg: 'src/assets/svg',
  components: 'src/components',
  scenes: 'src/scenes',
  data: 'src/assets/data',
  util: 'src/utilities'
}

function setAliases(config) {
  for (let idx in aliases) {
    config.resolve.alias[idx] = path.resolve(__dirname, aliases[idx])
  }
}
export default function (config, env, helpers) {
  setAliases(config)
  config.plugins.push(new WorkerPlugin)
  config.module.rules[4].include.push(path.resolve(__dirname, 'src/scenes'))
  config.module.rules[5].exclude.push(path.resolve(__dirname, 'src/scenes'))
}
