const webpack = require('webpack');

module.exports = {
	devtool: 'inline-source-map',
	entry: "./src/app.js",
	output:{
	  path: './build',
	  publicPath: './build',
	  filename: 'bundle.js'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.ExternalsPlugin('commonjs', [
            'desktop-capturer',
            'electron',
            'ipc',
            'ipc-renderer',
            'native-image',
            'remote',
            'web-frame',
            'clipboard',
            'crash-reporter',
            'screen',
            'shell'
        ]),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|server.js)/,
				loader: 'babel',
				query: {
          presets: ['react', 'es2015']
        }
			},
			{
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!sass-loader'
      }
		]
	}
};