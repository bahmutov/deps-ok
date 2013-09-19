#!/usr/bin/env node

var _ = require('lodash');
var path = require('path');
var packageFilename = path.join(process.cwd(), './package.json');
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
Object.keys(deps).forEach(function (dep) {
  var declaredVersion = deps[dep];
});