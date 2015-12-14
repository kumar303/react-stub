'use strict';

var merge = require('lodash.merge');
var webpackConfig = require('./webpack.config');

var newWebpackConfig = merge({}, webpackConfig);
// Remove the bits from the shared config
// that we don't want for tests.
delete newWebpackConfig.output;
delete newWebpackConfig.entry;
delete newWebpackConfig.externals;

newWebpackConfig.plugins = [];

// Expose the right kind of source map for tests/loader.js
newWebpackConfig.devtool = 'inline-source-map';

module.exports = function(config) {
  merge(config, {
    basePath: '',
    browsers: ['Firefox'],
    colors: true,
    frameworks: [
      'mocha',
      'chai',
      'sinon',
    ],
    files: [
      'tests/loader.js',
    ],
    preprocessors: {
      'tests/loader.js': ['webpack', 'sourcemap'],
    },
    reporters: ['mocha'],
    plugins: [
      'karma-sinon',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chai',
      'karma-firefox-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    singleRun: true,
    webpack: newWebpackConfig,
    webpackServer: {
      noInfo: true,
    },
  });
};
