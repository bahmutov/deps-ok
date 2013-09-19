#!/usr/bin/env node

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var packageFilename = path.join(process.cwd(), 'package.json');
var package = require(packageFilename);

if (!_.isString(package.name)) {
  throw new Error('missing package name inside ' + packageFilename);
}

var deps = {};
if (package.dependencies) {
  deps = _.extend(deps, package.dependencies);
}
if (package.devDependencies) {
  deps = _.extend(deps, package.devDependencies);
}
if (package.peerDependencies) {
  deps = _.extend(deps, package.peerDependencies);
}

console.log(package.name + ' declares:\n' +
  JSON.stringify(deps, null, 2));

var missing = Object.keys(deps).some(function (dep) {
  var declaredVersion = deps[dep];
  var depPackage = path.join(process.cwd(), 'node_modules', dep, 'package.json');
  console.log('checking', depPackage);

  if (!fs.existsSync(depPackage)) {
    console.error('cannot find module', dep);
    return true;
  }

  return false;
});

if (missing) {
  process.exit(1);
}
// every necessary dependency  is installed
process.exit(0);