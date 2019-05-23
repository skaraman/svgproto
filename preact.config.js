const path = require('path')
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
  //console.log(config.module.loaders);
  // config.output.libraryExport = 'default'
  // console.log(config.output)
  config.module.loaders[4].include.push(path.resolve(__dirname, 'src/scenes'))
  config.module.loaders[5].exclude.push(path.resolve(__dirname, 'src/scenes'))
}