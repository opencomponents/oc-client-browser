import { readFileSync } from 'node:fs';
import { watch } from 'node:fs/promises';
import path from 'node:path';
import { styleText } from 'node:util';
import { compileSync } from './tasks/compile.js';

const ac = new AbortController();
const { signal } = ac;

function getSize() {
  const { code } = compileSync();
  return code.length;
}
const originalSize = readFileSync('./dist/oc-client.min.js').length;
function getDiff() {
  const newSize = getSize();
  const diff = newSize - originalSize;
  const result = diff > 0 ? 'bigger' : diff < 0 ? 'smaller' : 'same';
  const humanReadable = (() => {
    const absDiff = Math.abs(diff);
    if (absDiff > 1024) {
      return `${(diff / 1024).toFixed(2)} KB`;
    } else if (absDiff >= 1) {
      return `${diff} B`;
    }
    return '';
  })();

  return { result, diff, humanReadable };
}

(async () => {
  try {
    const watcher = watch(path.join(process.cwd(), 'src/oc-client.js'), {
      signal
    });
    for await (const event of watcher) {
      if (event.eventType === 'change') {
        const { result, humanReadable } = getDiff();
        let text = '';
        if (result === 'same') {
          text = 'No changes';
        } else if (result === 'bigger') {
          text = styleText('red', `Size increased by ${humanReadable}`);
        } else {
          text = styleText('green', `Size decreased by ${humanReadable}`);
        }
        console.clear();
        console.log(text);
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
    throw err;
  }
})();
