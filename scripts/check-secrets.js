#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignored = new Set([".git", ".npm-cache", "node_modules", "package-lock.json"]);
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
];

async function files(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await files(entryPath)));
    else found.push(entryPath);
  }
  return found;
}

const findings = [];
for (const file of await files(root)) {
  let content;
  try {
    content = await readFile(file, "utf8");
  } catch {
    continue;
  }
  for (const pattern of patterns) {
    if (pattern.test(content)) findings.push(path.relative(root, file));
  }
}

if (findings.length) throw new Error(`Potential committed secrets found in: ${[...new Set(findings)].join(", ")}`);
process.stdout.write("No known secret patterns found.\n");
