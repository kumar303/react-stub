var path = require('path');
var webpack = require('webpack');

var webpackConfig = require('../webpack.config.js');


module.exports = {
  options: webpackConfig,
  dev: {
    // Default to all the options in webpackConfig
  },
  prod: {
    output: {
      path: path.join(__dirname, '../src/dist/'),
      filename: '[name].bundle.min.js',
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({minimize: true}),
    ],
  },
};
