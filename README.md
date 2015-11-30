# deps-ok

Fast checking of top level NPM and Bower dependencies based on version numbers.

[![NPM info][nodei.co]](https://npmjs.org/package/deps-ok)

[![Build status][ci-image]][ci-url]
[![dependencies][dependencies-image]][dependencies-url]
[![devdependencies][deps-ok-devdependencies-image] ][deps-ok-devdependencies-url]
[![manpm](https://img.shields.io/badge/manpm-%E2%9C%93-3399ff.svg)](https://github.com/bahmutov/manpm)
[![semantic-release][semantic-image] ][semantic-url]

See [grunt-deps-ok](https://github.com/bahmutov/grunt-deps-ok) for
integrating this task into grunt pipeline.

## Install

Install as a global tool

    npm install -g deps-ok

Install as a project's dependency

    npm install --save-dev deps-ok

## Use as a global tool

Checks modules until the first module without valid install.
Prints first found error and exits with code 1 if one of the
top level dependencies is missing or out of date.

    // from the package's root folder execute
    deps-ok

    deps-ok --verbose
    // prints declared and installed version numbers

    deps-ok --filename path/to/package.json
    // checks give package.json (not in this folder)

Checks both dependencies listed in your *package.json* and *bower.json*

If **deps-ok** finds a problem, then run `npm install` or `bower install`

## Use as 3<sup>rd</sup> party module

You can use **deps-ok** from another module

```javascript
npm install deps-ok --save
var depsOk = require('deps-ok');
var ok = depsOk(process.cwd(), false /* verbose */);
```

## Use with gulp

If you prefer using [gulp](), you can quickly just add a task

```js
gulp.task('deps-ok', function () {
  var gutil = require('gulp-util');
  var depsOk = require('deps-ok');
  var ok = depsOk(process.cwd(), false /* verbose */);
  if (!ok) {
    gulp.emit('error', new gutil.PluginError('deps-ok', 'Found outdated installs'));
  }
});
gulp.task('default', ['deps-ok', ...]);
```

## Small print

Author: Gleb Bahmutov &copy; 2013

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet / open issue on Github

[ci-image]: https://travis-ci.org/bahmutov/deps-ok.png?branch=master
[ci-url]: https://travis-ci.org/bahmutov/deps-ok
[nodei.co]: https://nodei.co/npm/deps-ok.png?downloads=true
[dependencies-image]: https://david-dm.org/bahmutov/deps-ok.png
[dependencies-url]: https://david-dm.org/bahmutov/deps-ok
[deps-ok-devdependencies-image]: https://david-dm.org/bahmutov/deps-ok/dev-status.png
[deps-ok-devdependencies-url]: https://david-dm.org/bahmutov/deps-ok#info=devDependencies
[endorse-image]: https://api.coderwall.com/bahmutov/endorsecount.png
[endorse-url]: https://coderwall.com/bahmutov
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
