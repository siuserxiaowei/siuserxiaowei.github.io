import assert from "node:assert/strict";
import { SessionManager } from "@earendil-works/pi-coding-agent";

const session = SessionManager.inMemory();
const original = "原记录 A";
const first = session.appendMessage({ role: "user", content: original, timestamp: Date.now() });
session.appendMessage({ role: "user", content: "另一条消息", timestamp: Date.now() });
session.appendContextEdit(first, { content: "未来模型只见 B" });
const editedLeaf = session.getLeafId();
assert.equal(session.buildSessionContext().messages[0].content, "未来模型只见 B");
assert.equal(session.getEntries().find((entry) => entry.id === first).message.content, original);

session.branch(first);
session.appendMessage({ role: "user", content: "从编辑之前分叉", timestamp: Date.now() });
assert.equal(session.buildSessionContext().messages[0].content, original);
session.branch(editedLeaf);
assert.equal(session.buildSessionContext().messages[0].content, "未来模型只见 B");
console.log("PASS: raw history preserved; context edits are branch-relative");
