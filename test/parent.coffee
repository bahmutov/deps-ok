join = require('path').join
check = require '..'

gt.module 'running as parent tests',
  setup: ->
    process.chdir join(__dirname, '..')
  teardown: ->
    process.chdir __dirname

gt.test 'check function', ->
  gt.func check, 'check is a function'

gt.test 'test itself via check', ->
  ok = check process.cwd(), true
  gt.ok ok, 'all deps are up to date'
