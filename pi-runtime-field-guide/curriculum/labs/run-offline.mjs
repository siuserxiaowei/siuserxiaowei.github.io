import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const cwd = dirname(fileURLToPath(import.meta.url));
const chapters = [2, 3, 4, 5, 6, 7, 9, 10, 11];
for (const chapter of chapters) {
  const file = `chapter-${String(chapter).padStart(2, "0")}.mjs`;
  const run = spawnSync(process.execPath, [join(cwd, file)], {
    cwd,
    env: process.env,
    encoding: "utf8",
    timeout: 30000,
  });
  process.stdout.write(`\n[${file}]\n${run.stdout || ""}`);
  if (run.stderr) process.stderr.write(run.stderr);
  if (run.error || run.status !== 0) {
    console.error(run.error || `Chapter ${chapter} exited ${run.status}`);
    process.exit(1);
  }
}
console.log(`\n${chapters.length} offline chapter experiments passed; no provider API requested.`);
