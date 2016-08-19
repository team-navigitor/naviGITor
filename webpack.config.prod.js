const webpack = require('webpack');

module.exports = {
	output:{
	  path: './build',
	  publicPath: './build',
	  filename: 'bundle.js'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
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