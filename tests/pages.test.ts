import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function getPageFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getPageFiles(full));
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      files.push(full);
    }
  }
  return files;
}

const pages = getPageFiles(path.join(process.cwd(), 'src/app'));

for (const file of pages) {
  const rel = path.relative(process.cwd(), file);
  test(`page ${rel} has default export`, () => {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /export default/);
  });
}
