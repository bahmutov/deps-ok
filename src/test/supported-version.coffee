isSupported = require '../is-supported-version-format'

gt.module 'is supported version format'

gt.test 'regular versions', ->
  gt.ok isSupported('0.2.0'), '0.2.0'
  gt.ok isSupported('^0.2.0'), '^0.2.0'
  gt.ok isSupported('~0.2.0'), '~0.2.0'

gt.test 'unsupported urls', ->
  gt.ok !isSupported('http://somewhere/repo'), 'http'
  gt.ok !isSupported('git@github.com:bahmutov/angular-minicolors.git'), 'git@'
  gt.ok !isSupported('git://gh.com/foo/bar#30030')
