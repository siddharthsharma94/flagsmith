// webpack.config.dev.js
const webpack = require('webpack');

module.exports = {
    plugins: require('./plugins').concat([
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(true),
        }),
    ]),
    module: {
        rules: require('./loaders')
            .concat([]),
    },
};
