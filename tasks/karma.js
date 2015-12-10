var grunt = require('grunt');

module.exports = {
  options: {
    logLevel: grunt.option('log-level') || 'INFO',
  },
  dev: {
    configFile: 'karma.config.js',
    singleRun: false,
    autoWatch: true,
  },
  run: {
    configFile: 'karma.config.js',
  },
};
