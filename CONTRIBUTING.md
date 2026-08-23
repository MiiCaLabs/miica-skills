# Contributing

`miica-skills` accepts focused pull requests for new skills and corrections to existing ones.

## Add a skill

1. Create `skills/<skill-name>/SKILL.md`.
2. Use lowercase letters, digits, and hyphens for the directory and frontmatter `name`.
3. Add a specific `description` that states what the skill does and when an agent should use it.
4. Keep the main instructions concise. Put detailed material in `references/` and deterministic helpers in `scripts/`.
5. Link every supporting reference directly from `SKILL.md`.
6. Declare any network access, system commands, file access, credentials, or external services required by bundled scripts.

Follow the [Agent Skills specification](https://agentskills.io/specification). Do not add a second manifest as the source of truth.

## Check the contribution

```bash
npm install
npm run check
```

The checks validate skill metadata and references, scan for common secret formats, exercise the CLI, and inspect the npm package contents.

Test the skill with realistic prompts before opening the pull request. Describe what you tested and any product-specific limits in the pull request.

## Review

A maintainer reviews the content, supporting files, declared permissions, and test evidence. Passing automation does not merge a contribution automatically.

Keep pull requests limited to one skill or one related correction. Do not commit credentials, customer data, generated archives, or copied material you cannot license.

## License

This repository uses the MIT License. By opening a pull request, you confirm that you can submit the contribution under that license. The project does not require a Contributor License Agreement or Developer Certificate of Origin.
