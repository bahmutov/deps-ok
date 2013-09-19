# deps-ok

Fast checking of top level dependencies based on version numbers.

[![NPM info][nodei.co]](https://npmjs.org/package/deps-ok)

[![Build status][ci-image]][ci-url]
[![dependencies][dependencies-image]][dependencies-url]
[![endorse][endorse-image]][endorse-url]

## Problem

Often a project depends on multiple dependencies which can be updated
by different people, sometimes working remotely. The typical workflow is to pull latest code changes and run the build, for example using grunt.

    git pull github master
    grunt
    // cryptic errors

A typical but unsatisfactory solution is to run `npm ls` to see if
the module needs to install / update / uninstall any of its dependencies. This step is slow, taking several seconds for even a small project.

## Solution

I have noticed that in 99% of the time, the problem is missing or out of date top level dependency. Thus there is no need to check everything the way `npm ls` does. Instead **deps-ok** checks if every dependency declared in the *package.json* has the corresponding *node_modules/name/package.json* with the compatible version. The installed package is ok if its version is equal to or larger than the declared version.

## Use

    npm install -g deps-ok
    // from the package's root folder execute
    deps-ok
    // prints error and exits with code 1
    // if one of the top level dependencies
    // is missing or out of date

If **deps-ok** finds a problem, then run `npm install`

## Use as 3<sup>rd</sup> party module

You can use **deps-ok** from another module

```javascript
npm install deps-ok --save
var depsOk = require('deps-ok');
var ok = depsOk(process.cwd(), false /* verbose */);
```

## Small print

Author: Gleb Bahmutov &copy; 2013

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet / open issue on Github

[ci-image]: https://travis-ci.org/bahmutov/deps-ok.png?branch=master
[ci-url]: https://travis-ci.org/bahmutov/deps-ok
[nodei.co]: https://nodei.co/npm/deps-ok.png?downloads=true
[dependencies-image]: https://david-dm.org/bahmutov/deps-ok.png
[dependencies-url]: https://david-dm.org/bahmutov/deps-ok
[endorse-image]: https://api.coderwall.com/bahmutov/endorsecount.png
[endorse-url]: https://coderwall.com/bahmutov
