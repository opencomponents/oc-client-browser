'use strict';

const fs = require('fs-extra');
const path = require('path');
const uglifyJs = require('uglify-js');

const packageJson = require('../package');

module.exports = function(grunt) {
  grunt.registerTask(
    'build',
    'Builds and minifies the oc-client component',
    function() {
      const done = this.async(),
        version = packageJson.version,
        srcPath = '../src/',
        vendorPath = '../vendor/',
        distPath = '../dist/',
        licenseLink =
          'https://github.com/opencomponents/oc-client-browser/tree/master/dist/LICENSES',
        license = `/*! OpenComponents client v${version} | (c) 2015-${new Date().getFullYear()} OpenTable, Inc. | ${licenseLink} */`,
        l = fs
          .readFileSync(path.join(__dirname, vendorPath, 'l.js'))
          .toString(),
        ocClient = fs
          .readFileSync(path.join(__dirname, srcPath, 'oc-client.js'))
          .toString(),
        bundle = `${l}\n;\n${ocClient}\n;\noc.clientVersion='${version}';`;

      const compressed = uglifyJs.minify(bundle, {
        fromString: true,
        outSourceMap: 'oc-client.min.map'
      });

      const compressedCode = `${license}\n${compressed.code}`;

      fs.ensureDirSync(distPath);
      fs.writeFileSync(
        path.join(__dirname, distPath, 'oc-client.min.map'),
        compressed.map
      );
      fs.writeFileSync(
        path.join(__dirname, distPath, 'oc-client.min.js'),
        compressedCode
      );

      done();
    }
  );
};
