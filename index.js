const fs = require('fs');
module.exports = cb => fs.readFile('./dist/oc-client.min.js', 'utf8', cb);
