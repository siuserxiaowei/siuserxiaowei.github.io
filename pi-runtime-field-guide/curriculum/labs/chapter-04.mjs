import assert from "node:assert/strict";
import { Agent } from "@earendil-works/pi-agent-core";
import { createModels, fauxProvider, fauxAssistantMessage } from "@earendil-works/pi-ai";
const faux = fauxProvider();
const models = createModels();
models.setProvider(faux.provider);
faux.setResponses(["first", "steered", "followed"].map(x => fauxAssistantMessage(x)));
let requests = 0, finishes = 0, queued = false;
const agent = new Agent({
  initialState: { model: faux.getModel() },
  streamFn: models.streamSimple.bind(models),
  prepareRequest: async () => { requests++; },
  finishTurn: async () => { finishes++; },
});
agent.subscribe(event => {
  if (!queued && event.type === "message_end" && event.message.role === "assistant") {
    queued = true;
    agent.steer({ role: "user", content: "STEER", timestamp: 2 });
    agent.followUp({ role: "user", content: "FOLLOW", timestamp: 3 });
  }
});
await agent.prompt("START");
const users = agent.state.messages.filter(x => x.role === "user").map(x => typeof x.content === "string" ? x.content : x.content.filter(b => b.type === "text").map(b => b.text).join(""));
assert.deepEqual(users, ["START", "STEER", "FOLLOW"]);
assert.equal(requests, 3);
assert.equal(finishes, 3);
assert.equal(agent.state.isStreaming, false);
console.log({ users, requests, finishes, idle: !agent.state.isStreaming });
