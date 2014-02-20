gt.module 'e2e NPM tests',
  setup: ->
    process.chdir '..'
  teardown: ->
    process.chdir __dirname

gt.async 'test itself', ->
  gt.exec 'node', ['index.js', '--verbose'], 0,
    'this module has all dependencies'
