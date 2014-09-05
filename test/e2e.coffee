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
