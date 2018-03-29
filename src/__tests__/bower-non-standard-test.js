const join = require('path').join
const exists = require('fs').existsSync
const check = require('../check-bower-file')

const testFolder = join(__dirname, 'bower-non-standard-test')
const bowerFilename =join(testFolder, 'bower.json')

describe('running as parent tests', () => {
  beforeEach(() => {
    process.chdir(testFolder)
  })

  afterEach(() => {
    process.chdir(__dirname)
  })

  it('check function', () => {
    expect(typeof check).toBe('function')
    expect(exists(bowerFilename)).toBeTruthy()
  })

  it('test itself via check', () => {
    expect(check(testFolder, bowerFilename, true)).toBe(true)
  })
})
