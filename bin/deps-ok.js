#!/usr/bin/env node

'use strict'

const debug = require('debug')('deps-ok')
const argv = require('minimist')(process.argv.slice(2))
const check = require('..');
const path = require('path');
const FAIL_EXIT_CODE = -1;
const SUCCESS = 0;

debug('arguments %j', argv)

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
  debug('checking file %s', argv.filename)

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

debug('checking dependencies in folder %s', dir)
if (argv.verbose) {
  console.log('checking deps', dir);
}

var ok = check(dir, Boolean(argv.verbose));
process.exit(ok ? SUCCESS : FAIL_EXIT_CODE);
