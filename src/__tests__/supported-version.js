const isSupported = require('../is-supported-version-format')

describe('is supported version format', () => {
  it('regular versions', () => {
    expect(isSupported('0.2.0')).toBe(true)
    expect(isSupported('^0.2.0')).toBe(true)
    expect(isSupported('~0.2.0')).toBe(true)
  })

  it('unsupported urls', () => {
    expect(isSupported('http://somewhere/repo')).toBe(false)
    expect(isSupported('git@github.com:bahmutov/angular-minicolors.git')).toBe(false)
    expect(isSupported('git://gh.com/foo/bar#30030')).toBe(false)
    expect(isSupported('github:jstrace/bars')).toBe(false)
    expect(isSupported('file:./dummy')).toBe(false)
  })
})
