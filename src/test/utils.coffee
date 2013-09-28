getAllDependencies = require('../utils').getAllDependencies

gt.module 'getAllDependencies'

gt.test '3 types', ->
  pkg =
    dependencies:
      foo: '0.1.0'
    devDependencies:
      bar: 'latest'
    peerDependencies:
      baz: '2.0.0'
  deps = getAllDependencies pkg
  gt.equal deps.foo, '0.1.0'
  gt.equal deps.bar, 'latest'
  gt.equal deps.baz, '2.0.0'

gt.test 'duplicate', ->
  pkg =
    dependencies:
      foo: '0.1.0'
    devDependencies:
      foo: '2.0.0'
  gt.raises ->
    deps = getAllDependencies pkg
  , 'Error', 'Package cannot have duplicates'
