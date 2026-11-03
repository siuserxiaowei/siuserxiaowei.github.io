import assert from 'node:assert/strict';
import { runToolCall } from '@earendil-works/pi-agent-core';
import { obj, str } from '@earendil-works/pi-schema';
let executions = 0;
const hooks = [];
const tool = {
  name: 'echo', label: 'Echo', description: 'Return a string',
  parameters: obj({ value: str() }),
  async execute(_id, args) {
    executions++;
    return { content: [{ type: 'text', text: args.value }], details: {} };
  },
};
const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0,
  totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };
const options = {
  tools: [tool], context: { messages: [] },
  assistantMessage: { role: 'assistant', content: [], api: 'faux',
    provider: 'faux', model: 'faux-1', usage, stopReason: 'stop', timestamp: 0 },
  beforeToolCall: async ({ toolCall, args }) => {
    hooks.push(`before:${toolCall.id}`);
    if (args.value === 'blocked') return { block: true, reason: 'blocked by lab' };
  },
  afterToolCall: async ({ toolCall }) => { hooks.push(`after:${toolCall.id}`); },
};
const results = [];
for (const [id, name, args] of [
  ['ok', 'echo', { value: 'ok' }],
  ['invalid', 'echo', { value: { nested: true } }],
  ['blocked', 'echo', { value: 'blocked' }],
  ['missing', 'missing', {}],
]) results.push(await runToolCall({ type: 'toolCall', id, name, arguments: args }, options));
assert.deepEqual(results.map(x => x.isError), [false, true, true, true]);
assert.equal(executions, 1);
assert.deepEqual(hooks, ['before:ok', 'after:ok', 'before:blocked']);
console.log(JSON.stringify({ errors: results.map(x => x.isError), executions, hooks }));
