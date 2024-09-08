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

function transformTemplates(templates = {}) {
  if (Array.isArray(templates)) {
    const templatesObj = {};
    for (const template of templates) {
      if (typeof template.getInfo !== 'function') {
        throw new Error(
          `Template ${
            template.type || 'unknown'
          } does not have a getInfo function`
        );
      }
      const { externals, type } = template.getInfo();
      templatesObj[type] = { externals };
    }
    return templatesObj;
  }

  return templates;
}

function parseConf(conf) {
  const jQueryExternal = {
    global: 'jQuery',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js'
  };
  const disableLegacyTemplates = Boolean(conf.disableLegacyTemplates ?? false);
  const transformedTemplates = transformTemplates(conf.templates);
  const templates = disableLegacyTemplates
    ? {
        'oc-template-es6': baseTemplates['oc-template-es6'],
        ...transformedTemplates
      }
    : { ...baseTemplates, ...transformedTemplates };

  return {
    externals: [jQueryExternal].concat(conf.externals || []),
    retryLimit: conf.retryLimit || 30,
    retryInterval: conf.retryInterval || 5000,
    disableLegacyTemplates: disableLegacyTemplates,
    disableLoader: Boolean(conf.disableLoader ?? false),
    templates
  };
}

function getFiles({ sync = false }) {
  const srcPath = '../src/';
  const vendorPath = '../vendor/';

  const lPath = path.join(__dirname, vendorPath, 'l.js');
  const ocClientPath = path.join(__dirname, srcPath, 'oc-client.js');

  if (sync) {
    const l = fs.readFileSync(lPath, 'utf-8');
    const ocClient = fs.readFileSync(ocClientPath, 'utf-8');

    return [l, ocClient];
  } else {
    const lPromise = readFile(lPath, 'utf-8');
    const ocClientPromise = readFile(ocClientPath, 'utf-8');

    return Promise.all([lPromise, ocClientPromise]);
  }
}

function compileFiles(l, ocClient, conf) {
  const version = packageJson.version;
  const licenseLink =
    'https://github.com/opencomponents/oc-client-browser/tree/master/LICENSES';
  const license = `/*! OpenComponents client v${version} | (c) 2015-${new Date().getFullYear()} OpenComponents community | ${licenseLink} */`;
  const bundle = `${license}\n${l}\n;\n${ocClient}\n;\noc.clientVersion='${version}';`;

  const compressed = uglifyJs.minify(bundle, {
    sourceMap: {
      filename: 'oc-client.min.js',
      url: 'oc-client.min.map'
    },
    compress: {
      global_defs: {
        __DISABLE_LEGACY_TEMPLATES__: conf.disableLegacyTemplates,
        __DEFAULT_DISABLE_LOADER__: conf.disableLoader,
        __DEFAULT_RETRY_INTERVAL__: conf.retryInterval,
        __DEFAULT_RETRY_LIMIT__: conf.retryLimit,
        __EXTERNALS__: conf.externals,
        __REGISTERED_TEMPLATES_PLACEHOLDER__: conf.templates
      }
    }
  });

  const compressedCode = `${license}\n${compressed.code}`;

  return { code: compressedCode, map: compressed.map, dev: bundle };
}

async function compile(conf = {}) {
  const parsedConf = parseConf(conf);
  const [l, ocClient] = await getFiles({ sync: false });
  return compileFiles(l, ocClient, parsedConf);
}

function compileSync(conf = {}) {
  const parsedConf = parseConf(conf);
  const [l, ocClient] = getFiles({ sync: true });
  return compileFiles(l, ocClient, parsedConf);
}

module.exports = {
  compile: compile,
  compileSync: compileSync
};
