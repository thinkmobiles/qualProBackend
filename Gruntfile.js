/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        jsdoc : {
            dist : {
                src: ['handlers/**/*.js', 'routes/**/*.js', 'models/**/*.js', 'helpers/**/*.js', 'public/js/collections/**/*.js', 'public/js/dataService.js'],
                options: {
                    destination: 'documentation',
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "config/jsdoc.json"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['jsdoc']);
};
