const MiniCssExtractPlugin = require("mini-css-extract-plugin");

exports.devServer = ({host, port} = {}) => ({
	devServer: {
		// stats: "errors-only", //What info to display about bundles.
		host, // Host, default to localhost
		port, // Port, default to 3000
		overlay: {  //ows an overlay on browser for errors/warnings while compiling.
			errors: true,
			warning: true
		},
		historyApiFallback: true, // Falls back the app to index.html if a route is not found.
    hot: true, // This adds HotModuleReplacementPlugin plugin automatically. So must be already installed.
    hotOnly: true, // After compilation failures and fixes done to create updated modules, do not refresh the page and apply the updates.
    writeToDisk: true // Write bundles to file system.
	}
});

exports.devPlugins = () => ({
    plugins: [
        // new WriteFilePlugin(), //Writes bundles to file system when wds is running.
        // new webpack.HotModuleReplacementPlugin(), // Enables HMR. devServer.hot: true works only if this plugin is there.
        // new webpack.WatchIgnorePlugin([paths.node_modules]),
        // new webpack.NamedModulesPlugin(),
    ]
});

exports.loadCSS = ({ include, exclude,  env } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          env && env.PLATFORM === 'production' ? MiniCssExtractPlugin.loader: 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ],
  },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,
        use: {
          loader: "url-loader", // Convert resource into base64 URIs. If filesize is > limit size, falls back to file-loader.
          options: {
            outputPath: 'images',
            name: "[name].[ext]"
          }
        },
      },
    ],
  },
});


