#!/usr/bin/env node

var argv = require('optimist').argv;
var check = require('./src/check-folder');
var path = require('path');

if (!module.parent) {
  if (argv.version) {
    var pkg = require('./package.json');
    console.log(pkg.name, pkg.version);
    process.exit(0);
    return;
  }

  var dir = process.cwd();
  if (argv.filename) {
    if (argv.filename) {
      console.log('checking', argv.filename);
    }
    if (/\.json$/.test(argv.filename)) {
      dir = path.dirname(argv.filename);
    } else {
      dir = argv.filename;
    }
    dir = path.resolve(dir);
  }

  if (argv.verbose) {
    console.log('checking deps in folder', dir);
  }
  var ok = check(dir, Boolean(argv.verbose));
  process.exit(ok ? 0 : 1);
  return;
}

module.exports = check;
