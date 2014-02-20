var utils = require('./utils');
var _ = require('lodash');
var check = require('check-types');
var verify = check.verify;

function checkTopLevelNpmDependencies(folder, verbose) {
  verify.unemptyString(folder, 'missing folder string');

  var pkg = utils.getPackage(process.cwd());
  var deps = utils.getAllDependencies(pkg);

  if (verbose) {
    console.log(pkg.name + ' declares:\n' +
      JSON.stringify(deps, null, 2));
  }

  var ok = true;
  _.forOwn(deps, function (declaredVersion, dep) {
    if (check.webUrl(declaredVersion)) {
      console.log('skipping git url', declaredVersion);
      return;
    }
    ok = ok && utils.checkDependency(dep, declaredVersion, verbose);
  });

  return ok;
}

module.exports = checkTopLevelNpmDependencies;
