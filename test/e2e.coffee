join = require('path').join
check = require '..'

gt.module 'e2e NPM tests in root folder',
  setup: ->
    process.chdir join(__dirname, '..')
  teardown: ->
    process.chdir __dirname

gt.async 'test itself', ->
  gt.exec 'node', ['index.js', '--verbose'], 0,
    'this module has all dependencies'

gt.module 'e2e NPM tests in this folder'

gt.async 'test itself with folder', ->
  gt.exec 'node', ['../index.js', '--verbose', '--filename', join(__dirname, '..')], 0,
    'this module has all dependencies'

gt.async 'test itself with package.json path', ->
  gt.exec 'node', ['../index.js', '--verbose', '--filename', join(__dirname, '../package.json')], 0,
    'this module has all dependencies'

gt.async 'test version with latest keyword', ->
  gt.exec 'node', ['../index.js', '--verbose', '--filename', join(__dirname, './package-with-latest.json')], 1,
    'this has some missing dependencies'

gt.async 'test version with github version', ->
  gt.exec 'node', ['../index.js', '--verbose', '--filename', join(__dirname, './package-with-github.json')], 0,
    'this handles github: version string'

gt.async 'test non-existing file', ->
  gt.exec 'node', ['../index.js', '--verbose', '--filename', join(__dirname, './does-not-exist.json')], 1,
    'package file does not exist'
