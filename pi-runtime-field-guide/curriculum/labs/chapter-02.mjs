import assert from "node:assert/strict";
import { createModels, fauxProvider, fauxAssistantMessage } from "@earendil-works/pi-ai";
const faux = fauxProvider();
const models = createModels();
models.setProvider(faux.provider);
faux.setResponses([
  fauxAssistantMessage("hello offline"),
  fauxAssistantMessage("", { stopReason: "error", errorMessage: "injected-error" }),
]);
const context = { messages: [{ role: "user", content: "test", timestamp: Date.now() }] };
const first = await models.complete(faux.getModel(), context);
const second = await models.complete(faux.getModel(), context);
assert.equal(first.stopReason, "stop");
assert.equal(second.stopReason, "error");
assert.match(second.errorMessage, /injected-error/);
assert.equal(typeof first.usage.totalTokens, "number");
console.log({ first: first.stopReason, second: second.stopReason, usage: first.usage });
