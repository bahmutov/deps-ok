var utils = require('./utils')
var _ = require('lodash')
var is = require('check-more-types')
var la = require('lazy-ass')
var isSupportedVersionFormat = require('./is-supported-version-format')

function checkBowerFile (folder, filename, verbose) {
  la(is.unemptyString(folder), 'missing bower folder')
  la(is.unemptyString(filename), 'missing bower filename')

  var pkg = require(filename)
  var deps = utils.getAllDependencies(pkg)

  if (verbose) {
    console.log('bower ' + pkg.name + ' declares:\n' +
      JSON.stringify(deps, null, 2))
  }

  var ok = true
  _.forOwn(deps, function (declaredVersion, dep) {
    if (!isSupportedVersionFormat(declaredVersion)) {
      console.log('skipping git url', declaredVersion)
      return
    }
    ok = ok && utils.checkBowerDependency(folder, dep, declaredVersion, verbose)
  })

  return ok
}

module.exports = checkBowerFile
