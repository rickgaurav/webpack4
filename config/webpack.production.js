const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const commonConfig = require('./webpack.common');
const parts = require('./webpack.parts');

const prodConfig = env => merge([
	parts.loadCSS({
		env: {
			PLATFORM: 'production'
		}
	}),
	parts.loadImages({
		options: {
			limit: 15000,
			name: "[name].[ext]"
		}
	}),
	{
		optimization: {
			runtimeChunk: 'single',
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					}
				}
			},
			minimizer: [new UglifyJsPlugin()],
		},
		plugins: [
			new OptimizeCssAssetsPlugin(),
			new Visualizer({ filename: './statistics.html' })
		],
	}
]);

const prod = env => merge(commonConfig(env), prodConfig(env));
module.exports = prod;