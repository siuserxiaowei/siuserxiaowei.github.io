import assert from "node:assert/strict";
import { normalizeContext, getCurrentSystemPrompt, getCurrentTools } from "@earendil-works/pi-ai";
const echo = { name: "echo", description: "Echo text", parameters: { type: "object" } };
const messages = [
  { role: "system", content: "BASE", sections: { rules: "SHORT" }, toolsAdded: [echo], timestamp: 1 },
  { role: "user", content: "hi", timestamp: 2 },
  { role: "system", content: "", sections: { rules: "LONG" }, toolsRemoved: [{ name: "echo" }], timestamp: 3 },
];
const context = normalizeContext({ messages });
const prompt = getCurrentSystemPrompt(context.messages);
const tools = getCurrentTools(context.messages);
assert.equal(prompt, "BASE\n\nLONG");
assert.deepEqual(tools, []);
assert.equal(messages[0].sections.rules, "SHORT");
console.log({ prompt, tools, originalRules: messages[0].sections.rules });
