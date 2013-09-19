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

module.exports = {
  getPackage: getPackage,
  getAllDependencies: getAllDependencies,
  cleanVersion: cleanVersion
};