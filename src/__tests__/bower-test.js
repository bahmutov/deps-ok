const join = require('path').join
const exists = require('fs').existsSync
const check = require('../check-bower-file')

const testFolder = join(__dirname, 'bower-test')
const bowerFilename = join(testFolder, 'bower.json')

/* eslint-env jest */
describe('running as parent tests', () => {
  beforeEach(() => {
    process.chdir(testFolder)
  })
  afterEach(() => {
    process.chdir(__dirname)
  })

  it('check function', () => {
    expect(typeof check).toBe('function')
    expect(exists(bowerFilename)).toBe(true)
  })

  it('detects that dependencies are not installed', () => {
    expect(check(testFolder, bowerFilename, true)).toBe(false)
  })
})
