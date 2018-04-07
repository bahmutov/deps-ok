'use strict'

const debug = require('debug')('deps-ok')
const is = require('check-more-types')
const la = require('lazy-ass')

var checkNpm = require('./check-npm-package')
var checkBower = require('./check-bower-file')
var join = require('path').join
var fs = require('fs')
var exists = fs.existsSync
var quote = require('quote')

function isFile (path) {
  return exists(path) &&
    fs.statSync(path).isFile()
}

function checkDependenciesInFolder (folder, options) {
  la(is.unemptyString(folder), 'missing folder string', folder)
  la(is.object(options), 'expected an options object', options)

  debug('folder', folder)
  debug('options', options)
  const verbose = options.verbose
  const skipBower = options.skipBower

  if (isFile(folder)) {
    if (verbose) {
      console.log('assuming file', folder, 'is NPM package')
    }
    return require('./check-npm-file')(folder, options)
  }

  var foundFile
  var packageFilename = join(folder, 'package.json')
  if (exists(packageFilename)) {
    foundFile = true
    if (!checkNpm(folder, options)) {
      return false
    }
  }

  if (!skipBower) {
    var bowerFilename = join(folder, 'bower.json')
    if (exists(bowerFilename)) {
      foundFile = true
      if (!checkBower(folder, bowerFilename, verbose)) {
        return false
      }
    }
  } else {
    if (verbose) {
      console.log('skipping bower check')
    }
  }

  if (!foundFile) {
    console.error('Cannot find anything to check in', quote(folder))
    return false
  }

  return true
}

module.exports = checkDependenciesInFolder
