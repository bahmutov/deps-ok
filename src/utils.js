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

function checkDependency(dep, version, verbose) {
  check.verifyString(version, 'missing declared version for ' + dep);

  var declaredVersion = cleanVersion(version);
  check.verifyString(declaredVersion, 'could not clean up version ' + version);

  var folder = path.join(process.cwd(), 'node_modules', dep);
  var installedDep = getPackage(folder);

  if (!installedDep) {
    console.error('ERROR: cannot find module', dep);
    return false;
  }
  var installedVersion = installedDep.version;
  if (!_.isString(installedVersion)) {
    console.error('ERROR: cannot version for module', dep);
    return false;
  }
  installedVersion = cleanVersion(installedVersion);
  if (!semver.valid(installedVersion)) {
    console.error('ERROR: invalid version', installedVersion, 'for module', dep);
    return false;
  }

  if (verbose) {
    console.log(dep, 'needed', declaredVersion, 'installed', installedVersion);
  }
  if (semver.lt(installedVersion, declaredVersion)) {
    console.error('ERROR:', dep, declaredVersion,
      'needed, but found', installedVersion);
    return false;
  }

  return true;
}

module.exports = {
  checkDependency: checkDependency,
  getPackage: getPackage,
  getAllDependencies: getAllDependencies,
  cleanVersion: cleanVersion
};
