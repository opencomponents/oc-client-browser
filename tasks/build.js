'use strict';

const fs = require('fs-extra');
const path = require('path');
const compile = require('./compile');

async function build() {
  const distPath = '../dist/';
  const compressed = await compile();

  await fs.ensureDir(path.join(__dirname, distPath));
  await fs.writeFile(
    path.join(__dirname, distPath, 'oc-client.min.map'),
    compressed.map,
    'utf-8'
  );
  await fs.writeFile(
    path.join(__dirname, distPath, 'oc-client.min.js'),
    compressed.code,
    'utf-8'
  );
}

build().catch(err => {
  console.error('Something went wrong:', err.message);
  process.exit(1);
});
