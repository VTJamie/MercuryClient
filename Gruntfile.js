module.exports = function (grunt) {

    var webdestination = process.env.CATALINA_BACKBONEJQM_HOME;
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            webapp: ['webapp/js/backbonejqm/**/*.js']
        },
        jslint: {// configure the task
	    all: {
            src: ['webapp/js/backbonejqm/**/*.js'],
            exclude: ['**/ignore-*.js', '**/*-min.js'],
            directives: {// example directives
                browser: true,
                unparam: true,
                todo: true,
                predef: [// array of pre-defined globals
                'jQuery']
            },
            options: {
                // junit: 'out/junit.xml', // write the output to a JUnit XML
                // log: 'out/lint.log',
                jslintXml: 'out/jslint_xml.xml',
                errorsOnly: true, // only display errors
                failOnError: false, // defaults to true
                shebang: true, // ignore shebang lines
                checkstyle: 'out/checkstyle.xml' // write a checkstyle-XML
            }
        }},
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'webapp/',
                    src: ['**'],
                    dest: webdestination + '/',
                    filter: 'isFile'
                  }]
            }
        },
        replace: {
            loggingoff: {
                src: ['webapp/js/backbonejqm/app.js'], // source files array (supports minimatch)
                dest: 'webapp/js/backbonejqm/', // destination directory or file
                replacements: [{
                    from: 'debug.setLevel(5);', // string replacement
                    to: 'debug.setLevel(0);'
                }]
            },
            loggingon: {
                src: ['webapp/js/backbonejqm/app.js'], // source files array (supports minimatch)
                dest: 'webapp/js/backbonejqm/', // destination directory or file
                replacements: [{
                    from: 'debug.setLevel(0);', // string replacement
                    to: 'debug.setLevel(5);'
                }]
            },
        },
        watch: {
            all: {
                files: ['webapp/**', '!**/*.scss'],
                tasks: ['copy']
            },
            css: {
                files: ['webapp/**/*.scss'],
                tasks: ['compass', 'copy']
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'webapp/sass',
                    cssDir: 'webapp/css',
                    force: true,
                    clean: false,
                    outputStyle: "nested",
                    raw: 'preferred_syntax = :sass\n' // Use `raw` since it's not directly available
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'jslint', 'compass', 'replace:loggingoff', 'copy', 'replace:loggingon']);

};
