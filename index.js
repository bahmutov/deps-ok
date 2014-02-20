#!/usr/bin/env node

var argv = require('optimist').argv;
var check = require('./src/check-folder');

if (!module.parent) {
  if (argv.version) {
    var pkg = require('./package.json');
    console.log(pkg.name, pkg.version);
    process.exit(0);
    return;
  }
  var verbose = argv.verbose;
  var ok = check(process.cwd(), verbose);
  process.exit(ok ? 0 : 1);
  return;
}

module.exports = check;
