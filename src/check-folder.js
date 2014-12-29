var verify = require('check-types').verify;
var checkNpm = require('./check-npm-package');
var checkBower = require('./check-bower-file');
var join = require('path').join;
var fs = require('fs');
var exists = fs.existsSync;
var quote = require('quote');

function isFile(path) {
  return exists(path) &&
    fs.statSync(path).isFile();
}

function checkDependenciesInFolder(folder, verbose) {
  verify.unemptyString(folder, 'missing folder string');

  if (isFile(folder)) {
    if (verbose) {
      console.log('assuming file', folder, 'is NPM package');
    }
    return require('./check-npm-file')(folder, verbose);
  }

  var foundFile;
  var packageFilename = join(folder, 'package.json');
  if (exists(packageFilename)) {
    foundFile = true;
    if (!checkNpm(folder, verbose)) {
      return false;
    }
  }

  var bowerFilename = join(folder, 'bower.json');
  if (exists(bowerFilename)) {
    foundFile = true;
    if (!checkBower(folder, bowerFilename, verbose)) {
      return false;
    }
  }

  if (!foundFile) {
    console.error('Cannot find anything to check in', quote(folder));
    return false;
  }

  return true;
}

module.exports = checkDependenciesInFolder;
