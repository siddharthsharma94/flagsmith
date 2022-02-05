const webpack = require('webpack');

module.exports = [
    new webpack.DefinePlugin(require('../env/environment-variables')),
];
