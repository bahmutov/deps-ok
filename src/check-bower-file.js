var utils = require('./utils');
var _ = require('lodash');
var verify = require('check-types').verify;
var isSupportedVersionFormat = require('./is-supported-version-format');

function checkBowerFile(filename, verbose) {
  verify.unemptyString(filename, 'missing bower filename');

  var pkg = require(filename);
  var deps = utils.getAllDependencies(pkg);

  if (verbose) {
    console.log('bower ' + pkg.name + ' declares:\n' +
      JSON.stringify(deps, null, 2));
  }

  var ok = true;
  _.forOwn(deps, function (declaredVersion, dep) {
    if (!isSupportedVersionFormat(declaredVersion)) {
      console.log('skipping git url', declaredVersion);
      return;
    }
    ok = ok && utils.checkBowerDependency(dep, declaredVersion, verbose);
  });

  return ok;
}

module.exports = checkBowerFile;
