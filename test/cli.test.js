import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { CliError, runCli } from "../src/cli.js";

function output() {
  let value = "";
  return {
    stream: { isTTY: false, write(chunk) { value += chunk; } },
    read: () => value,
  };
}

async function workspace() {
  const root = await mkdtemp(path.join(os.tmpdir(), "miica-skills-test-"));
  const home = path.join(root, "home");
  const cwd = path.join(root, "project");
  await mkdir(home);
  await mkdir(cwd);
  return { root, home, cwd };
}

async function run(args, paths) {
  const stdout = output();
  const stderr = output();
  const stdin = { isTTY: false };
  const code = await runCli(args, { ...paths, stdin, stdout: stdout.stream, stderr: stderr.stream, version: "9.9.9" });
  return { code, stdout: stdout.read(), stderr: stderr.read() };
}

test("list exposes the packaged catalog", async () => {
  const paths = await workspace();
  try {
    const result = await run(["list"], paths);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /^zoho-crm-widget\t/m);
    assert.match(result.stdout, /^zoho-deluge\t/m);
  } finally {
    await rm(paths.root, { recursive: true });
  }
});

test("add installs one skill in the Codex project directory", async () => {
  const paths = await workspace();
  try {
    const result = await run(["add", "zoho-deluge", "--agent", "codex"], paths);
    const installed = path.join(paths.cwd, ".agents", "skills", "zoho-deluge");
    const marker = JSON.parse(await readFile(path.join(installed, ".miica-skills.json"), "utf8"));

    assert.equal(result.code, 0);
    assert.equal(marker.sourceVersion, "9.9.9");
    assert.match(await readFile(path.join(installed, "SKILL.md"), "utf8"), /name: zoho-deluge/);
  } finally {
    await rm(paths.root, { recursive: true });
  }
});

test("global all-agent installation targets both user directories", async () => {
  const paths = await workspace();
  try {
    await run(["add", "zoho-crm-widget", "--agent", "all", "--global"], paths);
    await stat(path.join(paths.home, ".agents", "skills", "zoho-crm-widget", "SKILL.md"));
    await stat(path.join(paths.home, ".claude", "skills", "zoho-crm-widget", "SKILL.md"));
  } finally {
    await rm(paths.root, { recursive: true });
  }
});

test("add --all installs the complete catalog", async () => {
  const paths = await workspace();
  try {
    await run(["add", "--all", "--agent", "claude"], paths);
    await stat(path.join(paths.cwd, ".claude", "skills", "zoho-crm-widget", "SKILL.md"));
    await stat(path.join(paths.cwd, ".claude", "skills", "zoho-deluge", "SKILL.md"));
  } finally {
    await rm(paths.root, { recursive: true });
  }
});

test("add refuses to overwrite a skill it does not manage", async () => {
  const paths = await workspace();
  try {
    const target = path.join(paths.cwd, ".agents", "skills", "zoho-deluge");
    await mkdir(target, { recursive: true });
    await writeFile(path.join(target, "SKILL.md"), "user-owned\n");

    await assert.rejects(
      run(["add", "zoho-deluge", "--agent", "codex", "--yes"], paths),
      (error) => error instanceof CliError && /unmanaged skill/.test(error.message),
    );
    assert.equal(await readFile(path.join(target, "SKILL.md"), "utf8"), "user-owned\n");
  } finally {
    await rm(paths.root, { recursive: true });
  }
});

test("add replaces a managed skill only after explicit confirmation", async () => {
  const paths = await workspace();
  try {
    const target = path.join(paths.cwd, ".agents", "skills", "zoho-deluge");
    await run(["add", "zoho-deluge", "--agent", "codex"], paths);
    await writeFile(path.join(target, "SKILL.md"), "local change\n");

    await run(["add", "zoho-deluge", "--agent", "codex", "--yes"], paths);

    assert.match(await readFile(path.join(target, "SKILL.md"), "utf8"), /name: zoho-deluge/);
    assert.equal(JSON.parse(await readFile(path.join(target, ".miica-skills.json"), "utf8")).sourceVersion, "9.9.9");
  } finally {
    await rm(paths.root, { recursive: true });
  }
});

test("remove deletes only a managed installation", async () => {
  const paths = await workspace();
  try {
    const target = path.join(paths.cwd, ".agents", "skills", "zoho-deluge");
    await run(["add", "zoho-deluge", "--agent", "codex"], paths);
    await run(["remove", "zoho-deluge", "--agent", "codex", "--yes"], paths);
    await assert.rejects(stat(target), (error) => error.code === "ENOENT");
  } finally {
    await rm(paths.root, { recursive: true });
  }
});

test("ambiguous non-interactive detection requires an explicit agent", async () => {
  const paths = await workspace();
  try {
    await assert.rejects(
      run(["add", "zoho-deluge"], paths),
      (error) => error instanceof CliError && /Could not determine/.test(error.message),
    );
  } finally {
    await rm(paths.root, { recursive: true });
  }
});

test("a single existing agent configuration is detected", async () => {
  const paths = await workspace();
  try {
    await mkdir(path.join(paths.cwd, ".claude"));
    await run(["add", "zoho-crm-widget"], paths);
    await stat(path.join(paths.cwd, ".claude", "skills", "zoho-crm-widget", "SKILL.md"));
  } finally {
    await rm(paths.root, { recursive: true });
  }
});
