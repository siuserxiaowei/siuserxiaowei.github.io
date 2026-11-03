import assert from "node:assert/strict";
import { Agent } from "@earendil-works/pi-agent-core";
import { createModels, fauxProvider, fauxAssistantMessage, fauxToolCall } from "@earendil-works/pi-ai";
const models = createModels();
const faux = fauxProvider();
models.setProvider(faux.provider);
let executed = 0;
const echo = {
  name: "echo", label: "Echo", description: "Count executions",
  parameters: { type: "object", properties: { value: { type: "string" } }, required: ["value"] },
  execute: async () => { executed++; return { content: [{ type: "text", text: "ok" }], details: {} }; },
};
faux.setResponses([
  fauxAssistantMessage([fauxToolCall("echo", { value: "hel" })], { stopReason: "length" }),
  fauxAssistantMessage("recovered"),
]);
const agent = new Agent({ initialState: { model: faux.getModel(), tools: [echo] }, streamFn: models.streamSimple.bind(models) });
await agent.prompt("test truncation");
const errors = agent.state.messages.filter(x => x.role === "toolResult" && x.isError);
assert.equal(executed, 0);
assert.equal(errors.length, 1);
const slow = fauxProvider({ tokensPerSecond: 20 });
models.setProvider(slow.provider);
slow.setResponses([fauxAssistantMessage("a deliberately long offline response for cancellation")]);
const cancelled = new Agent({ initialState: { model: slow.getModel() }, streamFn: models.streamSimple.bind(models) });
cancelled.subscribe(event => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") cancelled.abort();
});
await cancelled.prompt("test abort");
const last = cancelled.state.messages.at(-1);
assert.equal(last.stopReason, "aborted");
console.log({ executed, toolErrors: errors.length, cancelled: last.stopReason });
