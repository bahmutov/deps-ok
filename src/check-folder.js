var verify = require('check-types').verify;
var checkNpm = require('./check-npm-package');
var checkBower = require('./check-bower-file');
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

  var bowerFilename = join(folder, 'bower.json');
  if (exists(bowerFilename)) {
    if (!checkBower(folder, bowerFilename, verbose)) {
      return false;
    }
  }

  return true;
}

module.exports = checkDependenciesInFolder;
