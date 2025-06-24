import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function getAllMdx(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? getAllMdx(path.join(dir, e.name))
                    : e.name.endsWith('.mdx') ? [path.join(dir, e.name)] : []
  );
}

const files = getAllMdx('src/app/blog/posts');

for (const f of files) {
  test(`MDX React import style → ${path.basename(f)}`, () => {
    const firstImportLine = fs.readFileSync(f, 'utf8')
      .split('\n')
      .find((l) => l.startsWith('import'));

    assert.ok(firstImportLine?.includes("@/lib/react-default"),
      'MDX file must import React from @/lib/react-default');
  });
}
