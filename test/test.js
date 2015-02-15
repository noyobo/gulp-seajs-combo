var fs = require( 'fs' ),
    path = require('path');
    gulp = require( 'gulp' ),
    should = require( 'should' ),
    gutil = require( 'gulp-util' ),
    assert = require( 'stream-assert' ),
    handlebars = require( 'gulp-handlebars' ),
    wrap = require( 'gulp-wrap' ),
    seajsCombo = require( '../index' );

describe( 'gulp-seajs-combo', function(){
    describe( 'seajsCombo()', function(){
        // 测试忽略空文件
        it( 'should ignore null file', function( done ){
            gulp.src( 'hello.js' )
                .pipe( seajsCombo() )
                .pipe( assert.length(0) )
                .pipe( assert.end(done) );
        });

        // 测试普通的模块
        it( 'should combo module a & b, no seajs.use', function( done ){
            var moduleA = fs.readFileSync( path.resolve('./test/build/a.js'), 'utf-8' );

            gulp.src( 'src/a.js' )
                .pipe( seajsCombo() )
                .pipe( assert.first(function( data ){
                    data.contents.toString().should.equal( moduleA );
                }))
                .pipe( assert.end(done) );
        });

        // 测试有seajs.use的情况
        it( 'should combo module f, have seajs.use', function( done ){
            var moduleF = fs.readFileSync( path.resolve('./test/build/f.js'), 'utf-8' );

            gulp.src( 'src/f.js' )
                .pipe( seajsCombo() )
                .pipe( assert.first(function( data ){
                    data.contents.toString().should.equal( moduleF );
                }))
                .pipe( assert.end(done) );
        });
    });

    describe( 'options', function(){
        // 测试options.ignore
        it( 'should ignore module e', function( done ){
            var moduleC = fs.readFileSync( path.resolve('./test/build/c.js'), 'utf-8' );

            gulp.src( 'src/c.js' )
                .pipe( seajsCombo({ ignore : ['e'] }) )
                .pipe( assert.first(function( data ){
                    data.contents.toString().should.equal( moduleC );
                }))
                .pipe( assert.end(done) );
        });

        // 测试options.map
        it( 'should use map', function( done ){
            var moduleK = fs.readFileSync( path.resolve('./test/build/k.js'), 'utf-8' );

            gulp.src( 'src/k.js' )
                .pipe( seajsCombo({
                    map : {
                        'test/src/l' : './l'
                    }
                }))
                .pipe( assert.first(function( data ){
                    data.contents.toString().should.equal( moduleK );
                }))
                .pipe( assert.end(done) );
        });

        // 测试options.plugins
        it( 'should use plugins for handlebars tpl', function( done ){
            var moduleK = fs.readFileSync( path.resolve('./test/build/q.js'), 'utf-8' );

            gulp.src( 'src/q.js' )
                .pipe( seajsCombo({
                    plugins : [{
                        ext : [ '.tpl' ],
                        use : [
                            handlebars(),
                            wrap('define(function(){return Handlebars.template(<%= contents %>)});')
                        ]
                    }]
                }))
                .pipe( assert.first(function( data ){
                    data.contents.toString().should.equal( moduleK );
                }))
                .pipe( assert.end(done) );
        });
    });

    describe( 'seajs.config', function(){
        // 测试解析seajs.config中的配置
        it( 'should parse alias & paths & vars in seajs.config', function( done ){
            var moduleM = fs.readFileSync( path.resolve('./test/build/m.js'), 'utf-8' );

            gulp.src( 'src/m.js' )
                .pipe( seajsCombo() )
                .pipe( assert.first(function( data ){
                    data.contents.toString().should.equal( moduleM );
                }))
                .pipe( assert.end(done) );
        });
    });
});