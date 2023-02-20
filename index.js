'use strict';
const fs = require('fs');
const path = require('path');
const { fromCallback, fromPromise } = require('universalify');
const compile = require('./tasks/compile');

const distDir = 'dist';
const clientLibFileName = 'oc-client.min.js';
const clientMapFileName = 'oc-client.min.map';
const version = require('./package.json').version;

function getLib(cb) {
  return fs.readFile(
    path.join(__dirname, distDir, clientLibFileName),
    'utf8',
    cb
  );
}

function getMap(cb) {
  return fs.readFile(
    path.join(__dirname, distDir, clientMapFileName),
    'utf8',
    cb
  );
}

module.exports = {
  compile: fromPromise(compile),
  getLib: fromCallback(getLib),
  getMap: fromCallback(getMap),
  version
};
