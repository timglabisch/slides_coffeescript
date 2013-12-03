module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            foo: {
                files: {
                    'build/core.js': ['src/**/*.coffee']
                },
                options: {
                    debug: true,
                    transform: ['coffeeify']
                }
            }
        },
        watch: {
            scripts: {
                files: 'src/**/*.coffee',
                tasks: ['default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['browserify']);

}