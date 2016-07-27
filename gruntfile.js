
module.exports = function(grunt) {
    grunt.initConfig({
        DIR: typeof(grunt.option("skin"))!=="undefined" ? grunt.option("skin") : "default",
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                livereload:true
            },
            maps: {
                files: ["skins/<%= DIR %>/maps/**/*"],
                tasks: ["copy:maps"]

            },
            js: {
                files: ["engine/js/**/*.js", "skins/<%= DIR %>/js/**/*.js"],
                tasks: ["buildcodewatched"]
            },

            css: {
                files: ["skins/<%=DIR%>/scss/*.scss","engine/scss/*.scss"],
                tasks: ["clean:css", "copy:css1", "copy:css2","compass:dist"]
            },

            images: {
                files: "skins/<%= DIR %>/images/**/*",
                tasks: ["copy:images"]
            },
            audio: {
                files: "skins/<%= DIR %>/audiobuilt/*.*",
                tasks: ["copy:audio", "copy:audiojson"]
            },

            sprites: {
                files: "skins/<%= DIR %>/sprites/**/*",
                tasks: ["sprite:one", "sprite:two", "sprite:logo","sprite:three"]
            },
            json: {
                files: "skins/<%= DIR %>/json/**/*.*",
                tasks: ["copy:json"]
            },
            fonts: {
                files: "skins/<%= DIR %>/fonts/**/*.*",
                tasks: ["copy:fonts"]
            },
            jade: {
                files: "skins/<%= DIR %>/views/**/*",
                tasks: ["pug"]
            },
            spritesbuilt: {
                files: "skins/<%= DIR %>/spritesbuilt/*.*",
                tasks: ["copy:spritesbuilt", "copy:spritesbuiltjson"]
            },
            video: {
                files: "skins/<%=DIR%>/videos/*.*",
                tasks: ["copy:video"]
            }
        },

        concat: {
            options: {
                separator: '\n\n// *** END OF FILE *** \n\n',
                sourceMap:true,
                banner:"//Files retrieved from <%= DIR %>\n\n"
            },
            dist: {

                src:["tmp/babeled/**/*.js"],
                dest: "dist/<%= DIR %>/js/main.js"
            }
        },
        uglify: {
            options: {
                mangle:{
                    eval:true,
                    preserveComments: false
                },
                compress: {
                    cascade:true,
                    comparisons:true,
                    conditionals:true,
                    dead_code:true,
                    drop_console: true,
                    unused:true,
                },
                sourceMap:false
            },
            all: {
                files: {
                    "dist/<%= DIR %>/js/main.js" : "tmp/babeled/**/*.js"
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: ["tmp"],
                    cssPath: "dist/<%= DIR %>/css"
                }
            }
        },
        pug: {
            main: {
                options: {
                    pretty: true,
                    debug: false
                },
                files: {
                    "dist/<%= DIR %>/index.html": ["skins/<%= DIR %>/views/*.pug"],   //["engine/views/index.jade","skins/<%= DIR %>/views/game.jade","engine/views/endhtml.jade"]
                }
            }
        },
        copy: {
            video: {
                cwd: "skins/<%= DIR %>/videos/",
                src: ["**/*"],
                dest: "dist/<%= DIR %>/videos/",
                expand:true

            },
            images: {
                cwd: "skins/<%= DIR %>/images/",
                src: ["**/*"],
                dest: "dist/<%= DIR %>/images/",
                expand:true
            },

            css2: {
                cwd: "skins/<%= DIR %>/scss/",
                src: ["*.scss"],
                dest: "tmp",
                expand:true

            },
            css1: {
                cwd: "engine/scss/",
                src: ["*.scss"],
                dest: "tmp",
                expand:true

            },
            json: {
                src: ["skins/<%= DIR %>/json/*.json"],
                dest: "dist/<%= DIR %>/json",
                expand:true, flatten:true
            },
            fonts: {
                src: ["skins/<%= DIR %>/fonts/*.*"],
                dest: "dist/<%= DIR %>/fonts",
                expand:true, flatten:true
            },
            none: {},
            audio: {
                src: ["skins/<%= DIR %>/audiobuilt/*.m4a", "skins/<%= DIR %>/audiobuilt/*.mp3"],
                dest: "dist/<%= DIR %>/audio",
                expand:true, flatten:true
            },
            audiojson: {
                src: ["skins/<%= DIR %>/audiobuilt/*.json"],
                dest: "dist/<%= DIR %>/audio",
                expand:true, flatten:true
            },
            spritesbuilt: {
                src: "skins/<%= DIR %>/spritesbuilt/*.png",
                dest: "dist/<%= DIR %>/sprites/",
                expand:true, flatten:true
            },
            spritesbuiltjson: {
                src: "skins/<%= DIR %>/spritesbuilt/json/*.json",
                dest: "dist/<%= DIR %>/json/",
                expand:true, flatten:true
            },
            maps: {
                src: "skins/<%= DIR %>/maps/**/*",
                dest: "dist/<%= DIR %>/maps/",
                expand:true, flatten:true

            }

        },
        clean: {
            images: {
                src:["dist/<%= DIR %>/images/**/*.*"]
            },
            code: {
                src:["dist/<%= DIR %>/js/**/*.*"]
            },
            css: {
                src:["tmp/*.scss"]
            },
            babel: {
                src:["tmp/babeled/"]
            },
            tmp: {
                src:["tmp"]
            },
            deb_package: [
                'tmp',
                'target'
            ]

        },
        babel: {
            options: {
                presets:"es2015",
                sourceMap:true,
                ignore:["engine/js/jquery.js"]
            },

                files: {
                    expand: true,
                    src: ["engine/js/**/*.js", 'skins/<%= DIR %>/js/**/*.js'],
                    dest: "tmp/babeled/",
                    ext: ".js"
                }

        },
        sprite: {
            options: {
                cssFormat:"json",
                padding:2
            },
            one: {
                src:"skins/<%= DIR %>/sprites/one/*",
                dest: grunt.option("spritedirect") ? "dist/<%= DIR %>/sprites/sprites.png" : "skins/<%= DIR %>/spritestmp/sprites.png",
                destCss: grunt.option("spritedirect") ? "dist/<%= DIR %>/json/sprites.json" : "skins/<%= DIR %>/spritesbuilt/json/sprites.json",
                padding:2
            },
            two: {
                src:"skins/<%= DIR %>/sprites/two/*",
                dest: grunt.option("spritedirect") ? "dist/<%= DIR %>/sprites/sprites2.png" : "skins/<%= DIR %>/spritestmp/sprites2.png",
                destCss: grunt.option("spritedirect") ? "dist/<%= DIR %>/json/sprites2.json" : "skins/<%= DIR %>/spritesbuilt/json/sprites2.json",
                padding:2
            },
            three: {
                src:"skins/<%= DIR %>/sprites/three/*",
                dest: grunt.option("spritedirect") ? "dist/<%= DIR %>/sprites/sprites3.png" : "skins/<%= DIR %>/spritestmp/sprites3.png",
                destCss: grunt.option("spritedirect") ? "dist/<%= DIR %>/json/sprites3.json" : "skins/<%= DIR %>/spritesbuilt/json/sprites3.json",
                padding:2
            },

            logo: {
                src:"skins/<%= DIR %>/sprites/logo/*",
                dest: grunt.option("spritedirect") ? "dist/<%= DIR %>/sprites/logo.png" : "skins/<%= DIR %>/spritestmp/logo.png",
                destCss: grunt.option("spritedirect") ? "dist/<%= DIR %>/json/logo.json" : "skins/<%= DIR %>/spritesbuilt/json/logo.json",
                padding:2
            }

        },

        audiosprite: {
            all : {
                output: "skins/<%= DIR %>/audiobuilt/audio",
                files: "skins/<%= DIR %>/audiosource/**/*.wav",
                export: "mp3,m4a",
                bitrate:44,
                channels:2,
                log:"debug",
                ogg_to_oga:false,
            }
        },



    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-audiosprite');


    grunt.registerTask("compasstask",["compass:dist"]);
    grunt.registerTask("buildcodewatched",["newer:babel","concat:dist"]);
    grunt.registerTask("buildcode",["clean:babel","babel",(grunt.option("ugly")) ? "uglify:all" : "concat:dist"]);
    grunt.registerTask("buildall",["copy:maps","copy:audio","copy:audiojson","copy:video","pug","buildcode","clean:css","copy:fonts","copy:css1", "copy:css2","compasstask","copy:json","clean:images","copy:images", "sprite:one","sprite:two","sprite:three","sprite:logo","copy:spritesbuilt","copy:spritesbuiltjson"]);
    grunt.registerTask("audio",["audiosprite:all"])
    grunt.registerTask("sprites",["sprite:one","sprite:two","sprite:three","sprite:logo"]);
    if (!grunt.option("skin")) {
        grunt.registerTask("default",["buildall"]);
    } else {
        grunt.registerTask("default",["buildall","watch"]);

    }
    
};
