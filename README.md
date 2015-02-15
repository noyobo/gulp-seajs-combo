# gulp-seajs-combo

[![npm version](http://img.shields.io/npm/v/gulp-seajs-combo.svg)](https://www.npmjs.org/package/gulp-seajs-combo)
[![npm download](http://img.shields.io/npm/dm/gulp-seajs-combo.svg)](https://www.npmjs.org/package/gulp-seajs-combo)
[![Build Status](https://travis-ci.org/noyobo/gulp-seajs-combo.svg)](https://travis-ci.org/noyobo/gulp-seajs-combo)
[![Coverage Status](https://img.shields.io/coveralls/noyobo/gulp-seajs-combo.svg)](https://coveralls.io/r/noyobo/gulp-seajs-combo)

***
> seajs(CMD) Module combo pulgin for gulp

## Install

```
$ npm install --save-dev gulp-seajs-combo
```

## Usage

```
var gulp = require( 'gulp' ),
    seajsCombo = require( 'gulp-seajs-combo' );
    
gulp.task( 'seajscombo', function(){
    return gulp.src( 'src/js/main.js' )
        .pipe( seajsCombo() )
        .pipe( gulp.task('build/js') );
}); 
```

## API

### seajsCombo( options )

Unsupported files are ignored.

### options

#### encoding 

Type : `String`

Default : `utf-8`

#### ignore

Type : `Array`

Ignored module list. e.g. combo module `main`, want ignore dependencies `global` and `common`, configuration ignore list : 

```
ignore : [ 'global', 'common' ]
```

The ignore configuration must is name of the module. 

#### map

When use `seajs.use`, module id is `foo/bar/biz`, but the module file with respect to `gulp.src` path is `./biz.js`, use `map` configuration.

```
map : {
    'foo/bar/biz' : './biz'
}
```

#### plugins

`plugins` for special module. A module need combo Handlebars tpl module, but tpl will compile before combo.

```
var handlebars = require( 'gulp-handlebars' ),
      wrap = require( 'gulp-wrap' );
      
...
plugins : [{
    ext : [ '.tpl' ],
    use : [
        handlebars(),
        wrap('define(function(){return Handlebars.template(<%= contents %>)});')
    ]
}]
```

## Combo rule

Module `a.js` :

```
define(function(){
    var b = require( 'deps/b' );
    return 'a' + ' ' + b;
});
```

Module `b.js` :

```
define(function(){
    return 'b';
});
```

gulp code :

```
gulp.src( 'src/a.js' )
    .pipe( seajsCombo() )
    ...
```

Combo after `a.js` :

```
define('b',function(){
    return 'b';
});
define('a',['b'],function(){
    var b = require( 'b' );
    return 'a' + ' ' + b;
});
```

File `main.js` :

```
seajs.use( 'a' );
```

Gulp code : 

```
gulp.src( 'src/main.js' )
    .pipe( seajsCombo() )
    ...
```

Combo after `main.js` :

```
define('b',function(){
    return 'b';
});
define('a',['b'],function(){
    var b = require( 'b' );
    return 'a' + ' ' + b;
});
seajs.use( 'a' );
```

## Parse `seajs.config`

`gulp-seajs-combo` will parse `alias` `vars` `paths` in `seajs.config`, other configuration is ignored, the configuration value must be a `String`, will ignored variable. see more [seajs.config](https://github.com/seajs/seajs/issues/262). [test/src/m.js](https://github.com/chenmnkken/gulp-seajs-combo/blob/master/test/src/m.js) and [test/build/m.js](https://github.com/chenmnkken/gulp-seajs-combo/blob/master/test/build/m.js) is parse example.

## License

MIT @ [Yiguo Chan](https://github.com/chenmnkken)