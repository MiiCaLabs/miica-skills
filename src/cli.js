import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { installSkill, isManagedSkill, listCatalog, pathExists, removeSkill } from "./skills.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultCatalogRoot = path.join(packageRoot, "skills");
const agentPaths = {
  codex: path.join(".agents", "skills"),
  claude: path.join(".claude", "skills"),
};

const usage = `miica-skills

Usage:
  miica-skills list
  miica-skills add <skill> [--agent codex|claude|all] [--global] [--yes]
  miica-skills add --all [--agent codex|claude|all] [--global] [--yes]
  miica-skills remove <skill> [--agent codex|claude|all] [--global] [--yes]

Options:
  --agent <agent>  Select Codex, Claude, or both
  --global         Install in the user-level skill directory
  --yes            Confirm replacement or removal without prompting
  --help            Show this help
  --version         Show the package version
`;

export class CliError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
  }
}

function parseArgs(args) {
  if (args.length === 0 || args.includes("--help")) return { command: "help" };
  if (args.length === 1 && args[0] === "--version") return { command: "version" };

  const command = args[0];
  const parsed = { command, agent: undefined, global: false, all: false, yes: false, names: [] };

  for (let index = 1; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--global") parsed.global = true;
    else if (argument === "--all") parsed.all = true;
    else if (argument === "--yes") parsed.yes = true;
    else if (argument === "--agent") {
      parsed.agent = args[index + 1];
      index += 1;
      if (!parsed.agent) throw new CliError("--agent requires codex, claude, or all.", 2);
    } else if (argument.startsWith("-")) {
      throw new CliError(`Unknown option: ${argument}`, 2);
    } else parsed.names.push(argument);
  }

  if (parsed.agent && !["codex", "claude", "all"].includes(parsed.agent)) {
    throw new CliError(`Unsupported agent: ${parsed.agent}`, 2);
  }
  return parsed;
}

async function packageVersion() {
  return JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8")).version;
}

function write(stream, message) {
  stream.write(`${message}\n`);
}

async function ask(io, question) {
  const prompt = createInterface({ input: io.stdin, output: io.stdout });
  try {
    return (await prompt.question(question)).trim().toLowerCase();
  } finally {
    prompt.close();
  }
}

async function confirm(io, question) {
  if (!io.stdin.isTTY || !io.stdout.isTTY) return false;
  return ["y", "yes"].includes(await ask(io, `${question} [y/N] `));
}

async function detectAgents(scopeRoot) {
  const detected = [];
  if (
    (await pathExists(path.join(scopeRoot, ".agents"))) ||
    (await pathExists(path.join(scopeRoot, "AGENTS.md")))
  ) {
    detected.push("codex");
  }
  if (
    (await pathExists(path.join(scopeRoot, ".claude"))) ||
    (await pathExists(path.join(scopeRoot, "CLAUDE.md")))
  ) {
    detected.push("claude");
  }
  return detected;
}

async function selectAgent(requested, scopeRoot, io) {
  if (requested) return requested;
  const detected = await detectAgents(scopeRoot);
  if (detected.length === 1) return detected[0];

  if (io.stdin.isTTY && io.stdout.isTTY) {
    const answer = await ask(io, "Target agent [codex/claude/all]: ");
    if (["codex", "claude", "all"].includes(answer)) return answer;
    throw new CliError(`Unsupported agent: ${answer || "empty selection"}`, 2);
  }

  throw new CliError("Could not determine the target agent. Use --agent codex, claude, or all.", 2);
}

function selectedAgents(agent) {
  return agent === "all" ? ["codex", "claude"] : [agent];
}

function targetPath(scopeRoot, agent, skillName) {
  return path.join(scopeRoot, agentPaths[agent], skillName);
}

function requireOneName(parsed) {
  if (parsed.names.length !== 1) throw new CliError(`${parsed.command} requires one skill name.`, 2);
  return parsed.names[0];
}

export async function runCli(args, options = {}) {
  const io = {
    stdin: options.stdin ?? process.stdin,
    stdout: options.stdout ?? process.stdout,
    stderr: options.stderr ?? process.stderr,
  };
  const cwd = options.cwd ?? process.cwd();
  const home = options.home ?? os.homedir();
  const catalogRoot = options.catalogRoot ?? defaultCatalogRoot;
  const version = options.version ?? (await packageVersion());
  const parsed = parseArgs(args);

  if (parsed.command === "help") {
    io.stdout.write(usage);
    return 0;
  }
  if (parsed.command === "version") {
    write(io.stdout, version);
    return 0;
  }
  if (!['list', 'add', 'remove'].includes(parsed.command)) {
    throw new CliError(`Unknown command: ${parsed.command}\n\n${usage}`, 2);
  }

  const catalog = await listCatalog(catalogRoot);
  if (parsed.command === "list") {
    if (parsed.names.length || parsed.all || parsed.agent || parsed.global || parsed.yes) {
      throw new CliError("list does not accept skill or installation options.", 2);
    }
    for (const skill of catalog) write(io.stdout, `${skill.name}\t${skill.description}`);
    return 0;
  }

  const scopeRoot = parsed.global ? home : cwd;
  const agent = await selectAgent(parsed.agent, scopeRoot, io);
  const agents = selectedAgents(agent);

  if (parsed.command === "add") {
    if (parsed.all && parsed.names.length) {
      throw new CliError("Use either add <skill> or add --all, not both.", 2);
    }
    if (!parsed.all && parsed.names.length !== 1) {
      throw new CliError("add requires one skill name or --all.", 2);
    }

    const selected = parsed.all
      ? catalog
      : catalog.filter((skill) => skill.name === parsed.names[0]);
    if (selected.length === 0) throw new CliError(`Unknown skill: ${parsed.names[0]}`, 2);

    for (const skill of selected) {
      for (const selectedAgent of agents) {
        const target = targetPath(scopeRoot, selectedAgent, skill.name);
        let replace = false;
        if (await pathExists(target)) {
          if (!(await isManagedSkill(target))) {
            throw new CliError(`Refusing to overwrite unmanaged skill: ${target}`);
          }
          replace = parsed.yes || (await confirm(io, `Replace ${skill.name} for ${selectedAgent}?`));
          if (!replace) {
            throw new CliError(`Replacement cancelled. Re-run with --yes for non-interactive use.`);
          }
        }
        await installSkill({ source: skill.path, target, skillName: skill.name, version, replace });
        write(io.stdout, `Installed ${skill.name} for ${selectedAgent}: ${target}`);
      }
    }
    return 0;
  }

  if (parsed.all) throw new CliError("remove requires one skill name.", 2);
  const skillName = requireOneName(parsed);
  if (!catalog.some((skill) => skill.name === skillName)) {
    throw new CliError(`Unknown skill: ${skillName}`, 2);
  }

  for (const selectedAgent of agents) {
    const target = targetPath(scopeRoot, selectedAgent, skillName);
    if (!(await isManagedSkill(target))) {
      if (!(await pathExists(target))) throw new CliError(`Skill is not installed: ${target}`);
      throw new CliError(`Refusing to remove unmanaged skill: ${target}`);
    }
    const approved = parsed.yes || (await confirm(io, `Remove ${skillName} for ${selectedAgent}?`));
    if (!approved) throw new CliError("Removal cancelled. Re-run with --yes for non-interactive use.");
    await removeSkill(target);
    write(io.stdout, `Removed ${skillName} for ${selectedAgent}: ${target}`);
  }
  return 0;
}
