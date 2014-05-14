var utils = require('./utils');
var _ = require('lodash');
var check = require('check-types');
var verify = check.verify;
var join = require('path').join;
var isSupportedVersionFormat = require('./is-supported-version-format');

function checkTopLevelNpmDependencies(folder, verbose) {
  verify.unemptyString(folder, 'missing folder string');

  var filename = join(process.cwd(), 'package.json');
  var pkg = utils.getPackage(filename);
  var deps = utils.getAllDependencies(pkg);

  if (verbose) {
    console.log(pkg.name + ' declares:\n' +
      JSON.stringify(deps, null, 2));
  }

  var ok = true;
  _.forOwn(deps, function (declaredVersion, dep) {
    if (!isSupportedVersionFormat(declaredVersion)) {
      console.log('skipping git url', declaredVersion);
      return;
    }
    ok = ok && utils.checkNpmDependency(dep, declaredVersion, verbose);
  });

  return ok;
}

module.exports = checkTopLevelNpmDependencies;
