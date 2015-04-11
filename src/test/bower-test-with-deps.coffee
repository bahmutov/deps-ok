join = require('path').join
exists = require('fs').existsSync
check = require '../check-bower-file'

testFolder = join __dirname, 'bower-test-with-deps'
bowerFilename = join testFolder, 'bower.json'

gt.module 'running as parent tests',
  setup: ->
    process.chdir join(__dirname, 'bower-test-with-deps')
  teardown: ->
    process.chdir __dirname

gt.test 'test bower folder with installed deps via check', ->
  ok = check testFolder, bowerFilename, true
  gt.ok ok, 'dependencies are installed'
