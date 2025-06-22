import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

function getFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => path.join(dir, f));
}

const blogDir = path.join(process.cwd(), 'src/app/blog/posts');
const workDir = path.join(process.cwd(), 'src/app/work/projects');

for (const file of [...getFiles(blogDir), ...getFiles(workDir)]) {
  test(`frontmatter ${path.relative(process.cwd(), file)}`, () => {
    const { data } = matter.read(file);
    assert.ok(data.title, 'missing title');
    assert.ok(data.publishedAt, 'missing publishedAt');
  });
}
