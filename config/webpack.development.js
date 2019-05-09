// const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const parts = require('./webpack.parts.js');

const devConfig = env => merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.devPlugins(),
    parts.loadCSS(),
    parts.loadImages()
]);

const devCon = env => merge(commonConfig(env), devConfig(env));
module.exports = devCon;