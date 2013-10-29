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
  var properties = [
    'dependencies', 'devDependencies', 'peerDependencies'
  ];
  properties.forEach(function (name) {
    if (!pkg[name]) {
      return;
    }

    var common = _.intersection(_.keys(deps), _.keys(pkg[name]));
    if (common.length) {
      throw new Error('duplicate properties found: ' + common);
    }
    deps = _.extend(deps, pkg[name]);
  });
  return deps;
}

function cleanVersion(version) {
  check.verify.string(version, 'expecting version string');

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
  check.verify.string(version, 'missing declared version for ' + dep);

  var declaredVersion = cleanVersion(version);
  check.verify.string(declaredVersion, 'could not clean up version ' + version);

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
