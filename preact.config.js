const path = require('path')
const WorkerPlugin = require('worker-plugin')
const preactCliSvgLoader = require('preact-cli-svg-loader')
const aliases = {
	imgs: 'src/assets/imgs',
	svgs: 'src/assets/svgs',
	data: 'src/assets/data',
	icons: 'src/assets/icons',
	sfx: 'src/assets/sounds/fx',
	music: 'src/assets/sounds/music',
	speech: 'src/assets/sounds/speech',
	components: 'src/components',
	scenes: 'src/scenes',
	util: 'src/utilities'
}

function setAliases(config) {
	config.devtool = 'source-map'
	for (let idx in aliases) {
		config.resolve.alias[idx] = path.resolve(__dirname, aliases[idx])
	}
}

export default function (config, env, helpers) {
	preactCliSvgLoader(config, helpers);
	helpers.getLoadersByName(config, 'postcss-loader').forEach(({ loader }) => {
		loader.options = {
			config: {
				path: path.resolve(__dirname, 'postcss.config.js')
			}
		}
	})
	helpers.getLoadersByName(config, 'glsl-shader-loader').forEach(({ loader }) => {
		loader.rules = [{
			test: '/\.(frag|vert|glsl)$/,'
		}]
		loader.options = {
			config: {
				path: path.resolve(__dirname, 'postcss.config.js')
			}
		}
	})
	setAliases(config)
	config.plugins.push(new WorkerPlugin)
	config.module.rules[4].include.push(path.resolve(__dirname, 'src/scenes'))
	config.module.rules[5].exclude.push(path.resolve(__dirname, 'src/scenes'))
}
