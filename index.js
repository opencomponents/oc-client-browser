const fs = require('fs');
const path = require('path');

const distPath = 'dist';
const clientLibFileName = 'oc-client.min.js';
const clientMapFileName = 'oc-client.min.map';


module.exports = {
  getLib(cb){
    return fs.readFile(
      path.join(__dirname, distPath, clientLibFileName),
      'utf8',
      cb
    );
  },
  getMap(cb){
    return fs.readFile(
      path.join(__dirname, distPath, clientMapFileName),
      'utf8',
      cb
    );
  }
};
