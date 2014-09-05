var check = require('check-types');
var verify = check.verify;

var gitAt = /^git@/;
var startsWithGit = /^git:/;

function isGitVersion(str) {
  return gitAt.test(str) || startsWithGit.test(str);
}

function isSupportedVersionFormat(version) {
  verify.unemptyString(version, 'expected version string');
  return !check.webUrl(version) &&
    !check.gitUrl(version) &&
    !isGitVersion(version);
}

module.exports = isSupportedVersionFormat;
