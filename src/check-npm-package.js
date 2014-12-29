var utils = require('./utils');
var _ = require('lodash');
var check = require('check-types');
var verify = check.verify;
var join = require('path').join;
var isSupportedVersionFormat = require('./is-supported-version-format');

function checkTopLevelNpmDependencies(folder, verbose) {
  verify.unemptyString(folder, 'missing folder string');
  var filename = join(folder, 'package.json');

  return require('./check-npm-file')(filename, verbose);
}

module.exports = checkTopLevelNpmDependencies;
