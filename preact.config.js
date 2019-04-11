const path = require('path')

const aliases = {
    svg: 'src/assets/svg',
    components: 'src/components',
    routes: 'src/routes',
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
}