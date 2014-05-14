var check = require('check-types');
var verify = check.verify;

var gitAt = /^git@/;

function isGitAt(str) {
  return gitAt.test(str);
}

function isSupportedVersionFormat(version) {
  verify.unemptyString(version, 'expected version string');
  return !check.webUrl(version) &&
    !check.gitUrl(version) &&
    !isGitAt(version);
}

module.exports = isSupportedVersionFormat;
