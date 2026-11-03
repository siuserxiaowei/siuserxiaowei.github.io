import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const cli = join(dirname(fileURLToPath(import.meta.resolve('@earendil-works/pi-coding-agent'))), 'cli.js');
const work = await mkdtemp(join(tmpdir(), 'pi-rpc-inspect-'));
const child = spawn(process.execPath, [cli, '--mode', 'rpc', '--no-session',
  '--no-extensions', '--no-skills', '--no-prompt-templates', '--no-themes', '--no-context-files'],
  { cwd: work, env: { PATH: process.env.PATH ?? '', TERM: 'dumb', NO_COLOR: '1',
      PI_CODING_AGENT_DIR: join(work, 'agent') },
    stdio: ['pipe', 'pipe', 'inherit'] });
let buffer = '';
const waiting = new Map();
child.stdout.setEncoding('utf8');
child.stdout.on('data', chunk => {
  buffer += chunk;
  let end;
  while ((end = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, end).replace(/\r$/, '');
    buffer = buffer.slice(end + 1);
    if (!line) continue;
    const record = JSON.parse(line);
    if (record.type === 'response' && waiting.has(record.id)) {
      const { resolve, timer } = waiting.get(record.id);
      clearTimeout(timer); waiting.delete(record.id); resolve(record);
    }
  }
});
function ask(type) {
  const id = `lab-${type}`;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { waiting.delete(id); reject(new Error(`Timeout: ${id}`)); }, 30000);
    waiting.set(id, { resolve, timer });
    child.stdin.write(JSON.stringify({ id, type }) + '\n');
  });
}
try {
  for (const type of ['get_state', 'get_session_stats', 'get_messages']) {
    const response = await ask(type);
    assert.equal(response.id, `lab-${type}`);
    assert.equal(response.command, type);
    assert.equal(response.success, true, JSON.stringify(response));
    console.log(JSON.stringify({ id: response.id, command: type, success: response.success }));
  }
  const exited = once(child, 'exit');
  child.stdin.end();
  const [status] = await exited;
  assert.equal(status, 0);
} finally {
  if (child.exitCode === null) child.kill();
}
