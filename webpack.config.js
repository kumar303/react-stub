'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    'react-stub': './src/react-stub/index.js',
  },
  failOnError: true,
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules|bower_components)/,
        test: /\.jsx?$/,
        loaders: [
          'babel?' +
          // es7.objectRestSpread to enable ES7 rest spread operators
          // eg: let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
          'optional[]=es7.objectRestSpread&' +
          'optional[]=es7.classProperties&' +
          // ES2015
          'stage=2'
        ],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'src/',
      'node_modules',
    ],
  },
  stats: {
    // Configure the console output
    colors: true,
    modules: true,
    reasons: true,
  },
  watch: true,
};
