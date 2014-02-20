join = require('path').join
check = require '..'

gt.module 'e2e NPM tests',
  setup: ->
    process.chdir join(__dirname, '..')
  teardown: ->
    process.chdir __dirname

gt.async 'test itself', ->
  gt.exec 'node', ['index.js', '--verbose'], 0,
    'this module has all dependencies'
