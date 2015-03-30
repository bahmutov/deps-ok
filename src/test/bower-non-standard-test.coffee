join = require('path').join
exists = require('fs').existsSync
check = require '../check-bower-file'

testFolder = join __dirname, 'bower-non-standard-test'
bowerFilename = join testFolder, 'bower.json'

gt.module 'running as parent tests',
  setup: ->
    process.chdir join(__dirname, 'bower-test')
  teardown: ->
    process.chdir __dirname

gt.test 'check function', ->
  gt.func check, 'check is a function'
  gt.ok exists(bowerFilename), 'bower file', bowerFilename, 'exists'

gt.test 'test itself via check', ->
  ok = check testFolder, bowerFilename, true
  gt.ok ok, 'dependencies are installed'
