import { spawn, type ChildProcess } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const PORT = 4005;
const URL  = `http://localhost:${PORT}/blog/posts/cleanmydesktop-pro-roadmap`;

let server: ChildProcess | undefined;

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`));
    });
  });
}

async function waitForServer(url: string, timeoutMs = 60_000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // ignore
    }
    await wait(1000);
  }
  throw new Error('Next server did not start in time');
}

before(async () => {
  await run('pnpm', ['exec', 'next', 'build']);

  server = spawn('pnpm', ['exec', 'next', 'start', '-p', String(PORT)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });

  await waitForServer(URL);
}, { timeout: 180_000 });

after(() => {
  server?.kill();
});

test('HTML includes Next runtime scripts', { timeout: 20_000 }, async () => {
  const res = await fetch(URL);
  assert.equal(res.status, 200);
  const html = await res.text();

  assert.ok(/_next\/static\/chunks\/[^"']+\.js/.test(html), 'missing runtime chunks');
  assert.ok(/__next_f/.test(html), 'missing next data');
});
