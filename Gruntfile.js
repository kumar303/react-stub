module.exports = function(grunt) {
  // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
  require('load-grunt-tasks')(grunt);

  var configs = require('load-grunt-configs')(grunt, {
    config: {
      src: 'tasks/*.js',
    },
  });

  grunt.initConfig(configs);

  grunt.registerTask('build', ['clean:dist', 'webpack']);
  grunt.registerTask('lint', 'Run all lint checks',
                     ['eslint', 'csslint:lax']);
  grunt.registerTask('test', 'Run the unit tests and lint checks',
                     ['karma:run', 'lint']);
  grunt.registerTask('watch-test', 'Watches files and runs tests',
                     ['karma:dev']);
};
