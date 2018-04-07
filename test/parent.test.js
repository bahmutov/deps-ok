const join = require('path').join
const check = require('..')

describe.only('running as parent tests', () => {
  beforeEach(() => {
    process.chdir(join(__dirname, '..'))
  })

  afterEach(() => {
    process.chdir(__dirname)
  })

  it('check function', () => {
    expect(typeof check).toBe('function')
  })

  it('test itself via check', () => {
    const options = {
      verbose: true
    }
    expect(check(process.cwd(), options)).toBe(true)
  })
})
