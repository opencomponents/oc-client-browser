const fs = require('fs');
const path = require('path');

module.exports = cb => fs.readFile(
  path.join(__dirname, 'dist/oc-client.min.js'),
  'utf8',
  cb
);
