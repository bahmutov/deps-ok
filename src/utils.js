'use strict'

const debug = require('debug')('deps-ok')
var _ = require('lodash')
var semver = require('semver')
var la = require('lazy-ass')
var is = require('check-more-types')
var join = require('path').join
var readFileSync = require('fs').readFileSync
var exists = require('fs').existsSync

function getPackage (packageFilename) {
  la(is.unemptyString(packageFilename), 'missing package filename')

  if (!exists(packageFilename)) {
    console.error('cannot find file', packageFilename)
    return
  }

  var pkg = require(packageFilename)
  if (!_.isString(pkg.name)) {
    throw new Error('missing package name inside ' + packageFilename)
  }
  return pkg
}

function getAllDependencies (pkg, options = {}) {
  la(is.object(options), 'missing options', options)

  const allowedDuplicates = Array.isArray(options.allowDuplicate)
    ? options.allowDuplicate : []
  const isAllowedDuplicate = (name) => _.includes(allowedDuplicates, name)

  var deps = {}
  // note that peer dependencies overwrite prod and dev dependencies
  // because peer is usually more relaxed
  var properties = [
    'dependencies', 'devDependencies', 'peerDependencies'
  ]
  properties.forEach(function (name) {
    if (!pkg[name]) {
      return
    }

    debug('checking %s', name)
    const common = _.intersection(_.keys(deps), _.keys(pkg[name]))
    debug('duplicate dependencies', common)
    const remaining = _.filter(common, name => !isAllowedDuplicate(name))
    debug('allowed duplicate dependencies', allowedDuplicates)
    debug('remaining duplicates', remaining)

    if (remaining.length) {
      throw new Error('duplicate properties found: ' + remaining)
    }
    deps = _.extend(deps, pkg[name])
  })
  return deps
}

function cleanVersion (version) {
  la(is.unemptyString(version), 'expecting version string')

  version = version.trim()
  version = version.replace('~', '').replace('^', '')
  var twoDigitVersion = /^\d+\.\d+$/
  if (twoDigitVersion.test(version)) {
    version += '.0'
  }
  version = semver.clean(version)

  return version
}

function checkNpmDependency (folder, dep, version, verbose) {
  la(is.unemptyString(folder), 'expected folder string, got', folder)
  la(is.unemptyString(version), 'missing declared version for', dep)

  var filename = join(folder, 'node_modules', dep, 'package.json')
  var installedDep = getPackage(filename)

  if (!installedDep) {
    console.error('ERROR: cannot find module', dep)
    console.error('run `npm install` first?')
    return false
  }
  var installedVersion = installedDep.version
  if (!_.isString(installedVersion)) {
    console.error('ERROR: cannot version for module', dep)
    console.error('run `npm install` first?')
    return false
  }

  installedVersion = cleanVersion(installedVersion)
  if (!semver.valid(installedVersion)) {
    console.error('ERROR: invalid version', installedVersion, 'for module', dep)
    return false
  }

  if (verbose) {
    console.log(dep, 'needed', version, 'installed', installedVersion)
  }
  if (semver.ltr(installedVersion, version)) {
    console.error('ERROR:', dep, version,
      'needed, but found', installedVersion)
    return false
  }

  return true
}

function checkBowerDependency (folder, dep, version, verbose) {
  la(is.unemptyString(folder), 'expected folder string, got', folder)
  la(is.unemptyString(version), 'missing declared version for', dep)

  var bowerComponentsPath = 'bower_components'
  var bowerConfigPath = join(folder, '.bowerrc')

  if (exists(bowerConfigPath)) {
    // read .bowerjs without require because of the messing .json extension
    var bowerConfig = JSON.parse(readFileSync(bowerConfigPath, 'utf8'))
    bowerComponentsPath = bowerConfig.directory || bowerComponentsPath
  }

  folder = join(folder, bowerComponentsPath, dep)
  if (!exists(folder)) {
    console.error('ERROR: cannot find folder', folder)
    return false
  }

  // only check for the generated .bower.json file (see: https://github.com/bower/bower/issues/1174)
  var filename = join(folder, '.bower.json')

  if (!exists(filename)) {
    console.error('ERROR: cannot find bower component json file in folder', folder)
    return false
  }
  var installedDep = getPackage(filename)

  if (!installedDep) {
    console.error('ERROR: cannot find module', dep)
    return false
  }
  var installedVersion = installedDep.version
  if (!_.isString(installedVersion)) {
    console.error('ERROR: cannot version for module', dep)
    return false
  }
  installedVersion = cleanVersion(installedVersion)
  if (!semver.valid(installedVersion)) {
    console.error('ERROR: invalid version', installedVersion, 'for module', dep)
    return false
  }

  if (verbose) {
    console.log(dep, 'needed', version, 'installed', installedVersion)
  }
  if (semver.ltr(installedVersion, version)) {
    console.error('ERROR:', dep, version,
      'needed, but found', installedVersion)
    return false
  }

  return true
}

module.exports = {
  checkNpmDependency: checkNpmDependency,
  checkBowerDependency: checkBowerDependency,
  getPackage: getPackage,
  getAllDependencies: getAllDependencies,
  cleanVersion: cleanVersion
}
