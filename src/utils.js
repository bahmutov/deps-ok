var _ = require('lodash');
var semver = require('semver');
var check = require('check-types');
var verify = check.verify;
var join = require('path').join;
var exists = require('fs').existsSync;

function getPackage(packageFilename) {
  verify.unemptyString(packageFilename, 'missing package filename');

  if (!exists(packageFilename)) {
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
  verify.unemptyString(version, 'expecting version string');

  version = version.trim();
  version = version.replace('~', '').replace('^', '');
  var twoDigitVersion = /^\d+\.\d+$/;
  if (twoDigitVersion.test(version)) {
    version += '.0';
  }
  version = semver.clean(version);

  return version;
}

function checkNpmDependency(dep, version, verbose) {
  verify.unemptyString(version, 'missing declared version for ' + dep);

  var filename = join(process.cwd(), 'node_modules', dep, 'package.json');
  var installedDep = getPackage(filename);

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
    console.log(dep, 'needed', version, 'installed', installedVersion);
  }
  if (semver.ltr(installedVersion, version)) {
    console.error('ERROR:', dep, version,
      'needed, but found', installedVersion);
    return false;
  }

  return true;
}

function checkBowerDependency(dep, version, verbose) {
  verify.unemptyString(version, 'missing declared version for ' + dep);

  var folder = join(process.cwd(), 'bower_components', dep);
  if (!exists(folder)) {
    console.error('ERROR: cannot find folder', folder);
    return false;
  }

  var filename;
  filename = join(folder, 'bower.json');
  if (!exists(filename)) {
    // some bower components use bower.json, some component.json
    filename = join(folder, 'component.json');
  }
  if (!exists(filename)) {
    console.error('ERROR: cannot find bower component json file in folder', folder);
    return false;
  }
  var installedDep = getPackage(filename);

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
    console.log(dep, 'needed', version, 'installed', installedVersion);
  }
  if (semver.ltr(installedVersion, version)) {
    console.error('ERROR:', dep, version,
      'needed, but found', installedVersion);
    return false;
  }

  return true;
}

module.exports = {
  checkNpmDependency: checkNpmDependency,
  checkBowerDependency: checkBowerDependency,
  getPackage: getPackage,
  getAllDependencies: getAllDependencies,
  cleanVersion: cleanVersion
};
