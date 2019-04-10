const path = require('path');

export default function (config, env, helpers) {
    config.resolve.alias['svg'] = path.resolve(__dirname, 'src/assets/svg');
    config.resolve.alias['components'] = path.resolve(__dirname, 'src/components/');
}
