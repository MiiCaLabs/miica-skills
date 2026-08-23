# Product context

## Vision

`miica-skills` is an open collection of reusable skills for AI agents, including Claude and Codex. The repository accepts community contributions and supports installation from GitHub or through npm package runners.

## Confirmed decisions

### Canonical skill format

- Every skill follows the open Agent Skills standard.
- `SKILL.md` is the canonical source.
- A skill may include the standard `scripts/`, `references/`, and `assets/` directories.
- The project does not define a proprietary MiiCaLabs skill format.
- The catalog and installer support the standard without replacing it.

### Initial contribution model

- The repository hosts a curated collection.
- Contributors submit skills through pull requests.
- Maintainers review every skill before it joins the collection.
- The first version does not include an external registry.
- A distributed registry may be considered if contribution volume requires one.

### Installation unit

- The CLI installs one skill by default.
- An explicit option installs the full collection.
- A Git clone remains available for contributors and users who want the complete repository.
- Interactive selection does not block the main installation path.

### Installation scope

- The CLI installs skills in the current project by default.
- The `--global` option makes them available across the user's projects.
- Project installations can be committed with the project.
- The CLI does not write to user-level directories without an explicit option.

### Target agent selection

- The CLI detects available agents.
- It asks the user only when detection is ambiguous.
- The `--agent` option selects a target for scripts and continuous integration.
- Initial targets are `codex`, `claude`, and `all`.
- Each adapter uses the location expected by its target agent.

### Package and command name

- The public npm package is named `miica-skills`.
- The package exposes a `miica-skills` binary.
- Users can run it with `npx`, `pnx`, `pnpm dlx`, `pnpx`, or `bunx`.
- Git cloning remains a separate path for contribution and development.

### Installation security

- The CLI never executes a skill's scripts during installation.
- It validates and copies files to the selected target.
- Contributors declare any network, system command, and file access their scripts require.
- Users retain control over permissions when an agent later uses a skill.

### License

- The repository uses the MIT License.
- Skills, scripts, and documentation use the same license.
- Accepted contributions are published under that license.

### Contribution validation

- Every contribution uses a pull request.
- Continuous integration checks Agent Skills compliance.
- It also checks unique names, metadata, references, scripts, and committed secrets.
- A maintainer reviews the content and declared permissions before merge.
- Automated checks never merge a contribution without human approval.

### Installed skill source

- Every npm release contains the skills it can install.
- The CLI does not use the current GitHub branch as an implicit source.
- A given npm version exposes a fixed catalog.
- Git cloning supports development and testing before release.

### Initial CLI surface

- The first version exposes `list`, `add`, and `remove`.
- `list` shows available skills.
- `add` installs a skill or replaces its version after the required checks.
- `remove` uninstalls a skill managed by the CLI.
- The first version excludes `search`, `update`, `doctor`, and `publish`.

### Repository language

- English is the only canonical language for repository content and documentation.
- The project does not maintain translated copies.
- Individual skills may instruct agents to answer in the user's language.

### Initial release contents

- The first release includes `zoho-crm-widget` and `zoho-deluge`.
- `zoho-crm-widget` uses the reference material already present in this repository.
- `zoho-deluge` is imported from `/Users/macbook/Documents/zoho-deluge` during implementation.
- The imported `zoho-deluge` directory includes its `SKILL.md` and complete `references/` directory.

### Contribution governance

- Contributions use the repository's MIT License.
- Opening a pull request confirms that the contributor can submit the work under that license.
- The project does not require a Contributor License Agreement or Developer Certificate of Origin.
- `CONTRIBUTING.md` documents this rule and the review process.

## Approval

- The user approved this scope for implementation on 2026-08-24.
