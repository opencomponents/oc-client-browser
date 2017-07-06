'use strict';

const format = require('stringformat');
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
        distPath = '../dist/',
        licenseRow =
          '/*! OpenComponents client v{0} | (c) 2015-{1} OpenTable, Inc. | {2} */',
        licenseLink =
          'https://github.com/opencomponents/oc-client-browser/tree/master/dist/LICENSES',
        license = format(
          licenseRow,
          version,
          new Date().getFullYear(),
          licenseLink
        ),
        l = fs
          .readFileSync(path.join(__dirname, srcPath, 'l.js'))
          .toString(),
        ocClient = fs
          .readFileSync(
            path.join(__dirname, srcPath, 'oc-client.js')
          )
          .toString(),
        bundle = format(
          "{0}\n;\n{1}\n;\noc.clientVersion='{2}';",
          l,
          ocClient,
          version
        );
        // ocClientPackageInfo = require(srcPath + 'package.json'),
        // jsonConfig = { spaces: 2 };

      // ocClientPackageInfo.version = version;
      // fs.writeJsonSync(
      //   path.join(__dirname, srcPath, 'package.json'),
      //   ocClientPackageInfo,
      //   jsonConfig
      // );

      const compressed = uglifyJs.minify(bundle, {
        fromString: true,
        outSourceMap: 'oc-client.min.map'
      });

      const compressedCode = format('{0}\n{1}', license, compressed.code);

      // fs.writeFileSync(
      //   path.join(__dirname, clientComponentDir, 'src/oc-client.min.js'),
      //   compressedCode
      // );
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
      // const Local = require('../src/cli/domain/local'),
      //   local = new Local(),
      //   packageOptions = {
      //     componentPath: path.join(__dirname, clientComponentDir),
      //     verbose: false
      //   };

      // local.package(packageOptions, err => {
      //   grunt.log[err ? 'error' : 'ok'](
      //     err ? err : 'Client has been built and packaged'
      //   );
      //   done();
      // });
    }
  );
};
