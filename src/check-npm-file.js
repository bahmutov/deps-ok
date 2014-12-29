var utils = require('./utils');
var _ = require('lodash');
var check = require('check-types');
var verify = check.verify;
var path = require('path');
var isSupportedVersionFormat = require('./is-supported-version-format');
var fs = require('fs');

function checkTopLevelNpmDependencies(filename, verbose) {
  verify.unemptyString(filename, 'missing folder string');
  console.assert(fs.existsSync(filename), 'file ' + filename + ' not found');

  var pkg = utils.getPackage(filename);
  var deps = utils.getAllDependencies(pkg);

  if (verbose) {
    console.log(pkg.name + ' declares:\n' +
      JSON.stringify(deps, null, 2));
  }

  var folder = path.dirname(filename);

  var ok = true;
  _.forOwn(deps, function (declaredVersion, dep) {
    if (!isSupportedVersionFormat(declaredVersion)) {
      console.log('skipping invalid version', declaredVersion);
      return;
    }
    ok = ok && utils.checkNpmDependency(folder, dep, declaredVersion, verbose);
  });

  return ok;
}

module.exports = checkTopLevelNpmDependencies;
