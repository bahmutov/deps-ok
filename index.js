#!/usr/bin/env node

var _ = require('lodash');
var semver = require('semver');
var check = require('check-types');
var path = require('path');
var fs = require('fs');

function getPackage(folder) {
  var packageFilename = path.join(folder, 'package.json');

  if (!fs.existsSync(packageFilename)) {
    console.error('cannot find file', packageFilename);
    return;
  }

  var pkg = require(packageFilename);
  if (!_.isString(pkg.name)) {
    throw new Error('missing package name inside ' + packageFilename);
  }
  return pkg;
}

function getAllDependencies(pkg) {
  var deps = {};
  if (pkg.dependencies) {
    deps = _.extend(deps, pkg.dependencies);
  }
  if (pkg.devDependencies) {
    deps = _.extend(deps, pkg.devDependencies);
  }
  if (pkg.peerDependencies) {
    deps = _.extend(deps, pkg.peerDependencies);
  }
  return deps;
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

var pkg = getPackage(process.cwd());
var deps = getAllDependencies(pkg);

console.log(pkg.name + ' declares:\n' +
  JSON.stringify(deps, null, 2));

var missing = Object.keys(deps).some(function (dep) {
  var declaredVersion = deps[dep];
  check.verifyString(declaredVersion, 'missing declared version for ' + dep);
  declaredVersion = cleanVersion(declaredVersion);
  check.verifyString(declaredVersion, 'could not clean up version ' + deps[dep]);

  var folder = path.join(process.cwd(), 'node_modules', dep);
  var installedDep = getPackage(folder);

  if (!installedDep) {
    console.error('cannot find module', dep);
    return true;
  }
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