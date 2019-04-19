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


    console.log(config.module.loaders);
    // config.module.loaders.push({
    //     test: /\.css$/,
    //     loader: 'style-loader',
    // });
    // // modify css loaders
    // helpers.getLoadersByName(config, 'postcss-loader').forEach(({ loader }) => {
    //     loader.options = {
    //         config: {
    //             path: rootDir('library/styles/postcss.config.js')
    //         }
    //     };
    // });
}
//

// "postcss-apply": "^0.12.0",
// "postcss-import": "^12.0.1",
// "postcss-mixins": "^6.2.0",
// "postcss-preset-env": "^5.1.0",


// const pkg = require('../../package.json');
// const cssVariables = require('./variables.js');
// const cssSets = require('./apply.js');
// const breakpoints = require('./breakpoints.js');
//
// module.exports = {
// 	plugins: {
// 		'postcss-import': {},
// 		'postcss-apply': {
// 			variables: cssVariables,
// 			sets: cssSets
// 		},
// 		'postcss-mixins': {
// 			mixins: {
// 				grid(mixin, gutterWidth) {
// 					return {
// 						width: '100%',
// 						padding: 'calc(' + gutterWidth + ')'
// 					};
// 				},
// 				row(mixin, gutterWidth) {
// 					return {
// 						display: 'flex',
// 						margin: '0 calc(0 - ' + gutterWidth + ' / 2)'
// 					};
// 				},
// 				col(mixin, gutterWidth, tiles) {
// 					return {
// 						padding: 'calc(' + gutterWidth + ' / 2)',
// 						width: 'calc(100% / ' + tiles + ')'
// 					};
// 				}
// 			}
// 		},
// 		'postcss-preset-env': {
// 			stage: 0,
// 			browsers: pkg.browserslist,
// 			features: {
// 				'custom-properties': {
// 					preserve: false,
// 					variables: cssVariables
// 				},
// 				'custom-media-queries': {
// 					extensions: breakpoints.generateMediaQuery()
// 				}
// 			}
// 		}
// 	}
// };


// module.exports = {
// 	storeItemAppearAnimationDuration: '480ms',
// 	storeItemAppearAnimationDelay: '120ms',
// 	categoryChangeAnimationDuration: '600ms',
//
// 	/* Pogo 2 Colors */
// 	shamrockBorder: '#50E3C2',
// 	shamrockGreen: '#2CCFAA',
// 	shamrockGreenActive: '#47C2B0',
// 	astronautBlue: '#263C6C',
// 	mirageBlue: '#191F2E',
// 	sailBlue: '#B1DFF5',
// 	aliceBlue: '#F0FAFF',
// 	sorbusOrange: '#FD8805',
// 	carnationRed: '#F44B51',
// 	malachiteGreen: '#0AC44A',
// 	yellowExtraLight: '#FFF5A0',
// 	pinkLight: '#FFCBCB',
// 	greyBlue: '#A0C5D7',
// 	hotPink: '#FF6FCA',
//
// 	/* Colors */
// 	black: '#000',
// 	grayDark: '#577079',
// 	grayMedium: '#6F929F',
// 	grayLight: '#8BA2AA',
// 	grayExtraLight: '#F0F3F8',
// 	white: '#FFF',
// 	white74: 'rgba(255, 255, 255, 0.74)',
// 	ceriseRed: '#DC3B4F',
// 	carnation: '#F15266',
// 	persimmon: '#FF5858',
// 	sunsetOrange: '#FF5252',
// 	brownOrange: '#BD6401',
// 	internationalOrange: '#FE5704',
// 	californiaOrange: '#FD9A05',
// 	goldenTainoi: '#FFCF55',
// 	yellowDark: '#E8BD24',
// 	yellow: '#FFD600',
// 	yellowLight: '#FCE051',
// 	greenMedium: '#09D74F',
// 	greenDark: '#09BB46',
// 	green: '#0AD750',
// 	caribbeanGreen: '#0ED99F',
// 	blueExtraDark: '#0A2E40',
// 	blueDark: '#024262',
// 	blueLight: '#A0DFFE',
// 	blueLight60: 'rgba(160, 223, 254, 0.6)',
// 	marinerBlue: '#2C69D5',
// 	lochmara: '#0A82D1',
// 	easternBlue: '#1888B6',
// 	bahamaBlue: '#076FA2',
// 	malibu: '#48DBFD',
// 	ceruleanDark: '#06A1CF',
// 	cerulean: '#08BAEA',
// 	ceruleanLight: '#36D5FF',
// 	cerulean40: 'rgba(8, 186, 234, 0.4)',
// 	brilliantRose: '#F857A6',
// 	pink: '#FF63AF',
// 	purpleHeart: '#9030E2',
// 	lavenderMagenta: '#E991E4',
//
// 	/* Gradients */
// 	'gradient-easternBlue-bahamaBlue': 'linear-gradient(to top, #1888B6, #076FA2)',
// 	'gradient-persimmon-brilliantRose': 'linear-gradient(162deg, #FF5858, #F857A6)',
// 	'gradient-californiaOrange-internationalOrange': 'linear-gradient(to bottom, #FD9A05, #FE5704)',
// 	'gradient-sunsetOrange-ceriseRed': 'linear-gradient(to bottom, #FF5252, #DC3B4F)',
// 	'gradient-malibu-lochmara': 'linear-gradient(to bottom, #48DBFD, #0A82D1)',
// 	'gradient-goldenTanoi-carnation': 'linear-gradient(to bottom, #FFCF55, #F15266)',
// 	'gradient-lavender-purple': 'linear-gradient(to bottom, #E991E4, #9030E2)',
// 	'gradient-green-blue': 'linear-gradient(to bottom, #0ED99F, #2C69D5)',
// 	'gradient-radial-blue': 'radial-gradient(circle at 51% 49%, rgba(2, 66, 98, 0.88), rgba(9, 46, 65, 0.98))',
// 	'gradient-blue': 'linear-gradient(rgba(6, 28, 38, 0.3), rgba(6, 28, 38, 0.3)), linear-gradient(to bottom, #1888B6, #076FA2)',
//
// 	/* Typography */
// 	'font-family': 'Open Sans, arial, Helvetica Neue, helvetica, sans-serif',
// 	'font-family-condensed': 'Open Sans Condensed, sans-serif, arial, Helvetica Neue, helvetica',
// 	'font-family-roboto': 'Roboto, sans-serif',
// 	'font-family-roboto-condensed': 'Roboto Condensed, sans-serif',
// 	bodyFontSize: '15px',
// 	h1FontSize: '60px',
// 	h2FontSize: '46px',
// 	h3FontSize: '34px',
// 	h4FontSize: '26px',
// 	h5FontSize: '20px',
// 	ctaFontSize: '18px',
// 	labelFontSize: '12px',
// 	semiBold: '600',
// 	bold: '700',
// 	extraBold: '800',
//
// 	/* Grid Spacing */
// 	gridColumnSpacingSmall: '8px',
// 	gridColumnSpacingLarge: '8px',
// 	gridGutterSpacingSmall: '16px',
// 	gridGutterSpacingLarge: '28px',
//
// 	/* Game Blade */
// 	gameBladeHeight: '344px'
// };

