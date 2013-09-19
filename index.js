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
    check.verifyString(declaredVersion, 'missing declared version for ' + dep);
    declaredVersion = utils.cleanVersion(declaredVersion);
    check.verifyString(declaredVersion, 'could not clean up version ' + deps[dep]);

    var folder = path.join(process.cwd(), 'node_modules', dep);
    var installedDep = utils.getPackage(folder);

    if (!installedDep) {
      console.error('ERROR: cannot find module', dep);
      return true;
    }
    var installedVersion = installedDep.version;
    if (!_.isString(installedVersion)) {
      console.error('ERROR: cannot version for module', dep);
      return true;
    }
    installedVersion = utils.cleanVersion(installedVersion);
    if (!semver.valid(installedVersion)) {
      console.error('ERROR: invalid version', installedVersion, 'for module', dep);
      return true;
    }

    // console.log('comparing', installedVersion, 'with needed', declaredVersion);
    if (semver.lt(installedVersion, declaredVersion)) {
      console.error('ERROR:', dep, declaredVersion,
        'needed, but found', installedVersion);
      return true;
    }

    return false;
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