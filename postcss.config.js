const pkg = require('./package.json')

module.exports = {
	plugins: {
		'postcss-preset-env': {
			stage: 0,
			browsers: pkg.browserslist
		},
		'postcss-hexrgba': require('postcss-hexrgba')
	}
}