// const breakpoints = {
// 	'enhance-small-plus': 360,
// 	'enhance-small-plus-plus': 480,
// 	'enhance-medium-plus': 600,
// 	'enhance-medium-plus-plus': 800,
// 	'enhance-large-plus': 960,
// 	'enhance-xlarge-plus': 1280,
// 	'enhance-xlarge-plus-plus': 1600,
// 	generateMediaQuery: () => {
// 		let objectQuery = {};
// 		Object.entries(breakpoints).map(entry => {
// 			if (typeof entry[1] === 'number') {
// 				objectQuery[entry[0]] = `screen and (width >= ${entry[1]}px)`;
// 			}
// 		});
// 		return objectQuery;
// 	}
// };
//
// module.exports =  breakpoints;

// module.exports = {
// 	ellipsis: {
// 		'text-overflow': 'ellipsis',
// 		'white-space': 'nowrap',
// 		overflow: 'hidden'
// 	},
// 	centerX: {
// 		top: '50%',
// 		transform: 'translate(0, -50%)'
// 	},
// 	centerY: {
// 		left: '50%',
// 		transform: 'translate(-50%, 0)',
// 		margin: '0 auto'
// 	},
// 	center: {
// 		top: '50%',
// 		left: '50%',
// 		transform: 'translate(-50%, -50%)',
// 		margin: '0 auto'
// 	},
// 	cover: {
// 		position: 'absolute',
// 		width: '100%',
// 		height: '100%',
// 		top: '0',
// 		left: '0'
// 	},
// 	forceCover: {
// 		position: 'absolute',
// 		width: '100%',
// 		height: '100%',
// 		top: '0',
// 		left: '0'
// 	},
// 	navigationStyles: `
// 		border-radius: 90%;
// 		&:hover {
// 			background-color: var(--cerulean40);
// 		}
// 		&:active {
// 			background-color: var(--cerulean);
// 		}
// 	`,
// 	buttonStyles: `
// 		color: var(--white);
// 		text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
// 		font-weight: 500;
// 		font-size: 18px;
// 		background-color: rgba(0, 0, 0, 0.35);
// 		border: 1px solid var(--shamrockBorder);
// 		&:hover {
// 			background-color: var(--shamrockGreen);
// 		}
// 		&:active {
// 			background-color: var(--shamrockGreenActive);
// 		}
// 	`
// };
