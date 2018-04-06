var utils = require('./utils');
var _ = require('lodash');
var la = require('lazy-ass')
var is = require('check-more-types');
var join = require('path').join;
var isSupportedVersionFormat = require('./is-supported-version-format');

function checkTopLevelNpmDependencies(folder, verbose) {
  la(is.unemptyString(folder), 'missing folder string');
  var filename = join(folder, 'package.json');

  return require('./check-npm-file')(filename, verbose);
}

module.exports = checkTopLevelNpmDependencies;
