import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { BACKGROUND_CONTEXT } from "@earendil-works/chord/context";
import { createModels } from "@earendil-works/pi-ai/models";
import { createRegistry, defineExtension, defineTask, Harness } from "@earendil-works/pi-durable";
import { openNodeJsonlStorage } from "@earendil-works/pi-durable/storage/jsonl/node";

const mode = process.argv[2];
if (!["crash", "resume"].includes(mode)) throw new Error("Choose crash or resume");
const directory = resolve(process.argv[3] ?? "./recovery-lab");
await mkdir(directory, { recursive: true });
const idFile = join(directory, "task-id.json");
const context = BACKGROUND_CONTEXT;
const Probe = defineTask({
  name: "lab.recovery", version: 1,
  initial: () => ({ phase: "prepare" }),
  phases: {
    prepare: async (_task, runtime, ctx) => {
      await runtime.sleepUntil(runtime.now() + 1000, { phase: "finish" }, ctx);
      console.log("sleep checkpoint committed");
      if (mode === "crash") process.exit(77);
    },
    finish: (_task, runtime, ctx) => runtime.commit(
      () => ({ status: "terminal", outcome: { status: "completed", result: "recovered" } }), ctx),
  },
  abort: (_task, runtime, ctx) => runtime.commit(
    () => ({ status: "terminal", outcome: { status: "aborted" } }), ctx),
});
const registry = createRegistry();
registry.install(defineExtension({ name: "recovery-lab", tasks: [Probe] }));
const storage = await openNodeJsonlStorage(join(directory, "store"), context, { fsync: true });
const harness = await Harness.open(storage, { models: createModels(), registry }, context);
let id;
if (mode === "crash") {
  if (existsSync(idFile)) throw new Error("Use a fresh experiment directory");
  const root = await harness.root(context);
  id = await root.commit((tx) => tx.createTask(Probe, null, { ownership: { kind: "conversation" } }), context);
  await writeFile(idFile, JSON.stringify(id));
} else {
  id = JSON.parse(await readFile(idFile, "utf8"));
}
const record = await harness.waitForTask(id, context);
assert.equal(record.state.status, "terminal");
assert.equal(record.state.outcome.status, "completed");
assert.equal(record.state.outcome.result, "recovered");
console.log("PASS: same task recovered", id);
await harness.close(context);
