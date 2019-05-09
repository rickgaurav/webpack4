const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const paths = require('./paths');


const commonConfig = env => merge([{
    entry: ["@babel/polyfill", paths.appJS], // Babel polyfill for regenerator lib. For async/await/yield etc.
    output: {
        pathinfo: true,
        path: paths.public,
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js'
    },
    devtool: "cheap-module-eval-source-map",
    plugins: [
        // new CleanWebpackPlugin([ paths.public ], {
        //     root: paths.root,
        //     verbose: true,
        //     dry: false,
        //     watch: false,
        //     allowExternal: false
        // }),
        new HtmlWebpackPlugin({
            title: 'Singapore MRT',
            filename: 'index.html',
            template: paths.appHtml,
            inject: true, // Places assets at the bottom of body
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new webpack.DefinePlugin({
            'process.env.VERSION': JSON.stringify(env.VERSION),
            'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
        }),

    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude(path) {
                    // exclude: /(node_modules|bower_components)/,
                    return path.match(/node_modules/) || path.match(/bower_components/);
                }
            }   
        ]
    },
}]);

module.exports = commonConfig;