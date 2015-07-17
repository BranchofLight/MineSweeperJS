module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ',',
      },
      dist: {
        src: ['src/*.js'],
        dest: 'dist/debug.js',
      },
    },
    watch: {
      files: ['src/*.js'],
      tasks: ['concat'],
    },
    jshint: {
      src: ['Gruntfile.js'],
      beforeconcat: ['src/*.js'],
      afterconcat: ['dist/debug.js'],
    },
    uglify: {
      my_target: {
        files: {
          'dist/release.js': ['src/*.js']
        }
      }
    }
  });

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Load the plugin that provides the "watch" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'jshint']);
  // Non-default task(s)
  grunt.registerTask('wat', ['watch']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('cat', ['concat']);
  grunt.registerTask('ugly', ['uglify']);
};
