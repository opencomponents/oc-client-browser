'use strict';

module.exports = {
  basePath: '',
  frameworks: ['jasmine', 'sinon'],
  files: [

    // Dynamically loaded via oc-client, alredy loaded to speed-up tests
    'jquery-1.11.2.js',
    'jQuery.XDomainRequest.js',
    'jade.runtime.js',
    'handlebars.runtime.js',

    // The tests settings
    'test-settings.js',

    // The oc-client bundle
    '../../vendor/l.js',
    '../../src/oc-client.js',

    // The tests
    '../*.js'
  ],
  port: 9876,
  singleRun: false
};
