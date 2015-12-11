var path = require('path');
var webpack = require('webpack');

var webpackConfig = require('../webpack.config.js');


module.exports = {
  options: webpackConfig,
  dist: {
    // Default to all the options in webpackConfig
  },
};
