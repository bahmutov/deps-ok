var check = require('check-types');
var verify = check.verify;

var gitAt = /^git@/;
var startsWithPrefix = /^(git|github|file):/;

function isGitAtVersion(str) {
  return gitAt.test(str);
}

function isVersionKeyword(str) {
  return str === '*' || str === 'latest';
}

function isPrefixed(str) {
  return startsWithPrefix.test(str);
}

function isSupportedVersionFormat(version) {
  verify.unemptyString(version, 'expected version string');

  return !check.webUrl(version) &&
    !check.gitUrl(version) &&
    !isGitAtVersion(version) &&
    !isVersionKeyword(version) &&
    !isPrefixed(version);
}

module.exports = isSupportedVersionFormat;
