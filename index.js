var package = require('./package.json');

var deps = [].concat(package.dependencies)
  .concat(package.devDependencies);
console.log('deps', deps);