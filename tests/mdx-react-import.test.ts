import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const blogDir = 'src/app/blog/posts';

/** look for .../<slug>/page.mdx only */
function pageMdxFiles(): string[] {
  return fs.readdirSync(blogDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(blogDir, e.name, 'page.mdx'))
    .filter((p) => fs.existsSync(p));
}

for (const file of pageMdxFiles()) {
  test(`React shim import → ${path.relative('.', file)}`, () => {
    const src = fs.readFileSync(file, 'utf8');
    assert.match(
      src,
      /import\s+React\s+from\s+['"]@\/lib\/react-default['"]/,
      'page.mdx must import React from @/lib/react-default'
    );
  });
}
