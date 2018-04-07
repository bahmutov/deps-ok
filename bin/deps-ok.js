#!/usr/bin/env node

'use strict'

const debug = require('debug')('deps-ok')
const argv = require('minimist')(process.argv.slice(2), {
  string: ['allow-duplicate', 'filename'],
  boolean: ['version', 'verbose', 'skip-version-check']
  // skip-version-check is used during end to end testing
  // to not actually find the dependency on disk
})
const check = require('..')
const path = require('path')
const FAIL_EXIT_CODE = -1
const SUCCESS = 0

debug('arguments %j', argv)

function isPackageJson (filename) {
  return /package\.json$/.test(filename)
}

function isBowerJson (filename) {
  return /bower\.json$/.test(filename)
}

if (argv.version) {
  debug('printing current package name and version')
  var pkg = require('./package.json')
  console.log(pkg.name, pkg.version)
  process.exit(SUCCESS)
}

var dir = process.cwd()
if (argv.filename) {
  debug('checking file %s', argv.filename)

  if (argv.verbose) {
    console.log('checking', argv.filename)
  }
  if (isPackageJson(argv.filename) || isBowerJson(argv.filename)) {
    dir = path.dirname(argv.filename)
  } else {
    dir = argv.filename
  }
  dir = path.resolve(dir)
}

debug('checking dependencies in folder %s', dir)
if (argv.verbose) {
  console.log('checking deps', dir)
}

const toArray = (a) => Array.isArray(a) ? a : [a]

const options = {
  verbose: argv.verbose,
  skipBower: false,
  allowDuplicate: toArray(argv['allow-duplicate']),
  skipVersionCheck: argv['skip-version-check']
}
const ok = check(dir, options)
debug('deps check finished with boolean %j', ok)
process.exit(ok ? SUCCESS : FAIL_EXIT_CODE)
