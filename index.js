#!/usr/bin/env node

var argv = require('optimist').argv;
var utils = require('./src/utils');

var _ = require('lodash');
var verify = require('check-types').verify;
var isUrl = require('npm-utils').isUrl;

var checkPackage = require('./src/check-npm-package');

if (!module.parent) {
  var verbose = argv.verbose;
  var ok = checkPackage(process.cwd(), verbose);
  process.exit(ok ? 0 : 1);
  return;
}

module.exports = checkPackage;
