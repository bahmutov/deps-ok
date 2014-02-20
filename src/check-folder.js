var verify = require('check-types').verify;
var checkNpm = require('./check-npm-package');
var join = require('path').join;
var exists = require('fs').existsSync;

function checkDependenciesInFolder(folder, verbose) {
  verify.unemptyString(folder, 'missing folder string');

  var packageFilename = join(folder, 'package.json');
  if (exists(packageFilename)) {
    if (!checkNpm(folder, verbose)) {
      return false;
    }
  }

  return true;
}

module.exports = checkDependenciesInFolder;
