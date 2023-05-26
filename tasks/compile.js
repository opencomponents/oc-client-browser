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

function getFiles({ sync = false, conf = {} }) {
  const registeredTemplates = { ...baseTemplates, ...conf.templates };
  const srcPath = '../src/';
  const vendorPath = '../vendor/';

  const lPath = path.join(__dirname, vendorPath, 'l.js');
  const ocClientPath = path.join(__dirname, srcPath, 'oc-client.js');
  const replaceTemplates = x =>
    x.replace(
      '__REGISTERED_TEMPLATES_PLACEHOLDER__',
      JSON.stringify(registeredTemplates)
    );

  if (sync) {
    const l = fs.readFileSync(lPath, 'utf-8');
    const ocClient = replaceTemplates(fs.readFileSync(ocClientPath, 'utf-8'));

    return [l, ocClient];
  } else {
    const lPromise = readFile(lPath, 'utf-8');
    const ocClientPromise = readFile(ocClientPath, 'utf-8').then(
      replaceTemplates
    );

    return Promise.all([lPromise, ocClientPromise]);
  }
}

function compileFiles(l, ocClient) {
  const version = packageJson.version;
  const licenseLink =
    'https://github.com/opencomponents/oc-client-browser/tree/master/LICENSES';
  const license = `/*! OpenComponents client v${version} | (c) 2015-${new Date().getFullYear()} OpenComponents community | ${licenseLink} */`;
  const bundle = `${l}\n;\n${ocClient}\n;\noc.clientVersion='${version}';`;

  const compressed = uglifyJs.minify(bundle, {
    sourceMap: {
      filename: 'oc-client.min.js',
      url: 'oc-client.min.map'
    }
  });

  const compressedCode = `${license}\n${compressed.code}`;

  return { code: compressedCode, map: compressed.map };
}

async function compile(conf = {}) {
  const [l, ocClient] = await getFiles({ sync: false, conf });
  return compileFiles(l, ocClient);
}

function compileSync(conf = {}) {
  const [l, ocClient] = getFiles({ sync: true, conf });
  return compileFiles(l, ocClient);
}

module.exports = {
  compile: compile,
  compileSync: compileSync,
};
