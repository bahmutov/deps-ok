const join = require('path').join
const relative = join.bind(null, __dirname)
const check = require('..')
const ERROR_EXIT_CODE = 255
const execaWrap = require('execa-wrap')

describe.only('e2e NPM tests in root folder', () => {
  beforeEach(() => {
    process.chdir(relative('..'))
  })

  afterEach(() => {
    process.chdir(__dirname)
  })

  it('test itself', () => {
    const options = {
      filter: 'code'
    }
    return execaWrap('node', ['bin/deps-ok.js', '--verbose'], options)
      .then(output => output.trim())
      .then(output => {
        expect(output).toBe("code: 0")
      })
  })
})

// gt.module 'e2e NPM tests in this folder'

// args = ['../bin/deps-ok.js', '--verbose', '--filename']

// gt.async 'test itself with folder', ->
//   gt.exec 'node', args.concat(relative('..')), 0,
//     'this module has all dependencies'

// gt.async 'test itself with package.json path', ->
//   gt.exec 'node', args.concat(relative('../package.json')), 0,
//     'this module has all dependencies'

// gt.async 'test version with latest keyword', ->
//   gt.exec 'node', args.concat(relative('./package-with-latest.json')), ERROR_EXIT_CODE,
//     'this has some missing dependencies'

// gt.async 'test version with github version', ->
//   gt.exec 'node', args.concat(relative('./package-with-github.json')), 0,
//     'this handles github: version string'

// gt.async 'test version with local file path', ->
//   gt.exec 'node', args.concat(relative('./package-with-file.json')), 0,
//     'this handles file: version string'

// gt.async 'test version with url', ->
//   gt.exec 'node', args.concat(relative('./package-with-url.json')), 0,
//     'this handles url string'

// gt.async 'test non-existing file', ->
//   gt.exec 'node', args.concat(relative('./does-not-exist.json')), ERROR_EXIT_CODE,
//     'package file does not exist'

// gt.async 'package is missing version property', ->
//   gt.exec 'node', args.concat(relative('./package-without-version.json')), ERROR_EXIT_CODE,
//     'this has some missing dependencies'
