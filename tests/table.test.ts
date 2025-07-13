import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { compileSync, runSync } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { JSDOM } from 'jsdom';
import { render } from '@testing-library/react';
import * as runtime from 'react/jsx-runtime';

test('welcome post table renders', () => {
  const mdxPath = path.join(
    process.cwd(),
    'src/app/blog/posts/welcome-to-the-portfolio.mdx'
  );
  const source = fs.readFileSync(mdxPath, 'utf8');
  const cleaned = source
    .split('\n')
    .filter((line) => !line.startsWith('import '))
    .join('\n');
  const compiled = compileSync(
    { value: cleaned },
    {
      remarkPlugins: [remarkGfm],
      providerImportSource: '#',
      outputFormat: 'function-body',
    }
  );
  const { default: Content } = runSync(String(compiled), {
    ...runtime,
    useMDXComponents: () => ({
      Callout: () => null,
      Image: () => null,
      AnimatedSignalPulse: () => null,
    }),
  });

  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  globalThis.window = dom.window as unknown as typeof globalThis.window;
  globalThis.document = dom.window.document;

  render(Content({}));

  assert.ok(document.querySelector('table'));
});
