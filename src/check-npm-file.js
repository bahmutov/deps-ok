'use strict'

const debug = require('debug')('deps-ok')
var utils = require('./utils')
var _ = require('lodash')
var is = require('check-more-types')
var la = require('lazy-ass')
var path = require('path')
var isSupportedVersionFormat = require('./is-supported-version-format')
var fs = require('fs')

function checkTopLevelNpmDependencies (filename, options) {
  la(is.unemptyString(filename), 'missing folder string')
  la(is.object(options), 'missing options', options)

  const verbose = options.verbose

  console.assert(fs.existsSync(filename), 'file ' + filename + ' not found')

  var pkg = utils.getPackage(filename)
  var deps = utils.getAllDependencies(pkg, options)

  if (typeof pkg.version === 'undefined') {
    console.error('Missing version in the package file', filename)
    return
  }

  if (verbose) {
    console.log(pkg.name + ' declares:\n' +
      JSON.stringify(deps, null, 2))
  }

  if (options.skipVersionCheck) {
    debug('skipping actual version check because of option')
    return true
  }

  var folder = path.dirname(filename)

  var ok = true
  _.forOwn(deps, function (declaredVersion, dep) {
    if (!isSupportedVersionFormat(declaredVersion)) {
      console.log('skipping invalid version', declaredVersion)
      return
    }
    try {
      ok = ok && utils.checkNpmDependency(folder, dep, declaredVersion, verbose)
    } catch (err) {
      console.error('Problem checking NPM dependency "%s" version "%s"',
        dep, declaredVersion)
      console.error(err.message)
    }
  })

  return ok
}

module.exports = checkTopLevelNpmDependencies
