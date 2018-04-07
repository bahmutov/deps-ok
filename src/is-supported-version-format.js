var is = require('check-more-types')
var la = require('lazy-ass')

var gitAt = /^git@/
var startsWithPrefix = /^(git|github|file):/

function gitUrl (thing) {
  return is.unemptyString(thing) && /^git\+(ssh|https?):\/\/.+/.test(thing)
}

function isGitAtVersion (str) {
  return gitAt.test(str)
}

function isVersionKeyword (str) {
  return str === '*' || str === 'latest'
}

function isPrefixed (str) {
  return startsWithPrefix.test(str)
}

function isSupportedVersionFormat (version) {
  la(is.unemptyString(version), 'expected version string')

  return !is.webUrl(version) &&
    !gitUrl(version) &&
    !isGitAtVersion(version) &&
    !isVersionKeyword(version) &&
    !isPrefixed(version)
}

module.exports = isSupportedVersionFormat
