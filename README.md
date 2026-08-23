# miica-skills

Curated, reusable skills for AI coding agents. Each skill follows the open [Agent Skills specification](https://agentskills.io/specification) and keeps `SKILL.md` as its canonical entry point.

## Skills

| Skill | Use it for |
| --- | --- |
| `zoho-crm-widget` | Building and debugging Zoho CRM widgets, Client Scripts, Embedded App SDK integrations, ZRC, and ZOHO.CRM APIs |
| `zoho-deluge` | Writing, reviewing, refactoring, and debugging Deluge across Zoho products |

## Install a skill

The npm package is prepared but has not been published yet. Until the first npm release, use the [Git clone instructions](#clone-the-collection).

List the catalog:

```bash
npx miica-skills list
```

Install one skill for Codex:

```bash
npx miica-skills add zoho-deluge --agent codex
```

Install one skill for Claude Code:

```bash
npx miica-skills add zoho-crm-widget --agent claude
```

Install the full collection for both agents:

```bash
npx miica-skills add --all --agent all
```

The CLI detects an existing Claude or Codex configuration when possible. Use `--agent` in scripts or when both agents are present.

Project installation is the default. Add `--global` to install for every project owned by the current user:

```bash
npx miica-skills add zoho-deluge --agent codex --global
```

| Agent | Project path | User path |
| --- | --- | --- |
| Codex | `.agents/skills/<skill>` | `~/.agents/skills/<skill>` |
| Claude Code | `.claude/skills/<skill>` | `~/.claude/skills/<skill>` |

The same package works with other npm package runners:

```bash
pnx miica-skills list
pnpm dlx miica-skills list
pnpx miica-skills list
bunx miica-skills list
```

## Clone the collection

Clone the repository to inspect, change, or install skills manually:

```bash
git clone https://github.com/MiiCaLabs/miica-skills.git
cd miica-skills
```

Each directory under `skills/` is self-contained. Copy the chosen directory to a skill location supported by your agent.

## Remove a skill

```bash
npx miica-skills remove zoho-deluge --agent codex
```

The CLI removes only installations carrying its management marker. It refuses to overwrite or remove an unmanaged skill directory. Use `--yes` to confirm a managed replacement or removal in a non-interactive command.

## Security

Installation validates and copies files. It never runs scripts bundled with a skill. Review a skill's declared network, command, and file access before allowing an agent to run its scripts.

See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Contribute

Submit skills and corrections through pull requests. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the required structure and checks.

Development requires Node.js 22 or newer.

```bash
npm install
npm run check
```

Contributions are accepted under the MIT License.
