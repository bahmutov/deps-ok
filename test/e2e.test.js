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
  const args = [relative('../bin/deps-ok.js'), '--verbose', '--filename']

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
    return execaWrap('node', args.concat(relative('./package-with-latest.json')), options)
    .then(expectError)
  })

  it('test version with github version', () => {
    return execaWrap('node', args.concat(relative('./package-with-github.json')), options)
    .then(expectSuccess)
  })

  it('test version with local file path', () => {
    return execaWrap('node', args.concat(relative('./package-with-file.json')), options)
    .then(expectSuccess)
  })

  it('test version with url', () => {
    return execaWrap('node', args.concat(relative('./package-with-url.json')), options)
    .then(expectSuccess)
  })

  it('test non-existing file', () => {
    return execaWrap('node', args.concat(relative('./does-not-exist.json')), options)
    .then(expectError)
  })

  it('package is missing version property', () => {
    return execaWrap('node', args.concat(relative('./package-without-version.json')), options)
    .then(expectError)
  })
})
