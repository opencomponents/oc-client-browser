'use strict';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const uglifyJs = require('uglify-js');

const readFile = promisify(fs.readFile);
const packageJson = require('../package');

const baseTemplates = {
  'oc-template-handlebars': {
    externals: [
      {
        global: 'Handlebars',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.runtime.min.js'
      }
    ]
  },
  'oc-template-jade': {
    externals: [
      {
        global: 'jade',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/jade/1.11.0/runtime.min.js'
      }
    ]
  },
  'oc-template-es6': { externals: [] }
};

module.exports = async function compile(conf = {}) {
  const registeredTemplates = { ...baseTemplates, ...conf.templates };

  const version = packageJson.version;
  const srcPath = '../src/';
  const vendorPath = '../vendor/';
  const licenseLink =
    'https://github.com/opencomponents/oc-client-browser/tree/master/LICENSES';
  const license = `/*! OpenComponents client v${version} | (c) 2015-${new Date().getFullYear()} OpenComponents community | ${licenseLink} */`;
  const l = await readFile(path.join(__dirname, vendorPath, 'l.js'), 'utf-8');
  const ocClient = (
    await readFile(path.join(__dirname, srcPath, 'oc-client.js'), 'utf-8')
  ).replace(
    '__REGISTERED_TEMPLATES_PLACEHOLDER__',
    JSON.stringify(registeredTemplates)
  );
  const bundle = `${l}\n;\n${ocClient}\n;\noc.clientVersion='${version}';`;

  const compressed = uglifyJs.minify(bundle, {
    sourceMap: {
      filename: 'oc-client.min.js',
      url: 'oc-client.min.map'
    }
  });

  const compressedCode = `${license}\n${compressed.code}`;

  return { code: compressedCode, map: compressed.map };
};
