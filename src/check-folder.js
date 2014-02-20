var verify = require('check-types').verify;
var checkNpm = require('./check-npm-package');

function checkDependenciesInFolder(folder, verbose) {
  verify.unemptyString(folder, 'missing folder string');
  if (!checkNpm(folder, verbose)) {
    return false;
  }

  return true;
}

module.exports = checkDependenciesInFolder;
