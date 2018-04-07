const cleanVersion = require('../utils').cleanVersion
const getAllDependencies = require('../utils').getAllDependencies

/* eslint-env jest */
describe('clean version', () => {
  it('^ symbol', () => {
    const version = cleanVersion('^0.1.1')
    expect(version).toBe('0.1.1')
  })
})

describe('getAllDependencies', () => {
  it('^ symbol', () => {
    const pkg = {
      dependencies: {
        foo: '^0.1.0'
      }
    }
    const deps = getAllDependencies(pkg)
    expect(deps).toMatchSnapshot()
  })

  it('returns all 3 types', () => {
    const pkg = {
      dependencies: {
        foo: '0.1.0'
      },
      devDependencies: {
        bar: 'latest'
      },
      peerDependencies: {
        baz: '2.0.0'
      }
    }
    const deps = getAllDependencies(pkg)
    expect(deps).toMatchSnapshot()
  })

  it('duplicate', () => {
    const pkg = {
      dependencies: {
        foo: '0.1.0'
      },
      devDependencies: {
        foo: '2.0.0'
      }
    }
    expect(() => getAllDependencies(pkg)).toThrowErrorMatchingSnapshot()
  })

  it('allowed duplicate', () => {
    const pkg = {
      dependencies: {
        foo: '0.1.0'
      },
      devDependencies: {
        foo: '2.0.0'
      }
    }
    const options = {
      allowDuplicate: ['foo']
    }
    getAllDependencies(pkg, options)
  })
})
