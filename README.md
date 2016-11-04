#gulp-data-uri [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> convert imgs from css to datauri

## Usage

First, install `gulp-data-uri` as a development dependency:

```shell
npm install gulp-data-uri --save-dev
```

Then, add it to your `gulpfile.js`:

```javascript
var data_uri = require('gulp-data-uri');

gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(data_uri())
    .pipe(gulp.dest('build/file.txt'));
});
```

### Options

####base

Type `array`

The `base` option allows you to specify a series of base paths relative to the
location of the `gulpfile.js` to try to find the resource.

Sometimes resources described in the SASS/CSS file being processed do not actually
exist at the location evaluated when the `gulp-data-uri` task is run.

For example, our SASS/CSS might be:

```css
background: url(icons/icon-email.svg)
```

But we might want the path to be evaluated as:

```
./src/css/icons/icon-email.svg
```

In this case, we can use `base` to specify a path which will be

`path to gulpfile` + '/' + `base` + `url`

```javascript
var data_uri = require('gulp-data-uri');

gulp.task('templates', function(){
  gulp.src(['file.css'])
    .pipe(data_uri({
        base: [
            'src/css'
        ],
        exclude: [
            'some-icon.svg'
        ],
        verbose: true
    }))
    .pipe(gulp.dest('build/css/file.css'));
});
```

###exclude

Type `Array`

RegExps of URLs to exclude from conversion into a data URI.


###verbose

Type `boolean`

Do we want messages about the resources processed?

[travis-url]: http://travis-ci.org/lazd/gulp-data-uri
[travis-image]: https://travis-ci.org/versoul/gulp-data-uri.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-data-uri
[npm-image]: https://badge.fury.io/js/gulp-data-uri.png
