#!/usr/bin/env node

var _ = require('lodash');
var semver = require('semver');
var check = require('check-types');
var path = require('path');
var fs = require('fs');
var packageFilename = path.join(process.cwd(), 'package.json');
var package = require(packageFilename);

if (!_.isString(package.name)) {
  throw new Error('missing package name inside ' + packageFilename);
}

var deps = {};
if (package.dependencies) {
  deps = _.extend(deps, package.dependencies);
}
if (package.devDependencies) {
  deps = _.extend(deps, package.devDependencies);
}
if (package.peerDependencies) {
  deps = _.extend(deps, package.peerDependencies);
}

function cleanVersion(version) {
  check.verifyString(version, 'expecting version string');

  version = version.trim();
  version = version.replace('~', '');
  var twoDigitVersion = /^\d+\.\d+$/;
  if (twoDigitVersion.test(version)) {
    version += '.0';
  }
  version = semver.clean(version);

  return version;
}

console.log(package.name + ' declares:\n' +
  JSON.stringify(deps, null, 2));

var missing = Object.keys(deps).some(function (dep) {
  var declaredVersion = deps[dep];
  check.verifyString(declaredVersion, 'missing declared version for ' + dep);
  declaredVersion = cleanVersion(declaredVersion);
  check.verifyString(declaredVersion, 'could not clean up version ' + deps[dep]);

  var depPackage = path.join(process.cwd(), 'node_modules', dep, 'package.json');
  // console.log('checking', depPackage);

  if (!fs.existsSync(depPackage)) {
    console.error('cannot find module', dep);
    return true;
  }
  var installedDep = require(depPackage);
  var installedVersion = installedDep.version;
  if (!_.isString(installedVersion)) {
    console.error('cannot version for module', dep);
    return true;
  }
  installedVersion = cleanVersion(installedVersion);
  if (!semver.valid(installedVersion)) {
    console.error('invalid version', installedVersion, 'for module', dep);
    return true;
  }
  // console.log('comparing', installedVersion, 'with needed', declaredVersion);
  if (semver.lt(installedVersion, declaredVersion)) {
    console.error('module', dep, declaredVersion,
      'needed, but found', installedVersion);
    return true;
  }

  return false;
});

if (missing) {
  process.exit(1);
}
// every necessary dependency  is installed
process.exit(0);