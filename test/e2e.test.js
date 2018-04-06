const join = require('path').join
const relative = join.bind(null, __dirname)
const check = require('..')
const ERROR_EXIT_CODE = 255
const execaWrap = require('execa-wrap')

const expectSuccess = (output) => {
  output = output.trim()
  expect(output).toBe("code: 0")
}

const expectError = (output) => {
  output = output.trim()
  expect(output).toBe(`code: ${ERROR_EXIT_CODE}`)
}

describe('e2e NPM tests in root folder', () => {
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
      .then(expectSuccess)
  })
})

describe('e2e NPM tests in this folder', () => {
  const args = ['../bin/deps-ok.js', '--verbose', '--filename']

  const options = {
    filter: 'code'
  }

  it('test itself with folder', () => {
    return execaWrap('node', args.concat(relative('..')), options)
    .then(expectSuccess)
  })

  it('test itself with package.json path', () => {
    return execaWrap('node', args.concat(relative('../package.json')), options)
    .then(expectSuccess)
  })

  it('test version with latest keyword', () => {
    return execaWrap('node', args.concat(relative('../package-with-latest.json')), options)
    .then(expectError)
  })

  it('test version with github version', () => {
    return execaWrap('node', args.concat(relative('../package-with-github.json')), options)
    .then(expectSuccess)
  })

  it('test version with local file path', () => {
    return execaWrap('node', args.concat(relative('../package-with-file.json')), options)
    .then(expectSuccess)
  })
})

// gt.async 'test version with url', ->
//   gt.exec 'node', args.concat(relative('./package-with-url.json')), 0,
//     'this handles url string'

// gt.async 'test non-existing file', ->
//   gt.exec 'node', args.concat(relative('./does-not-exist.json')), ERROR_EXIT_CODE,
//     'package file does not exist'

// gt.async 'package is missing version property', ->
//   gt.exec 'node', args.concat(relative('./package-without-version.json')), ERROR_EXIT_CODE,
//     'this has some missing dependencies'
