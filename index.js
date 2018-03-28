'use strict';
const fs = require('fs');
const path = require('path');

const distDir = 'dist';
const clientLibFileName = 'oc-client.min.js';
const clientMapFileName = 'oc-client.min.map';
const version = require('./package.json').version;


module.exports = {
  getLib(cb){
    return fs.readFile(
      path.join(__dirname, distDir, clientLibFileName),
      'utf8',
      cb
    );
  },
  getMap(cb){
    return fs.readFile(
      path.join(__dirname, distDir, clientMapFileName),
      'utf8',
      cb
    );
  },
  version
};
