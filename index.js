#!/usr/bin/env node

var argv = require('optimist').argv;
var utils = require('./src/utils');

var _ = require('lodash');
var semver = require('semver');
var check = require('check-types');
var path = require('path');

function checkTopLevelDependencies(folder, verbose) {
  check.verifyString(folder, 'missing folder string');

  var pkg = utils.getPackage(process.cwd());
  var deps = utils.getAllDependencies(pkg);

  if (verbose) {
    console.log(pkg.name + ' declares:\n' +
      JSON.stringify(deps, null, 2));
  }

  var ok = true;
  _.forOwn(deps, function (declaredVersion, dep) {
    ok = ok && utils.checkDependency(dep, declaredVersion, verbose);
  });

  return ok;
}

if (!module.parent) {
  var verbose = argv.verbose;
  var ok = checkTopLevelDependencies(process.cwd(), verbose);
  if (ok) {
    process.exit(0);
  } else {
    process.exit(1);
  }
  return;
}

module.exports = checkTopLevelDependencies;
