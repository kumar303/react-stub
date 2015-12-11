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
        // See .babelrc for configuration.
        loaders: ['babel'],
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
