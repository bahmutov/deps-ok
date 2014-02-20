#!/usr/bin/env node

var argv = require('optimist').argv;
var check = require('./src/check-folder');

if (!module.parent) {
  var verbose = argv.verbose;
  var ok = check(process.cwd(), verbose);
  process.exit(ok ? 0 : 1);
  return;
}

module.exports = check;
