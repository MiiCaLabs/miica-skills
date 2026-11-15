# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`miica-skills` is a curated collection of Agent Skills (open spec: https://agentskills.io/specification) plus a small zero-dependency Node CLI (`miica-skills list|add|remove`) that installs them into Codex (`.agents/skills`) or Claude Code (`.claude/skills`), at project or `--global` scope. Product decisions are recorded in [CONTEXT.md](CONTEXT.md); contribution rules in [CONTRIBUTING.md](CONTRIBUTING.md).

## Commands

Node >= 22, ES modules, no runtime dependencies.

```bash
npm run check              # full CI gate: validate:skills + check:secrets + test + npm pack --dry-run
npm run validate:skills    # validate every skills/<name>/ against the rules below
npm run check:secrets      # scan for committed secret formats
npm test                   # node --test (test/cli.test.js)
node --test --test-name-pattern="<pattern>" test/cli.test.js   # single test
node bin/miica-skills.js list                                   # run the CLI from the checkout
```

CI runs `npm run check` on Node 22, 24 and 26.

## Architecture

- `skills/<name>/SKILL.md` is the single source of truth for each skill, with optional `references/`, `scripts/`, `assets/`. Do not add a second manifest or a proprietary format.
- [src/skills.js](src/skills.js) holds the logic: `validateSkill` / `listCatalog` (catalog validation), and `installSkill` / `removeSkill` (copy with a `.miica-skills.json` managed marker, staged-copy-then-rename replacement with rollback). [src/cli.js](src/cli.js) is argument parsing, agent detection and prompts on top of it; [bin/miica-skills.js](bin/miica-skills.js) is the thin entry point.
- The catalog is the `skills/` directory shipped inside the npm package (`files` in package.json). The CLI never reads the GitHub branch, and never executes bundled skill scripts.
- The CLI refuses to overwrite or remove a skill directory that lacks its managed marker; replacement/removal needs `--yes` when non-interactive.

## Skill validation rules (enforced by `validateSkill`)

- Directory name and frontmatter `name` must match and be lowercase letters/digits/hyphens (max 64 chars).
- `SKILL.md` must start with YAML frontmatter containing `name` and a non-empty `description` (no `TODO`). Frontmatter is parsed with simple per-line regexes, not a YAML parser, so keep `name` and `description` as single-line values.
- Every `references/*.md` path mentioned in `SKILL.md` must exist, and every file in `references/` must be linked from `SKILL.md` and be non-empty. Adding or renaming a reference file therefore requires updating `SKILL.md`.

## Conventions

- Repository content and documentation are English only; individual skills may tell agents to answer in the user's language.
- Keep pull requests to one skill or one related correction; the README skills table lists the shipped skills.
