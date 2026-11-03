import assert from 'node:assert/strict';
import { SessionManager } from '@earendil-works/pi-coding-agent';
const manager = SessionManager.inMemory();
const original = 'RAW_CONTEXT_SENTINEL';
const id = manager.appendMessage({ role: 'user', content: original, timestamp: 0 });
manager.appendContextEdit(id, { content: 'short replacement' });
assert.equal(manager.getEntry(id).message.content, original);
assert.equal(manager.buildSessionContext().messages[0].content, 'short replacement');
manager.appendContextEdit(id, null);
assert.equal(manager.buildSessionContext().messages.length, 0);
assert.equal(manager.getEntry(id).message.content, original);
manager.branch(id);
assert.equal(manager.buildSessionContext().messages[0].content, original);
assert.equal(manager.getEntries().filter(e => e.type === 'context_edit').length, 2);
console.log(JSON.stringify({ rawPreserved: true, replacementApplied: true,
  omissionApplied: true, beforeEditRestored: true }));
