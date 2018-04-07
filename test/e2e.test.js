const join = require('path').join
const relative = join.bind(null, __dirname)
const ERROR_EXIT_CODE = 255
const execaWrap = require('execa-wrap')

const expectSuccess = (output) => {
  output = output.trim()
  expect(output).toContain('code: 0')
}

const expectError = (code) => (output) => {
  output = output.trim()
  expect(output).toContain(`code: ${code}`)
}

/* eslint-env jest */
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
  beforeEach(() => {
    process.chdir(relative('..'))
  })

  afterEach(() => {
    process.chdir(__dirname)
  })

  const args = [relative('../bin/deps-ok.js'), '--verbose', '--filename']

  const options = {
    filter: ['code', 'stdout', 'stderr']
  }

  describe('peer dependency', () => {
    const packageFilename = relative('./package-dev-and-peer.json')

    it('does not allow same dependency in dev and peer by default', () => {
      const list = args.concat(packageFilename)
      return execaWrap('node', list, options)
        .then(expectError(1))
    })

    it('allow same named dependency in dev and peer', () => {
      const list = args.concat(packageFilename,
        '--allow-duplicate', 'angular',
        '--skip-version-check'
      )
      return execaWrap('node', list, options)
        .then(expectSuccess)
    })

    it('allow seveal duplicates in dev and peer', () => {
      const list = args.concat(packageFilename,
        '--allow-duplicate', 'angular',
        '--allow-duplicate', 'angular',
        '--skip-version-check'
      )
      return execaWrap('node', list, options)
        .then(expectSuccess)
    })
  })

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
      .then(expectError(ERROR_EXIT_CODE))
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
      .then(expectError(ERROR_EXIT_CODE))
  })
})
