#!/usr/bin/env node

import { CliError, runCli } from "../src/cli.js";

try {
  const exitCode = await runCli(process.argv.slice(2));
  process.exitCode = exitCode;
} catch (error) {
  if (error instanceof CliError) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = error.exitCode;
  } else {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
