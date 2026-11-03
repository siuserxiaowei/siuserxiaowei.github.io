import assert from 'node:assert/strict';
import { isRetryableAssistantError, retryAssistantCall, retryDelayMs } from '@earendil-works/pi-ai';
const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0,
  totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };
const message = (stopReason, errorMessage) => ({ role: 'assistant', content: [],
  api: 'faux', provider: 'faux', model: 'faux-1', usage, stopReason,
  ...(errorMessage ? { errorMessage } : {}), timestamp: 0 });
const policy = { enabled: true, maxRetries: 2, baseDelayMs: 0 };
let transientCalls = 0;
const result = await retryAssistantCall(async () => {
  transientCalls++;
  return transientCalls === 1 ? message('error', '503 service unavailable') : message('stop');
}, policy, undefined);
let quotaCalls = 0;
await retryAssistantCall(async () => {
  quotaCalls++;
  return message('error', '429 insufficient_quota');
}, policy, undefined);
let abortedCalls = 0;
await retryAssistantCall(async () => {
  abortedCalls++;
  return message('aborted');
}, policy, undefined);
assert.equal(isRetryableAssistantError(message('error', '429 insufficient_quota')), false);
assert.equal(result.stopReason, 'stop');
assert.deepEqual([transientCalls, quotaCalls, abortedCalls], [2, 1, 1]);
assert.equal(retryDelayMs({ baseDelayMs: 1000, maxAgentDelayMs: 2500 }, 5), 2500);
console.log(JSON.stringify({ transientCalls, quotaCalls, abortedCalls, cappedDelayMs: 2500 }));
