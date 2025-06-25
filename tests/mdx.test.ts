// tests/mdx.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * Recursively gather every .mdx file under a directory.
 */
function collectMdxFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectMdxFiles(fullPath);
    return entry.isFile() && entry.name.toLowerCase().endsWith('.mdx')
      ? [fullPath]
      : [];
  });
}

const blogDir = path.join(process.cwd(), 'src/app/blog/posts');
const workDir = path.join(process.cwd(), 'src/app/work/projects');

const mdxFiles = [
  ...collectMdxFiles(blogDir),
  ...collectMdxFiles(workDir),
];

for (const file of mdxFiles) {
  test(`frontmatter ${path.relative(process.cwd(), file)}`, () => {
    let src = fs.readFileSync(file, 'utf8');
    if (src.startsWith("'use client'")) {
      src = src.split('\n').slice(1).join('\n');
    }
    const { data } = matter(src);

    assert.ok(data.title, 'missing title');
    assert.ok(data.publishedAt, 'missing publishedAt');
  });
}

test('getPosts handles use client frontmatter', () => {
  type Post = { metadata: { publishedAt: string }; slug: string; content: string };
  const { getPosts } = require('../src/app/utils/utils') as {
    getPosts: (paths: string[]) => Post[];
  };
  const posts = getPosts(['src', 'app', 'blog', 'posts']);
  const item = posts.find((p) => p.slug === 'cleanmydesktop-pro-roadmap');
  assert.ok(item, 'post not found');
  assert.ok(item.metadata.publishedAt, 'missing publishedAt');
});
