module.exports = function (grunt) {

    var appname = "mercury", webdestination = process.env.CATALINA_HOME + "/webapps/" + appname,
        appname2 = "mercuryangular";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            webapp: ['webapp/js/'+appname+'/**/*.js', '!**/r.js', '!webapp/js/'+appname+'/main-built.js', '!webapp/js/'+appname+'/build.js'],
            webapp: ['webapp/js/'+appname2+'/**/*.js', '!**/r.js', '!webapp/js/'+appname2+'/main-built.js', '!webapp/js/'+appname2+'/build.js']
        },
        jslint: {// configure the task
	    all: {
            src: ['webapp/js/'+appname+'/**/*.js', 'webapp/js/'+appname2+'/**/*.js'],
            exclude: ['**/ignore-*.js', '**/*-min.js', '**/r.js', 'webapp/js/'+appname+'/main-built.js', 'webapp/js/'+appname+'/build.js',
                                                                  'webapp/js/'+appname2+'/main-built.js', 'webapp/js/'+appname2+'/build.js'],
            directives: {// example directives
                browser: true,
                unparam: true,
                todo: true,
                predef: [// array of pre-defined globals
                'jQuery']
            },
            options: {
                jslintXml: 'out/jslint_xml.xml',
                errorsOnly: true, // only display errors
                failOnError: false, // defaults to true
                shebang: true, // ignore shebang lines
                checkstyle: 'out/checkstyle.xml' // write a checkstyle-XML
            }
        }},
        clean:  [webdestination],
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
                src: ['webapp/js/'+appname+'/app.js'], // source files array (supports minimatch)
                dest: 'webapp/js/'+appname+'/', // destination directory or file
                replacements: [{
                    from: 'debug.setLevel(5);', // string replacement
                    to: 'debug.setLevel(0);'
                }]
            },
            loggingon: {
                src: ['webapp/js/'+appname+'/app.js'], // source files array (supports minimatch)
                dest: 'webapp/js/'+appname+'/', // destination directory or file
                replacements: [{
                    from: 'debug.setLevel(0);', // string replacement
                    to: 'debug.setLevel(5);'
                }]
            },
        },
        watch: {
            all: {
                files: ['webapp/**', '!**/*.scss'],
                tasks: ['clean', 'copy']
            },
            css: {
                files: ['webapp/**/*.scss'],
                tasks: ['clean', 'compass', 'copy']
            },
            less: {
                files: ['webapp/**/*.less'],
                tasks: ['clean', 'less', 'copy']
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'webapp/sass',
                    cssDir: 'webapp/css',
                    force: true,
                    clean: false,
                    outputStyle: "compressed",
                    noLineComments: true,
                    raw: 'preferred_syntax = :sass\n' // Use `raw` since it's not directly available
                }
            }
        },
        sloc: {
            main: {
                files: {
                    'webapp/js/mercury': [ '**.js' ]
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: "main",
                    baseUrl: "webapp/js/"+appname,
                    mainConfigFile: "webapp/js/"+appname+"/main.js",
                    out: "webapp/js/"+appname+"/main-built.js",
                    optimize: "uglify2",
                    logLevel: 0,
                    preserveLicenseComments: false
                }
            },
            compile2: {
                options: {
                    name: "main",
                    baseUrl: "webapp/js/"+appname2,
                    mainConfigFile: "webapp/js/"+appname2+"/main.js",
                    out: "webapp/js/"+appname2+"/main-built.js",
                    optimize: "uglify2",
                    logLevel: 0,
                    preserveLicenseComments: false
                }
            }
        },
        less: {
            compile: {
                options: {
                  strictMath: true
                },
                files: {
                  'webapp/css/mercuryangular.css': 'webapp/less/'+appname2+'.less'
                }
            },
            minify: {
                options: {
                    cleancss: true,
                    report: 'min'
                },
                files: {
                    'webapp/css/mercuryangular-min.css': 'webapp/css/'+appname2+'.css'
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sloc');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.option('force', true);

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'jslint', 'copy']);

};
