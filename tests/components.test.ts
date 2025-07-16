import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const indexPath = path.join(process.cwd(), 'src/components/index.ts');
const lines = fs.readFileSync(indexPath, 'utf8').split('\n');

for (const line of lines) {
  const match = line.match(/export\s+\{\s*(?:default\s+as\s+)?(\w+)\s*\}\s*from\s+\"(.+)\"/);
  if (!match) continue;
  const [, name, spec] = match;
  const rel = spec.replace(/^@\//, '');
  const tsPathTsx = path.join(process.cwd(), 'src', rel + '.tsx');
  const tsPathTs = path.join(process.cwd(), 'src', rel + '.ts');
  const filePath = fs.existsSync(tsPathTsx) ? tsPathTsx : tsPathTs;
  test(`component file ${rel} exports ${name}`, () => {
    const source = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(
      `export (?:const|function)\\s+${name}|export\\s+\\{\\s*${name}\\s*\\}|export default`
    );
    assert.match(source, regex);
  });
}
