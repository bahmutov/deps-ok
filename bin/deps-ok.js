#!/usr/bin/env node

'use strict'

var argv = require('optimist').argv;
var check = require('..');
var path = require('path');
var FAIL_EXIT_CODE = -1;
var SUCCESS = 0;

function isPackageJson(filename) {
  return /package\.json$/.test(filename);
}

function isBowerJson(filename) {
  return /bower\.json$/.test(filename);
}

if (argv.version) {
  var pkg = require('./package.json');
  console.log(pkg.name, pkg.version);
  process.exit(SUCCESS);
  return;
}

var dir = process.cwd();
if (argv.filename) {
  if (argv.verbose) {
    console.log('checking', argv.filename);
  }
  if (isPackageJson(argv.filename) || isBowerJson(argv.filename)) {
    dir = path.dirname(argv.filename);
  } else {
    dir = argv.filename;
  }
  dir = path.resolve(dir);
}

if (argv.verbose) {
  console.log('checking deps', dir);
}
var ok = check(dir, Boolean(argv.verbose));
process.exit(ok ? SUCCESS : FAIL_EXIT_CODE);
