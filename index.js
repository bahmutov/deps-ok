#!/usr/bin/env node

var utils = require('./src/utils');

var _ = require('lodash');
var semver = require('semver');
var check = require('check-types');
var path = require('path');

function checkTopLevelDependencies(folder) {
  check.verifyString(folder, 'missing folder string');

  var pkg = utils.getPackage(process.cwd());
  var deps = utils.getAllDependencies(pkg);

  console.log(pkg.name + ' declares:\n' +
    JSON.stringify(deps, null, 2));

  var missing = Object.keys(deps).some(function (dep) {
    var declaredVersion = deps[dep];
    return utils.checkDependency(dep, declaredVersion);
  });

  return !missing;
}

if (!module.parent) {
  var ok = checkTopLevelDependencies(process.cwd());
  if (ok) {
    process.exit(0);
  } else {
    process.exit(1);
  }
  return;
}

module.exports = checkTopLevelDependencies;